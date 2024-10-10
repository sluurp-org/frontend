import Header from "@/components/Header";
import Component from "../../../../components/Container";
import { useRouter } from "next/router";
import { Table, Input } from "antd";
import { useState } from "react";
import { useProducts } from "@/hooks/quries/useProduct";
import Loading from "@/components/Loading";
import errorHandler from "@/utils/error";

const { Search } = Input;

export default function ProductListPage() {
  const router = useRouter();
  const workspaceId = Number(router.query.id);
  const [filters, setFilters] = useState<{
    size?: number;
    page?: number;
    name?: string;
  }>({ size: 15, page: 1 });
  const { data, isLoading, error } = useProducts(workspaceId, filters);

  const handlePageChange = (page: number, pageSize: number) => {
    setFilters({ ...filters, page, size: pageSize });
  };

  const handleSearch = (value: string) => {
    const name = value === "" ? undefined : value.trim();
    setFilters({ ...filters, name, page: 1 });
  };

  const columns = [
    {
      title: "상품 ID",
      dataIndex: "id",
      key: "id",
      width: "8%",
    },
    {
      title: "스토어명",
      dataIndex: ["store", "name"],
      key: "store",
      width: "13%",
    },
    {
      title: "상품 명",
      dataIndex: "name",
      key: "name",
    },
  ];

  if (isLoading) return <Loading />;
  if (error) {
    errorHandler(error, router);
  }

  return (
    <Component>
      <Header title="상품 목록" description="워크스페이스의 모든 상품 목록" />

      {/* 검색 바 */}
      <div className="flex justify-start mb-4">
        <Search
          placeholder="상품명 검색"
          onSearch={handleSearch}
          enterButton
          className="w-full md:w-1/3"
        />
      </div>

      {/* 상품 테이블 */}
      <Table
        columns={columns}
        dataSource={data?.nodes}
        rowKey="id"
        scroll={{ x: "1500px" }}
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
        }}
        onRow={(record) => ({
          onClick: () =>
            router.push(`/workspaces/${workspaceId}/product/${record.id}`),
        })}
      />
    </Component>
  );
}
