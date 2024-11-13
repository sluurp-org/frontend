import { Drawer, Button, Form, Input, Typography, Select, Alert } from "antd";
import React from "react";
import { useCreateStore, useSyncStoreProduct } from "@/hooks/queries/useStore";
import errorHandler from "@/utils/error";
import { CreateStoreDto, StoreType } from "@/types/store";
import toast from "react-hot-toast";
import { InfoCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useChannel } from "@/contexts/ChannelContext";

export default function CreateStoreDrawer({
  workspaceId,
  isOpen,
  setIsOpen,
}: {
  workspaceId: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const ChannelService = useChannel();
  const [form] = Form.useForm<CreateStoreDto>();
  const { mutateAsync: createStore } = useCreateStore(workspaceId);
  const { mutateAsync: syncStoreProduct } = useSyncStoreProduct(workspaceId);

  const syncProduct = (storeId: number) => {
    toast.promise(syncStoreProduct(storeId), {
      loading: "스토어 상품 동기화중...",
      success: "스토어 상품 동기화 완료",
      error: (error) => {
        return errorHandler(error);
      },
    });
  };

  const onFinish = async (values: any) => {
    toast.promise(createStore(values), {
      loading: "스토어 생성중...",
      success: (data) => {
        syncProduct(data.id);
        setIsOpen(false);
        return "스토어 생성 완료";
      },
      error: (error) => {
        return errorHandler(error);
      },
    });
  };

  const onStoreCreateRequest = () => {
    const channelMessage = `스토어 생성 대행 요청을 위해\n아래 정보를 입력해주세요.\n\n워크스페이스 아이디: ${workspaceId} (변경 금지)\n요청자명:\n전화번호:`;

    ChannelService.openChat(undefined, channelMessage);
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
          <Input placeholder="스토어 이름을 입력해주세요" />
        </Form.Item>
        <Form.Item
          name="type"
          label="스토어 타입"
          rules={[{ required: true, message: "스토어 타입을 선택해주세요" }]}
          initialValue={"SMARTSTORE"}
        >
          <Select placeholder="스토어 타입을 선택해주세요">
            {Object.entries(StoreType).map(([key, value]) => (
              <Select.Option key={key} value={key}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item noStyle>
          <Alert
            icon={<InfoCircleOutlined />}
            showIcon
            className="mb-3"
            message={
              <div className="flex flex-col items-start">
                <p>아래 문서를 참고해서 스마트스토어 연동을 진행해주세요.</p>
                <Link
                  className="text-indigo-500"
                  target="_blank"
                  href="https://docs.sluurp.io/ko/articles/d180665d"
                >
                  스마트 스토어(스토어팜) 연동 방법
                </Link>
                <Button
                  type="link"
                  size="small"
                  className="pl-0 text-indigo-500"
                  onClick={onStoreCreateRequest}
                >
                  또는 스토어 연결 대행 요청하기
                </Button>
              </div>
            }
            type="info"
          />
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
          <Input placeholder="스마트스토어 애플리케이션 ID를 입력해주세요" />
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
          <Input.Password placeholder="스마트스토어 애플리케이션 시크릿을 입력해주세요" />
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
