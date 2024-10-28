import {
  useDeleteWorkspaceSubscription,
  useIsFree,
  useWorkspaceSubscription,
} from "@/hooks/queries/useSubscription";
import errorHandler from "@/utils/error";
import Error from "../Error";
import moment from "moment";
import { Alert, Button, Popover } from "antd";
import CreateSubscriptionModal from "./CreateSubscriptionModal";
import Loading from "../Loading";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SubscriptionCurrent({
  workspaceId,
}: {
  workspaceId: number;
}) {
  const { data, isLoading, error } = useWorkspaceSubscription(workspaceId);
  const { mutateAsync: deleteSubscription } =
    useDeleteWorkspaceSubscription(workspaceId);
  const {
    data: isFree,
    isLoading: isFreeLoading,
    error: isFreeError,
  } = useIsFree(workspaceId);
  const [open, setOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  if (error || isFreeError) {
    errorHandler(error || isFreeError);
    return <Error isFullPage={false} />;
  }

  if (isLoading || isFreeLoading) {
    return <Loading isFullPage={false} />;
  }

  const onCancelSubscription = () => {
    toast.promise(deleteSubscription(), {
      loading: "구독 취소중...",
      success: "구독 취소 완료",
      error: (err) => {
        errorHandler(err);
        return err?.response?.data?.message ?? "구독 취소 실패";
      },
    });

    setIsCancelOpen(false);
  };

  return (
    <>
      <CreateSubscriptionModal
        open={open}
        onClose={() => setOpen(false)}
        workspaceId={workspaceId}
        isSubscribed={data?.currentSubscription !== null}
        isFree={isFree ?? false}
        currentSubscriptionId={data?.nextSubscription?.subscription.id}
      />
      {data?.currentSubscription ? (
        <>
          <p className="text-[16px] text-gray-600">
            <span className="text-indigo-500 font-bold text-2xl">
              {data.currentSubscription.subscription.name}
            </span>{" "}
            플랜 구독중
          </p>
          <div className="mt-2">
            <p>
              총 결제 금액:{" "}
              {data.currentSubscription.subscription.price.toLocaleString()}원
            </p>
            {data.nextSubscription && (
              <p>
                다음 결제일:{" "}
                {moment(data.nextSubscription.startedAt).format("YYYY-MM-DD")}
              </p>
            )}
            {!data.nextSubscription && (
              <Alert
                className="mt-2 whitespace-pre-line"
                message={`${moment(data.currentSubscription.startedAt)
                  .add(1, "month")
                  .format(
                    "YYYY년 MM월 DD일"
                  )}에 구독이 만료됩니다.\n만료시 등록된 모든 스토어가 비활성화됩니다.`}
                type="warning"
                showIcon
              />
            )}
          </div>
        </>
      ) : (
        <>
          <div className="mb-12">
            <p className="text-lg font-bold">워크스페이스 현재 구독</p>
            <p className="text-sm text-gray-500">구독 정보가 없습니다.</p>
          </div>
        </>
      )}
      <div className="flex flex-col gap-2 absolute bottom-0 left-0 right-0 m-5">
        <Button type="primary" onClick={() => setOpen(true)}>
          {isFree ? "무료 플랜 시작" : "플랜 변경"}
        </Button>
        {data?.nextSubscription && (
          <Popover
            title="구독 취소"
            open={isCancelOpen}
            onOpenChange={setIsCancelOpen}
            trigger="click"
            content={
              <div>
                <p>구독을 취소하시겠습니까?</p>
                <div className="flex gap-1 mt-3">
                  <Button type="primary" onClick={() => setIsCancelOpen(false)}>
                    구독 유지
                  </Button>
                  <Button
                    type="primary"
                    danger
                    onClick={() => onCancelSubscription()}
                  >
                    구독 취소
                  </Button>
                </div>
              </div>
            }
          >
            <Button danger type="primary">
              구독 취소
            </Button>
          </Popover>
        )}
      </div>
    </>
  );
}
