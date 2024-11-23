import moment from "moment";
import { Button, Empty, Popover } from "antd";
import { useBilling, useDeleteBilling } from "@/hooks/queries/useBilling";
import { CreateBillingModal } from "../billing/CreateBillingModal";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Billing({ workspaceId }: { workspaceId: number }) {
  const { data } = useBilling(workspaceId);
  const [open, setOpen] = useState(false);
  const { mutateAsync: deleteBilling } = useDeleteBilling(workspaceId);

  const handleDeleteBilling = async () => {
    toast.promise(deleteBilling(), {
      loading: "카드 삭제 중...",
      success: "카드가 삭제되었습니다.",
      error: "카드 삭제 실패",
    });
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <CreateBillingModal
        open={open}
        onClose={() => setOpen(false)}
        workspaceId={workspaceId}
      />
      {data ? (
        <>
          <div>
            <p className="text-lg font-bold">카드 정보</p>
            <div className="mt-3">
              <p className="text-sm text-gray-500">카드번호</p>
              <p className="text-[15px]">{data.cardNumber}</p>
            </div>
            <div className="mt-1">
              <p className="text-sm text-gray-500">등록일</p>
              <p className="text-[15px]">
                {moment(data.createdAt).format("YYYY-MM-DD")}
              </p>
            </div>
          </div>

          <Button
            type="primary"
            className="w-full mt-4"
            onClick={() => setOpen(true)}
          >
            카드 변경
          </Button>
          <Popover
            trigger={["click"]}
            title="카드 삭제"
            content={
              <>
                <p>카드를 정말 삭제하시겠습니까?</p>
                <Button
                  type="primary"
                  className="w-full mt-2"
                  onClick={handleDeleteBilling}
                  danger
                >
                  카드 삭제
                </Button>
              </>
            }
          >
            <Button
              type="link"
              className="w-full mt-1 text-gray-400"
              size="small"
              danger
            >
              카드 삭제
            </Button>
          </Popover>
        </>
      ) : (
        <>
          <Empty description="카드 정보가 없습니다." />
          <Button
            type="primary"
            className="mt-4 w-full"
            onClick={() => setOpen(true)}
            disabled
          >
            카드 등록
          </Button>
          <p className="text-xs text-gray-400 w-full text-center mt-3">
            현재는 카드를 등록 할 수 없습니다.
          </p>
        </>
      )}
    </div>
  );
}
