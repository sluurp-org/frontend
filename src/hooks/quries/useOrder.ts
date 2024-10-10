import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosClient from "@/utils/axios";
import { OrderDto, CreateOrderDto, UpdateOrderDto } from "@/types/order";
import { OrdersFilters, PaginatedOrdersResponse } from "@/types/orders";
import {
  OrderHistoryDto,
  OrderHistoryFilters,
  PaginatedOrderHistoryResponse,
} from "@/types/order-history";

const fetchOrders = async (
  workspaceId: number,
  filters: OrdersFilters = {}
): Promise<PaginatedOrdersResponse> => {
  const { data } = await axiosClient.get(`/workspace/${workspaceId}/order`, {
    params: filters,
  });
  return data;
};

const fetchOrder = async (
  workspaceId: number,
  id: number
): Promise<OrderDto> => {
  const { data } = await axiosClient.get(
    `/workspace/${workspaceId}/order/${id}`
  );
  return data;
};

const createOrder = async (
  workspaceId: number,
  newOrder: CreateOrderDto
): Promise<OrderDto> => {
  const { data } = await axiosClient.post(
    `/workspace/${workspaceId}/order`,
    newOrder
  );
  return data;
};

const updateOrder = async (
  workspaceId: number,
  id: number,
  updatedOrder: UpdateOrderDto
): Promise<OrderDto> => {
  const { data } = await axiosClient.patch(
    `/workspace/${workspaceId}/order/${id}`,
    updatedOrder
  );
  return data;
};

const fetchOrderHistory = async (
  workspaceId: number,
  id: number,
  orderHistory: OrderHistoryFilters = {}
): Promise<PaginatedOrderHistoryResponse> => {
  const { data } = await axiosClient.get(
    `/workspace/${workspaceId}/order/${id}/history`,
    { params: orderHistory }
  );
  return data;
};

const deleteOrder = async (workspaceId: number, id: number): Promise<void> => {
  await axiosClient.delete(`/workspace/${workspaceId}/order/${id}`);
};

export const useOrders = (workspaceId: number, filters: OrdersFilters = {}) => {
  return useQuery(
    ["orders", workspaceId, filters],
    () => fetchOrders(workspaceId, filters),
    {
      keepPreviousData: true,
    }
  );
};

export const useOrder = (workspaceId: number, id: number) => {
  return useQuery(
    ["order", workspaceId, id],
    () => fetchOrder(workspaceId, id),
    {
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: true,
    }
  );
};

export const useCreateOrder = (workspaceId: number) => {
  const queryClient = useQueryClient();
  return useMutation(
    (newOrder: CreateOrderDto) => createOrder(workspaceId, newOrder),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders", workspaceId]);
      },
    }
  );
};

export const useUpdateOrder = (workspaceId: number, id: number) => {
  const queryClient = useQueryClient();
  return useMutation(
    (updatedOrder: UpdateOrderDto) =>
      updateOrder(workspaceId, id, updatedOrder),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["order", workspaceId, id]);
      },
    }
  );
};

export const useDeleteOrder = (workspaceId: number, id: number) => {
  const queryClient = useQueryClient();
  return useMutation(() => deleteOrder(workspaceId, id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["orders", workspaceId]);
    },
  });
};

export const useOrderHistory = (
  workspaceId: number,
  id: number,
  filters: OrderHistoryFilters = {}
) => {
  return useQuery(
    ["orderHistory", workspaceId, id, filters],
    () => fetchOrderHistory(workspaceId, id, filters),
    {
      keepPreviousData: true,
    }
  );
};
