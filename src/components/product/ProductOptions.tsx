import Loading from "../Loading";
import { Button, Table } from "antd";
import { useState } from "react";
import {
  useProductOptions,
  useSyncProductOptions,
} from "@/hooks/queries/useProduct";
import { ProductOptionFilters } from "@/types/product";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { ReloadOutlined } from "@ant-design/icons";
import { Events } from "../event/Events";
import errorHandler from "@/utils/error";

export default function ProductOptions({
  productId,
  workspaceId,
}: {
  productId: number;
  workspaceId: number;
}) {
  const [filters, setFilters] = useState<ProductOptionFilters>({
    page: 1,
    size: 5,
  });
  const { data, isLoading, error } = useProductOptions(
    workspaceId,
    productId,
    filters
  );

  const columns = [
    {
      title: "옵션 아이디",
      dataIndex: "id",
      key: "id",
      width: "100px",
    },
    {
      title: "옵션 명",
      dataIndex: ["name"],
      key: "name",
    },
  ];

  const syncOptionsMutation = useSyncProductOptions(workspaceId, productId);
  const handleSyncOptions = () =>
    toast.promise(syncOptionsMutation.mutateAsync(), {
      loading: "옵션을 불러오는 중...",
      success: "옵션을 성공적으로 불러왔습니다.",
      error: (error) =>
        errorHandler(error) || "옵션을 불러오는데 실패했습니다.",
    });

  const handlePageChange = (page: number, pageSize: number) => {
    setFilters({ ...filters, page, size: pageSize });
  };

  if (isLoading || !data) {
    return <Loading isFullPage={false} />;
  }

  if (error) {
    return <div>주문 이력을 불러오는 중 에러가 발생했습니다.</div>;
  }

  return (
    <div>
      <Button type="primary" onClick={handleSyncOptions}>
        <ReloadOutlined />
        옵션 불러오기
      </Button>

      <p className="mt-4 text-sm text-gray-500">
        옵션을 클릭하면 발송 메시지 목록을 확인할 수 있습니다.
      </p>
      <Table
        columns={columns}
        dataSource={data?.nodes}
        rowKey="id"
        scroll={{ x: "300px" }}
        rowClassName={"cursor-pointer"}
        className="mt-3"
        expandable={{
          expandedRowRender: (record) => (
            <Events
              productId={productId}
              productVariantId={record.id}
              workspaceId={workspaceId}
            />
          ),
        }}
        pagination={{
          total: data?.total,
          pageSize: filters.size,
          current: filters.page,
          onChange: handlePageChange,
          onShowSizeChange: handlePageChange,
          pageSizeOptions: ["15", "20", "30", "40"],
          showSizeChanger: true,
          showTotal: (total) => `총 ${total} 개`,
          position: ["bottomCenter"],
        }}
      />
    </div>
  );
}
