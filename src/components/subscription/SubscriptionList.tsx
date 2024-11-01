import errorHandler from "@/utils/error";
import { useState } from "react";
import Error from "@/components/Error";
import { Select, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import {
  PurchaseItemDto,
  PurchaseFilter,
  PurchaseStatus,
  PurchaseStatusMap,
} from "@/types/purchase";
import { usePurchaseList } from "@/hooks/queries/usePurcahse";
import { Card } from "../common/Card";

export default function SubscriptionList({
  workspaceId,
}: {
  workspaceId: number;
}) {
  const [purchaseFilter, setPurchaseFilter] = useState<PurchaseFilter>({
    page: 1,
    size: 10,
  });

  const { data, isLoading, isError, error } = usePurchaseList(
    workspaceId,
    purchaseFilter
  );

  if (isError) {
    errorHandler(error);
    return <Error isFullPage={false} />;
  }

  const columns: ColumnsType<PurchaseItemDto> = [
    {
      title: "상태",
      dataIndex: "status",
      render: (status: PurchaseStatus) => {
        return (
          <Tag color={status === "PAID" ? "green" : "yellow"}>
            {PurchaseStatusMap[status]}
          </Tag>
        );
      },
      width: 80,
    },
    {
      title: "결제 금액",
      dataIndex: "amount",
      render: (amount) => {
        return `${amount.toLocaleString("ko-KR")}원`;
      },
      className: "whitespace-pre-wrap",
      width: 150,
    },
    {
      title: "할인 금액",
      dataIndex: "defaultPrice",
      render: (amount) => {
        return `${amount.toLocaleString("ko-KR")}원`;
      },
      className: "whitespace-pre-wrap",
      width: 150,
    },
    {
      title: "총 결제 금액",
      dataIndex: "totalAmount",
      render: (amount) => {
        return `${amount.toLocaleString("ko-KR")}원`;
      },
      className: "whitespace-pre-wrap",
      width: 150,
    },
    {
      title: "결제 사유",
      dataIndex: "reason",
      render: (reason) => {
        return reason || "-";
      },
    },
    {
      title: "결제일",
      dataIndex: "purchasedAt",
      render: (purchasedAt) => {
        return purchasedAt ? moment(purchasedAt).format("YYYY-MM-DD") : "-";
      },
      width: 160,
    },
  ];

  return (
    <Card className="max-h-[800px] h-full w-full">
      <p className="text-lg font-bold mb-3">결제 내역</p>
      <Table
        className="h-full"
        dataSource={data?.nodes}
        loading={isLoading}
        columns={columns}
        rowKey="id"
        scroll={{ x: 800 }}
        pagination={{
          total: data?.total,
          current: purchaseFilter.page,
          pageSize: purchaseFilter.size,
          onChange: (page, pageSize) => {
            setPurchaseFilter({ ...purchaseFilter, page, size: pageSize });
          },
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 30, 40, 50],
          showTotal: (total) => {
            return `총 ${total}개`;
          },
        }}
      />
    </Card>
  );
}
