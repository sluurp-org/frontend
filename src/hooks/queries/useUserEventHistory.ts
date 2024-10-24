import { useQuery } from "react-query";
import axiosClient from "@/utils/axios";
import {
  UserEventHistoryDownloadDto,
  UserEventHistoryDto,
  UserEventHistoryRedirectDto,
} from "@/types/event-history";

const fetchUserEventHistory = async (eventHistoryId: string) => {
  const { data } = await axiosClient.get<UserEventHistoryDto>(
    `/event-history/${eventHistoryId}`
  );
  return data;
};

const fetchUserEventHistoryDownload = async (eventHistoryId: string) => {
  const { data } = await axiosClient.get<UserEventHistoryDownloadDto>(
    `/event-history/${eventHistoryId}/download`
  );
  return data;
};

const fetchUserEventHistoryReview = async (eventHistoryId: string) => {
  const { data } = await axiosClient.get<UserEventHistoryRedirectDto>(
    `/event-history/${eventHistoryId}/review`
  );
  return data;
};

const fetchUserEventHistoryConfirm = async (eventHistoryId: string) => {
  const { data } = await axiosClient.get<UserEventHistoryRedirectDto>(
    `/event-history/${eventHistoryId}/confirm`
  );
  return data;
};

export const useUserEventHistory = (eventHistoryId: string) => {
  return useQuery({
    queryKey: ["user-event-history", eventHistoryId],
    queryFn: () => fetchUserEventHistory(eventHistoryId),
    enabled: !!eventHistoryId,
  });
};

export const useUserEventHistoryDownload = (eventHistoryId: string) => {
  return useQuery({
    queryKey: ["user-event-history-download", eventHistoryId],
    queryFn: () => fetchUserEventHistoryDownload(eventHistoryId),
    enabled: false,
  });
};

export const useUserEventHistoryReview = (eventHistoryId: string) => {
  return useQuery({
    queryKey: ["user-event-history-review", eventHistoryId],
    queryFn: () => fetchUserEventHistoryReview(eventHistoryId),
    enabled: !!eventHistoryId,
  });
};

export const useUserEventHistoryConfirm = (eventHistoryId: string) => {
  return useQuery({
    queryKey: ["user-event-history-confirm", eventHistoryId],
    queryFn: () => fetchUserEventHistoryConfirm(eventHistoryId),
    enabled: !!eventHistoryId,
  });
};
