import { useRouter } from "next/router";
import { useMessage } from "@/hooks/queries/useMessage";
import errorHandler from "@/utils/error";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import KakaoMessageDetail from "@/components/message/KakaoMessageDetail";
import toast from "react-hot-toast";

export default function WorkspaceMessageDetail() {
  const router = useRouter();

  const workspaceId = parseInt(router.query.id as string, 10);
  const messageId = parseInt(router.query.messageId as string, 10);
  const { data, isLoading, error } = useMessage(workspaceId, messageId);

  if (isLoading) return <Loading />;
  if (!isLoading && error) {
    toast.error(errorHandler(error));
    return <Error />;
  }

  if (data?.sendType === "KAKAO")
    return <KakaoMessageDetail workspaceId={workspaceId} message={data} />;

  return <Error />;
}
