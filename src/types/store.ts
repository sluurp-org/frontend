export type StoreType = "SMARTSTORE" | "SMARTPLACE";
export const StoreType = {
  SMARTSTORE: "스마트스토어",
  SMARTPLACE: "스마트플레이스",
} as const;

export interface CreateSmartStoreCredentialsDto {
  applicationId: string;
  applicationSecret: string;
}
export interface CreateSmartPlaceCredentialsDto {
  username: string;
  password: string;
  channelId: string;
}

export interface CreateStoreDto {
  name: string;
  type: StoreType;
  smartStoreCredentials?: CreateSmartStoreCredentialsDto;
  smartPlaceCredentials?: CreateSmartPlaceCredentialsDto;
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

export interface UpdateSmartPlaceCredentialsDto {
  username: string;
  password: string;
}

export interface UpdateStoreDto {
  id?: number;
  name?: string;
  enabled?: boolean;
  smartStoreCredentials?: UpdateSmartStoreCredentialsDto;
  smartPlaceCredentials?: UpdateSmartPlaceCredentialsDto;
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

export interface SmartPlaceCredentialsDto {
  username: string;
  password: string;
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
  smartPlaceCredentials: SmartPlaceCredentialsDto;
}
