import Container from "@/components/Container";
import errorHandler from "@/utils/error";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button, Form, Input } from "antd";
import { useUserMe, useUserUpdate } from "@/hooks/quries/useUser";
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
      const formData = form.getFieldsValue();
      const processedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value === "" ? null : value,
        ])
      );

      if (processedData.password !== processedData.passwordConfirm) {
        toast.error("비밀번호가 일치하지 않습니다.");
        return;
      }

      if (
        processedData.password &&
        (processedData.password as string).length < 8
      ) {
        toast.error("비밀번호는 8자 이상이어야 합니다.");
        return;
      }

      const updateBody = processedData as UserUpdateDto;

      toast.promise(
        updateMe({
          name: updateBody.name,
          email: updateBody.email,
          password: updateBody.password,
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
        <Form.Item name="name" label="이름">
          <Input />
        </Form.Item>
        <Form.Item name="email" label="이메일">
          <Input />
        </Form.Item>
        <Form.Item name="password" label="비밀번호">
          <Input type="password" />
        </Form.Item>
        <Form.Item name="passwordConfirm" label="비밀번호 확인">
          <Input type="password" />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          수정
        </Button>
      </Form>
    </Container>
  );
}
