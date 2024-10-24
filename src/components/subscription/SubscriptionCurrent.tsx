import { useWorkspaceSubscription } from "@/hooks/queries/useSubscription";
import errorHandler from "@/utils/error";
import Error from "../Error";
import moment from "moment";
import { Button } from "antd";
import CreateSubscriptionModal from "./CreateSubscriptionModal";
import Loading from "../Loading";
import { useState } from "react";

export default function SubscriptionCurrent({
  workspaceId,
}: {
  workspaceId: number;
}) {
  const { data, isLoading, error } = useWorkspaceSubscription(workspaceId);
  const [open, setOpen] = useState(false);

  if (error) {
    errorHandler(error);
    return <Error isFullPage={false} />;
  }

  if (isLoading) return <Loading isFullPage={false} />;

  return (
    <>
      <CreateSubscriptionModal
        open={open}
        onClose={() => setOpen(false)}
        workspaceId={workspaceId}
        currentSubscriptionId={data?.currentSubscription?.subscription.id}
      />
      <div className="p-5 bg-white rounded-lg shadow-md w-max-[300px] relative">
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
        <Button
          type="primary"
          className="mt-4 absolute bottom-0 right-0 left-0 m-5"
          onClick={() => setOpen(true)}
        >
          구독 변경
        </Button>
      </div>
    </>
  );
}
