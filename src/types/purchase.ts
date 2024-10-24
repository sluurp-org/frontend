export type PurchaseType = "CREDIT" | "SUBSCRIPTION" | "CHANGE_SUBSCRIPTION";
export const PurchaseTypeMap: Record<PurchaseType, string> = {
  CREDIT: "크레딧 충전",
  SUBSCRIPTION: "구독",
  CHANGE_SUBSCRIPTION: "구독 변경",
};

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

export interface CreatePurchaseDto {
  amount: number;
  type: PurchaseType;
}

export interface CompletePurchaseDto {
  paymentId: string;
}

export interface PurchaseDto {
  id: string;
  amount: number;
  reason: string;
  type: PurchaseType;
  startedAt: Date;
  endedAt: Date;
  status: PurchaseStatus;
  purchasedAt: Date;
}
export interface PurchaseListDto {
  nodes: PurchaseDto[];
  total: number;
}

export interface PurchaseFilter {
  type?: PurchaseType;
  page: number;
  size: number;
}
