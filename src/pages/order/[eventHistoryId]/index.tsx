import InfoRow from "@/components/InfoRow";
import Loading from "@/components/Loading";
import UserEventContainer from "@/components/user-event/UserEventContainer";
import {
  useUserEventHistory,
  useUserEventHistoryDownload,
} from "@/hooks/queries/useUserEventHistory";
import { ContentDto, UserEventHistoryDownloadDto } from "@/types/event-history";
import {
  CopyOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Alert, Button, Modal, QRCode, Result } from "antd";
import { isAxiosError } from "axios";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import CopyToClipboard from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import Barcode from "react-barcode";
import { useState } from "react";

const ContentDownloadRendering = ({
  data,
}: {
  data: UserEventHistoryDownloadDto;
}) => {
  const [isDetailView, setIsDetailView] = useState(false);
  const { type, url, text } = data;

  const downloadFile = () => {
    if (!url) return;

    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    a.click();
  };

  if (type === "FILE") {
    return (
      <Button
        type="primary"
        size="large"
        className="w-full"
        onClick={downloadFile}
        icon={<DownloadOutlined />}
      >
        파일 다운로드
      </Button>
    );
  }

  if (type === "URL" && text) {
    return (
      <Link href={text} target="_blank">
        <p className="text-sm text-gray-500 mb-2">{text}</p>
        <Button type="primary" size="large" className="w-full">
          주소로 이동하기
        </Button>
      </Link>
    );
  }

  if (type === "TEXT" && text) {
    return (
      <p className="text-sm bg-gray-200 rounded-lg shadow-sm whitespace-pre-line p-5">
        {text}

        <CopyToClipboard
          text={text}
          onCopy={() => toast.success("복사되었습니다.")}
        >
          <CopyOutlined className="ml-2 text-gray-400 cursor-pointer" />
        </CopyToClipboard>
      </p>
    );
  }

  if (type === "QRCODE" && text) {
    return (
      <CopyToClipboard
        text={text}
        onCopy={() => toast.success("복사되었습니다.")}
      >
        <div className="flex flex-col items-center cursor-pointer">
          <QRCode size={256} className="w-full" value={text} />
          <p className="text-sm text-gray-500 mt-2">
            화면을 터치하여 복사할 수 있습니다.
          </p>
        </div>
      </CopyToClipboard>
    );
  }

  if (type === "BARCODE" && text) {
    return (
      <>
        <div className="flex flex-col items-center cursor-pointer max-w-[350px]">
          <Button
            className="w-full flex justify-center items-center mt-3"
            type="link"
            size="large"
            onClick={() => setIsDetailView(true)}
          >
            <Barcode value={text} />
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            화면을 터치하여 확대할 수 있습니다.
          </p>
        </div>
        <Modal
          open={isDetailView}
          onCancel={() => setIsDetailView(false)}
          footer={null}
          width={800}
        >
          <div className="w-full flex justify-center items-center">
            <Barcode value={text} />
          </div>
          <div className="flex justify-center items-center mt-3">
            <p className="text-sm text-gray-500">{text}</p>
            <CopyToClipboard
              text={text}
              onCopy={() => toast.success("복사되었습니다.")}
            >
              <CopyOutlined className="ml-2 text-gray-400 cursor-pointer" />
            </CopyToClipboard>
          </div>
        </Modal>
      </>
    );
  }

  return (
    <Alert
      icon={<ExclamationCircleOutlined />}
      showIcon
      type="error"
      className="whitespace-pre-line"
      message={`열람할 수 없는 형식입니다.\n우측 하단 고객센터로 문의 부탁드립니다.`}
    />
  );
};

function OrderItem({
  index,
  content,
  eventHistoryId,
}: {
  index: number;
  content: ContentDto;
  eventHistoryId: string;
}) {
  const {
    data: downloadData,
    isLoading: downloadIsLoading,
    error: downloadError,
    refetch: downloadRefetch,
  } = useUserEventHistoryDownload(
    eventHistoryId,
    content.downloadAvailable ? content.connectionId : 0
  );

  if (!content.downloadAvailable) {
    return (
      <Alert
        icon={<ExclamationCircleOutlined />}
        showIcon
        type="error"
        className="whitespace-pre-line"
        message={content.error}
      />
    );
  }

  if (downloadError) {
    return (
      <Alert
        icon={<ExclamationCircleOutlined />}
        showIcon
        type="error"
        className="whitespace-pre-line"
        message={
          isAxiosError(downloadError)
            ? downloadError.response?.data.message
            : "디지털 컨텐츠를 열람할 수 없습니다."
        }
      />
    );
  }

  const contentDownloadText =
    content.type === "FILE" ? "다운로드 주소 생성" : "열람";

  return (
    <div>
      {!downloadData && (
        <Button
          type="primary"
          size="large"
          className="w-full"
          onClick={() => downloadRefetch()}
          loading={downloadIsLoading}
        >
          #{index + 1} 상품 {contentDownloadText}
        </Button>
      )}
      {downloadData && !downloadIsLoading && (
        <ContentDownloadRendering data={downloadData} />
      )}
    </div>
  );
}

export default function Order() {
  const router = useRouter();
  const eventHistoryId = router.query.eventHistoryId as string;
  const { data, isLoading, error } = useUserEventHistory(eventHistoryId);

  if (!isLoading && error) {
    return (
      <UserEventContainer>
        <Result
          status="error"
          title="주문 정보를 불러올 수 없습니다."
          subTitle={isAxiosError(error) ? error.response?.data.message : ""}
        />
        <p className="text-sm text-gray-500">
          오류라고 판단될 시 우측 하단 고객센터로 문의 부탁드립니다.
        </p>
      </UserEventContainer>
    );
  }

  return (
    <UserEventContainer isLoading={isLoading}>
      <div className="mb-5 w-full">
        <p className="text-lg font-bold">상품 다운로드</p>
        <p className="text-sm text-gray-500 whitespace-pre-line mb-4">
          아래 버튼을 눌러 상품을 다운로드 할 수 있습니다.{"\n"}
          판매자가 지정해둔 정책에 따라 상품 다운로드 횟수 제한이 있을 수
          있습니다.
        </p>
        <div className="flex flex-col gap-3">
          {data?.contents.map((content, index) => (
            <div key={index}>
              <p className="text-sm text-gray-800 mb-1">#{index + 1} 상품</p>
              <OrderItem
                index={index}
                content={content}
                eventHistoryId={eventHistoryId}
              />
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
