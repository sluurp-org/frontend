import { EventHistoryStatus } from "./event-history";
import { MessageType } from "./message";
import { OrderStatus } from "./orders";

export interface EventsDto {
  id: number;
  name: string;
  productId: number;
  productVariantId: number;
  messageId: number;
  message: {
    id: number;
    name: string;
    type: MessageType;
    variables: Record<string, string>;
    contentGroupId: number;
    status: EventHistoryStatus;
    webhookUrl: string;
    webhookHeaders: Record<string, string>;
    webhookBody: string;
    emailTitle: string;
    body?: string;
    createdAt: string;
    updatedAt: string;
  };
  type: OrderStatus;
}

export interface EventsFilters {
  page?: number;
  size?: number;
  productId?: number;
  productVariantId?: number;
}

export interface EventDto {
  id: number;
  productId: number;
  productVariantId: number;
  messageId: number;
  type: OrderStatus;
}

export interface PaginatedEventsDto {
  total: number;
  nodes: EventsDto[];
}

export interface CreateEventDto {
  productId?: number;
  productVariantId?: number;
  messageId: number;
  type: OrderStatus;
}
