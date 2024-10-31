import { useMutation, useQuery } from "react-query";
import {
  KakaoCategoryDto,
  MessageCreateDto,
  MessageDto,
  MessageFilters,
  MessageUpdateDto,
  MessageVariablesDto,
  PaginatedMessages,
} from "@/types/message";
import axiosClient from "@/utils/axios";
import { queryClient } from "@/pages/_app";

const fetchMessages = async (workspaceId: number, filters: MessageFilters) => {
  const { data } = await axiosClient.get<PaginatedMessages>(
    `/workspace/${workspaceId}/message`,
    { params: filters }
  );
  return data;
};

const fetchMessage = async (workspaceId: number, messageId: number) => {
  const { data } = await axiosClient.get<MessageDto>(
    `/workspace/${workspaceId}/message/${messageId}`
  );
  return data;
};

const createMessage = async (
  workspaceId: number,
  message: MessageCreateDto
) => {
  const { data } = await axiosClient.post(
    `/workspace/${workspaceId}/message`,
    message
  );
  return data;
};

const updateMessage = async (
  workspaceId: number,
  messageId: number,
  message: MessageUpdateDto
) => {
  const { data } = await axiosClient.patch(
    `/workspace/${workspaceId}/message/${messageId}`,
    message
  );
  return data;
};

const deleteMessage = async (workspaceId: number, messageId: number) => {
  const { data } = await axiosClient.delete(
    `/workspace/${workspaceId}/message/${messageId}`
  );
  return data;
};

const fetchKakaoTemplateCategories = async (workspaceId: number) => {
  const { data } = await axiosClient.get<KakaoCategoryDto>(
    `/workspace/${workspaceId}/kakao/category/message`
  );
  return data;
};

const fetchVariables = async (workspaceId: number) => {
  const { data } = await axiosClient.get<MessageVariablesDto>(
    `/workspace/${workspaceId}/message/variables`
  );
  return data;
};

const requestInspection = async (workspaceId: number, messageId: number) => {
  const { data } = await axiosClient.post<MessageDto>(
    `/workspace/${workspaceId}/message/${messageId}/inspection`
  );
  return data;
};

const cancelInspection = async (workspaceId: number, messageId: number) => {
  const { data } = await axiosClient.delete<MessageDto>(
    `/workspace/${workspaceId}/message/${messageId}/inspection`
  );
  return data;
};

export const useMessages = (
  workspaceId: number,
  filters: MessageFilters = {}
) => {
  return useQuery(
    ["messages", workspaceId, filters],
    () => fetchMessages(workspaceId, filters),
    {
      keepPreviousData: true,
    }
  );
};

export const useMessage = (workspaceId: number, messageId: number) => {
  return useQuery(
    ["message", workspaceId, messageId],
    () => fetchMessage(workspaceId, messageId),
    {
      enabled: !!workspaceId && !!messageId,
    }
  );
};

export const useKakaoTemplateCategories = (workspaceId: number) => {
  return useQuery(
    ["kakaoTemplateCategories", workspaceId],
    () => fetchKakaoTemplateCategories(workspaceId),
    {
      enabled: !!workspaceId,
    }
  );
};

export const useVariables = (workspaceId: number) => {
  return useQuery(
    ["variables", workspaceId],
    () => fetchVariables(workspaceId),
    {
      enabled: !!workspaceId,
    }
  );
};

export const useUpdateMessage = (workspaceId: number, messageId: number) => {
  return useMutation(
    (message: MessageUpdateDto) =>
      updateMessage(workspaceId, messageId, message),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["message", workspaceId, messageId]);
        queryClient.invalidateQueries(["messages", workspaceId]);
      },
    }
  );
};

export const useDeleteMessage = (workspaceId: number, messageId: number) => {
  return useMutation(() => deleteMessage(workspaceId, messageId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", workspaceId]);
      queryClient.invalidateQueries(["message", workspaceId, messageId]);
    },
  });
};

export const useCreateMessage = (workspaceId: number) => {
  return useMutation(
    (message: MessageCreateDto) => createMessage(workspaceId, message),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["messages", workspaceId]);
      },
    }
  );
};

export const useRequestInspection = (workspaceId: number) => {
  return useMutation(
    (messageId: number) => requestInspection(workspaceId, messageId),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["messages", workspaceId]);
        queryClient.invalidateQueries(["message", workspaceId, data.id]);
      },
    }
  );
};

export const useCancelInspection = (workspaceId: number, messageId: number) => {
  return useMutation(() => cancelInspection(workspaceId, messageId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", workspaceId]);
      queryClient.invalidateQueries(["message", workspaceId, messageId]);
    },
  });
};
