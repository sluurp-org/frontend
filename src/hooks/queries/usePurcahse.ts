import { useQuery } from "react-query";
import axiosClient from "@/utils/axios";
import { PurchaseFilter, PurchaseListDto } from "@/types/purchase";

const getPurchaseList = async (workspaceId: number, filter: PurchaseFilter) => {
  const { data } = await axiosClient.get<PurchaseListDto>(
    `/workspace/${workspaceId}/purchase/history`,
    { params: filter }
  );
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
