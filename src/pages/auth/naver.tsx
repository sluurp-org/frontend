import { useNaverLogin } from "@/hooks/queries/useAuth";
import errorHandler from "@/utils/error";
import { LoadingOutlined } from "@ant-design/icons";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function NaverLogin() {
  const router = useRouter();
  const { mutateAsync } = useNaverLogin();
  const { code } = router.query as { code: string };

  useEffect(() => {
    if (!code) return;

    toast.promise(mutateAsync(code), {
      loading: "로그인 중...",
      success: () => {
        router.push("/workspaces");
        return "로그인 성공";
      },
      error: (err) => {
        router.push("/auth/login");
        return errorHandler(err);
      },
    });
  }, [code, mutateAsync, router]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="text-center">
        <LoadingOutlined className="text-5xl text-indigo-400" />
        <p className="mt-5 font-bold text-lg">네이버 아이디로 로그인 중...</p>
        <Link href="/" className="text-indigo-400 mt-5">
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}
