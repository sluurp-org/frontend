import { MessageFilters, MessageListItem } from "@/types/message";
import { OrderStatus } from "@/types/orders";
import { Button, Modal, Select, Table } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { ApiOutlined, PlusOutlined, MessageOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import Loading from "../Loading";
import Search from "antd/es/input/Search";
import { useMessages } from "@/hooks/queries/useMessage";
import { useCreateEvent } from "@/hooks/queries/useEvent";
import errorHandler from "@/utils/error";
import Link from "next/link";

function MessageItem({
  message,
  handleCreateEvent,
}: {
  message: MessageListItem;
  handleCreateEvent: (messageId: number, type: OrderStatus) => void;
}) {
  const [selectedType, setSelectedType] = useState<OrderStatus>();

  const handleOnChange = (e: any) => {
    setSelectedType(e as OrderStatus);
  };

  const handleOnClick = () => {
    if (!selectedType) {
      toast.error("상태를 선택해주세요.");
      return;
    }

    handleCreateEvent(message.id, selectedType);
  };

  return (
    <div key={message.id} className="flex gap-1">
      <Select
        onChange={handleOnChange}
        defaultValue={"배송 상태 선택"}
        className="w-full"
      >
        {Object.entries(OrderStatus).map(([key, value]) => (
          <Select.Option key={key} value={key}>
            {value}
          </Select.Option>
        ))}
      </Select>
      <Button onClick={handleOnClick} type="primary">
        <ApiOutlined />
        메세지 연결
      </Button>
    </div>
  );
}

export function EventCreateModal({
  productId,
  productVariantId,
  workspaceId,
  isModalOpen,
  setIsModalOpen,
}: {
  productId?: number;
  productVariantId?: number;
  workspaceId: number;
  isModalOpen: boolean;
  setIsModalOpen: (arg0: boolean) => void;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<MessageFilters>({
    page: 1,
    size: 6,
  });
  const { data, isLoading, error } = useMessages(workspaceId, filters);
  const { mutateAsync: createEvent } = useCreateEvent(workspaceId);

  if (isLoading) return null;
  if (error) {
    errorHandler(error, router);
  }

  const handleSearch = (value: string) => {
    const name = value === "" ? undefined : value.trim();
    setFilters({ ...filters, name, page: 1 });
  };

  const handleCreateEvent = (messageId: number, type: OrderStatus) => {
    toast.promise(
      createEvent({
        productId,
        productVariantId,
        messageId,
        type,
      }),
      {
        loading: "메세지 연결 중...",
        success: "메세지 연결 성공",
        error: (error) => error || "메세지 연결 실패",
      }
    );
  };

  return (
    <Modal
      open={isModalOpen}
      onOk={() => setIsModalOpen(false)}
      onCancel={() => setIsModalOpen(false)}
      title="메세지 연결"
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
            메세지 생성
          </Button>
          <Button type="primary" onClick={() => setIsModalOpen(false)}>
            닫기
          </Button>
        </div>
      }
    >
      <div>
        <Search
          placeholder="메세지 검색"
          onSearch={handleSearch}
          enterButton
          className="w-full"
        />
        <div className="flex flex-col gap-3 mt-3 w-full mb-10">
          <Table
            dataSource={data?.nodes}
            columns={[
              {
                title: "메세지",
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
                title: "메세지 생성",
                dataIndex: "id",
                key: "id",
                width: "200px",
                render: (id, record) => (
                  <MessageItem
                    message={record}
                    handleCreateEvent={handleCreateEvent}
                  />
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
                return `총 ${total}개의 메세지`;
              },
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
