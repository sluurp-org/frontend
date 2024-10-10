import React, { useState } from "react";
import { useRouter } from "next/router";
import { useOrderHistory } from "@/hooks/quries/useOrder";
import Loading from "../Loading";
import { Button, Empty, Pagination, Timeline } from "antd";
import {
  OrderHistoryDto,
  OrderHistoryEventStatus,
  OrderHistoryFilters,
} from "@/types/order-history";
import moment from "moment";
import { OrderStatus } from "@/types/orders";
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

interface Order {
  id: string;
  type: "EVENT" | "MESSAGE" | "STATUS_CHANGE";
  createdAt: string;
  message?: string;
  changedStatus?: string;
  eventHistory?: {
    status: "PROCESSING" | "SUCCESS" | "FAILURE";
    message?: string;
    processedAt?: string;
  };
}

interface Props {
  orderId: number;
  workspaceId: number;
}

const OrderHistory: React.FC<Props> = ({ orderId, workspaceId }) => {
  const router = useRouter();
  const [filters, setFilters] = useState<OrderHistoryFilters>({
    page: 1,
    size: 5,
  });
  const { data, isLoading, error, refetch } = useOrderHistory(
    workspaceId,
    orderId,
    filters
  );

  if (isLoading || !data) {
    return <Loading isFullPage={false} />;
  }

  if (error) {
    errorHandler(error, router);
    return <div>주문 이력을 불러오는 중 에러가 발생했습니다.</div>;
  }

  const renderTimelineDot = (order: OrderHistoryDto) => {
    if (order.type === "EVENT") {
      if (order.eventHistory) {
        switch (order.eventHistory.status) {
          case "PROCESSING":
            return <LoadingOutlined />;
          case "SUCCESS":
            return <CheckCircleOutlined className="text-green-400" />;
          case "FAIL":
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
                  {OrderStatus[order.changedStatus as keyof typeof OrderStatus]}
                </span>
                {getJosaPicker("로")(
                  OrderStatus[order.changedStatus as keyof typeof OrderStatus]
                )}{" "}
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
                <MessageOutlined className="mr-1" /> 안내 메세지
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
            <div className="flex flex-col bg-white border rounded-lg p-4 cursor-pointer hover:shadow-lg duration-150">
              <h4 className="mb-2 text-base font-semibold">
                <MessageOutlined className="mr-1" /> 메세지 발송
              </h4>
              {order.eventHistory ? (
                <>
                  <p className="text-sm font-light">
                    진행 상태:{" "}
                    {OrderHistoryEventStatus[order.eventHistory.status]}
                  </p>
                  {order.eventHistory.message && (
                    <p className="text-sm font-light">
                      진행 메세지: {order.eventHistory.message}
                    </p>
                  )}
                  <p>눌러서 상세 정보 보기</p>
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

  if (data.nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3">
        <Empty description="주문 이력이 없습니다." />
        <button
          className="flex items-center text-sm hover:bg-indigo-500 duration-150 bg-indigo-400 text-white rounded-md px-4 py-2 h-min"
          onClick={handleRefresh}
        >
          <ReloadOutlined className="mr-2" />
          새로고침
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <Button
          className="bg-indigo-400 text-white border-none duration-150"
          type="text"
          onClick={handleRefresh}
        >
          <ReloadOutlined className="mr-2" />
          새로고침
        </Button>
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
    </div>
  );
};

export default OrderHistory;
