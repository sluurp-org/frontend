import { MessageFilters, MessageListItem } from "@/types/message";
import { OrderStatus, OrderStatusMap } from "@/types/orders";
import { Button, Form, InputNumber, Modal, Select, Table } from "antd";
import { useState } from "react";
import { ApiOutlined, PlusOutlined, MessageOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import Search from "antd/es/input/Search";
import { useMessages } from "@/hooks/queries/useMessage";
import { useCreateEvent } from "@/hooks/queries/useEvent";
import errorHandler from "@/utils/error";
import Link from "next/link";
import { getJosaPicker } from "josa";
import { CreateEventDto } from "@/types/events";

function MessageItem({
  message,
  productId,
  productVariantId,
  workspaceId,
}: {
  message: MessageListItem;
  productId?: number | null;
  productVariantId?: number | null;
  workspaceId: number;
}) {
  const { mutateAsync: createEvent } = useCreateEvent(workspaceId);
  const [form] = Form.useForm<CreateEventDto>();

  const onSubmit = async () => {
    const values = await form.validateFields();

    toast.promise(
      createEvent({
        ...values,
        productId,
        productVariantId,
        messageId: message.id,
      }),
      {
        loading: "메시지 연결 중...",
        success: "메시지 연결 성공",
        error: (error) => errorHandler(error) || "메시지 연결 실패",
      }
    );
  };

  return (
    <Form layout="vertical" form={form} onFinish={onSubmit}>
      <Form.Item noStyle className="mb-0">
        <div className="flex justify-between gap-3 mb-0">
          <Form.Item
            label="주문 상태 선택"
            name="type"
            required
            className="w-full mb-0"
            rules={[{ required: true, message: "주문 상태를 선택해주세요." }]}
          >
            <Select placeholder="주문 상태 선택">
              {Object.entries(OrderStatusMap).map(([key, value]) => (
                <Select.Option key={key} value={key}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="발송 지연 일수"
            name="delayDays"
            className="w-full mb-0"
            rules={[
              { type: "number", message: "숫자만 입력해주세요." },
              {
                type: "number",
                min: 1,
                warningOnly: true,
                message: "1 이상의 숫자를 입력해주세요.",
                transform(value) {
                  return Number(value || 1);
                },
              },
            ]}
          >
            <InputNumber
              type="number"
              placeholder="발송 지연 일수"
              suffix="일"
              className="w-full"
            />
          </Form.Item>
          <Form.Item
            label="발송 시간"
            name="sendHour"
            className="w-full mb-0"
            rules={[
              {
                type: "number",
                max: 23,
                min: 0,
                warningOnly: true,
                message: "0부터 23까지 입력해주세요.",
                transform(value) {
                  return Number(value || 1);
                },
              },
            ]}
          >
            <InputNumber
              className="w-full"
              placeholder="발송 시간"
              suffix="시"
              min={0}
              max={23}
            />
          </Form.Item>
        </div>
      </Form.Item>
      <Form.Item
        className="mt-0"
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.type !== currentValues.type ||
          prevValues.delayDays !== currentValues.delayDays ||
          prevValues.sendHour !== currentValues.sendHour
        }
      >
        {({ getFieldValue }) => {
          const type = getFieldValue("type") as OrderStatus;
          const delayDays = getFieldValue("delayDays") as number;
          const sendHour = getFieldValue("sendHour") as number;
          const josaPicker = getJosaPicker("으로");

          return (
            <>
              <div>
                {type && (
                  <span>
                    주문 상태가 {OrderStatusMap[type]}
                    {josaPicker(OrderStatusMap[type])} 변경되면{" "}
                  </span>
                )}
                {delayDays && <span> {delayDays}일 후 </span>}
                {sendHour && <span>{sendHour}시에 </span>}
                {!delayDays && !sendHour && <span>구매 후 즉시 </span>}
                {<span>메시지가 발송됩니다.</span>}
              </div>
              {!delayDays && sendHour && (
                <span>
                  상품 구매 일의 {sendHour}시에 발송됩니다. 이미 {sendHour}시가
                  지났다면 즉시 발송됩니다.
                </span>
              )}
            </>
          );
        }}
      </Form.Item>
      <Form.Item noStyle className="mt-0">
        <Button type="primary" htmlType="submit">
          <ApiOutlined />
          메시지 연결
        </Button>
      </Form.Item>
    </Form>
  );
}

export function EventCreateModal({
  productId,
  productVariantId,
  workspaceId,
  isModalOpen,
  setIsModalOpen,
}: {
  productId?: number | null;
  productVariantId?: number | null;
  workspaceId: number;
  isModalOpen: boolean;
  setIsModalOpen: (arg0: boolean) => void;
}) {
  const [filters, setFilters] = useState<MessageFilters>({
    page: 1,
    size: 6,
  });
  const { data, isLoading, error } = useMessages(workspaceId, filters);

  if (isLoading) return null;
  if (error) {
    toast.error(errorHandler(error));
  }

  const handleSearch = (value: string) => {
    const name = value === "" ? undefined : value.trim();
    setFilters({ ...filters, name, page: 1 });
  };

  return (
    <Modal
      open={isModalOpen}
      onOk={() => setIsModalOpen(false)}
      onCancel={() => setIsModalOpen(false)}
      title="메시지 연결"
      destroyOnClose
      width={800}
      cancelButtonProps={{
        className: "hidden",
      }}
      footer={
        <div className="flex justify-between gap-3">
          <Button
            onClick={() =>
              window.open(`/workspaces/${workspaceId}/message/create`, "_blank")
            }
          >
            <PlusOutlined />
            메시지 생성
          </Button>
          <Button type="primary" onClick={() => setIsModalOpen(false)}>
            닫기
          </Button>
        </div>
      }
    >
      <div>
        <Search
          placeholder="메시지 검색"
          onSearch={handleSearch}
          enterButton
          className="w-full"
        />
        <div className="flex flex-col gap-3 mt-3 w-full mb-10">
          <Table
            scroll={{ x: 300 }}
            dataSource={data?.nodes}
            columns={[
              {
                title: "메시지",
                dataIndex: "name",
                key: "name",
                render: (name, record) => (
                  <Link
                    href={`/workspaces/${workspaceId}/message/${record.id}`}
                    target="_blank"
                    className="text-indigo-500"
                  >
                    <MessageOutlined className="mr-1" />
                    {name}
                  </Link>
                ),
              },
              {
                title: "메시지 생성",
                dataIndex: "id",
                key: "id",
                width: "20%",
                render: (id, record) => (
                  <Button type="primary">
                    <ApiOutlined />
                    메시지 연결
                  </Button>
                ),
              },
            ]}
            rowKey={(row) => row.id}
            pagination={{
              pageSize: 6,
              total: data?.total,
              onChange: (page, pageSize) => {
                setFilters({ ...filters, page, size: pageSize });
              },
              position: ["bottomCenter"],
              showTotal(total, range) {
                return `총 ${total}개의 메시지`;
              },
            }}
            expandable={{
              expandRowByClick: true,
              expandedRowRender: (record) => (
                <MessageItem
                  message={record}
                  workspaceId={workspaceId}
                  productId={productId}
                  productVariantId={productVariantId}
                />
              ),
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
