import { useMutation, useQuery } from "react-query";
import axiosClient from "@/utils/axios";
import {
  CreateEventDto,
  EventDto,
  EventsFilters,
  PaginatedEventsDto,
} from "@/types/events";
import { queryClient } from "@/pages/_app";

const fetchEvents = async (
  workspaceId: number,
  filters: EventsFilters = {}
): Promise<PaginatedEventsDto> => {
  const { data } = await axiosClient.get<PaginatedEventsDto>(
    `/workspace/${workspaceId}/event`,
    {
      params: filters,
    }
  );
  return data;
};

const createEvent = async (
  workspaceId: number,
  newEvent: CreateEventDto
): Promise<EventDto> => {
  const { data } = await axiosClient.post(
    `/workspace/${workspaceId}/event`,
    newEvent
  );

  return data;
};

const deleteEvent = async (workspaceId: number, eventId: number) => {
  const { data } = await axiosClient.delete(
    `/workspace/${workspaceId}/event/${eventId}`
  );
  return data;
};

export const useEvents = (workspaceId: number, filters: EventsFilters = {}) => {
  return useQuery(
    ["event", workspaceId, filters],
    () => fetchEvents(workspaceId, filters),
    {}
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
