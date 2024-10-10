import { Drawer, Button, Form, Input, Typography, Select } from "antd";
import React from "react";
import { useCreateStore, useSyncStoreProduct } from "@/hooks/quries/useStore";
import errorHandler from "@/utils/error";
import { useRouter } from "next/router";
import { CreateStoreDto, StoreType } from "@/types/store";
import toast from "react-hot-toast";

export default function CreateStoreDrawer({
  workspaceId,
  isOpen,
  setIsOpen,
}: {
  workspaceId: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const router = useRouter();
  const [form] = Form.useForm<CreateStoreDto>();
  const { mutateAsync: createStore } = useCreateStore(workspaceId);
  const { mutateAsync: syncStoreProduct } = useSyncStoreProduct(workspaceId);

  const syncProduct = (storeId: number) => {
    toast.promise(syncStoreProduct(storeId), {
      loading: "스토어 상품 동기화중...",
      success: "스토어 상품 동기화 완료",
      error: (error) => {
        errorHandler(error, router);
        return "스토어 상품 동기화 실패";
      },
    });
  };

  const onFinish = async (values: any) => {
    try {
      toast.promise(createStore(values), {
        loading: "스토어 생성중...",
        success: (data) => {
          syncProduct(data.id);
          return "스토어 생성 완료";
        },
        error: (error) => {
          errorHandler(error, router);
          return "스토어 생성 실패";
        },
      });
      setIsOpen(false);
    } catch (error) {
      errorHandler(error, router);
    }
  };

  return (
    <Drawer
      open={isOpen}
      title="스토어 생성"
      onClose={() => setIsOpen(false)}
      destroyOnClose
      width={720}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="스토어 이름"
          rules={[{ required: true, message: "스토어 이름을 입력해주세요" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="스토어 타입"
          rules={[{ required: true, message: "스토어 타입을 선택해주세요" }]}
          initialValue={"SMARTSTORE"}
        >
          <Select defaultValue={"SMARTSTORE"}>
            {Object.entries(StoreType).map(([key, value]) => (
              <Select.Option key={key} value={key}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={["smartStoreCredentials", "applicationId"]}
          label="스마트스토어 애플리케이션 ID"
          rules={[
            {
              required: true,
              message: "스마트스토어 애플리케이션 ID를 입력해주세요",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["smartStoreCredentials", "applicationSecret"]}
          label="스마트스토어 애플리케이션 시크릿"
          rules={[
            {
              required: true,
              message: "스마트스토어 애플리케이션 시크릿을 입력해주세요",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <div className="flex gap-3">
            <Button type="primary" htmlType="submit">
              저장
            </Button>
            <Button type="primary" danger onClick={() => setIsOpen(false)}>
              취소
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
