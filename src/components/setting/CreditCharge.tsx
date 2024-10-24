import {
  useCompletePurchase,
  useCreatePurchase,
} from "@/hooks/queries/usePurcahse";
import { useState } from "react";
import * as PortOne from "@portone/browser-sdk/v2";
import toast from "react-hot-toast";
import errorHandler from "@/utils/error";
import { useRouter } from "next/router";
import { Button, InputNumber } from "antd";

export default function CreditCharge({ workspaceId }: { workspaceId: number }) {
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [chargeAble, setChargeAble] = useState(false);

  const { mutateAsync: completePurchase } = useCompletePurchase(workspaceId);
  const { mutateAsync: createPurchase } = useCreatePurchase(workspaceId);

  const onClick = async () => {
    try {
      const purchase = await createPurchase({
        amount,
        type: "CREDIT",
      });

      const purchaseResponse = await PortOne.requestPayment({
        storeId: "store-5b713c8d-9630-43ed-b57a-fd9609b35623",
        channelKey: "channel-key-7dd8834a-747e-42c7-8836-924950c8afee",
        paymentId: purchase.id,
        orderName: `크레딧 충전 ${amount.toLocaleString("ko-KR")}원`,
        totalAmount: purchase.amount,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
        isTestChannel: true,
      });
      if (!purchaseResponse || !purchaseResponse.paymentId) {
        toast.error("결제 실패");
        return;
      }

      if (purchaseResponse.code) {
        toast.error(purchaseResponse.message?.split("] ")[1] || "결제 실패");
        return;
      }

      toast.promise(
        completePurchase({ paymentId: purchaseResponse.paymentId }),
        {
          loading: "결제 완료 중...",
          success: "결제 완료",
          error: (error) => {
            errorHandler(error, router);
            return "결제 실패";
          },
        }
      );
    } catch (error: any) {
      if (error.code === "PAYMENT_ALREADY_PAID") {
        toast.error("이미 결제된 결제입니다.");

        return;
      }

      errorHandler(error, router);
      return;
    }
  };

  const setChargeAmount = (value: number) => {
    setAmount(value);

    const AVAILABLE_AMOUNT = 1_000;
    setChargeAble(value >= AVAILABLE_AMOUNT);
  };

  return (
    <div className="flex-col flex gap-2 p-5 bg-white rounded-lg shadow-md w-max-[300px]">
      <p className="text-lg font-bold">크레딧 충전</p>
      <p className="text-sm text-gray-500 mb-3">
        최소 충전 금액은 1,000원입니다.
      </p>
      <InputNumber
        placeholder="크레딧 충전"
        onChange={(value) => setChargeAmount(value || 0)}
        value={amount}
        className="w-full"
        min={1_000}
        max={5_000_000}
        size="large"
        formatter={(value) =>
          `${
            parseInt(value?.toString() || "0")?.toLocaleString("ko-KR") || 0
          }원`
        }
      />

      <Button
        type="primary"
        onClick={onClick}
        className="w-full"
        disabled={!chargeAble}
      >
        크레딧 충전
      </Button>
    </div>
  );
}
