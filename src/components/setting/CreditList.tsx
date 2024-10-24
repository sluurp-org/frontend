import { useCreditList } from "@/hooks/queries/useCredit";
import { CreditDto, CreditFilterDto, CreditTypeMap } from "@/types/credit";
import errorHandler from "@/utils/error";
import { useState } from "react";
import Error from "@/components/Error";
import { Select, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";

export default function CreditList({ workspaceId }: { workspaceId: number }) {
  const [creditFilter, setCreditFilter] = useState<CreditFilterDto>({
    page: 1,
    size: 10,
  });

  const { data, isLoading, isError, error } = useCreditList(
    workspaceId,
    creditFilter
  );

  if (isError) {
    errorHandler(error);
    return <Error />;
  }

  const columns: ColumnsType<CreditDto> = [
    {
      title: "타입",
      dataIndex: "type",
      render: (type) => {
        return (
          <Tag color={type === "ADD" ? "green" : "red"}>
            {type === "ADD" ? "충전" : "사용"}
          </Tag>
        );
      },
      width: 80,
    },
    {
      title: "크레딧",
      dataIndex: "amount",
      render: (amount, record) => {
        const { type, remainAmount: remain } = record;

        const remainText = remain
          ? `\n(잔여: ${remain.toLocaleString("ko-KR")}크레딧)`
          : "";
        return `${amount.toLocaleString("ko-KR")}크레딧 ${
          type === "ADD" ? "충전" : "사용"
        } ${remainText}`;
      },
      className: "whitespace-pre-wrap",
      width: 300,
    },
    {
      title: "설명",
      dataIndex: "reason",
      render: (reason) => {
        return reason || "-";
      },
    },
    {
      title: "만료일",
      dataIndex: "expireAt",
      render: (expiredAt) => {
        return expiredAt ? moment(expiredAt).format("YYYY-MM-DD") : "-";
      },
      width: 160,
    },
    {
      title: "생성일",
      dataIndex: "createdAt",
      render: (createdAt) => {
        return createdAt ? moment(createdAt).format("YYYY-MM-DD") : "-";
      },
      width: 160,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="flex justify-between items-center mb-3">
        <p className="text-lg font-bold">크레딧 내역</p>
        <Select
          style={{ width: 200 }}
          allowClear
          placeholder="크레딧 유형"
          onChange={(value) => {
            setCreditFilter({ ...creditFilter, type: value });
          }}
          options={Object.entries(CreditTypeMap).map(([key, value]) => ({
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
          current: creditFilter.page,
          pageSize: creditFilter.size,
          onChange: (page, pageSize) => {
            setCreditFilter({ ...creditFilter, page, size: pageSize });
          },
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 30, 40, 50],
          showTotal: (total) => {
            return `총 ${total}개`;
          },
        }}
      />
    </div>
  );
}
