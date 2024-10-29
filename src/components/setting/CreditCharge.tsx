import {
  useCompletePurchase,
  useCreatePurchase,
} from "@/hooks/queries/usePurcahse";
import { useState } from "react";
import * as PortOne from "@portone/browser-sdk/v2";
import toast from "react-hot-toast";
import errorHandler from "@/utils/error";
import { useRouter } from "next/router";
import { Button, Select } from "antd";
import Link from "next/link";

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

  const creditPrices = [5000, 10000, 15000, 20000, 30000, 50000, 100000];

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <p className="text-lg font-bold">크레딧 충전</p>
        <p className="text-sm text-gray-500">
          충전한 금액은 1년(365일) 동안 사용할 수 있습니다.
        </p>
        <Link
          href={
            "https://docs.sluurp.io/ko/articles/e7388652-서비스-이용-약관#제5조-(거래-취소-및-환불)"
          }
        >
          <p className="mb-3 text-indigo-500">
            환불 정책은 여기를 확인해주세요.
          </p>
        </Link>
        <Select
          className="w-full"
          onChange={setChargeAmount}
          placeholder="충전할 금액을 선택하세요."
        >
          {creditPrices.map((price) => (
            <Select.Option key={price} value={price}>
              {price.toLocaleString("ko-KR")}원
            </Select.Option>
          ))}
        </Select>
      </div>

      <Button
        type="primary"
        onClick={onClick}
        className="w-full mt-3"
        disabled={!chargeAble}
      >
        크레딧 충전
      </Button>
    </div>
  );
}
