import { OrderStatus } from "./orders";

export interface OrderHistoryFilters {
  page?: number;
  size?: number;
}

export type OrderHistoryType = "STATUS_CHANGE" | "MESSAGE" | "EVENT";

export const OrderHistoryEventStatus = {
  PROCESSING: "처리중",
  SUCCESS: "성공",
  FAIL: "실패",
} as const;

export type OrderHistoryEventStatus =
  | "PROCESSING"
  | "SUCCESS"
  | "FAIL";

export type OrderHistoryDto =
  | {
      id: number;
      type: "STATUS_CHANGE";
      changedStatus: OrderStatus;
      createdAt: Date;
    }
  | {
      id: number;
      type: "MESSAGE";
      message: string;
      createdAt: Date;
    }
  | {
      id: number;
      type: "EVENT";
      createdAt: Date;
      eventHistory: {
        expiredAt?: Date;
        downloadCount: number;
        message?: string;
        status: OrderHistoryEventStatus;
        processedAt: Date;
      }
    };

export interface PaginatedOrderHistoryResponse {
  total: number;
  nodes: OrderHistoryDto[];
}
