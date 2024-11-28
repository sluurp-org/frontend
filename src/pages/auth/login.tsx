import Image from "next/image";
import { useRouter } from "next/router";
import { LoginDto } from "@/types/auth";
import { useLogin } from "@/hooks/queries/useAuth";
import AuthLayout from "@/components/auth/AuthLayout";
import Link from "next/link";
import { Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [form] = useForm<LoginDto>();

  const { mutateAsync } = useLogin();

  const onSubmit = async () => {
    const data = await form.validateFields();

    toast.promise(mutateAsync(data), {
      loading: "로그인 중...",
      success: () => {
        router.push("/workspaces");
        return "로그인 성공";
      },
      error: "아이디와 비밀번호를 확인해주세요.",
    });
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_HOST;
  return (
    <AuthLayout>
      <div className="flex flex-col gap-2">
        <Link href={`${apiUrl}/auth/naver`}>
          <div className="bg-[#04C75B] w-full rounded-md flex h-12 items-center justify-center hover:shadow-md duration-150 hover:bg-[#04c75cc2]">
            <Image
              src="/login/naver.png"
              alt="네이버 로그인"
              width={100}
              height={100}
              className="w-4 h-4 mr-2"
            />
            <p className="text-center text-white text-lg">네이버로 로그인</p>
          </div>
        </Link>
        <Link href={`${apiUrl}/auth/google`}>
          <div className="bg-white border w-full rounded-md flex h-12 items-center justify-center hover:shadow-md duration-150 hover:bg-gray-100">
            <Image
              src="/login/google.png"
              alt="구글 로그인"
              width={100}
              height={100}
              className="w-5 h-5 mr-2"
            />
            <p className="text-center text-gray-600 text-lg">구글로 로그인</p>
          </div>
        </Link>
      </div>
      <div className="w-full border-t border-gray-200 my-4" />
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="loginId"
          label="아이디"
          rules={[
            {
              required: true,
              message: "아이디를 입력해주세요.",
            },
          ]}
        >
          <Input id="id" size="large" placeholder="아이디" />
        </Form.Item>
        <Form.Item
          name="password"
          label="비밀번호"
          rules={[
            {
              required: true,
              message: "비밀번호를 입력해주세요.",
            },
          ]}
        >
          <Input.Password id="password" size="large" placeholder="비밀번호" />
        </Form.Item>
        <Form.Item>
          <button
            type="submit"
            className="w-full p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 duration-75"
          >
            로그인
          </button>
        </Form.Item>
      </Form>
      <div className="flex flex-col w-center justify-center gap-1">
        <Link
          className="mt-4 text-center text-indigo-500 cursor-pointer"
          href={"/auth/register"}
        >
          계정이 없으신가요? 회원가입
        </Link>
        <Link
          className="mt-1 text-center text-indigo-500 cursor-pointer"
          href={"/auth/password"}
        >
          또는 비밀번호 찾기
        </Link>
      </div>
    </AuthLayout>
  );
}
