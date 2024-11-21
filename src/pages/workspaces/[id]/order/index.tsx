import Header from "@/components/Header";
import Component from "@/components/Container";
import { Button, Cascader, Input, Select, Table, Tag } from "antd";
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
import { useStore } from "@/hooks/queries/useStore";
import useDebounce from "@/hooks/useDebounce";
import { PaginatedProductsResponse } from "@/types/product";
import { useProducts } from "@/hooks/queries/useProduct";

interface Option {
  value: number;
  label: string;
  children?: Option[];
}

export default function WorkspaceOrderList() {
  const router = useRouter();
  const [filters, setFilters] = useState<OrdersFilters>({ page: 1, size: 15 });
  const [createOrderDrawerOpen, setCreateOrderDrawerOpen] = useState(false);

  const workspaceId = Number(router.query.id);
  const debouncedFilters = useDebounce(filters, 500);
  const { data, isLoading, error, refetch } = useOrders(workspaceId, {
    ...debouncedFilters,
    page: filters.page,
    size: filters.size,
  });
  const { data: productData, isLoading: productLoading } =
    useProducts(workspaceId);
  const { data: store, isLoading: storeLoading } = useStore(workspaceId);

  const groupByStore = (product: PaginatedProductsResponse | undefined) => {
    if (!product) return [];
    const grouped: Record<number, Option> = {};

    product.nodes.map((node) => {
      const storeId = node.store.id;

      if (!grouped[storeId]) {
        grouped[storeId] = {
          value: storeId,
          label: node.store.name,
          children: [],
        };
      }

      grouped[storeId].children?.push({
        value: node.id,
        label: node.name,
      });
    });

    return Object.values(grouped);
  };

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
      <div className="flex gap-3 mb-3">
        <Button
          type="primary"
          onClick={() => setCreateOrderDrawerOpen(true)}
          icon={<FormOutlined />}
        >
          주문 생성
        </Button>
        <Button
          icon={<ReloadOutlined />}
          loading={isLoading}
          onClick={() => refetch()}
        >
          새로고침
        </Button>
      </div>
      <div className="flex gap-3 mb-3 flex-col sm:flex-row">
        <Input
          placeholder="주문 번호"
          className="w-64"
          onChange={(e) =>
            setFilters({ ...filters, orderId: e.target.value || undefined })
          }
        />
        <Input
          placeholder="상품 주문 번호"
          className="w-64"
          onChange={(e) =>
            setFilters({
              ...filters,
              productOrderId: e.target.value || undefined,
            })
          }
        />
        <Select
          placeholder="주문 상태"
          className="w-28"
          onChange={(value) => setFilters({ ...filters, status: value })}
          allowClear
        >
          {Object.entries(OrderStatusMap).map(([key, value]) => (
            <Select.Option key={key} value={key}>
              {value}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="스토어"
          className="w-auto"
          loading={storeLoading}
          filterOption={(input, option) =>
            (option?.children ?? "")
              .toString()
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
          onChange={(value) => setFilters({ ...filters, storeId: value })}
          showSearch
          allowClear
        >
          {store?.nodes.map((store) => (
            <Select.Option key={store.id} value={store.id}>
              {store.name}
            </Select.Option>
          ))}
        </Select>
        <Cascader
          placeholder="상품"
          loading={productLoading}
          disabled={productLoading}
          multiple={false}
          className="w-auto"
          onChange={(value) => {
            const productId = value ? value[value.length - 1] : undefined;
            setFilters({
              ...filters,
              productId,
            });
          }}
          showSearch
          options={groupByStore(productData)}
        />
      </div>
      <Card className="p-0">
        <Table
          loading={isLoading}
          scroll={{ x: "1500px" }}
          columns={columns}
          dataSource={data?.nodes || []}
          rowKey={(record) => record.id}
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
