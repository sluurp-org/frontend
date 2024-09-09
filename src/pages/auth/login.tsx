import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { AuthAPI } from "../api/auth";
import {
  ArrowLeftOutlined,
  CaretLeftOutlined,
  LeftOutlined,
} from "@ant-design/icons";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await AuthAPI.loginByEmail({ email, password });
      const redirect = router.query.redirect as string | undefined;

      toast.success("로그인 되었습니다.");
      router.push(redirect ?? "/workspaces");
    } catch (error: any) {
      const message = error.response.data.message;
      toast.error(message);
    }
  };

  const onReturnClick = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center h-screen select-none">
      <div className="w-screen p-8 sm:p-0 sm:w-[400px]">
        <div className="items-center justify-center mt-6">
          <button
            onClick={onReturnClick}
            className="text-indigo-400 font-bold mb-2"
          >
            <LeftOutlined className="mr-1" />
            뒤로가기
          </button>
          <Image alt="스르륵" src="/logo.png" width={120} height={80} />
          <p className="mt-3">
            더 이상 자동 발송, 고민하지 마세요.
            <br />
            스르륵과 함께 자유를 누리세요.
          </p>
        </div>
        <div>
          <form onSubmit={onSubmit}>
            <div>
              <label className="block mt-6 text-gray-600">이메일</label>
              <input
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-200 rounded-md"
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-600">비밀번호</label>
              <input
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-200 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 duration-75"
            >
              로그인
            </button>
          </form>
        </div>
        <p
          className="mt-6 text-center text-indigo-500 cursor-pointer"
          onClick={() => router.push("/auth/register")}
        >
          계정이 없으신가요? 회원가입
        </p>
        <div className="border-b-2 border-gray-200 w-full mt-6"></div>
        <button className="w-full mt-6 p-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 duration-75">
          구글 계정으로 로그인
        </button>
        <button className="w-full mt-6 p-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 duration-75">
          구글 계정으로 로그인
        </button>
        <button className="w-full mt-6 p-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 duration-75">
          구글 계정으로 로그인
        </button>
      </div>
    </div>
  );
}
