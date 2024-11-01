import { usePurchase } from "@/hooks/queries/usePurcahse";
import Loading from "../Loading";
import errorHandler from "@/utils/error";
import toast from "react-hot-toast";
import Error from "../Error";
import { Empty, Tag } from "antd";

export default function SubscriptionCurrent({
  workspaceId,
}: {
  workspaceId: number;
}) {
  const { data, isLoading, error } = usePurchase(workspaceId);

  if (isLoading) return <Loading isFullPage={false} />;
  if (error) {
    errorHandler(error);
    toast.error("결제 정보를 불러오는 중 오류가 발생했습니다.");

    return <Error isFullPage={false} />;
  }
  if (!data) return <Empty description="결제 정보가 없습니다." />;

  const {
    amount,
    totalAmount,
    alimtalkSendCount,
    contentSendCount,
    defaultPrice,
    discountAmount,
    freeTrialAvailable,
    alimtalkSendPrice,
    contentSendPrice,
  } = data;
  return (
    <>
      {freeTrialAvailable && <Tag color="green">무료체험 중</Tag>}
      <p className="text-lg font-bold mt-1">이번달 결제 정보</p>
      <div className="mt-3">
        <p className="text-sm text-gray-500">결제 예정 금액</p>
        <p className="text-[15px] font-bold">
          {totalAmount.toLocaleString("ko-KR")}원
          <span
            className="text-xs text-gray-400 font-normal ml-2"
            title="할인 금액"
          >
            ({discountAmount.toLocaleString("ko-KR")}원 할인)
          </span>
        </p>
      </div>
      <div className="mt-3 flex gap-3 flex-col">
        <div>
          <p className="text-sm text-gray-500">총 결제액</p>
          <p className="text-[15px] font-semibold">
            {amount.toLocaleString("ko-KR")}원
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">기본 요금</p>
          <p className="text-[15px] font-semibold">
            {defaultPrice.toLocaleString("ko-KR")}원
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">알림톡 발송 금액</p>
          <p className="text-[15px] font-semibold">
            {alimtalkSendPrice * alimtalkSendCount}원 ({alimtalkSendCount}건)
            <span className="text-xs text-gray-400 font-normal ml-2">
              {alimtalkSendPrice.toLocaleString("ko-KR")}원/건
            </span>
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">컨텐츠 발송 금액</p>
          <p className="text-[15px] font-semibold">
            {contentSendPrice * contentSendCount}원 ({contentSendCount}건)
            <span className="text-xs text-gray-400 font-normal ml-2">
              {contentSendPrice.toLocaleString("ko-KR")}원/건
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
