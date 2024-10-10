export type ContentType = "FILE" | "TEXT" | "URL" | "QRCODE" | "BARCODE";
export const ContentType = {
  FILE: "파일",
  TEXT: "텍스트",
  URL: "주소",
  QRCODE: "QR코드",
  BARCODE: "바코드",
};

export interface ContentGroupDto {
  id: number;
  name: string;
  type: ContentType;
  oneTime: boolean;
  expireMinute: number;
  downloadLimit: number;
}

export interface CreateContentGroupDto {
  name: string;
  type: ContentType;
  oneTime: boolean;
  expireMinute: number;
  downloadLimit: number;
}

export interface UpdateContentGroupDto {
  name?: string;
  expireMinute?: number | null;
  downloadLimit?: number | null;
}

export interface PaginatedContentGroupsResponse {
  total: number;
  nodes: ContentGroupDto[];
}

export interface ContentGroupFilters {
  page?: number;
  size?: number;
  name?: string;
  type?: ContentType;
  oneTime?: boolean;
}

export interface ContentDto {
  id: number;
  name: string;
  type: ContentType;
  oneTime: boolean;
  expireMinute: number;
  downloadLimit: number;
}

export interface ContentDto {
  id: number;
  text: string;
  used: boolean;
}

export interface ContentFilters {
  page?: number;
  size?: number;
  isUsed?: boolean;
}

export interface PaginatedContentsResponse {
  total: number;
  nodes: ContentDto[];
}

export interface CreateContentDto {
  text: string[];
}

export interface UpdateContentDto {
  text: string;
}
