import Header from "@/components/Header";
import Component from "@/components/Container";
import { Button, Table, Tag } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import errorHandler from "@/utils/error";
import { StoreFilters, StoreType } from "@/types/store";
import { useStore } from "@/hooks/queries/useStore";
import StoreDrawer from "@/components/store/StoreDrawer";
import CreateStoreDrawer from "@/components/store/CreateStoreDrawer";
import Error from "@/components/Error";
import { Card } from "@/components/common/Card";
import { ShopOutlined } from "@ant-design/icons";

export default function StoreList() {
  const router = useRouter();
  const workspaceId = Number(router.query.id);
  const storeId = Number(router.query.storeId) || null;

  const [filters, setFilters] = useState<StoreFilters>({ page: 1, size: 15 });
  const { data, isLoading, error } = useStore(workspaceId, filters);
  const [createStoreDrawerOpen, setCreateStoreDrawerOpen] = useState(false);

  const setSelectedStoreId = useCallback(
    (id: number | null) => {
      router.push(
        {
          query: {
            ...router.query,
            storeId: id,
          },
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  const columns = [
    {
      title: "아이디",
      dataIndex: "id",
      width: "70px",
    },
    {
      title: "유형",
      dataIndex: "type",
      render: (type: StoreType) => StoreType[type],
      width: "120px",
    },
    {
      title: "이름",
      dataIndex: "name",
    },
    {
      title: "상태",
      dataIndex: "enabled",
      render: (enabled: boolean) => {
        return enabled ? (
          <Tag color="green">활성화</Tag>
        ) : (
          <Tag color="red">비활성화</Tag>
        );
      },
    },
  ];

  if (isLoading) return <Loading />;
  if (error) {
    errorHandler(error);
    return <Error />;
  }

  return (
    <Component>
      <Header title="스토어 목록" description="워크스페이스의 스토어 목록" />

      {storeId && (
        <StoreDrawer
          workspaceId={workspaceId}
          storeId={storeId}
          isOpen={!!storeId}
          setIsOpen={() => setSelectedStoreId(null)}
        />
      )}
      <CreateStoreDrawer
        workspaceId={workspaceId}
        isOpen={createStoreDrawerOpen}
        setIsOpen={setCreateStoreDrawerOpen}
      />

      <Button
        type="primary"
        onClick={() => setCreateStoreDrawerOpen(true)}
        className="mb-4"
        icon={<ShopOutlined />}
      >
        스토어 생성
      </Button>

      <Card className="p-0">
        <Table
          scroll={{ x: "1000px" }}
          columns={columns}
          dataSource={data?.nodes || []}
          rowKey="id"
          rowClassName={"cursor-pointer"}
          onRow={(record) => ({
            onClick: () => {
              setSelectedStoreId(record.id);
            },
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
