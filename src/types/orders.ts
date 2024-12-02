interface StoreDto {
  id: number;
  name: string;
  type: "SMARTSTORE";
  enabled: boolean;
}

interface ProductDto {
  id: number;
  name: string;
  productImageUrl: string;
  productId: string;
}

export type OrderStatus =
  | "PAY_WAITING"
  | "PAYED"
  | "PRODUCT_PREPARE"
  | "DELIVERING"
  | "DELIVERED"
  | "PURCHASE_CONFIRM"
  | "EXCHANGE"
  | "CANCEL"
  | "REFUND"
  | "CANCEL_NOPAY"
  | "REQUEST"
  | "CONFIRM"
  | "DONE"
  | "NOSHOW";

export const OrderStatusColor: Record<OrderStatus, string> = {
  PAY_WAITING: "yellow",
  DELIVERING: "blue",
  PRODUCT_PREPARE: "purple",
  CANCEL: "red",
  REFUND: "red",
  PURCHASE_CONFIRM: "green",
  PAYED: "green",
  DELIVERED: "green",
  EXCHANGE: "default",
  CANCEL_NOPAY: "default",
  REQUEST: "yellow",
  CONFIRM: "green",
  DONE: "green",
  NOSHOW: "red",
};

export interface OrderListDto {
  id: number;
  productOrderId: string;
  orderId: string;
  status: OrderStatus;
  store: StoreDto;
  product: ProductDto;
  workspaceId: number;
  ordererName: string;
  ordererEmail: string;
  ordererPhone: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  price: number;
  quantity: number;
  orderAt: string;
  deliveryAddress: string;
  deliveryMessage: string;
  deliveryCompany: string;
  deliveryTrackingNumber: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface OrdersFilters {
  page?: number;
  size?: number;
  id?: number;
  storeId?: number;
  productOrderId?: string;
  productId?: number;
  orderId?: string;
  status?: OrderStatus;
}

export const OrderStatusMap: Record<OrderStatus, string> = {
  PAY_WAITING: "결제 대기중",
  PAYED: "결제 완료",
  PRODUCT_PREPARE: "상품 준비중",
  DELIVERING: "배송중",
  DELIVERED: "배송 완료",
  PURCHASE_CONFIRM: "구매 확정",
  EXCHANGE: "교환 완료",
  CANCEL: "취소 완료",
  REFUND: "환불 완료",
  CANCEL_NOPAY: "미결제 취소",
  REQUEST: "신청",
  CONFIRM: "확정",
  DONE: "이용 완료",
  NOSHOW: "노쇼",
};

export interface PaginatedOrdersResponse {
  total: number;
  nodes: OrderListDto[];
}
