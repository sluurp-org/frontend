import moment from "moment";
import { Button, Empty } from "antd";
import { useBilling } from "@/hooks/queries/useBilling";
import { CreateBillingModal } from "../billing/CreateBillingModal";
import { useEffect, useState } from "react";

export default function Billing({ workspaceId }: { workspaceId: number }) {
  const { data } = useBilling(workspaceId);
  const [open, setOpen] = useState(false);

  return (
    <>
      <CreateBillingModal
        open={open}
        onClose={() => setOpen(false)}
        workspaceId={workspaceId}
      />
      <div className="p-5 bg-white rounded-lg shadow-md w-max-[300px]">
        {data ? (
          <>
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

            <Button
              type="primary"
              className="w-full mt-4"
              onClick={() => setOpen(true)}
            >
              카드 변경
            </Button>
          </>
        ) : (
          <>
            <Empty description="카드 정보가 없습니다." />
            <Button
              type="primary"
              className="mt-4 w-full"
              onClick={() => setOpen(true)}
            >
              카드 등록
            </Button>
          </>
        )}
      </div>
    </>
  );
}
