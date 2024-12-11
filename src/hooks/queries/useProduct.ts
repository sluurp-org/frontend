import { useMutation, useQuery } from "react-query";
import {
  PaginatedProductOptionsResponse,
  PaginatedProductsResponse,
  ProductDto,
  ProductOptionFilters,
  ProductsFilters,
  UpdateProductDto,
} from "@/types/product";
import axiosClient from "@/utils/axios";
import { queryClient } from "@/pages/_app";

const fetchProducts = async (
  workspaceId: number,
  params: ProductsFilters = {}
): Promise<PaginatedProductsResponse> => {
  const { data } = await axiosClient.get(`/workspace/${workspaceId}/product`, {
    params,
  });
  return data;
};

const fetchProduct = async (workspaceId: number, productId: number) => {
  const { data } = await axiosClient.get<ProductDto>(
    `/workspace/${workspaceId}/product/${productId}`
  );
  return data;
};

const updateProduct = async (
  workspaceId: number,
  productId: number,
  payload: UpdateProductDto
) => {
  const { data } = await axiosClient.patch<ProductDto>(
    `/workspace/${workspaceId}/product/${productId}`,
    payload
  );

  return data;
};

const fetchProductOptions = async (
  workspaceId: number,
  productId: number,
  filters: ProductOptionFilters = {}
) => {
  const { data } = await axiosClient.get<PaginatedProductOptionsResponse>(
    `/workspace/${workspaceId}/product/${productId}/options`,
    {
      params: filters,
    }
  );
  return data;
};

const syncProductOptions = async (workspaceId: number, productId: number) => {
  const { data } = await axiosClient.post(
    `/workspace/${workspaceId}/product/${productId}/options/sync`
  );

  return data;
};

export const useSyncProductOptions = (
  workspaceId: number,
  productId: number
) => {
  return useMutation(
    "syncProductOptions",
    () => syncProductOptions(workspaceId, productId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "productOptions",
          workspaceId,
          productId,
        ]);
      },
    }
  );
};

export const useProducts = (
  workspaceId: number,
  params: ProductsFilters = {}
) => {
  return useQuery(
    ["products", workspaceId, params],
    () => fetchProducts(workspaceId, params),
    {
      keepPreviousData: true,
      enabled: !!workspaceId,
    }
  );
};

export const useProduct = (workspaceId: number, productId: number) => {
  return useQuery(
    ["product", workspaceId, productId],
    () => fetchProduct(workspaceId, productId),
    {
      keepPreviousData: true,
      enabled: !!productId && !!workspaceId,
    }
  );
};

export const useProductOptions = (
  workspaceId: number,
  productId?: number | null,
  filters: ProductOptionFilters = {}
) => {
  return useQuery(
    ["productOptions", workspaceId, productId, filters],
    () => fetchProductOptions(workspaceId, productId ?? 0, filters),
    {
      keepPreviousData: true,
      enabled: !!productId,
    }
  );
};

export const useUpdateProduct = (workspaceId: number, productId: number) => {
  return useMutation(
    "updateProduct",
    (payload: UpdateProductDto) =>
      updateProduct(workspaceId, productId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["product", workspaceId, productId]);
      },
    }
  );
};
