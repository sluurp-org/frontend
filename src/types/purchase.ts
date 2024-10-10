export type PurchaseType = "CREDIT" | "SUBSCRIPTION";

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
  type: PurchaseType;
  createdAt: Date;
  updatedAt: Date;
}
