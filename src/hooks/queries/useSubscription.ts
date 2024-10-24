import { useMutation, useQuery } from "react-query";
import {
  SubscriptionDto,
  WorkspaceSubscription,
  WorkspaceSubscriptionDto,
} from "@/types/subscription";
import axiosClient from "@/utils/axios";
import { queryClient } from "@/pages/_app";

const fetchSubscriptions = async () => {
  const { data } = await axiosClient.get<SubscriptionDto[]>("/subscription");
  return data;
};

const fetchWorkspaceSubscription = async (workspaceId: number) => {
  const { data } = await axiosClient.get<WorkspaceSubscriptionDto>(
    `/workspace/${workspaceId}/purchase`
  );
  return data;
};

const createWorkspaceSubscription = async (
  workspaceId: number,
  subscriptionId: number
) => {
  const { data } = await axiosClient.post<WorkspaceSubscriptionDto>(
    `/workspace/${workspaceId}/purchase`,
    { subscriptionId }
  );
  return data;
};

const updateWorkspaceSubscription = async (
  workspaceId: number,
  subscriptionId: number
) => {
  const { data } = await axiosClient.patch<WorkspaceSubscription>(
    `/workspace/${workspaceId}/purchase`,
    { subscriptionId }
  );
  return data;
};

const deleteWorkspaceSubscription = async (workspaceId: number) => {
  const { data } = await axiosClient.delete(
    `/workspace/${workspaceId}/purchase`
  );
  return data;
};

export const useSubscriptions = () =>
  useQuery<SubscriptionDto[]>("/subscription", fetchSubscriptions);

export const useWorkspaceSubscription = (workspaceId: number) =>
  useQuery<WorkspaceSubscriptionDto>(
    ["workspace", workspaceId, "purchase"],
    () => fetchWorkspaceSubscription(workspaceId),
    {
      enabled: !!workspaceId,
    }
  );

export const useCreateWorkspaceSubscription = (workspaceId: number) =>
  useMutation(
    ["workspace", workspaceId, "purchase"],
    (subscriptionId: number) =>
      createWorkspaceSubscription(workspaceId, subscriptionId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["workspace", workspaceId, "purchase"]);
      },
    }
  );

export const useUpdateWorkspaceSubscription = (workspaceId: number) =>
  useMutation(
    ["workspace", workspaceId, "purchase"],
    (subscriptionId: number) =>
      updateWorkspaceSubscription(workspaceId, subscriptionId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["workspace", workspaceId, "purchase"]);
      },
    }
  );

export const useDeleteWorkspaceSubscription = (workspaceId: number) =>
  useMutation(
    ["workspace", workspaceId, "purchase"],
    () => deleteWorkspaceSubscription(workspaceId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["workspace", workspaceId, "purchase"]);
      },
    }
  );
