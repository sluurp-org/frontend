import { EventHistoryStatus } from "./event-history";
import { MessageType } from "./message";
import { OrderStatus } from "./orders";

export interface EventsDto {
  id: number;
  productId: number;
  productVariantId: number;
  messageId: number;
  delayDays: number;
  sendHour: number;
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
  productId?: number | null;
  productVariantId?: number | null;
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
  productId?: number | null;
  productVariantId?: number | null;
  messageId: number;
  type: OrderStatus;
  delayDays?: number;
  sendHour?: number;
}
