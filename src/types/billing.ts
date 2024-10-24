export interface BillingDto {
  id: number;
  cardNumber: string;
  createdAt: Date;
}

export interface CreateBillingDto {
  number: string;
  expiryYear: string;
  expiryMonth: string;
  birthOrBusinessRegistrationNumber: string;
  passwordTwoDigits: string;
}
