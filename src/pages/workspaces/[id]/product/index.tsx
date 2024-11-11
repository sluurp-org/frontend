import Header from "@/components/Header";
import Component from "../../../../components/Container";
import { useRouter } from "next/router";
import { Table, Input, Collapse } from "antd";
import { useState } from "react";
import { useProducts } from "@/hooks/queries/useProduct";
import Loading from "@/components/Loading";
import errorHandler from "@/utils/error";
import { Card } from "@/components/common/Card";
import { Events } from "@/components/product/Events";
import { ProductsFilters } from "@/types/product";

const { Search } = Input;

export default function ProductListPage() {
  const router = useRouter();
  const workspaceId = Number(router.query.id);
  const [filters, setFilters] = useState<ProductsFilters>({
    size: 15,
    page: 1,
  });
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
      <Collapse
        rootClassName="bg-white mb-3"
        items={[
          {
            label: (
              <>
                <p className="text-indigo-500 font-bold cursor-pointer">
                  기본 메세지 발송 설정
                </p>
                <p className="text-gray-600">
                  모든 상품에 적용되는 메세지 발송 규칙을 설정할 수 있습니다.
                </p>
              </>
            ),
            children: (
              <Events
                workspaceId={workspaceId}
                productId={null}
                productVariantId={null}
              />
            ),
            key: "events",
          },
        ]}
      >
        접기
      </Collapse>

      <div className="flex justify-start mb-4">
        <Search
          placeholder="상품명 검색"
          onSearch={handleSearch}
          enterButton
          className="w-full md:w-1/3"
        />
      </div>
      <Card className="p-0">
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
            className: "pr-4",
          }}
          onRow={(record) => ({
            onClick: () =>
              router.push(`/workspaces/${workspaceId}/product/${record.id}`),
          })}
        />
      </Card>
    </Component>
  );
}
