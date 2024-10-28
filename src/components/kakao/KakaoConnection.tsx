import {
  useCreateKakaoConnection,
  useCreateKakaoConnectionToken,
  useDeleteKakaoConnection,
  useKakaoConnection,
} from "@/hooks/queries/useKakao";
import Error from "../Error";
import { Button, Popover } from "antd";
import toast from "react-hot-toast";
import errorHandler from "@/utils/error";
import { isAxiosError } from "axios";
import { CreateKakaoConnection } from "./CreateKakaoConnection";

export function KakaoConnection({ workspaceId }: { workspaceId: number }) {
  const {
    data: kakaoConnection,
    isLoading,
    isError,
    error,
  } = useKakaoConnection(workspaceId);
  const { mutateAsync: deleteKakaoConnection } =
    useDeleteKakaoConnection(workspaceId);

  if (isError || (error && kakaoConnection !== null)) {
    if (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          return <CreateKakaoConnection workspaceId={workspaceId} />;
        }
      }
    }

    return <Error isFullPage={false} />;
  }

  const handleDeleteKakaoConnection = async () => {
    toast.promise(deleteKakaoConnection(), {
      loading: "연동 해제 중...",
      success: "연동 해제 완료",
      error: (error) => {
        errorHandler(error);
        return error.response?.data.message || "연동 해제 실패";
      },
    });
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-gray-800">카카오톡 채널 연동</h2>
      <div className="flex flex-col mt-3">
        {kakaoConnection && (
          <>
            <p className="text-[17px] font-semibold">연동된 카카오톡 채널</p>
            <p className="text-[13px] text-gray-500">
              @{kakaoConnection.searchId}
            </p>
            <Popover
              title="연동 해제"
              trigger="click"
              className="mt-3"
              content={
                <div>
                  <p>연동 해제하시겠습니까?</p>
                  <Button
                    danger
                    className="mt-1"
                    onClick={handleDeleteKakaoConnection}
                  >
                    연동 해제
                  </Button>
                </div>
              }
            >
              <Button danger>연동 해제</Button>
            </Popover>
          </>
        )}
      </div>
    </div>
  );
}
