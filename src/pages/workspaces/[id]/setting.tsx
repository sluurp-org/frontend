import { Button, InputNumber } from "antd";
import Component from "../../../components/Container";
import * as PortOne from "@portone/browser-sdk/v2";
import { useRouter } from "next/router";
import {
  useCompletePurchase,
  useCreatePurchase,
} from "@/hooks/quries/usePurcahse";
import toast from "react-hot-toast";
import { useState } from "react";
import errorHandler from "@/utils/error";

export default function WorkspaceSetting() {
  const router = useRouter();
  const workspaceId = parseInt(router.query.id as string, 10);
  const [amount, setAmount] = useState(0);

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
        orderName: "크레딧 충전 10000원",
        totalAmount: purchase.amount,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
        isTestChannel: true,
      });
      if (!purchaseResponse || !purchaseResponse.paymentId) {
        toast.error("결제 실패");
        return;
      }

      if (purchaseResponse.code && purchaseResponse.code?.startsWith("4")) {
        toast.error(purchaseResponse.message || "결제 실패");
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

  return (
    <Component>
      <div>
        <h1>설정</h1>
        <InputNumber
          placeholder="크레딧 충전"
          onChange={(value) => setAmount(value || 0)}
          value={amount}
          className="w-[300px]"
          formatter={(value) =>
            `${
              parseInt(value?.toString() || "0")?.toLocaleString("ko-KR") || 0
            }원`
          }
        />

        <Button onClick={onClick}>크레딧 충전</Button>
      </div>
    </Component>
  );
}
