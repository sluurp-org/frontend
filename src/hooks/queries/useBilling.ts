import { useMutation, useQuery } from "react-query";
import axiosClient from "@/utils/axios";
import { BillingDto, CreateBillingDto } from "@/types/billing";
import { queryClient } from "@/pages/_app";

const fetchBilling = async (workspaceId: number) => {
  const { data } = await axiosClient.get<BillingDto>(
    `/workspace/${workspaceId}/purchase/billing`
  );
  return data;
};

const createBilling = async (workspaceId: number, dto: CreateBillingDto) => {
  const { data } = await axiosClient.post<BillingDto>(
    `/workspace/${workspaceId}/purchase/billing`,
    dto
  );
  return data;
};

export const useBilling = (workspaceId: number) =>
  useQuery<BillingDto>(
    ["workspace", workspaceId, "billing"],
    () => fetchBilling(workspaceId),
    {
      enabled: !!workspaceId,
    }
  );

export const useCreateBilling = (workspaceId: number) =>
  useMutation(
    ["workspace", workspaceId, "billing"],
    (dto: CreateBillingDto) => createBilling(workspaceId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["workspace", workspaceId, "billing"]);
      },
    }
  );
