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

export interface EventHistoryFilter {
  page?: number;
  size?: number;
  id?: string;
  eventId?: number;
  productId?: number;
  productVariantId?: number;
  messageId?: number;
  status?: EventHistoryStatus;
}

export interface PaginatedEventHistory {
  total: number;
  nodes: EventHistory[];
}

export interface EventHistoryContent {
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
}

export interface EventHistory {
  id: string;
  contents: EventHistoryContent[];
  status: EventHistoryStatus;
  rawMessage: string | null;
  messageId: number | null;
  processedAt: Date | null;
  scheduledAt: Date;
  messageContent: string;
  messageVariables: Record<string, string>;
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
