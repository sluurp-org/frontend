import { isAxiosError } from "axios";
import { useRouter } from "next/router";

import { useMessage } from "@/hooks/queries/useMessage";
import errorHandler from "@/utils/error";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import UpdateKakaoMessage from "@/components/message/UpdateKakaoMessage";
import toast from "react-hot-toast";

export default function WorkspaceMessageEdit() {
  const router = useRouter();

  const workspaceId = parseInt(router.query.id as string, 10);
  const messageId = parseInt(router.query.messageId as string, 10);
  const { data, isLoading, isError, error } = useMessage(
    workspaceId,
    messageId
  );

  if (isLoading || !data) return <Loading />;
  if (!isLoading && isError) {
    toast.error(errorHandler(error));
    return <Error />;
  }

  if (data?.sendType === "KAKAO") {
    return <UpdateKakaoMessage workspaceId={workspaceId} message={data} />;
  }

  return <Error />;
}
