import Image from "next/image";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
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
      <Link href={`${apiUrl}/auth/naver`}>
        <div className="bg-[#04C75B] w-full rounded-md flex h-12 items-center justify-center">
          <Image
            src="/login/naver.png"
            alt="네이버 로그인"
            width={750}
            height={200}
            className="w-10 h-10"
          />
          <p className="text-center text-white text-lg">네이버로 로그인</p>
        </div>
      </Link>
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
