import Header from "@/components/Header";
import Component from "@/components/Container";
import { Button, Table, Tag } from "antd";
import { useState } from "react";
import {
  OrdersFilters,
  OrderStatus,
  OrderStatusColor,
  OrderStatusMap,
} from "@/types/orders";
import { useRouter } from "next/router";
import { useOrders } from "@/hooks/queries/useOrder";
import errorHandler from "@/utils/error";
import CreateOrderDrawer from "@/components/order/CreateOrderDrawer";
import { Card } from "@/components/common/Card";
import { FormOutlined, ReloadOutlined } from "@ant-design/icons";
import Error from "@/components/Error";
import toast from "react-hot-toast";

export default function WorkspaceOrderList() {
  const router = useRouter();
  const [filters, setFilters] = useState<OrdersFilters>({ page: 1, size: 15 });
  const [createOrderDrawerOpen, setCreateOrderDrawerOpen] = useState(false);

  const workspaceId = Number(router.query.id);
  const { data, isLoading, error, refetch } = useOrders(workspaceId, filters);

  if (error) {
    toast.error(errorHandler(error));
    return <Error />;
  }

  const columns = [
    {
      title: "스토어명",
      dataIndex: ["store", "name"],
      width: 150,
      key: "storeName",
    },
    {
      title: "주문 번호",
      dataIndex: "orderId",
      key: "orderId",
      render: (productOrderId: string) => (
        <span className="line-clamp-1">{productOrderId}</span>
      ),
    },
    {
      title: "상품 주문 번호",
      dataIndex: "productOrderId",
      key: "productOrderId",
      render: (productOrderId: string) => (
        <span className="line-clamp-1">{productOrderId}</span>
      ),
    },
    {
      title: "상품 명",
      dataIndex: ["product", "name"],
      key: "productName",
      render: (productName: string) => (
        <span className="line-clamp-1">{productName}</span>
      ),
    },
    {
      title: "주문자",
      dataIndex: "ordererName",
      key: "ordererName",
      width: 80,
    },
    {
      title: "수령인",
      dataIndex: "receiverName",
      key: "receiverName",
      width: 80,
    },
    {
      title: "총 결제액",
      dataIndex: "price",
      key: "price",
      render: (price?: number) => (
        <span>{price?.toLocaleString("ko-KR") || 0}원</span>
      ),
    },
    {
      title: "주문 상태",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: OrderStatus) => (
        <Tag color={OrderStatusColor[status]}>{OrderStatusMap[status]}</Tag>
      ),
    },
  ];

  if (error) return <Error />;

  return (
    <Component>
      <Header title="주문 목록" description="모든 스토어의 주문 목록" />
      <CreateOrderDrawer
        workspaceId={workspaceId}
        open={createOrderDrawerOpen}
        onClose={() => setCreateOrderDrawerOpen(false)}
      />
      <div className="flex gap-3">
        <Button
          icon={<ReloadOutlined />}
          loading={isLoading}
          onClick={() => refetch()}
        >
          새로고침
        </Button>
        <Button
          type="primary"
          onClick={() => setCreateOrderDrawerOpen(true)}
          className="mb-4"
          icon={<FormOutlined />}
        >
          주문 생성
        </Button>
      </div>
      <Card className="p-0">
        <Table
          loading={isLoading}
          scroll={{ x: "1500px" }}
          columns={columns}
          dataSource={data?.nodes || []}
          rowKey="orderId"
          rowClassName={"cursor-pointer"}
          onRow={(record) => ({
            onClick: () =>
              router.push(`/workspaces/${workspaceId}/order/${record.id}`),
          })}
          pagination={{
            className: "pr-4",
            current: filters.page,
            pageSize: filters.size,
            total: data?.total,
            showSizeChanger: true,
            pageSizeOptions: ["15", "20", "30", "40"],
            showTotal: (total) => `총 ${total} 건`,
            onChange: (page, pageSize) =>
              setFilters({ ...filters, page, size: pageSize }),
          }}
        />
      </Card>
    </Component>
  );
}
