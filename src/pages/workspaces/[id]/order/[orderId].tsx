import Header from "@/components/Header";
import Component from "../../../../components/Container";
import { useRouter } from "next/router";
import { useOrder } from "@/hooks/queries/useOrder";
import Loading from "@/components/Loading";
import { OrderStatus } from "@/types/orders";
import OrderHistory from "@/components/order/OrderHistory";
import InfoRow from "@/components/InfoRow";
import moment from "moment";
import Image from "next/image";
import { ArrowLeftOutlined, ProductOutlined } from "@ant-design/icons";
import errorHandler from "@/utils/error";

export default function WorkspaceOrderDetail() {
  const router = useRouter();

  const workspaceId = parseInt(router.query.id as string, 10);
  const orderId = parseInt(router.query.orderId as string, 10);
  const { data, isLoading, error } = useOrder(workspaceId, orderId);

  if (isLoading) return <Loading />;
  if (error || !data) {
    errorHandler(error, router);
    return null;
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
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">주문 정보</h2>
            <InfoRow label="주문 번호" copyable>
              {data.orderId}
            </InfoRow>
            <InfoRow label="상품 주문 번호" copyable>
              {data.productOrderId}
            </InfoRow>
            <InfoRow label="주문 상태">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  data.status === "PAY_WAITING"
                    ? "bg-yellow-200 text-yellow-800"
                    : data.status === "CANCEL" || data.status === "REFUND"
                    ? "bg-red-200 text-red-800"
                    : data.status === "PURCHASE_CONFIRM"
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-200 text-gray-800"
                } transition-colors duration-300 ease-in-out`}
              >
                {OrderStatus[data.status]}
              </span>
            </InfoRow>
            <InfoRow label="주문 일시">
              {moment(data.orderAt).format("YYYY년 MM월 DD일 HH시 mm분 ss초")}
            </InfoRow>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
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
            <InfoRow label="배송 메세지">
              {data.deliveryMessage || "배송 메세지 없음"}
            </InfoRow>
            <InfoRow label="배송 업체" copyable={!!data.deliveryCompany}>
              {data.deliveryCompany || "배송 업체 없음"}
            </InfoRow>
            <InfoRow label="송장 번호" copyable={!!data.deliveryTrackingNumber}>
              {data.deliveryTrackingNumber || "송장 번호 없음"}
            </InfoRow>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">결제 상품 정보</h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Image
                src={data.product.productImage}
                alt={data.product.name}
                className="w-32 h-32 object-cover rounded-md"
                width={128}
                height={128}
              />
              <div>
                <p
                  className="text-indigo-400 cursor-pointer hover:underline text-lg font-semibold"
                  onClick={() =>
                    router.push(
                      `/workspaces/${workspaceId}/product/${data.product.id}`
                    )
                  }
                >
                  <ProductOutlined className="mr-1" />
                  {data.product.name}
                </p>
                <InfoRow label="상품 아이디" copyable>
                  {data.product.productId}
                </InfoRow>
                <InfoRow label="결제 수량">{data.quantity}</InfoRow>
                <InfoRow label="결제 금액">
                  {data.price?.toLocaleString() || 0}원
                </InfoRow>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm w-full">
          <h2 className="text-2xl font-semibold mb-4">주문 히스토리</h2>
          <OrderHistory workspaceId={workspaceId} orderId={orderId} />
        </div>
      </div>
    </Component>
  );
}
