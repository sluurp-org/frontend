import { useMutation, useQuery } from "react-query";
import axiosClient from "@/utils/axios";
import {
  EventHistory,
  EventHistoryFilter,
  PaginatedEventHistory,
  UpdateEventHistoryDto,
} from "@/types/event-history";
import { queryClient } from "@/pages/_app";

const fetchEventHistories = async (
  workspaceId: number,
  dto: EventHistoryFilter
) => {
  const { data } = await axiosClient.get<PaginatedEventHistory>(
    `/workspace/${workspaceId}/event-history`,
    {
      params: dto,
    }
  );
  return data;
};

const fetchEventHistory = async (
  workspaceId: number,
  eventHistoryId: string
): Promise<EventHistory> => {
  const { data } = await axiosClient.get<EventHistory>(
    `/workspace/${workspaceId}/event-history/${eventHistoryId}`
  );
  return data;
};

const updateEventHistory = async (
  workspaceId: number,
  eventHistoryContentId: number,
  dto: UpdateEventHistoryDto
): Promise<EventHistory> => {
  const { data } = await axiosClient.patch<EventHistory>(
    `/workspace/${workspaceId}/event-history/${eventHistoryContentId}`,
    dto
  );

  return data;
};

const resetEventHistoryDownloadCount = async (
  workspaceId: number,
  eventHistoryContentId: number
): Promise<EventHistory> => {
  const { data } = await axiosClient.put<EventHistory>(
    `/workspace/${workspaceId}/event-history/${eventHistoryContentId}/reset-download-count`
  );

  return data;
};

export const useEventHistories = (
  workspaceId: number,
  dto: EventHistoryFilter
) => {
  return useQuery(
    ["event-histories", workspaceId, dto],
    () => fetchEventHistories(workspaceId, dto),
    {
      enabled: !!workspaceId,
    }
  );
};

export const useEventHistory = (
  workspaceId: number,
  eventHistoryId: string
) => {
  return useQuery(
    ["event-history", workspaceId, eventHistoryId],
    () => fetchEventHistory(workspaceId, eventHistoryId),
    {
      enabled: !!eventHistoryId,
    }
  );
};

export const useUpdateEventHistory = (
  workspaceId: number,
  eventHistoryContentId: number
) => {
  return useMutation({
    mutationFn: (dto: UpdateEventHistoryDto) =>
      updateEventHistory(workspaceId, eventHistoryContentId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries([
        "event-history",
        workspaceId,
        eventHistoryContentId,
      ]);
    },
  });
};

export const useResetEventHistoryDownloadCount = (
  workspaceId: number,
  eventHistoryContentId: number
) => {
  return useMutation({
    mutationFn: () =>
      resetEventHistoryDownloadCount(workspaceId, eventHistoryContentId),
    onSuccess: () => {
      queryClient.invalidateQueries(["event-history", workspaceId]);
    },
  });
};
