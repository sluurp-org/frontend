import { ContentType } from "./content";

export type EventHistoryStatus =
  | "PENDING"
  | "CONTENT_READY"
  | "READY"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED";

export const EventHistoryStatusMap: Record<EventHistoryStatus, string> = {
  PENDING: "발송 준비 대기중",
  CONTENT_READY: "디지털 컨텐츠 준비 완료",
  READY: "발송 준비 완료",
  PROCESSING: "발송 중",
  SUCCESS: "발송 완료",
  FAILED: "발송 실패",
} as const;

// {"id":"c30cf207-7ab7-4d8e-bce3-612f65191bf1","contents":[{"id":1,"downloadCount":0,"downloadLimit":null,"disableDownload":false,"lastDownloadAt":null,"firstDownloadAt":null,"expiredAt":null,"content":{"id":240,"contentGroupId":16,"text":null,"type":"TEXT","name":"slurp-logo"}}],"status":"READY","message":null,"messageContent":"안녕하세요!\n#{구매자명}님의 주문이 정상적으로 접수되었습니다! ☺\n\n결제 상세 내역\n▶ 주문일자 : #{주문일자}\n▶ 주문번호 : #{주문번호}\n▶ 상품명 : #{상품명}\n▶ 옵션명: #{옵션명}\n▶ 결제금액 : #{총결제금액}\n\n#{상점명}에서 상품을 구매해주셔서 감사드립니다!\n\n구매하신 상품은 정성스럽게 준비해서 안전하게 보내드릴께요 ❤","processedAt":null,"createdAt":"2024-10-26T06:27:28.330Z","eventMessage":{"id":1,"name":"스르륵 구매완료\n"}}
export interface EventHistory {
  id: string;
  contents: {
    id: number;
    downloadCount: number;
    downloadLimit: number | null;
    disableDownload: boolean;
    lastDownloadAt: Date | null;
    firstDownloadAt: Date | null;
    expiredAt: Date | null;
    content: {
      id: number;
      contentGroupId: number;
      text: string | null;
      type: ContentType;
      name: string;
    };
  }[];
  status: EventHistoryStatus;
  rawMessage: string | null;
  messageId: number | null;
  processedAt: Date | null;
  messageContent: string;
  eventMessage: {
    id: number;
    name: string;
  };
}

export interface UpdateEventHistoryDto {
  expiredAt?: Date;
  disableDownload?: boolean;
}

export type ContentDto =
  | {
      downloadAvailable: false;
      error: string;
    }
  | {
      downloadAvailable: true;
      id: number;
      connectionId: number;
      name: string;
      type: ContentType;
    };

export interface UserEventHistoryDto {
  id: string;
  order: {
    orderId: string;
    productOrderId: string;
    ordererName: string;
    productName: string;
    productVariantName?: string;
    price: number;
    quantity: number;
    orderAt: Date;
  };
  contents: ContentDto[];
}

export interface UserEventHistoryDownloadDto {
  url?: string;
  text?: string;
  type: ContentType;
}

export interface UserEventHistoryRedirectDto {
  url: string;
}
