import { useWorkspace } from "@/hooks/queries/useWorkspace";
import Loading from "../Loading";
import Error from "../Error";

export default function CreditCurrent({
  workspaceId,
}: {
  workspaceId: number;
}) {
  const { data: workspace, isLoading, isError } = useWorkspace(workspaceId);
  if (isLoading) return <Loading isFullPage={false} />;
  if (isError) return <Error isFullPage={false} />;

  return (
    <div className="flex-col flex p-5 bg-white rounded-lg shadow-md w-max-[300px] justify-between">
      <div>
        <p className="text-lg font-bold">워크스페이스 크레딧 잔액</p>
        <p className="text-sm text-gray-500 mb-3">현재 크레딧 잔액</p>
      </div>

      <p className="text-4xl font-bold text-right text-indigo-500">
        {workspace?.credit.toLocaleString("ko-KR")}크레딧
      </p>
    </div>
  );
}
