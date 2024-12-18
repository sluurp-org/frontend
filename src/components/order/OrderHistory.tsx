import React, { useState } from "react";
import { useOrderHistory } from "@/hooks/queries/useOrder";
import Loading from "../Loading";
import { Button, Checkbox, Empty, Pagination, Timeline } from "antd";
import { OrderHistoryDto, OrderHistoryFilters } from "@/types/order-history";
import { EventHistoryStatusMap } from "@/types/event-history";
import moment from "moment";
import { OrderStatusMap } from "@/types/orders";
import Error from "@/components/Error";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  MessageOutlined,
  ReloadOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { getJosaPicker } from "josa";
import toast from "react-hot-toast";
import errorHandler from "@/utils/error";
import EventHistoryModal from "../event-history/EventHistoryModal";
import Link from "next/link";

interface Props {
  orderId: number;
  workspaceId: number;
}

const OrderHistory: React.FC<Props> = ({ orderId, workspaceId }) => {
  const [eventHistoryModalOpen, setEventHistoryModalOpen] = useState(false);
  const [eventHistoryId, setEventHistoryId] = useState<string | null>(null);
  const [showMessageHistory, setShowMessageHistory] = useState(false);
  const [filters, setFilters] = useState<OrderHistoryFilters>({
    page: 1,
    size: 5,
  });
  const { data, isLoading, error, refetch } = useOrderHistory(
    workspaceId,
    orderId,
    {
      ...filters,
      type: showMessageHistory ? "EVENT" : undefined,
    }
  );

  if (isLoading || !data) {
    return <Loading isFullPage={false} />;
  }

  if (error) {
    toast.error(errorHandler(error));
    return <Error />;
  }

  const renderTimelineDot = (order: OrderHistoryDto) => {
    if (order.type === "EVENT") {
      if (order.eventHistory) {
        switch (order.eventHistory.status) {
          case "PROCESSING":
          case "CONTENT_READY":
          case "PENDING":
          case "READY":
            return <LoadingOutlined />;
          case "SUCCESS":
            return <CheckCircleOutlined className="text-green-400" />;
          case "FAILED":
            return <CloseCircleOutlined className="text-red-400" />;
          default:
            return <CloseCircleOutlined className="text-red-400" />;
        }
      }
      return <CloseCircleOutlined className="text-red-400" />;
    }

    if (order.type === "MESSAGE") {
      return <MessageOutlined />;
    }

    if (order.type === "STATUS_CHANGE") {
      return <CheckCircleOutlined className="text-green-400" />;
    }

    return null;
  };

  const handleOpenEventHistoryModal = (id: string) => {
    setEventHistoryId(id);
    setEventHistoryModalOpen(true);
  };

  const renderTimelineContent = (order: OrderHistoryDto) => {
    const formattedDate = moment(order.createdAt).format(
      "YYYY년 MM월 DD일 HH시 mm분 ss초"
    );

    switch (order.type) {
      case "STATUS_CHANGE":
        return (
          <>
            <p className="text-xs mb-2">{formattedDate}</p>
            <div className="flex flex-col bg-white border rounded-lg p-4">
              <h4 className="mb-2 text-base font-semibold">
                <TruckOutlined className="mr-1" /> 주문 상태 변경
              </h4>
              <p className="text-sm font-light">
                주문 상태가{" "}
                <span className="text-indigo-500">
                  {OrderStatusMap[order.changedStatus]}
                </span>
                {getJosaPicker("로")(OrderStatusMap[order.changedStatus])}{" "}
                변경되었습니다.
              </p>
            </div>
          </>
        );

      case "MESSAGE":
        return (
          <>
            <p className="text-xs mb-2">{formattedDate}</p>
            <div className="flex flex-col bg-white border rounded-lg p-4">
              <h4 className="mb-2 text-base font-semibold">
                <MessageOutlined className="mr-1" /> 안내 메시지
              </h4>
              {order.message && (
                <p className="text-sm font-light">{order.message}</p>
              )}
            </div>
          </>
        );

      case "EVENT":
        return (
          <>
            <p className="text-xs mb-2">{formattedDate}</p>
            <div
              className="flex flex-col bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md duration-150"
              onClick={() =>
                handleOpenEventHistoryModal(order?.eventHistory?.id)
              }
            >
              <h4 className="mb-2 text-base font-semibold">
                <MessageOutlined className="mr-1" /> 메시지 발송
              </h4>
              {order.eventHistory ? (
                <>
                  <p className="text-sm font-light">
                    상태: {EventHistoryStatusMap[order.eventHistory.status]}
                  </p>
                  {order.eventHistory.message && (
                    <p>
                      <span>메시지: </span>
                      <Link
                        className="text-indigo-400 cursor-pointer hover:underline"
                        href={`/workspaces/${workspaceId}/message/${order.eventHistory.message.id}`}
                      >
                        <MessageOutlined className="mr-1" />
                        {order.eventHistory.message.name}
                      </Link>
                    </p>
                  )}
                  <p>
                    발송 예정:{" "}
                    {moment(order.eventHistory.scheduledAt).format(
                      "YYYY년 MM월 DD일 HH시 mm분"
                    )}
                  </p>
                  <p className="font-semibold mt-1">눌러서 상세 정보 보기</p>
                </>
              ) : (
                <p className="text-sm font-light">
                  발송 내역을 조회할 수 없습니다.
                </p>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success("주문 이력을 새로고침했습니다.");
  };

  return (
    <div>
      {eventHistoryId && (
        <EventHistoryModal
          open={eventHistoryModalOpen}
          onClose={() => setEventHistoryModalOpen(false)}
          workspaceId={workspaceId}
          eventHistoryId={eventHistoryId}
        />
      )}
      <div className="flex justify-between items-center mb-3">
        <div className="flex flex-col gap-1 mb-3">
          <Button
            className="bg-indigo-400 text-white border-none duration-150 w-min"
            type="text"
            onClick={handleRefresh}
          >
            <ReloadOutlined className="mr-2" />
            새로고침
          </Button>
          <Checkbox
            checked={showMessageHistory}
            onChange={(e) => setShowMessageHistory(e.target.checked)}
          >
            메시지 발송 이력만 보기
          </Checkbox>
        </div>
        <Pagination
          current={filters.page}
          total={data.total}
          pageSize={filters.size}
          simple
          className="mt-4"
          showSizeChanger={false}
          onChange={(page, pageSize) =>
            setFilters({ ...filters, page, size: pageSize })
          }
        />
      </div>
      <Timeline className="w-full">
        {data.nodes.map((order) => (
          <Timeline.Item key={order.id} dot={renderTimelineDot(order)}>
            {renderTimelineContent(order)}
          </Timeline.Item>
        ))}
      </Timeline>
      {data.nodes.length === 0 && <Empty description="주문 이력이 없습니다." />}
    </div>
  );
};

export default OrderHistory;
