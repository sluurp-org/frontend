import { StoreList } from "@/types/store";
import { SearchStoreDto } from "@/types/store.dto";
import axiosClient from "@/utils/axios";

interface StoreAPI {
  findMany: (
    workspaceId: number,
    searchStore?: SearchStoreDto
  ) => Promise<StoreList>;
}

export const StoreAPI: StoreAPI = {
  findMany: async (workspaceId: number, searchStore?: SearchStoreDto) => {
    try {
      const uri = `/workspace/${workspaceId}/store`;
      const { data } = await axiosClient.get<StoreList>(uri, {
        params: searchStore,
      });

      return data;
    } catch (error: any) {
      throw error;
    }
  },
};
