import { OrderStatus } from "./orders";

export interface OrderDto {
  id: number;
  productOrderId: string;
  orderId: string;
  status: OrderStatus;
  storeId: number;
  product: {
    id: number;
    name: string;
    productImageUrl: string;
    productId: string;
  };
  productVariant?: { id: number; name: string };
  workspaceId: number;
  ordererName: string;
  ordererEmail: string;
  ordererPhone: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  price?: number;
  quantity: number;
  orderAt?: Date;
  deliveryAddress: string;
  deliveryMessage: string;
  deliveryCompany: string;
  deliveryTrackingNumber: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateOrderDto {
  storeId: number;
  productId: number;
  productVariantId?: number;
  status: OrderStatus;
  ordererName: string;
  ordererPhone?: string;
  ordererEmail?: string;
  receiverName?: string;
  receiverPhone?: string;
  receiverEmail?: string;
  price?: number;
  quantity?: number;
  orderAt?: string;
  deliveryAddress?: string;
  deliveryMessage?: string;
  deliveryCompany?: string;
  deliveryTrackingNumber?: string;
}

export type UpdateOrderDto = Partial<CreateOrderDto>;
