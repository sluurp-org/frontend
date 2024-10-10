export type StoreType = "SMARTSTORE";
export const StoreType = {
  SMARTSTORE: "스마트스토어",
} as const;

export interface CreateSmartStoreCredentialsDto {
  applicationId: string;
  applicationSecret: string;
}

export interface CreateStoreDto {
  name: string;
  type: StoreType;
  smartStoreCredentials: CreateSmartStoreCredentialsDto;
}

export interface StoresDto {
  id: number;
  name: string;
  type: StoreType;
  enabled: boolean;
}

export interface UpdateSmartStoreCredentialsDto {
  applicationId?: string;
  applicationSecret?: string;
}

export interface UpdateStoreDto {
  id?: number;
  name?: string;
  enabled?: boolean;
  smartStoreCredentials?: UpdateSmartStoreCredentialsDto;
}

export interface StoreFilters {
  page?: number;
  size?: number;
  name?: string;
}

export interface PaginatedStoreDto {
  total: number;
  nodes: StoresDto[];
}

export interface SmartStoreCredentialsDto {
  applicationId: string;
  applicationSecret: string;
  name: string;
  channelId: number;
}

export interface StoreDetailDto {
  id: number;
  name: string;
  type: StoreType;
  enabled: boolean;
  lastProductSyncAt: Date;
  lastOrderSyncAt: Date;
  smartStoreCredentials: SmartStoreCredentialsDto;
}
