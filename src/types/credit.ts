export type CreditType = "USE" | "ADD";
export const CreditTypeMap: Record<CreditType, string> = {
  USE: "사용",
  ADD: "충전",
};

export interface CreditFilterDto {
  page: number;
  size: number;
  type?: CreditType;
}

export interface CreditDto {
  id: number;
  amount: number;
  remainAmount: number;
  type?: CreditType;
  expireAt?: string;
  reason?: string;
  createdAt: string;
}

export interface PaginatedCreditDto {
  nodes: CreditDto[];
  total: number;
}
