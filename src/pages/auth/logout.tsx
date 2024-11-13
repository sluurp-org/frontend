import { useRouter } from "next/router";
import { useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { useLogout } from "@/hooks/queries/useAuth";
import errorHandler from "@/utils/error";

const LogoutPage = () => {
  const hasLoggedOut = useRef(false);

  const { mutateAsync: logoutMutation } = useLogout();
  const router = useRouter();

  const handleLogout = useCallback(() => {
    if (hasLoggedOut.current) return; // 이미 로그아웃 시도했다면 중단

    hasLoggedOut.current = true; // 로그아웃 시도 표시
    toast.promise(logoutMutation(), {
      loading: "로그아웃 처리중...",
      success: () => {
        router.push("/auth/login");
        return "로그아웃 완료";
      },
      error: (err) => {
        hasLoggedOut.current = false; // 에러 시 재시도 가능하도록 리셋
        return errorHandler(err);
      },
    });
  }, [logoutMutation, router]);

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return null; // 또는 로그아웃 중임을 나타내는 UI
};

export default LogoutPage;
