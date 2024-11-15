import Header from "@/components/Header";
import Component from "../../../../components/Container";
import { useRouter } from "next/router";
import { Table, Input, Collapse, Select } from "antd";
import { useState } from "react";
import { useProducts } from "@/hooks/queries/useProduct";
import Loading from "@/components/Loading";
import errorHandler from "@/utils/error";
import { Card } from "@/components/common/Card";
import { Events } from "@/components/event/Events";
import { ProductsFilters } from "@/types/product";
import toast from "react-hot-toast";
import Error from "@/components/Error";
import useDebounce from "@/hooks/useDebounce";
import { useStore } from "@/hooks/queries/useStore";

const { Search } = Input;

export default function ProductListPage() {
  const router = useRouter();
  const workspaceId = Number(router.query.id);
  const [filters, setFilters] = useState<ProductsFilters>({
    size: 15,
    page: 1,
  });
  const debouncedFilters = useDebounce(filters, 500);
  const { data, isLoading, error } = useProducts(workspaceId, {
    ...debouncedFilters,
    page: filters.page,
    size: filters.size,
  });

  const { data: store, isLoading: isStoreLoading } = useStore(workspaceId);

  const handlePageChange = (page: number, pageSize: number) => {
    setFilters({ ...filters, page, size: pageSize });
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
    toast.error(errorHandler(error));
    return <Error />;
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
                  기본 메시지 발송 설정
                </p>
                <p className="text-gray-600">
                  모든 상품에 적용되는 메시지 발송 규칙을 설정할 수 있습니다.
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

      <div className="flex justify-start mb-4 gap-3">
        <Input
          placeholder="상품명 검색"
          className="w-80"
          onChange={(e) => {
            setFilters({
              ...filters,
              name: e.target.value || undefined,
            });
          }}
        />
        <Select
          placeholder="스토어 선택"
          className="w-48"
          loading={isStoreLoading}
          allowClear
          defaultValue={undefined}
          onChange={(value) => {
            setFilters({
              ...filters,
              storeId: value || undefined,
            });
          }}
        >
          {store?.nodes.map((store) => (
            <Select.Option key={store.id} value={store.id}>
              {store.name}
            </Select.Option>
          ))}
        </Select>
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
