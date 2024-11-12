import InfoRow from "@/components/InfoRow";
import UserEventContainer from "@/components/user-event/UserEventContainer";
import { ContentDto, UserEventHistoryDto } from "@/types/event-history";
import { CopyOutlined } from "@ant-design/icons";
import { Button } from "antd";
import moment from "moment";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import { useState } from "react";

function OrderItem({ index }: { index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {!isOpen ? (
        <Button
          type="primary"
          size="large"
          className="w-full"
          onClick={() => setIsOpen(true)}
        >
          #{index + 1} 상품 열람하기
        </Button>
      ) : (
        <p className="text-sm bg-gray-200 rounded-lg shadow-sm whitespace-pre-line p-5">
          스르륵 1개월 무료 체험권 획득!
          <CopyToClipboard
            text={"ㅁ"}
            onCopy={() => toast.success("복사되었습니다.")}
          >
            <CopyOutlined className="ml-2 text-gray-400 cursor-pointer" />
          </CopyToClipboard>
        </p>
      )}
    </div>
  );
}

export default function Order() {
  const data: UserEventHistoryDto = {
    id: "test",
    order: {
      orderId: "192738265838294",
      productOrderId: "5820349851032948",
      productName: "스르륵 테스트 상품",
      productVariantName: "1개월 무료 체험권",
      orderAt: new Date("2024-10-12"),
      quantity: 1,
      price: 10000,
      ordererName: "홍길동",
    },
    contents: [
      {
        id: 1,
        connectionId: 1,
        type: "TEXT",
        name: "테스트 상품",
        downloadAvailable: true,
      },
    ],
  };

  return (
    <UserEventContainer>
      <div className="mb-5 w-full">
        <p className="text-lg font-bold">상품 다운로드</p>
        <p className="text-sm text-gray-500 whitespace-pre-line mb-4">
          아래 버튼을 눌러 상품을 다운로드 할 수 있습니다.{"\n"}
          판매자가 지정해둔 정책에 따라 상품 다운로드 횟수 제한이 있을 수
          있습니다.
        </p>
        <div className="flex flex-col gap-3">
          {data?.contents.map((_, index) => (
            <div key={index}>
              <p className="text-sm text-gray-800 mb-1">#{index + 1} 상품</p>
              <OrderItem index={index} />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full">
        <p className="text-lg font-bold">
          {data?.order.ordererName || "고객"}님의 주문 정보
        </p>
        <div className="border-b border-gray-200 pb-3"></div>
        <InfoRow label="주문번호" copyable>
          {data?.order.orderId}
        </InfoRow>
        <InfoRow label="상품 주문번호" copyable>
          {data?.order.productOrderId}
        </InfoRow>
        <InfoRow label="상품명">{data?.order.productName}</InfoRow>
        <InfoRow label="상품 옵션명">
          {data?.order.productVariantName || "-"}
        </InfoRow>
        <InfoRow label="주문 일시">
          {data?.order.orderAt
            ? moment(data?.order.orderAt).format("YYYY.MM.DD HH:mm:ss")
            : "-"}
        </InfoRow>
        <InfoRow label="주문 수량">
          {data?.order.quantity.toLocaleString("ko-KR")}개
        </InfoRow>
        <InfoRow label="주문 금액">
          {data?.order.price.toLocaleString("ko-KR")}원
        </InfoRow>
      </div>
    </UserEventContainer>
  );
}
