import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRegister, useRequestSignupCode } from "@/hooks/queries/useAuth";
import errorHandler from "@/utils/error";
import { Button, Form, Input, Space } from "antd";
import AuthLayout from "@/components/auth/AuthLayout";
import Link from "next/link";
import { SignupDto } from "@/types/auth";

export default function Register() {
  const router = useRouter();
  const [form] = Form.useForm<
    SignupDto & {
      passwordConfirm: string;
    }
  >();

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(180);

  const { mutateAsync: register } = useRegister();
  const { mutateAsync: requestSignupCode } = useRequestSignupCode();

  const startCountdown = () => {
    setCountdown(180); // 3분 카운트다운
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCodeSent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onRequestCode = async () => {
    const { phone, name } = await form.validateFields(["phone", "name"]);
    if (!phone || !name) {
      toast.error("전화번호와 이름을 입력해주세요.");
      return;
    }

    await toast.promise(requestSignupCode({ phone, name }), {
      loading: "인증번호를 요청 중입니다...",
      success: "인증번호가 전송되었습니다.",
      error: (error) => errorHandler(error),
    });

    setIsCodeSent(true);
    startCountdown();
  };

  const onSubmit = async () => {
    const { name, loginId, phone, password, passwordConfirm, code } =
      await form.validateFields([
        "name",
        "loginId",
        "phone",
        "password",
        "passwordConfirm",
        "code",
      ]);

    if (password !== passwordConfirm) {
      await form.setFields([
        {
          name: "passwordConfirm",
          errors: ["비밀번호가 일치하지 않습니다."],
        },
        {
          name: "password",
          errors: ["비밀번호가 일치하지 않습니다."],
        },
      ]);
      return;
    }

    if (!isCodeSent) {
      await form.setFields([
        {
          name: "phone",
          errors: ["인증번호를 요청해주세요."],
        },
      ]);
      return;
    }

    // set error message for each field

    toast.promise(register({ name, loginId, phone, password, code }), {
      loading: "회원가입 중...",
      success: () => {
        router.push("/auth/login");
        return "회원가입이 완료되었습니다.";
      },
      error: (error) => {
        return errorHandler(error);
      },
    });
  };

  return (
    <AuthLayout>
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
          name="name"
          label="이름"
          rules={[
            {
              required: true,
              message: "이름을 입력해주세요.",
            },
          ]}
        >
          <Input size="large" placeholder="이름" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="전화번호"
          rules={[
            {
              required: true,
              message: "전화번호를 입력해주세요.",
            },
            {
              pattern: new RegExp(/^[0-9]{3}[0-9]{4}[0-9]{4}$/),
              message: "- 를 제외한 숫자만 입력해주세요.",
            },
          ]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Input size="large" placeholder="전화번호" />
            <Button onClick={onRequestCode} size="large" disabled={isCodeSent}>
              {isCodeSent
                ? `재요청 (${Math.floor(countdown / 60)}:${(
                    "0" +
                    (countdown % 60)
                  ).slice(-2)})`
                : "인증번호 요청"}
            </Button>
          </Space.Compact>
        </Form.Item>
        {isCodeSent && (
          <Form.Item
            name="code"
            label="인증번호"
            rules={[
              {
                required: true,
                message: "인증번호를 입력해주세요.",
              },
            ]}
          >
            <Input size="large" placeholder="인증번호" />
          </Form.Item>
        )}
        <Form.Item
          name="password"
          label="비밀번호"
          rules={[
            {
              required: true,
              message: "비밀번호를 입력해주세요.",
            },
            {
              min: 8,
              message: "비밀번호는 8자 이상이어야 합니다.",
            },
          ]}
        >
          <Input.Password id="password" size="large" placeholder="비밀번호" />
        </Form.Item>
        <Form.Item
          name="passwordConfirm"
          label="비밀번호 확인"
          rules={[
            {
              required: true,
              message: "비밀번호를 입력해주세요.",
            },
            {
              min: 8,
              message: "비밀번호는 8자 이상이어야 합니다.",
            },
          ]}
        >
          <Input.Password size="large" placeholder="비밀번호 확인" />
        </Form.Item>
        <Form.Item>
          <button
            type="submit"
            className="w-full p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 duration-75"
          >
            회원가입
          </button>
        </Form.Item>
      </Form>
      <div className="flex w-center justify-center gap-1">
        <Link
          className="text-center text-indigo-500 cursor-pointer"
          href="/auth/login"
        >
          계정이 있으신가요? 로그인
        </Link>
      </div>
    </AuthLayout>
  );
}
