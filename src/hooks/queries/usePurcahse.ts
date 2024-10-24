import { useMutation, useQuery } from "react-query";
import axiosClient from "@/utils/axios";
import {
  CompletePurchaseDto,
  CreatePurchaseDto,
  PurchaseDto,
  PurchaseFilter,
  PurchaseListDto,
} from "@/types/purchase";
import { queryClient } from "@/pages/_app";

const createPurchase = async (workspaceId: number, dto: CreatePurchaseDto) => {
  const { data } = await axiosClient.post<PurchaseDto>(
    `/workspace/${workspaceId}/purchase/order/credit`,
    dto
  );
  return data;
};

const completePurchase = async (
  workspaceId: number,
  dto: CompletePurchaseDto
) => {
  const { data } = await axiosClient.post(
    `/workspace/${workspaceId}/purchase/order/completed`,
    dto
  );
  return data;
};

const getPurchaseList = async (workspaceId: number, filter: PurchaseFilter) => {
  const { data } = await axiosClient.get<PurchaseListDto>(
    `/workspace/${workspaceId}/purchase/history`,
    { params: filter }
  );
  return data;
};

export const useCreatePurchase = (workspaceId: number) =>
  useMutation((data: CreatePurchaseDto) => createPurchase(workspaceId, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["purchase", workspaceId]);
    },
  });

export const useCompletePurchase = (workspaceId: number) =>
  useMutation(
    (data: CompletePurchaseDto) => {
      queryClient.invalidateQueries(["credit", workspaceId]);
      queryClient.invalidateQueries(["workspace", workspaceId]);
      queryClient.invalidateQueries(["purchase", workspaceId]);
      return completePurchase(workspaceId, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["credit", workspaceId]);
        queryClient.invalidateQueries(["workspace", workspaceId]);
        queryClient.invalidateQueries(["purchase", workspaceId]);
      },
    }
  );

export const usePurchaseList = (workspaceId: number, filter: PurchaseFilter) =>
  useQuery<PurchaseListDto>(
    ["purchase", workspaceId, filter],
    () => getPurchaseList(workspaceId, filter),
    {
      enabled: !!workspaceId,
    }
  );
