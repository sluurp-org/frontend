import {
  useDeleteEvent,
  useEvents,
  useUpdateEvent,
} from "@/hooks/queries/useEvent";
import { EventsDto, EventsFilters, UpdateEventDto } from "@/types/events";
import errorHandler from "@/utils/error";
import { Button, Popover, Switch, Table } from "antd";
import { useState } from "react";
import { OrderStatus, OrderStatusMap } from "@/types/orders";
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
import Link from "next/link";
import Error from "@/components/Error";
import EventTypeUpdate from "./EventTypeUpdate";
import EventTimeUpdate from "./EventTimeUpdate";

export function EventItem({
  event,
  workspaceId,
  refetch,
}: {
  event: EventsDto;
  workspaceId: number;
  refetch: () => void;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { mutateAsync: deleteEvent } = useDeleteEvent(workspaceId);

  const handleDeleteEvent = async () => {
    setIsPopoverOpen(false);
    await toast.promise(deleteEvent(event.id), {
      loading: "메시지 연결 해제 중...",
      success: "메시지 연결 해제이 해제되었습니다.",
      error: "메시지 연결 해제 실패",
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
            {OrderStatusMap[event.type]}
          </span>
          {getJosaPicker("으로")(OrderStatusMap[event.type])} 변경되면
        </p>
        <p className="text-lg">
          <span className="text-indigo-500 font-bold">
            {event.message.name}
          </span>{" "}
          메시지가 발송됩니다.
        </p>
      </div>
      <div className="flex gap-1 mt-4 flex-col 2xl:flex-row">
        <Link
          href={`/workspaces/${workspaceId}/message/${event.message.id}`}
          target="_blank"
          className="text-indigo-500"
        >
          <MessageOutlined className="mr-1" />
          메시지 보기
        </Link>
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
  productId?: number | null;
  productVariantId?: number | null;
  workspaceId: number;
}) {
  const [filters, setFilters] = useState<EventsFilters>({
    page: 1,
    size: 7,
    productId,
    productVariantId,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, error, refetch } = useEvents(workspaceId, filters);
  const { mutateAsync: deleteEvent } = useDeleteEvent(workspaceId);
  const { mutateAsync: updateEvent } = useUpdateEvent(workspaceId);

  const handleUpdateEvent = async (eventId: number, dto: UpdateEventDto) => {
    await toast.promise(updateEvent({ eventId, dto }), {
      loading: "발송 설정 변경중...",
      success: "발송 설정이 변경되었습니다.",
      error: (error) => errorHandler(error) || "발송 설정 변경 실패",
    });
  };

  const handleDeleteEvent = async (id: number) => {
    await toast.promise(deleteEvent(id), {
      loading: "메시지 연결 해제 중...",
      success: "메시지 연결 해제이 해제되었습니다.",
      error: (error) => errorHandler(error) || "발송 설정 변경 실패",
    });
  };

  if (isLoading) return <Loading isFullPage={false} />;
  if (error) {
    toast.error(errorHandler(error));
    return <Error />;
  }

  const handleRefetch = () => {
    toast.promise(refetch(), {
      loading: "메시지 목록을 불러오는 중...",
      success: "메시지 목록을 성공적으로 불러왔습니다.",
      error: (error) =>
        errorHandler(error) || "옵션을 불러오는 중 에러가 발생했습니다",
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
      <p className="text-sm text-gray-500 whitespace-pre-line mb-3">
        {productId
          ? `해당 ${productVariantId ? "옵션" : "상품"}`
          : "스토어에 등록된 상품"}
        을 구매한 사용자의 배송상태가 변경될 때 연결된 메시지를 발송합니다.
        {"\n"}
        아래에서 메시지를 연결해주세요.
      </p>

      <div className="flex gap-3 flex-col sm:flex-row mb-3">
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          <PlusOutlined />
          메시지 연결 생성
        </Button>
        <Button type="primary" onClick={handleRefetch}>
          <ReloadOutlined />
          메시지 새로고침
        </Button>
      </div>
      <Table
        columns={[
          {
            title: "메시지",
            dataIndex: "message",
            render: (message) => {
              return (
                <Link
                  href={`/workspaces/${workspaceId}/message/${message.id}`}
                  target="_blank"
                  className="text-indigo-500"
                >
                  <MessageOutlined className="mr-1" />
                  {message.name}
                </Link>
              );
            },
          },
          {
            title: "주문 상태",
            dataIndex: "type",
            render: (type: OrderStatus, obj: EventsDto) => (
              <EventTypeUpdate
                orderStatus={type}
                onSave={(orderStatus) => {
                  handleUpdateEvent(obj.id, {
                    type: orderStatus,
                  });
                }}
              />
            ),
          },
          {
            title: "발송 일시",
            dataIndex: "id",
            render: (_: any, obj: EventsDto) => (
              <EventTimeUpdate
                delayDays={obj.delayDays}
                sendHour={obj.sendHour}
                onSave={(delayDays, sendHour) => {
                  handleUpdateEvent(obj.id, {
                    delayDays,
                    sendHour,
                  });
                }}
              />
            ),
          },
          {
            title: "활성화 여부",
            dataIndex: "enabled",
            key: "enabled",
            width: "10%",
            render: (enabled: boolean, obj: EventsDto) => (
              <Switch
                checked={enabled}
                onChange={(checked) =>
                  handleUpdateEvent(obj.id, {
                    enabled: checked,
                  })
                }
              />
            ),
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
                    <p className="w-[200px] text-left text-sm text-gray-500">
                      해제할경우 해당 {productVariantId ? "옵션" : "상품"}을
                      구매한 사용자의 배송상태가 변경될 때 메시지가 발송되지
                      않습니다.
                    </p>
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
          showTotal: (total) => `총 ${total}개의 메시지`,
          position: ["bottomCenter"],
          onChange: (page, pageSize) =>
            setFilters({ ...filters, page, size: pageSize }),
        }}
      />
    </div>
  );
}
