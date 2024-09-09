import Workspace from "@/types/workspace";
import axiosClient from "@/utils/axios";

interface WorkspaceAPI {
  findMany: () => Promise<Workspace[]>;
}

export const WorkspaceAPI: WorkspaceAPI = {
  findMany: async () => {
    try {
      const uri = "/workspace";
      const { data } = await axiosClient.get<Workspace[]>(uri);

      return data;
    } catch (error: any) {
      throw error;
    }
  },
};
