import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosClient from "@/utils/axios";
import {
  WorkspaceDto,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
} from "@/types/workspace";

const fetchWorkspaces = async (): Promise<WorkspaceDto[]> => {
  const { data } = await axiosClient.get("/workspace");
  return data;
};

const fetchWorkspaceById = async (id: number): Promise<WorkspaceDto> => {
  const { data } = await axiosClient.get(`/workspace/${id}`);
  return data;
};

const createWorkspace = async (
  newWorkspace: CreateWorkspaceDto
): Promise<WorkspaceDto> => {
  const { data } = await axiosClient.post("/workspace", newWorkspace);
  return data;
};

const updateWorkspace = async (
  id: number,
  updatedWorkspace: UpdateWorkspaceDto
): Promise<WorkspaceDto> => {
  const { data } = await axiosClient.patch(
    `/workspace/${id}`,
    updatedWorkspace
  );
  return data;
};

const deleteWorkspace = async (id: number): Promise<void> => {
  await axiosClient.delete(`/workspace/${id}`);
};

export const useWorkspaces = () => {
  return useQuery("workspaces", fetchWorkspaces);
};

export const useWorkspace = (id: number) => {
  return useQuery(["workspace", id], () => fetchWorkspaceById(id));
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (newWorkspace: CreateWorkspaceDto) => createWorkspace(newWorkspace),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("workspaces");
      },
    }
  );
};

export const useUpdateWorkspace = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    (updatedWorkspace: UpdateWorkspaceDto) =>
      updateWorkspace(id, updatedWorkspace),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["workspace", id]);
      },
    }
  );
};

export const useDeleteWorkspace = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation(() => deleteWorkspace(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("workspaces");
    },
  });
};
