import Container from "@/components/Container";
import errorHandler from "@/utils/error";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button, Form, Input } from "antd";
import { useUserMe, useUserUpdate } from "@/hooks/queries/useUser";
import { UserMeDto, UserUpdateDto } from "@/types/user";
import Loading from "@/components/Loading";
export default function Profile() {
  const router = useRouter();
  const [form] = Form.useForm();

  const { data, isLoading, error } = useUserMe();
  const { mutateAsync: updateMe } = useUserUpdate();

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  if (isLoading) return <Loading />;
  if (error) {
    errorHandler(error, router);
    router.back();
    return null;
  }

  const onSubmit = async () => {
    try {
      const { name, password, passwordConfirm } = form.getFieldsValue();

      if (password && password !== passwordConfirm) {
        toast.error("비밀번호가 일치하지 않습니다.");
        return;
      }

      toast.promise(
        updateMe({
          name,
          password: password || undefined,
        }),
        {
          loading: "프로필 수정중...",
          success: "프로필 수정 완료",
          error: (error) => {
            errorHandler(error, router);
            return "프로필 수정 실패";
          },
        }
      );
    } catch (error) {
      errorHandler(error, router);
    }
  };

  return (
    <Container>
      <Header title="프로필" description="프로필 정보" />
      <Form
        form={form}
        onFinish={onSubmit}
        className="w-full sm:w-[450px]"
        layout="vertical"
      >
        <Form.Item name="loginId" label="아이디">
          <Input size="large" readOnly disabled />
        </Form.Item>
        <Form.Item name="phone" label="휴대폰 번호">
          <Input size="large" readOnly disabled />
        </Form.Item>
        <Form.Item
          name="name"
          label="이름"
          rules={[{ required: true, message: "이름을 입력해주세요." }]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          name="password"
          label="비밀번호"
          rules={[
            {
              min: 8,
              message: "비밀번호는 8자 이상이어야 합니다.",
            },
          ]}
        >
          <Input size="large" type="password" />
        </Form.Item>
        <Form.Item
          name="passwordConfirm"
          label="비밀번호 확인"
          rules={[
            {
              min: 8,
              message: "비밀번호는 8자 이상이어야 합니다.",
            },
          ]}
        >
          <Input size="large" type="password" />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          수정
        </Button>
      </Form>
    </Container>
  );
}
