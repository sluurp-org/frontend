import Header from "@/components/Header";
import Component from "@/components/Container";
import { Button, Table, Tag } from "antd";
import { useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import errorHandler from "@/utils/error";
import { ContentGroupFilters, ContentType } from "@/types/content";
import { useContentGroups } from "@/hooks/queries/useContent";
import CreateContentGroupDrawer from "@/components/content/CreateContentGroupDrawer";

export default function WorkspaceContent() {
  const router = useRouter();
  const [filters, setFilters] = useState<ContentGroupFilters>({
    page: 1,
    size: 15,
  });
  const [createContentGroupDrawerOpen, setCreateContentGroupDrawerOpen] =
    useState(false);

  const workspaceId = Number(router.query.id);
  const { data, isLoading, error } = useContentGroups(workspaceId, filters);

  if (error) {
    errorHandler(error, router);
  }

  const columns = [
    {
      title: "아이디",
      dataIndex: "id",
      width: "10px",
      key: "id",
    },
    {
      title: "이름",
      dataIndex: "name",
      width: 150,
      key: "name",
    },
    {
      title: "유형",
      dataIndex: "type",
      width: 150,
      key: "type",
      render: (type: ContentType) => (
        <Tag color="blue">{ContentType[type]}</Tag>
      ),
    },
  ];

  if (isLoading) return <Loading />;
  if (error) return <div>Error</div>;

  return (
    <Component>
      <Header
        title="발송 콘텐츠 목록"
        description="모든 스토어의 콘텐츠 목록"
      />
      <CreateContentGroupDrawer
        workspaceId={workspaceId}
        open={createContentGroupDrawerOpen}
        onClose={() => setCreateContentGroupDrawerOpen(false)}
      />
      <Button
        type="primary"
        onClick={() => setCreateContentGroupDrawerOpen(true)}
        className="mb-4"
      >
        콘텐츠 생성
      </Button>
      <Table
        columns={columns}
        dataSource={data?.nodes || []}
        rowKey="id"
        rowClassName={"cursor-pointer"}
        onRow={(record) => ({
          onClick: () =>
            router.push(`/workspaces/${workspaceId}/content/${record.id}`),
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
