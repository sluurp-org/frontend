import { isAxiosError } from "axios";
import { NextRouter } from "next/router";
import toast from "react-hot-toast";

const ERROR_MESSAGE: { [key: number]: string } = {
  400: "잘못된 형식의 요청입니다.",
  401: "로그인이 필요한 서비스입니다.\n로그인 후 다시 시도해주세요.",
  403: "권한이 없습니다.",
  404: "찾을 수 없습니다.",
  500: "알 수 없는 에러가 발생했습니다.",
};

const errorHandler = async (error: unknown, router: NextRouter) => {
  if (error instanceof Error) {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message =
        (error.response?.data?.message || ERROR_MESSAGE[status]) ??
        "알 수 없는 에러가 발생했습니다.";

      toast.error(message);
      if (status === 401) {
        const currentPath = router.asPath;
        router.push(`/auth/login?redirect=${currentPath}`);
      }

      if (status === 403) {
        router.back();
      }
      return;
    }

    if (error.name === "TimeoutError") {
      toast.error("요청 시간이 초과되었습니다.");
      return;
    }

    if (error.message === "NoRefreshToken") {
      toast.error("로그인이 만료되었습니다. 다시 로그인해주세요.");
      router.push("/auth/login");
      return;
    }

    toast.error(error.message);
    return;
  }

  toast.error(`에러가 발생했습니다. ${error}`);
};

export default errorHandler;
