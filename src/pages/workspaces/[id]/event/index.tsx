import Header from "@/components/Header";
import Component from "../../../../components/Container";
import { useRouter } from "next/router";
import { Table, Button, Popover, Switch } from "antd";
import { useState } from "react";
import Loading from "@/components/Loading";
import errorHandler from "@/utils/error";
import { Card } from "@/components/common/Card";
import {
  useDeleteEvent,
  useEvents,
  useUpdateEvent,
} from "@/hooks/queries/useEvent";
import { EventsDto, EventsFilters } from "@/types/events";
import { OrderStatus, OrderStatusMap } from "@/types/orders";
import toast from "react-hot-toast";
import {
  DisconnectOutlined,
  MessageOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Error from "@/components/Error";

export default function ProductListPage() {
  const router = useRouter();
  const workspaceId = Number(router.query.id);
  const [filters, setFilters] = useState<EventsFilters>({
    size: 15,
    page: 1,
  });
  const { data, isLoading, error } = useEvents(workspaceId, filters);
  const { mutateAsync: deleteEvent } = useDeleteEvent(workspaceId);
  const { mutateAsync: updateEvent } = useUpdateEvent(workspaceId);

  const handleUpdateEvent = async (eventId: number, enabled: boolean) => {
    await toast.promise(updateEvent({ eventId, enabled }), {
      loading: "상태 변경중...",
      success: "상태가 변경되었습니다.",
      error: "상태 변경 도중 오류가 발생하였습니다.",
    });
  };

  const handleDeleteEvent = async (id: number) => {
    await toast.promise(deleteEvent(id), {
      loading: "메세지 연결 해제 중...",
      success: "메세지 연결 해제이 해제되었습니다.",
      error: "메세지 연결 해제 실패",
    });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setFilters({ ...filters, page, size: pageSize });
  };

  const columns = [
    {
      title: "아이디",
      dataIndex: "id",
      key: "id",
      width: "5%",
    },
    {
      title: "상품 명",
      dataIndex: ["product", "name"],
      key: "product.name",
      width: "200px",
      render: (text: string, obj: EventsDto) =>
        text ? (
          <Link
            href={`/workspaces/${workspaceId}/product/${obj.productId}`}
            className="text-indigo-500"
          >
            <ProductOutlined className="mr-1" />
            <span>{text}</span>
          </Link>
        ) : (
          "모든 상품"
        ),
    },
    {
      title: "옵션 명",
      dataIndex: ["productVariant", "name"],
      key: "store",
      width: "200px",
      render: (text: string) => (
        <div className="flex items-center">
          <span>{text || "모든 옵션"}</span>
        </div>
      ),
    },
    {
      title: "발송 메세지",
      dataIndex: ["message", "name"],
      key: "store",
      width: "150px",
      render: (text: string, obj: EventsDto) => (
        <Link
          href={`/workspaces/${workspaceId}/message/${obj.messageId}`}
          className="text-indigo-500"
        >
          <MessageOutlined className="mr-1" />
          <span>{text}</span>
        </Link>
      ),
    },
    {
      title: "주문 상태",
      dataIndex: "type",
      key: "type",
      width: "10%",
      render: (text: OrderStatus) => <span>{OrderStatusMap[text]}</span>,
    },
    {
      title: "발송 일시",
      dataIndex: "scheduledAt",
      render: (_: any, obj: EventsDto) => {
        const { delayDays, sendHour } = obj;
        if (!delayDays && !sendHour) return "즉시";
        if (delayDays && !sendHour) return `${delayDays}일 후`;
        if (!delayDays && sendHour) return `발송 후 ${sendHour}시`;
        return `${delayDays}일 후 ${sendHour}시`;
      },
    },
    {
      title: "활성화 여부",
      dataIndex: "enabled",
      key: "enabled",
      width: "10%",
      render: (enabled: boolean, obj: EventsDto) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleUpdateEvent(obj.id, checked)}
        />
      ),
    },
    {
      title: "삭제",
      dataIndex: "id",
      key: "type",
      width: "10px",
      render: (id: number) => (
        <Popover
          content={
            <div className="flex flex-col gap-2">
              <p>정말 연결을 해제하시겠습니까?</p>
              <Button
                type="primary"
                danger
                onClick={() => handleDeleteEvent(id)}
              >
                네 해제합니다
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
      ),
    },
  ];

  if (isLoading) return <Loading />;
  if (error) {
    errorHandler(error);
    return <Error />;
  }

  return (
    <Component>
      <Header
        title="자동발송 목록"
        description="워크스페이스의 모든 자동발송 목록"
      />

      <Card className="p-0">
        <Table
          columns={columns}
          dataSource={data?.nodes}
          rowKey="id"
          scroll={{ x: "1500px" }}
          rowClassName={"cursor-pointer"}
          pagination={{
            total: data?.total,
            pageSize: filters.size,
            current: filters.page,
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
            pageSizeOptions: ["15", "20", "30", "40"],
            showSizeChanger: true,
            showTotal: (total) => `총 ${total} 개`,
            className: "pr-4",
          }}
        />
      </Card>
    </Component>
  );
}
