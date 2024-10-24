import { PurchaseStatus } from "./purchase";

export interface SubscriptionDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  isContentEnabled: boolean;
  contentLimit: number;
  messageLimit: number;
  storeLimit: number;
  contentCredit: number;
  alimTalkCredit: number;
  emailCredit: number;
}

export interface WorkspaceSubscription {
  startedAt: Date;
  endedAt: Date;
  status: PurchaseStatus;
  purchasedAt: Date;
  subscription: SubscriptionDto;
}

export interface WorkspaceSubscriptionDto {
  currentSubscription: WorkspaceSubscription;
  nextSubscription?: WorkspaceSubscription;
}
