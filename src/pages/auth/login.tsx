import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { LoginDto } from "@/types/auth";
import { useLogin } from "@/hooks/queries/useAuth";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [credentials, setCredentials] = useState<LoginDto>({
    loginId: "",
    password: "",
  });
  const loginMutation = useLogin();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };
  const handleReturn = () => router.push("/");

  const apiUrl = process.env.NEXT_PUBLIC_API_HOST;
  return (
    <div className="flex items-center justify-center h-screen select-none bg-[#F9FAFB]">
      <div className="w-screen p-8 sm:p-0 sm:w-[400px]">
        <div className="items-center justify-center mt-6">
          <button
            onClick={handleReturn}
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
        <div className="mt-5 gap-2 flex flex-col">
          <Link href={`${apiUrl}/auth/naver`}>
            <div className="shadow-sm hover:shadow-md bg-[#04C75B] hover:bg-[#54b759] w-full rounded-md flex h-11 items-center justify-center">
              <Image
                src="/login/naver.png"
                alt="네이버 로그인"
                width={750}
                height={200}
                className="w-10 h-10"
              />
              <p className="text-center text-white">네이버 로그인</p>
            </div>
          </Link>
          <Link href={`${apiUrl}/auth/kakao`}>
            <div className="shadow-sm hover:shadow-md bg-[#FEE501] hover:bg-[#e0d14a] w-full rounded-md flex h-11 items-center justify-center">
              <Image
                src="/login/kakao.png"
                alt="카카오 로그인"
                width={750}
                height={200}
                className="w-7 h-7"
              />
              <p className="text-center text-[#181600]">카카오 로그인</p>
            </div>
          </Link>
        </div>
        <div className="border-t my-4 border-gray-300" />
        <div>
          <form onSubmit={handleLogin}>
            <div>
              <label className="block mt-3 text-gray-600">아이디</label>
              <input
                type="text"
                required
                placeholder="아이디"
                onChange={(e) =>
                  setCredentials({ ...credentials, loginId: e.target.value })
                }
                className="w-full mt-2 p-3 border border-gray-200 rounded-md"
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-600">비밀번호</label>
              <input
                type="password"
                required
                placeholder="비밀번호"
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="w-full mt-2 p-3 border border-gray-200 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="shadow-sm hover:shadow-md w-full h-12 mt-6 p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 duration-75"
            >
              로그인
            </button>
          </form>
        </div>
        <p
          className="mt-4 text-center text-indigo-500 cursor-pointer"
          onClick={() => router.push("/auth/register")}
        >
          계정이 없으신가요? 회원가입
        </p>
        <p
          className="mt-1 text-center text-indigo-500 cursor-pointer"
          onClick={() => router.push("/auth/password")}
        >
          또는 비밀번호 찾기
        </p>
      </div>
    </div>
  );
}
