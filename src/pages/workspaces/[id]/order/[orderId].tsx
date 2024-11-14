import Header from "@/components/Header";
import Component from "../../../../components/Container";
import { useRouter } from "next/router";
import { useOrder } from "@/hooks/queries/useOrder";
import Loading from "@/components/Loading";
import { OrderStatus, OrderStatusColor, OrderStatusMap } from "@/types/orders";
import OrderHistory from "@/components/order/OrderHistory";
import InfoRow from "@/components/InfoRow";
import moment from "moment";
import Image from "next/image";
import {
  ArrowLeftOutlined,
  ProductOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import errorHandler from "@/utils/error";
import { Tag } from "antd";
import { Card } from "@/components/common/Card";
import Link from "next/link";
import toast from "react-hot-toast";
import Error from "@/components/Error";

export default function WorkspaceOrderDetail() {
  const router = useRouter();

  const workspaceId = parseInt(router.query.id as string, 10);
  const orderId = parseInt(router.query.orderId as string, 10);
  const { data, isLoading, error } = useOrder(workspaceId, orderId);

  if (isLoading) return <Loading />;
  if (error || !data) {
    toast.error(errorHandler(error));
    return <Error />;
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
      <Header
        title={`${data.ordererName}님의 주문 상세`}
        description="주문 상세 정보를 확인할 수 있습니다."
      />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-y-6 xl:gap-6 w-full">
        <div className="space-y-6 col-span-2">
          <Card>
            <h2 className="text-2xl font-semibold mb-4">주문 정보</h2>
            <InfoRow label="주문 번호" copyable>
              {data.orderId}
            </InfoRow>
            <InfoRow label="상품 주문 번호" copyable>
              {data.productOrderId}
            </InfoRow>
            <InfoRow label="주문 상태">
              <Tag color={OrderStatusColor[data.status]}>
                {OrderStatusMap[data.status]}
              </Tag>
            </InfoRow>
            <InfoRow label="주문 일시">
              {moment(data.orderAt).format("YYYY년 MM월 DD일 HH시 mm분 ss초")}
            </InfoRow>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold mb-4">배송 정보</h2>
            <InfoRow label="주문자">{data.ordererName}</InfoRow>
            <InfoRow
              label="주문자 연락처"
              copyable
              copytext={data.ordererPhone}
            >
              <a href={`tel:${data.ordererPhone}`}>{data.ordererPhone}</a>
            </InfoRow>
            <InfoRow label="수령자">{data.receiverName}</InfoRow>
            <InfoRow
              label="수령자 연락처"
              copyable
              copytext={data.receiverPhone}
            >
              <a href={`tel:${data.receiverPhone}`}>{data.receiverPhone}</a>
            </InfoRow>
            <InfoRow label="배송 주소" copyable>
              {data.deliveryAddress || "배송 주소 없음"}
            </InfoRow>
            <InfoRow
              label="배송 메시지"
              copyable={!!data.deliveryMessage}
              copytext={data.deliveryMessage}
            >
              {data.deliveryMessage || "배송 메시지 없음"}
            </InfoRow>
            <InfoRow label="배송 업체" copyable={!!data.deliveryCompany}>
              {data.deliveryCompany || "배송 업체 없음"}
            </InfoRow>
            <InfoRow label="송장 번호" copyable={!!data.deliveryTrackingNumber}>
              {data.deliveryTrackingNumber || "송장 번호 없음"}
            </InfoRow>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold mb-4">결제 상품 정보</h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Image
                src={data.product.productImageUrl}
                alt={data.product.name}
                className="w-32 h-32 object-cover rounded-md"
                width={128}
                height={128}
              />
              <div>
                <Link
                  href={`/workspaces/${workspaceId}/product/${data.product.id}`}
                  target="_blank"
                  className="text-indigo-400 cursor-pointer hover:underline text-lg font-bold"
                >
                  <ProductOutlined className="mr-1" />
                  <span>{data.product.name}</span>
                </Link>
                <InfoRow label="상품명">{data.product.name}</InfoRow>
                <InfoRow label="옵션명">
                  {data.productVariant?.name || "-"}
                </InfoRow>
                <InfoRow label="상품 스토어">
                  <Link
                    href={`/workspaces/${workspaceId}/store?storeId=${data.store.id}`}
                    target="_blank"
                    className="text-indigo-400 cursor-pointer hover:underline"
                  >
                    <ShopOutlined className="mr-1" />
                    <span>{data.store.name}</span>
                  </Link>
                </InfoRow>
                <InfoRow label="상품 아이디" copyable>
                  {data.product.productId}
                </InfoRow>
                <InfoRow label="결제 수량">{data.quantity}개</InfoRow>
                <InfoRow label="결제 금액">
                  {data.price?.toLocaleString() || 0}원
                </InfoRow>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-2xl font-semibold mb-4">주문 히스토리</h2>
          <OrderHistory workspaceId={workspaceId} orderId={orderId} />
        </Card>
      </div>
    </Component>
  );
}
