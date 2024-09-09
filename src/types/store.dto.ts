import { StoreType } from "./store";

interface SearchStoreQueryDto {
  workspaceId: string;
  page?: number;
  limit?: number;
  type?: StoreType;
  name?: string;
  enabled?: boolean;
}

export type { SearchStoreQueryDto };
