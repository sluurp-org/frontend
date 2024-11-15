import Header from "@/components/Header";
import Component from "../../../../components/Container";
import { useRouter } from "next/router";
import { Button, Cascader, Input, Select, Table } from "antd";
import { useState } from "react";
import { Card } from "@/components/common/Card";
import { useEventHistories } from "@/hooks/queries/useEventHistory";
import errorHandler from "@/utils/error";
import Error from "@/components/Error";
import {
  EventHistoryFilter,
  EventHistoryStatus,
  EventHistoryStatusMap,
} from "@/types/event-history";
import EventHistoryModal from "@/components/event-history/EventHistoryModal";
import moment from "moment";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { CopyOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import useDebounce from "@/hooks/useDebounce";
import { useProducts } from "@/hooks/queries/useProduct";
import { useMessages } from "@/hooks/queries/useMessage";
import { PaginatedProductsResponse } from "@/types/product";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";

interface Option {
  value: number;
  label: string;
  children?: Option[];
}

export default function EventHistoryPage() {
  const router = useRouter();
  const workspaceId = Number(router.query.id);
  const [eventHistoryModalOpen, setEventHistoryModalOpen] = useState(false);
  const [eventHistoryId, setEventHistoryId] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventHistoryFilter>({
    page: 1,
    size: 20,
  });

  const debouncedFilters = useDebounce(filters, 500);
  const { data, isLoading, error } = useEventHistories(workspaceId, {
    ...debouncedFilters,
    page: filters.page,
    size: filters.size,
  });

  const { data: productData, isLoading: productLoading } = useProducts(
    workspaceId,
    {}
  );

  const { data: messageData, isLoading: messageLoading } =
    useMessages(workspaceId);

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

  const handlePageChange = (page: number, size?: number) => {
    setFilters({
      ...filters,
      page,
      size: size || filters.size,
    });
  };

  const columns = [
    {
      title: "아이디",
      dataIndex: "id",
      key: "id",
      width: 200,
      render: (id: string) => (
        <div className="flex">
          <Button
            type="link"
            size="small"
            className="color-indigo-500"
            onClick={() => {
              setEventHistoryId(id);
              setEventHistoryModalOpen(true);
            }}
          >
            {id}
          </Button>
          <CopyToClipboard
            text={id}
            onCopy={() => toast.success("복사되었습니다.")}
          >
            <CopyOutlined className="ml-2 text-gray-400 cursor-pointer" />
          </CopyToClipboard>
        </div>
      ),
    },
    {
      title: "주문 보기",
      dataIndex: "orderId",
      key: "orderId",
      width: 80,
      render: (orderId: string) => {
        if (!orderId) return "-";

        return (
          <Link
            className="text-indigo-500"
            href={`/workspaces/${workspaceId}/order/${orderId}`}
            target="_blank"
            rel="noreferrer"
          >
            <ShoppingCartOutlined className="mr-1" />
            주문 보기
          </Link>
        );
      },
    },
    {
      title: "발송 상태",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: EventHistoryStatus) => EventHistoryStatusMap[status],
    },
    {
      title: "발송 예정일",
      dataIndex: "scheduledAt",
      key: "scheduledAt",
      width: 200,
      render: (scheduledAt: string) =>
        scheduledAt
          ? moment(scheduledAt).format("YYYY시 MM월 DD일 HH시 mm분")
          : "즉시 발송됨",
    },
    {
      title: "발송 완료일",
      dataIndex: "processedAt",
      key: "processedAt",
      width: 250,
      render: (processedAt: string) => (
        <div className="flex items-center">
          <p>{moment(processedAt).format("YYYY시 MM월 DD일 HH시 mm분")}</p>
          <p className="ml-2 text-xs text-gray-400">
            (
            {formatDistanceToNow(new Date(processedAt), {
              addSuffix: true,
              locale: ko,
            })}
            )
          </p>
        </div>
      ),
    },
  ];

  if (error) {
    errorHandler(error);
    return <Error />;
  }

  return (
    <>
      <EventHistoryModal
        open={eventHistoryModalOpen}
        onClose={() => {
          setEventHistoryModalOpen(false);
          setEventHistoryId(null);
        }}
        workspaceId={workspaceId}
        eventHistoryId={eventHistoryId || ""}
      />
      <Component>
        <Header
          title="자동발송 이력"
          description="워크스페이스의 모든 자동발송 이력"
        />

        <div className="flex items-center gap-3 mb-4">
          <Input
            className="w-64"
            placeholder="아이디를 입력해주세요."
            onChange={(e) => {
              setFilters({
                ...filters,
                id: e.target.value,
              });
            }}
          />
          <Cascader
            placeholder="상품을 선택해주세요."
            loading={productLoading}
            disabled={productLoading}
            multiple={false}
            className="w-auto"
            allowClear
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
          <Select
            placeholder="메세지를 선택해주세요."
            loading={messageLoading}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toString()
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            onChange={(value) =>
              setFilters({
                ...filters,
                messageId: value || undefined,
              })
            }
            className="w-auto"
          >
            {messageData?.nodes.map((message) => (
              <Select.Option key={message.id} value={message.id}>
                {message.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="발송 상태"
            allowClear
            className="w-auto"
            onChange={(value) =>
              setFilters({
                ...filters,
                status: value || undefined,
              })
            }
          >
            {Object.entries(EventHistoryStatusMap).map(([key, value]) => (
              <Select.Option key={key} value={key}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </div>
        <Card className="p-0">
          <Table
            loading={isLoading}
            columns={columns}
            dataSource={data?.nodes || []}
            rowKey="id"
            scroll={{ x: 1450 }}
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
    </>
  );
}
