import { useQuery } from "react-query";
import axiosClient from "@/utils/axios";
import {
  CreateStoreDto,
  PaginatedStoreDto,
  StoreDetailDto,
  StoreFilters,
  UpdateStoreDto,
} from "@/types/store";
import { useMutation, useQueryClient } from "react-query";
import { queryClient } from "@/pages/_app";

const fetchStore = async (workspaceId: number, filters: StoreFilters) => {
  const { data } = await axiosClient.get<PaginatedStoreDto>(
    `/workspace/${workspaceId}/store`,
    { params: filters }
  );
  return data;
};

const fetchStoreDetail = async (workspaceId: number, storeId: number) => {
  const { data } = await axiosClient.get<StoreDetailDto>(
    `/workspace/${workspaceId}/store/${storeId}`
  );
  return data;
};

const createStore = async (workspaceId: number, storeData: CreateStoreDto) => {
  const { data } = await axiosClient.post<StoreDetailDto>(
    `/workspace/${workspaceId}/store`,
    storeData
  );
  return data;
};

const deleteStore = async (workspaceId: number, storeId: number) => {
  const { data } = await axiosClient.delete(
    `/workspace/${workspaceId}/store/${storeId}`
  );
  return data;
};

const updateStore = async (workspaceId: number, storeData: UpdateStoreDto) => {
  const { data } = await axiosClient.patch<StoreDetailDto>(
    `/workspace/${workspaceId}/store/${storeData.id}`,
    storeData,
    {
      timeout: 1000 * 60, // 1 minute
    }
  );
  return data;
};

const syncStoreProduct = async (workspaceId: number, storeId: number) => {
  const { data } = await axiosClient.post<StoreDetailDto>(
    `/workspace/${workspaceId}/store/${storeId}/product`
  );
  return data;
};

export const useStore = (workspaceId: number, filters: StoreFilters = {}) => {
  return useQuery(["store", workspaceId, filters], () =>
    fetchStore(workspaceId, filters)
  );
};

export const useStoreDetail = (workspaceId: number, storeId: number) => {
  return useQuery(
    ["store", workspaceId, storeId],
    () => fetchStoreDetail(workspaceId, storeId),
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const useUpdateStore = (workspaceId: number) => {
  const queryClient = useQueryClient();
  return useMutation(
    (storeData: UpdateStoreDto) => updateStore(workspaceId, storeData),
    {
      onSuccess: (storeData) => {
        queryClient.invalidateQueries(["store", workspaceId]);
        queryClient.invalidateQueries(["store", workspaceId, storeData.id]);
      },
    }
  );
};

export const useCreateStore = (workspaceId: number) => {
  const queryClient = useQueryClient();
  return useMutation(
    (storeData: CreateStoreDto) => createStore(workspaceId, storeData),
    {
      onSuccess: (storeData) => {
        queryClient.invalidateQueries(["store", workspaceId]);
        queryClient.invalidateQueries(["store", workspaceId, storeData.id]);
      },
    }
  );
};

export const useDeleteStore = (workspaceId: number) => {
  const queryClient = useQueryClient();
  return useMutation((storeId: number) => deleteStore(workspaceId, storeId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["store", workspaceId]);
    },
  });
};

export const useSyncStoreProduct = (workspaceId: number) => {
  return useMutation(
    "syncStoreProduct",
    (storeId: number) => syncStoreProduct(workspaceId, storeId),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["store", workspaceId, data.id]);
      },
    }
  );
};
