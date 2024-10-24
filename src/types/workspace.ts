export interface WorkspaceDto {
  id: number;
  name: string;
  credit: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceDto {
  name: string;
}

export type UpdateWorkspaceDto = Partial<CreateWorkspaceDto>;
