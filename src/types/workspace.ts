export interface WorkspaceDto {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceDto {
  name: string;
}

export type UpdateWorkspaceDto = Partial<CreateWorkspaceDto>;
