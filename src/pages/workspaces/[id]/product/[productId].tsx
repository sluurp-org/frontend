import Header from "@/components/Header";
import Component from "../../../../components/Container";
import { useRouter } from "next/router";
import { useProduct } from "@/hooks/queries/useProduct";
import Loading from "@/components/Loading";
import errorHandler from "@/utils/error";
import Image from "next/image";
import InfoRow from "@/components/InfoRow";
import {
  ShopOutlined,
  ArrowLeftOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import ProductOptions from "@/components/product/ProductOptions";
import { Button } from "antd";
import { Events } from "@/components/product/Events";
import { Card } from "@/components/common/Card";

export default function ProductDetailPage() {
  const router = useRouter();

  const workspaceId = Number(router.query.id);
  const productId = Number(router.query.productId);
  const { data, isLoading, error } = useProduct(workspaceId, productId);

  if (isLoading || !data) return <Loading />;
  if (error) {
    errorHandler(error, router);
  }

  return (
    <Component>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 mb-3 transition-colors duration-300 ease-in-out hover:text-blue-500 p-2"
      >
        <ArrowLeftOutlined />
        뒤로 가기
      </button>

      <Header title="상품 상세" description={`${data.name} 상품 상세`} />
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-y-6 xl:gap-6 w-full">
        <Card className="h-min">
          <Image
            src={data?.productImage || "/store/smartstore.png"}
            alt={data.name}
            width={160}
            height={160}
            className="rounded-lg h-auto shadow-md w-full mb-6"
          />
          <div>
            <span className="text-sm text-gray-400">상품명</span>
            <h2 className="text-2xl font-semibold">{data.name}</h2>
            <div className="flex flex-col w-full divide-y space-y-3">
              <InfoRow label="상품 ID" copyable>
                {data.productId}
              </InfoRow>
              <InfoRow label="상품 스토어">
                <span
                  className="text-indigo-400 cursor-pointer hover:underline"
                  onClick={() =>
                    router.push(
                      `/workspaces/${workspaceId}/store/${data.store.id}`
                    )
                  }
                >
                  <ShopOutlined className="mr-1 text-indigo-400" />
                  {data.store.name}
                </span>
              </InfoRow>
            </div>
          </div>
        </Card>
        <div className="space-y-6 col-span-3">
          <Card>
            <h2 className="text-2xl font-semibold mb-4">상품 발송 메세지</h2>
            <Events workspaceId={workspaceId} productId={productId} />
          </Card>
          <Card>
            <h2 className="text-2xl font-semibold mb-4">상품 옵션</h2>
            <ProductOptions workspaceId={workspaceId} productId={productId} />
          </Card>
        </div>
      </div>
    </Component>
  );
}
