export type PurchaseStatus =
  | "CANCELLED"
  | "FAILED"
  | "PAID"
  | "PARTIAL_CANCELLED"
  | "PAY_PENDING"
  | "READY"
  | "VIRTUAL_ACCOUNT_ISSUED";

export const PurchaseStatusMap: Record<PurchaseStatus, string> = {
  CANCELLED: "취소됨",
  FAILED: "실패",
  PAID: "결제됨",
  PARTIAL_CANCELLED: "부분 취소됨",
  PAY_PENDING: "결제 대기중",
  READY: "결제 대기중",
  VIRTUAL_ACCOUNT_ISSUED: "가상 계좌 발급됨",
};

export interface PurchaseItemDto {
  id: string;
  amount: number;
  defaultPrice: number;
  totalAmount: number;
  reason: string;
  status: PurchaseStatus;
  purchasedAt: Date;
}
export interface PurchaseListDto {
  nodes: PurchaseItemDto[];
  total: number;
}

export interface PurchaseFilter {
  page: number;
  size: number;
}

export interface PurchaseConfigDto {
  defaultPrice: number;
  alimtalkSendPrice: number;
  contentSendPrice: number;
}

export interface PurchaseDto {
  freeTrialAvailable: boolean;
  noPurchase: boolean;
  nextPurchaseAt: Date;
  contentSendCount: number;
  alimtalkSendCount: number;
  amount: number;
  totalAmount: number;
  discountAmount: number;
  defaultPrice: number;
  alimtalkSendPrice: number;
  contentSendPrice: number;
}
