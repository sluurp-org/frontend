export type MessageType = "KAKAO" | "WEBHOOK" | "EMAIL";
export const MessageType = {
  KAKAO: "카카오",
  WEBHOOK: "웹훅",
  EMAIL: "이메일",
} as const;

export interface MessageListItem {
  id: number;
  name: string;
}

export interface MessageFilters {
  page?: number;
  size?: number;
  name?: string;
}

export interface PaginatedMessages {
  nodes: MessageListItem[];
  total: number;
}

export type KakaoTemplateStatus =
  | "APPROVED"
  | "REJECTED"
  | "PENDING"
  | "UPLOADED";

export const KakaoTemplateStatus = {
  APPROVED: "승인됨",
  REJECTED: "거절됨",
  PENDING: "검수중",
  UPLOADED: "검수 대기",
} as const;

export interface KakaoTemplateDto {
  id: number;
  status: KakaoTemplateStatus;
  categoryCode: string;
  content: string;
  buttons: {
    name: string;
    type: string;
    url?: string;
  }[];
  extra: string;
  comments: string[];
  imageUrl?: string;
}

export interface MessageDto {
  id: number;
  name: string;
  contentGroupId?: number;
  completeDelivery: boolean;
  contentGroup?: {
    id: number;
    name: string;
  };
  variables: {
    key: string;
    value: string;
  }[];
  kakaoTemplate: KakaoTemplateDto;
  createdAt: Date;
  updatedAt: Date;
}

export const KakaoButtonMapping = {
  DS: "배송조회",
  WL: "웹링크",
  BK: "봇키워드",
  MD: "메시지전달",
  BC: "상담톡 전환",
  BT: "봇전환",
  AC: "채널추가",
  PR: "디지털 상품 다운로드",
  RW: "리뷰 작성",
  PC: "구매 확정",
} as const;

export type KakaoButtonType =
  | "DS"
  | "WL"
  | "BK"
  | "MD"
  | "BC"
  | "BT"
  | "AC"
  | "PR"
  | "RW"
  | "PC";

export interface KakaoTemplateCreateDto {
  categoryCode: string;
  content: string;
  buttons: {
    name: string;
    type: string;
    url?: string;
  }[];
  extra?: string;
  imageId?: string;
  imageUrl?: string;
}

export interface MessageCreateDto {
  name: string;
  contentGroupId: number;
  completeDelivery?: boolean;
  variables: {
    key: string;
    value: string;
  }[];
  kakaoTemplate: KakaoTemplateCreateDto;
}

export interface KakaoTemplateUpdateDto {
  categoryCode?: string | undefined;
  content?: string | undefined;
  buttons?: {
    name: string | undefined;
    type: string | undefined;
    url?: string | undefined;
  }[];
  extra?: string | undefined;
  imageId?: string | undefined;
  imageUrl?: string | undefined;
}

export interface MessageUpdateDto {
  name?: string | undefined;
  contentGroupId?: number | undefined;
  completeDelivery?: boolean;
  variables?:
    | {
        key: string;
        value: string;
      }[]
    | undefined;
  kakaoTemplate?: KakaoTemplateUpdateDto;
}

export interface KakaoMessageCategoryDto {
  categories: {
    code: string;
    name: string;
  }[];
}

export interface MessageVariablesDto {
  nodes: {
    key: string;
    description?: string;
    example?: string;
  }[];
  total: number;
}