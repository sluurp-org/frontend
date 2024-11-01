import { useQuery } from "react-query";
import axiosClient from "@/utils/axios";
import {
  PurchaseFilter,
  PurchaseListDto,
  PurchaseDto,
  PurchaseConfigDto,
} from "@/types/purchase";

const getPurchase = async (workspaceId: number) => {
  const { data } = await axiosClient.get<PurchaseDto>(
    `/workspace/${workspaceId}/purchase`
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

const getConfig = async () => {
  const { data } = await axiosClient.get<PurchaseDto>(`/purchase/config`);
  return data;
};

export const usePurchaseList = (workspaceId: number, filter: PurchaseFilter) =>
  useQuery<PurchaseListDto>(
    ["purchase", workspaceId, filter],
    () => getPurchaseList(workspaceId, filter),
    {
      enabled: !!workspaceId,
    }
  );

export const usePurchase = (workspaceId: number) =>
  useQuery<PurchaseDto>(
    ["purchase", workspaceId],
    () => getPurchase(workspaceId),
    {
      enabled: !!workspaceId,
    }
  );

export const usePurchaseConfig = () =>
  useQuery<PurchaseConfigDto>(["purchaseConfig"], getConfig);
