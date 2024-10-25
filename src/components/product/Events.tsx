import { useDeleteEvent, useEvents } from "@/hooks/queries/useEvent";
import { EventsDto, EventsFilters } from "@/types/events";
import errorHandler from "@/utils/error";
import { Button, Popover, Table } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { OrderStatus } from "@/types/orders";
import {
  DisconnectOutlined,
  MessageOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Loading from "../Loading";
import toast from "react-hot-toast";
import { EventCreateModal } from "./EventCreateModal";
import { getJosaPicker } from "josa";

export function EventItem({
  event,
  workspaceId,
  refetch,
}: {
  event: EventsDto;
  workspaceId: number;
  refetch: () => void;
}) {
  const router = useRouter();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { mutateAsync: deleteEvent } = useDeleteEvent(workspaceId);

  const handleDeleteEvent = async () => {
    setIsPopoverOpen(false);
    await toast.promise(deleteEvent(event.id), {
      loading: "메세지 연결 해제 중...",
      success: "메세지 연결 해제이 해제되었습니다.",
      error: "메세지 연결 해제 실패",
    });
    refetch();
  };

  return (
    <div
      key={event.id}
      className="p-4 border rounded-lg border-gray-100 shadow-md"
    >
      <div className="w-full">
        <p className="text-sm text-gray-500">만약 주문 상태가</p>
        <p>
          <span className="text-indigo-500 font-bold">
            {OrderStatus[event.type]}
          </span>
          {getJosaPicker("으로")(OrderStatus[event.type])} 변경되면
        </p>
        <p className="text-lg">
          <span className="text-indigo-500 font-bold">
            {event.message.name}
          </span>{" "}
          메세지가 발송됩니다.
        </p>
      </div>
      <div className="flex gap-1 mt-4 flex-col 2xl:flex-row">
        <Button
          type="primary"
          className="hover:shadow-lg flex"
          onClick={() =>
            router.push(
              `/workspaces/${workspaceId}/message/${event.message.id}`
            )
          }
        >
          <MessageOutlined className="mr-1" />
          메세지 보기
        </Button>
        <Popover
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          content={
            <div className="flex flex-col gap-2">
              <p>정말 연결을 해제하시겠습니까?</p>
              <Button type="primary" danger onClick={handleDeleteEvent}>
                네 해제합니다
              </Button>
              <Button type="primary" onClick={() => setIsPopoverOpen(false)}>
                아니오
              </Button>
            </div>
          }
          trigger="click"
          title="연결 해제"
        >
          <Button type="primary" danger className="hover:shadow-lg flex">
            <DisconnectOutlined className="mr-1" />
            연결 해제
          </Button>
        </Popover>
      </div>
    </div>
  );
}

export function Events({
  productId,
  productVariantId,
  workspaceId,
}: {
  productId: number;
  productVariantId?: number;
  workspaceId: number;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<EventsFilters>({
    page: 1,
    size: 7,
    productId,
    productVariantId,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, error, refetch } = useEvents(workspaceId, filters);
  const { mutateAsync: deleteEvent } = useDeleteEvent(workspaceId);

  const handleDeleteEvent = async (id: number) => {
    await toast.promise(deleteEvent(id), {
      loading: "메세지 연결 해제 중...",
      success: "메세지 연결 해제이 해제되었습니다.",
      error: "메세지 연결 해제 실패",
    });
  };

  if (isLoading) return <Loading isFullPage={false} />;
  if (error) {
    errorHandler(error, router);
  }

  const handleRefetch = () => {
    toast.promise(refetch(), {
      loading: "메세지 목록을 불러오는 중...",
      success: "메세지 목록을 성공적으로 불러왔습니다.",
      error: (error) => error || "옵션을 불러오는 중 에러가 발생했습니다",
    });
  };

  return (
    <div>
      <EventCreateModal
        productId={productId}
        productVariantId={productVariantId}
        workspaceId={workspaceId}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <div className="flex gap-3 flex-col sm:flex-row mb-3">
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          <PlusOutlined />
          메세지 연결 생성
        </Button>
        <Button type="primary" onClick={handleRefetch}>
          <ReloadOutlined />
          메세지 새로고침
        </Button>
      </div>
      <Table
        columns={[
          {
            title: "메세지",
            dataIndex: "message",
            render: (message) => message.name,
          },
          {
            title: "주문 상태",
            dataIndex: "type",
            render: (type: OrderStatus) => OrderStatus[type],
          },
          {
            title: "삭제",
            dataIndex: "id",
            render: (id) => (
              <Popover
                trigger="click"
                content={
                  <div className="flex flex-col gap-2">
                    <p>정말 해제하시겠습니까?</p>
                    <Button
                      type="primary"
                      danger
                      onClick={() => handleDeleteEvent(id)}
                    >
                      네 해제합니다
                    </Button>
                  </div>
                }
              >
                <Button type="primary" danger>
                  <DisconnectOutlined />
                  연결 해제
                </Button>
              </Popover>
            ),
          },
        ]}
        dataSource={data?.nodes}
        loading={isLoading}
        pagination={{
          current: filters.page,
          pageSize: filters.size,
          total: data?.total,
          showTotal: (total) => `총 ${total}개의 메세지`,
          position: ["bottomCenter"],
          onChange: (page, pageSize) =>
            setFilters({ ...filters, page, size: pageSize }),
        }}
      />
    </div>
  );
}
