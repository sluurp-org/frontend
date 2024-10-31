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
  READY: "준비됨",
  VIRTUAL_ACCOUNT_ISSUED: "가상 계좌 발급됨",
};

export interface CompletePurchaseDto {
  paymentId: string;
}

export interface PurchaseDto {
  id: string;
  amount: number;
  discountAmount: number;
  totalAmount: number;
  reason: string;
  status: PurchaseStatus;
  purchasedAt: Date;
}
export interface PurchaseListDto {
  nodes: PurchaseDto[];
  total: number;
}

export interface PurchaseFilter {
  page: number;
  size: number;
}
