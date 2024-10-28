import { useQuery, useMutation } from "react-query";
import axiosClient from "@/utils/axios";
import {
  CreateKakaoConnectionDto,
  CreateKakaoConnectionTokenDto,
  KakaoConnectionDto,
} from "@/types/kakao";
import { queryClient } from "@/pages/_app";
import { KakaoCategoryDto } from "@/types/message";
import { Option } from "antd/es/mentions";
import { buildTree } from "@/lib/build-category-tree";

const fetchKakaoConnections = async (workspaceId: number) => {
  const { data } = await axiosClient.get<KakaoConnectionDto>(
    `/workspace/${workspaceId}/kakao`
  );
  return data;
};

const createKakaoConnectionToken = async (
  workspaceId: number,
  dto: CreateKakaoConnectionTokenDto
) => {
  const { data } = await axiosClient.post<boolean>(
    `/workspace/${workspaceId}/kakao/token`,
    dto
  );
  return data;
};

const createKakaoConnection = async (
  workspaceId: number,
  dto: CreateKakaoConnectionDto
) => {
  const { data } = await axiosClient.post<boolean>(
    `/workspace/${workspaceId}/kakao`,
    dto
  );
  return data;
};

const deleteKakaoConnection = async (workspaceId: number) => {
  await axiosClient.delete(`/workspace/${workspaceId}/kakao`);
};

const fetchKakaoConnectionCategories = async (workspaceId: number) => {
  const { data } = await axiosClient.get<KakaoCategoryDto>(
    `/workspace/${workspaceId}/kakao/category`
  );

  return buildTree(data);
};

export const useKakaoConnectionCategories = (workspaceId: number) => {
  return useQuery(
    ["kakao-connection-categories", workspaceId],
    () => fetchKakaoConnectionCategories(workspaceId),
    {
      retry: false,
    }
  );
};

export const useKakaoConnection = (workspaceId: number) => {
  return useQuery(
    ["kakao-connection", workspaceId],
    () => fetchKakaoConnections(workspaceId),
    {
      retry: false,
    }
  );
};

export const useCreateKakaoConnectionToken = (workspaceId: number) => {
  return useMutation((dto: CreateKakaoConnectionTokenDto) =>
    createKakaoConnectionToken(workspaceId, dto)
  );
};

export const useCreateKakaoConnection = (workspaceId: number) =>
  useMutation(
    (dto: CreateKakaoConnectionDto) => createKakaoConnection(workspaceId, dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["kakao-connection", workspaceId]);
      },
    }
  );

export const useDeleteKakaoConnection = (workspaceId: number) =>
  useMutation(() => deleteKakaoConnection(workspaceId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["kakao-connection", workspaceId]);
    },
  });
