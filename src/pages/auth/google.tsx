import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useGoogleLogin,
  useRegister,
  useRegisterByProvider,
  useRequestSignupCode,
} from "@/hooks/queries/useAuth";
import errorHandler from "@/utils/error";
import { Button, Form, Input, Space } from "antd";
import AuthLayout from "@/components/auth/AuthLayout";
import { SignupByProviderDto, TokenDto } from "@/types/auth";
import { LoadingOutlined } from "@ant-design/icons";

export default function Google() {
  const router = useRouter();
  const { mutateAsync } = useGoogleLogin();
  const { code } = router.query as { code: string };

  const [form] = Form.useForm<SignupByProviderDto>();

  const [requestRegister, setRequestRegister] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(180);

  const { mutateAsync: register } = useRegisterByProvider();
  const { mutateAsync: requestSignupCode } = useRequestSignupCode();

  useEffect(() => {
    if (!code) return;

    toast.promise(mutateAsync(code), {
      loading: "로그인 중...",
      success: (data: TokenDto) => {
        if (!data.isRegister) {
          router.push("/workspaces");
          return "로그인 성공";
        }

        setRequestRegister(true);
        form.setFieldsValue({
          providerId: data.id,
          provider: "GOOGLE",
        });
        return "추가 정보를 입력해주세요.";
      },
      error: (err) => {
        router.push("/auth/login");
        return errorHandler(err);
      },
    });
  }, [code, form, mutateAsync, router]);

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
    const { name, phone, code, provider, providerId } =
      await form.validateFields([
        "name",
        "phone",
        "code",
        "providerId",
        "provider",
      ]);

    if (!isCodeSent) {
      await form.setFields([
        {
          name: "phone",
          errors: ["인증번호를 요청해주세요."],
        },
      ]);
      return;
    }

    toast.promise(register({ name, phone, code, provider, providerId }), {
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

  if (!requestRegister)
    return (
      <AuthLayout>
        <div className="mt-12 flex items-center">
          <LoadingOutlined className="text-lg text-indigo-400 mr-3" />
          <p className="text-lg">구글 아이디로 로그인 중...</p>
        </div>
      </AuthLayout>
    );

  return (
    <AuthLayout>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
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
        <Form.Item hidden name="providerId">
          <Input />
        </Form.Item>
        <Form.Item hidden name="provider">
          <Input />
        </Form.Item>
        <Form.Item>
          <button
            type="submit"
            className="w-full p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 duration-75"
          >
            구글로 회원가입
          </button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
}
