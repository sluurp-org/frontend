import { useMutation, useQuery } from "react-query";
import axiosClient from "@/utils/axios";
import {
  ContentFilters,
  ContentGroupDto,
  ContentGroupFilters,
  CreateContentDto,
  CreateContentGroupDto,
  CreateFileContentDto,
  DownloadFileContentDto,
  FileContentDto,
  PaginatedContentGroupsResponse,
  PaginatedContentsResponse,
  UpdateContentDto,
  UpdateContentGroupDto,
} from "../../types/content";
import { queryClient } from "@/pages/_app";

const fetchContentGroups = async (
  workspaceId: number,
  filters: ContentGroupFilters
) => {
  const { data } = await axiosClient.get<PaginatedContentGroupsResponse>(
    `/workspace/${workspaceId}/content-group`,
    { params: filters }
  );
  return data;
};

const fetchContentGroup = async (
  workspaceId: number,
  contentGroupId: number
) => {
  const { data } = await axiosClient.get<ContentGroupDto>(
    `/workspace/${workspaceId}/content-group/${contentGroupId}`
  );
  return data;
};

const createContentGroup = async (
  workspaceId: number,
  dto: CreateContentGroupDto
) => {
  const { data } = await axiosClient.post(
    `/workspace/${workspaceId}/content-group`,
    dto
  );
  return data;
};

const updateContentGroup = async (
  workspaceId: number,
  contentGroupId: number,
  dto: UpdateContentGroupDto
) => {
  const { data } = await axiosClient.patch<ContentGroupDto>(
    `/workspace/${workspaceId}/content-group/${contentGroupId}`,
    dto
  );
  return data;
};

const deleteContentGroup = async (
  workspaceId: number,
  contentGroupId: number
) => {
  await axiosClient.delete(
    `/workspace/${workspaceId}/content-group/${contentGroupId}`
  );
};

export const useContentGroups = (
  workspaceId: number,
  filters: ContentGroupFilters = {}
) => {
  return useQuery(
    ["contentGroups", workspaceId, filters],
    () => fetchContentGroups(workspaceId, filters),
    {
      enabled: !!workspaceId,
    }
  );
};

export const useContentGroup = (
  workspaceId: number,
  contentGroupId: number
) => {
  return useQuery(["contentGroup", workspaceId, contentGroupId], () =>
    fetchContentGroup(workspaceId, contentGroupId)
  );
};

export const useCreateContentGroup = (workspaceId: number) => {
  return useMutation(
    (dto: CreateContentGroupDto) => createContentGroup(workspaceId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["contentGroups", workspaceId]);
      },
    }
  );
};

export const useUpdateContentGroup = (
  workspaceId: number,
  contentGroupId: number
) => {
  return useMutation(
    (dto: UpdateContentGroupDto) =>
      updateContentGroup(workspaceId, contentGroupId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["contentGroup", workspaceId]);
      },
    }
  );
};

export const useDeleteContentGroup = (workspaceId: number) => {
  return useMutation(
    (contentGroupId: number) => deleteContentGroup(workspaceId, contentGroupId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["contentGroups", workspaceId]);
      },
    }
  );
};

const fetchContents = async (
  workspaceId: number,
  contentGroupId: number,
  filters: ContentFilters
) => {
  const { data } = await axiosClient.get<PaginatedContentsResponse>(
    `/workspace/${workspaceId}/content-group/${contentGroupId}/content`,
    { params: filters }
  );
  return data;
};

const createContent = async (
  workspaceId: number,
  contentGroupId: number,
  dto: CreateContentDto
) => {
  const { data } = await axiosClient.post(
    `/workspace/${workspaceId}/content-group/${contentGroupId}/content`,
    dto
  );
  return data;
};

const createFileContent = async (
  workspaceId: number,
  contentGroupId: number,
  dto: CreateFileContentDto
) => {
  const { data } = await axiosClient.post<FileContentDto>(
    `/workspace/${workspaceId}/content-group/${contentGroupId}/content-file`,
    dto
  );
  return data;
};

const updateContent = async (
  workspaceId: number,
  contentGroupId: number,
  contentId: number,
  dto: UpdateContentDto
) => {
  const { data } = await axiosClient.patch(
    `/workspace/${workspaceId}/content-group/${contentGroupId}/content/${contentId}`,
    dto
  );
  return data;
};

const deleteContent = async (
  workspaceId: number,
  contentGroupId: number,
  contentId: number
) => {
  await axiosClient.delete(
    `/workspace/${workspaceId}/content-group/${contentGroupId}/content/${contentId}`
  );
};

export const fetchDownloadFileContent = async (
  workspaceId: number,
  contentGroupId: number,
  contentId: number
) => {
  const { data } = await axiosClient.get<DownloadFileContentDto>(
    `/workspace/${workspaceId}/content-group/${contentGroupId}/content/${contentId}/download`
  );
  return data;
};

export const useContents = (
  workspaceId: number,
  contentGroupId: number,
  filters: ContentFilters = {}
) => {
  return useQuery(["contents", workspaceId, contentGroupId, filters], () =>
    fetchContents(workspaceId, contentGroupId, filters)
  );
};

export const useCreateContent = (
  workspaceId: number,
  contentGroupId: number
) => {
  return useMutation(
    (dto: CreateContentDto) => createContent(workspaceId, contentGroupId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["contents", workspaceId]);
      },
    }
  );
};

export const useCreateFileContent = (
  workspaceId: number,
  contentGroupId: number
) => {
  return useMutation(
    (dto: CreateFileContentDto) =>
      createFileContent(workspaceId, contentGroupId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["contents", workspaceId]);
      },
    }
  );
};

export const useUpdateContent = (
  workspaceId: number,
  contentGroupId: number
) => {
  return useMutation<
    any,
    unknown,
    { contentId: number; dto: UpdateContentDto }
  >(
    ({ contentId, dto }) =>
      updateContent(workspaceId, contentGroupId, contentId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "contents",
          workspaceId,
          contentGroupId,
        ]);
      },
    }
  );
};

export const useDeleteContent = (
  workspaceId: number,
  contentGroupId: number
) => {
  return useMutation(
    (contentId: number) =>
      deleteContent(workspaceId, contentGroupId, contentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["contents", workspaceId]);
      },
    }
  );
};
