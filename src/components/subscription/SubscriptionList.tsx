import errorHandler from "@/utils/error";
import { useState } from "react";
import Error from "@/components/Error";
import { Select, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import {
  PurchaseDto,
  PurchaseFilter,
  PurchaseStatus,
  PurchaseStatusMap,
  PurchaseType,
  PurchaseTypeMap,
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

  const columns: ColumnsType<PurchaseDto> = [
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
      title: "결제 유형",
      dataIndex: "type",
      render: (type: PurchaseType) => {
        return PurchaseTypeMap[type];
      },
      width: 100,
    },
    {
      title: "결제 금액",
      dataIndex: "amount",
      render: (amount) => {
        return `${amount.toLocaleString("ko-KR")}원`;
      },
      className: "whitespace-pre-wrap",
      width: 250,
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
    <Card>
      <div className="flex justify-between items-center mb-3">
        <p className="text-lg font-bold">결제 내역</p>
        <Select
          style={{ width: 200 }}
          allowClear
          placeholder="결제 유형"
          onChange={(value) => {
            setPurchaseFilter({ ...purchaseFilter, type: value });
          }}
          options={Object.entries(PurchaseTypeMap).map(([key, value]) => ({
            label: value,
            value: key,
          }))}
        />
      </div>
      <Table
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
