import {
  Drawer,
  Button,
  Form,
  Input,
  Typography,
  Popover,
  Switch,
  Alert,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  useDeleteStore,
  useStoreDetail,
  useSyncStoreProduct,
  useUpdateStore,
} from "@/hooks/queries/useStore";
import errorHandler from "@/utils/error";
import InfoRow from "@/components/InfoRow";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { StoreType, UpdateStoreDto } from "@/types/store";
import moment from "moment";
import toast from "react-hot-toast";
import Link from "next/link";
const { Text } = Typography;

export default function StoreDrawer({
  workspaceId,
  storeId,
  isOpen,
  setIsOpen,
}: {
  workspaceId: number;
  storeId: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { data, isLoading, error } = useStoreDetail(workspaceId, storeId);
  const { mutateAsync: updateStore, isLoading: isStoreUpdating } =
    useUpdateStore(workspaceId);
  const [form] = Form.useForm<UpdateStoreDto>();
  const [editingStoreName, setEditingStoreName] = useState(false);
  const { mutateAsync: deleteStore } = useDeleteStore(workspaceId);
  const { mutateAsync: syncStoreProduct } = useSyncStoreProduct(workspaceId);
  const [enabled, setEnabled] = useState(data?.enabled);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        enabled: data.enabled,
        smartStoreCredentials: {
          applicationId: data.smartStoreCredentials?.applicationId || "",
          applicationSecret:
            data.smartStoreCredentials?.applicationSecret || "",
        },
        smartPlaceCredentials: {
          username: data.smartPlaceCredentials?.username || "",
          password: data.smartPlaceCredentials?.password || "",
        },
      });
      setEnabled(data.enabled);
    }
  }, [data, form]);

  if (error) {
    toast.error(errorHandler(error));
    setIsOpen(false);
    return null;
  }

  if (!data) {
    setIsOpen(false);
    return null;
  }
  if (isLoading) return null;

  const handleStoreNameChange = async (newName: string) => {
    toast.promise(updateStore({ id: storeId, name: newName }), {
      loading: "스토어명 변경중...",
      success: () => {
        setEditingStoreName(false);
        return "스토어명 변경 완료";
      },
      error: (error) => {
        return errorHandler(error);
      },
    });
  };

  const onFinish = async (values: any) => {
    toast.promise(updateStore({ id: storeId, ...values }), {
      loading: "스토어 정보 업데이트중...",
      success: () => {
        return "스토어 정보 업데이트 완료";
      },
      error: (error) => {
        return errorHandler(error);
      },
    });
  };

  const onDelete = async () => {
    toast.promise(deleteStore(storeId), {
      loading: "스토어 삭제중...",
      success: () => {
        setIsOpen(false);
        return "스토어 삭제 완료";
      },
      error: (error) => {
        return errorHandler(error);
      },
    });
  };

  const handleStoreEnabledChange = async (checked: boolean) => {
    setEnabled(checked);

    toast.promise(updateStore({ id: storeId, enabled: checked }), {
      loading: "스토어 상태 변경중...",
      success: () => {
        setEnabled(checked);
        return "스토어 상태 변경 완료";
      },
      error: (error) => {
        return errorHandler(error);
      },
    });
  };

  const handleSyncStoreProduct = async () => {
    toast.promise(syncStoreProduct(storeId), {
      loading: "스토어 상품 동기화 요청중...",
      success:
        "스토어 상품 동기화 요청 완료.\n등록된 상품수에 따라 시간이 소요될 수 있습니다.\n완료 시 카카오톡으로 알림이 전송됩니다.",
      error: (error) => {
        return errorHandler(error);
      },
    });
  };

  return (
    <Drawer
      open={isOpen}
      title="스토어 상세"
      onClose={() => setIsOpen(false)}
      destroyOnClose
      width={720}
    >
      <span className="text-sm text-gray-400">스토어명</span>
      <div className="flex items-center">
        <Text
          editable={{
            icon: <EditOutlined />,
            tooltip: "수정하려면 클릭하세요",
            editing: editingStoreName,
            onStart: () => setEditingStoreName(true),
            onChange: handleStoreNameChange,
          }}
          className="text-2xl font-semibold mr-2"
        >
          {data.name}
        </Text>
      </div>
      <div className="flex flex-col w-full divide-y space-y-3 mt-4">
        <InfoRow label="스토어 ID" copyable>
          {data.id}
        </InfoRow>
        <InfoRow label="스토어 유형">{StoreType[data.type]}</InfoRow>
        <InfoRow label="상태">
          <Switch
            checked={enabled}
            onChange={handleStoreEnabledChange}
            checkedChildren="활성화"
            unCheckedChildren="비활성화"
          />
        </InfoRow>
        <InfoRow label="마지막 상품 동기화">
          <div className="flex flex-col gap-2">
            {data.lastProductSyncAt
              ? moment(data.lastProductSyncAt).format(
                  "YYYY년 MM월 DD일 HH시 mm분 ss초"
                )
              : "상품 동기화 기록 없음"}
            <Button type="primary" onClick={handleSyncStoreProduct}>
              상품 동기화
            </Button>
          </div>
        </InfoRow>
        <InfoRow label="마지막 주문 동기화">
          {data.lastOrderSyncAt
            ? moment().format("YYYY년 MM월 DD일 HH시 mm분 ss초")
            : "주문 동기화 기록 없음"}
        </InfoRow>
      </div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            {data.type === "SMARTSTORE"
              ? "네이버 스마트스토어"
              : "네이버 스마트플레이스"}{" "}
            설정
          </h3>
          <Form.Item noStyle dependencies={["type"]} shouldUpdate>
            {({ getFieldValue }) => {
              return getFieldValue("type") === "SMARTSTORE" ? (
                <Alert
                  icon={<InfoCircleOutlined />}
                  showIcon
                  className="mb-3"
                  message={
                    <div className="flex flex-col items-start">
                      <p>
                        아래 문서를 참고해서 스마트스토어 연동을 진행해주세요.
                      </p>
                      <Link
                        className="text-indigo-500"
                        target="_blank"
                        href="https://docs.sluurp.io/ko/articles/d180665d"
                      >
                        스마트 스토어(스토어팜) 연동 방법
                      </Link>
                    </div>
                  }
                  type="info"
                />
              ) : getFieldValue("type") === "SMARTPLACE" ? (
                <Alert
                  icon={<InfoCircleOutlined />}
                  showIcon
                  className="mb-3"
                  message={
                    <div className="flex flex-col items-start">
                      <p>
                        아래 문서를 참고해서 스마트플레이스 연동을 진행해주세요.
                      </p>
                      <Link
                        className="text-indigo-500"
                        target="_blank"
                        href="https://docs.sluurp.io/ko/articles/1ce5c2d5"
                      >
                        스마트플레이스 연동 방법
                      </Link>
                    </div>
                  }
                  type="info"
                />
              ) : null;
            }}
          </Form.Item>
          {data.type === "SMARTSTORE" && (
            <>
              <Form.Item
                name={["smartStoreCredentials", "applicationId"]}
                label="애플리케이션 아이디"
                rules={[
                  {
                    required: true,
                    message: "애플리케이션 아이디를 입력해주세요",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={["smartStoreCredentials", "applicationSecret"]}
                label="애플리케이션 시크릿"
                rules={[
                  {
                    required: true,
                    message: "애플리케이션 시크릿을 입력해주세요",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
          {data.type === "SMARTPLACE" && (
            <>
              <Form.Item
                name={["smartPlaceCredentials", "username"]}
                label="네이버 아이디"
                rules={[
                  {
                    required: true,
                    message: "네이버 아이디를 입력해주세요",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={["smartPlaceCredentials", "password"]}
                label="네이버 비밀번호"
                rules={[
                  {
                    required: true,
                    message: "네이버 비밀번호를 입력해주세요",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <div className="flex gap-3">
              <Button
                type="primary"
                htmlType="submit"
                loading={isStoreUpdating}
                disabled={isStoreUpdating}
              >
                저장
              </Button>
              <Popover
                open={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
                content={
                  <div className="flex flex-col gap-2">
                    <div>
                      <p>삭제시 연결된 상품 및 주문데이터가 모두 삭제됩니다.</p>
                      <p className="text-sm text-red-500">
                        해당 작업 실행 시 절대 되돌릴 수 없습니다. 정말
                        삭제하시겠습니까?
                      </p>
                    </div>
                    <Button type="primary" danger onClick={onDelete}>
                      네 삭제합니다
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => setIsPopoverOpen(false)}
                    >
                      아니오
                    </Button>
                  </div>
                }
                trigger="click"
                title="스토어 삭제"
              >
                <Button type="primary" danger>
                  스토어 삭제
                </Button>
              </Popover>
            </div>
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
}
