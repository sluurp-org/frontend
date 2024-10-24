import { EventHistoryStatus } from "./event-history";
import { OrderStatus } from "./orders";

export interface OrderHistoryFilters {
  page?: number;
  size?: number;
}

export type OrderHistoryType = "STATUS_CHANGE" | "MESSAGE" | "EVENT";
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
        id: string;
        expiredAt?: Date;
        downloadCount: number;
        message?: string;
        status: EventHistoryStatus;
        processedAt: Date;
      };
    };

export interface PaginatedOrderHistoryResponse {
  total: number;
  nodes: OrderHistoryDto[];
}
