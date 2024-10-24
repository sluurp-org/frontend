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
  CONTENT_READY: "컨텐츠 준비 완료",
  READY: "발송 준비 완료",
  PROCESSING: "발송 중",
  SUCCESS: "발송 완료",
  FAILED: "발송 실패",
} as const;

export interface EventHistory {
  id: string;
  expiredAt: Date;
  downloadCount: number;
  disableDownload: boolean;
  status: EventHistoryStatus;
  message: string;
  processedAt: Date;
  createdAt: Date;
}

export interface UpdateEventHistoryDto {
  expiredAt?: Date;
  disableDownload?: boolean;
}

export interface UserEventHistoryDto {
  id: string;
  expiredAt: Date;
  downloadCount: number;
  downloadAvailable: boolean;
  downloadError: string;
  contentType: ContentType;
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
}

export interface UserEventHistoryDownloadDto {
  url?: string;
  text?: string;
  type: ContentType;
}

export interface UserEventHistoryRedirectDto {
  url: string;
}
