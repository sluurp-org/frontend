import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
// import { UserAPI } from "../api/user";
import toast from "react-hot-toast";
import { LeftOutlined } from "@ant-design/icons";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      // await UserAPI.register({ name, email, password });

      toast.success("회원가입이 완료되었습니다.");
      router.push("/auth/login");
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
            <div className="mt-4">
              <label className="block text-gray-600">이름</label>
              <input
                type="text"
                required
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-200 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 duration-75"
            >
              회원가입
            </button>
          </form>
          <p
            className="mt-6 text-center text-indigo-500 cursor-pointer"
            onClick={() => router.push("/auth/login")}
          >
            계정이 있으신가요? 로그인
          </p>
        </div>
      </div>
    </div>
  );
}
