import { useMutation, useQuery } from "react-query";
import axiosClient from "@/utils/axios";
import {
  CompletePurchaseDto,
  CreatePurchaseDto,
  PurchaseDto,
} from "@/types/purchase";

const createPurchase = async (workspaceId: number, dto: CreatePurchaseDto) => {
  const { data } = await axiosClient.post<PurchaseDto>(
    `/workspace/${workspaceId}/purchase/order`,
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

export const useCreatePurchase = (workspaceId: number) =>
  useMutation((data: CreatePurchaseDto) => createPurchase(workspaceId, data));

export const useCompletePurchase = (workspaceId: number) =>
  useMutation((data: CompletePurchaseDto) =>
    completePurchase(workspaceId, data)
  );
