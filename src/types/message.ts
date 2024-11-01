export type MessageType = "KAKAO" | "WEBHOOK" | "EMAIL";
export const MessageType = {
  KAKAO: "카카오",
  WEBHOOK: "웹훅",
  EMAIL: "이메일",
} as const;

export interface MessageListItem {
  id: number;
  name: string;
  isGlobal: boolean;
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
  isGlobal: boolean;
  contentGroupId?: number;
  completeDelivery: boolean;
  contentGroup?: {
    id: number;
    name: string;
  };
  kakaoTemplate: KakaoTemplateDto;
  createdAt: Date;
  updatedAt: Date;
  target: MessageTarget;
  customPhone?: string;
}

export const KakaoButtonMapping = {
  DS: "배송조회",
  WL: "웹링크",
  BK: "봇키워드",
  MD: "메시지전달",
  BC: "상담톡 전환",
  BT: "봇전환",
  AC: "채널추가",
  PR: "디지털 컨텐츠 다운로드",
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

export type MessageTarget = "BUYER" | "RECEIVER" | "CUSTOM";
export const MessageTargetMapping: Record<MessageTarget, string> = {
  BUYER: "주문인",
  RECEIVER: "수령인",
  CUSTOM: "지정발송",
};

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
  kakaoTemplate: KakaoTemplateCreateDto;
  target: MessageTarget;
  customPhone?: string;
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
  target?: MessageTarget;
  customPhone?: string;
}

export interface KakaoCategoryDto {
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
