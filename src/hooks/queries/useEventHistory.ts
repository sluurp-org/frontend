import { useMutation, useQuery } from "react-query";
import axiosClient from "@/utils/axios";
import { EventHistory, UpdateEventHistoryDto } from "@/types/event-history";
import { queryClient } from "@/pages/_app";

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
  eventHistoryId: string,
  dto: UpdateEventHistoryDto
): Promise<EventHistory> => {
  const { data } = await axiosClient.patch<EventHistory>(
    `/workspace/${workspaceId}/event-history/${eventHistoryId}`,
    dto
  );
  return data;
};

const resetEventHistoryDownloadCount = async (
  workspaceId: number,
  eventHistoryId: string
): Promise<EventHistory> => {
  const { data } = await axiosClient.put<EventHistory>(
    `/workspace/${workspaceId}/event-history/${eventHistoryId}/reset-download-count`
  );
  return data;
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
  eventHistoryId: string
) => {
  return useMutation({
    mutationFn: (dto: UpdateEventHistoryDto) =>
      updateEventHistory(workspaceId, eventHistoryId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries([
        "event-history",
        workspaceId,
        eventHistoryId,
      ]);
    },
  });
};

export const useResetEventHistoryDownloadCount = (
  workspaceId: number,
  eventHistoryId: string
) => {
  return useMutation({
    mutationFn: () =>
      resetEventHistoryDownloadCount(workspaceId, eventHistoryId),
    onSuccess: () => {
      queryClient.invalidateQueries([
        "event-history",
        workspaceId,
        eventHistoryId,
      ]);
    },
  });
};
