export enum StoreType {
  SMARTSTORE = "SMARTSTORE",
}

export enum FilterStoreType {
  "스마트스토어" = "SMARTSTORE",
}

interface StoreBase {
  id: number;
  name: string;
  type: StoreType;
  enabled: boolean;
}

interface SmartStoreCredentials {
  name: string;
  channelId: number;
  applicationId: string;
  applicationSecret: string;
}

type Store = StoreBase & {
  type: StoreType.SMARTSTORE;
  smartStoreCredentials: SmartStoreCredentials;
};

export interface StoreList {
  nodes: Store[];
  total: number;
}
