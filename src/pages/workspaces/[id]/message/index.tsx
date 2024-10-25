import Header from "@/components/Header";
import Component from "@/components/Container";
import { Button, Table, Tag } from "antd";
import { useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import errorHandler from "@/utils/error";
import { MessageFilters } from "@/types/message";
import { useMessages } from "@/hooks/queries/useMessage";

export default function MessageList() {
  const router = useRouter();
  const [filters, setFilters] = useState<MessageFilters>({ page: 1, size: 15 });

  const workspaceId = Number(router.query.id);
  const { data, isLoading, error } = useMessages(workspaceId, filters);

  if (error) {
    errorHandler(error, router);
  }

  const columns = [
    {
      title: "아이디",
      dataIndex: "id",
      key: "id",
      width: "100px",
    },
    {
      title: "형식",
      dataIndex: "isGlobal",
      key: "isGlobal",
      render: (isGlobal: boolean) => (
        <Tag color={isGlobal ? "blue" : "green"}>
          {isGlobal ? "빠른시작형" : "고급형"}
        </Tag>
      ),
      width: "100px",
    },
    {
      title: "메세지 제목",
      dataIndex: "name",
      key: "name",
    },
  ];

  if (isLoading) return <Loading />;
  if (error) return <div>Error</div>;

  return (
    <Component>
      <Header title="메세지 목록" description="모든 스토어의 메세지 목록" />

      <Button
        type="primary"
        className="mb-3"
        onClick={() => router.push(`/workspaces/${workspaceId}/message/create`)}
      >
        메세지 생성
      </Button>
      <Table
        scroll={{ x: "700px" }}
        columns={columns}
        dataSource={data?.nodes || []}
        rowKey="id"
        rowClassName={"cursor-pointer"}
        onRow={(record) => ({
          onClick: () =>
            router.push(`/workspaces/${workspaceId}/message/${record.id}`),
        })}
        pagination={{
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
    </Component>
  );
}
