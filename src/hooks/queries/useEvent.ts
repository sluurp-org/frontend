import { useMutation, useQuery } from "react-query";
import axiosClient from "@/utils/axios";
import {
  CreateEventDto,
  EventDto,
  EventsFilters,
  PaginatedEventsDto,
  UpdateEventDto,
} from "@/types/events";
import { queryClient } from "@/pages/_app";

const fetchEvents = async (
  workspaceId: number,
  filters: EventsFilters = {}
): Promise<PaginatedEventsDto> => {
  const { data } = await axiosClient.get<PaginatedEventsDto>(
    `/workspace/${workspaceId}/event`,
    {
      params: {
        productId: filters.productId === null ? "" : filters.productId,
        productVariantId:
          filters.productVariantId === null ? "" : filters.productVariantId,
        messageId: filters.messageId === null ? "" : filters.messageId,
        page: filters.page,
        size: filters.size,
      },
    }
  );
  return data;
};

const createEvent = async (
  workspaceId: number,
  newEvent: CreateEventDto
): Promise<EventDto> => {
  const { data } = await axiosClient.post(`/workspace/${workspaceId}/event`, {
    ...newEvent,
    productId: newEvent.productId === null ? undefined : newEvent.productId,
    productVariantId:
      newEvent.productVariantId === null
        ? undefined
        : newEvent.productVariantId,
  });

  return data;
};

const deleteEvent = async (workspaceId: number, eventId: number) => {
  const { data } = await axiosClient.delete(
    `/workspace/${workspaceId}/event/${eventId}`
  );
  return data;
};

const updateEvent = async (
  workspaceId: number,
  eventId: number,
  dto: UpdateEventDto
) => {
  const { data } = await axiosClient.patch(
    `/workspace/${workspaceId}/event/${eventId}`,
    dto
  );
  return data;
};

export const useEvents = (workspaceId: number, filters: EventsFilters = {}) => {
  return useQuery(
    ["event", workspaceId, filters],
    () => fetchEvents(workspaceId, filters),
    {
      enabled: !!workspaceId,
    }
  );
};

export const useCreateEvent = (workspaceId: number) => {
  return useMutation(
    (newEvent: CreateEventDto) => createEvent(workspaceId, newEvent),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["event", workspaceId]);
      },
    }
  );
};

export const useDeleteEvent = (workspaceId: number) => {
  return useMutation((eventId: number) => deleteEvent(workspaceId, eventId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["event", workspaceId]);
    },
  });
};

export const useUpdateEvent = (workspaceId: number) => {
  return useMutation(
    ({ eventId, dto }: { eventId: number; dto: UpdateEventDto }) =>
      updateEvent(workspaceId, eventId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["event", workspaceId]);
      },
    }
  );
};
