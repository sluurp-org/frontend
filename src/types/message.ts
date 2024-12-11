export type MessageSendType = "KAKAO" | "WEBHOOK" | "EMAIL";
export const MessageSendTypeMap: Record<MessageSendType, string> = {
  KAKAO: "카카오",
  WEBHOOK: "웹훅",
  EMAIL: "이메일",
} as const;

export type MessageType = "GLOBAL" | "CUSTOM" | "FULLY_CUSTOM";
export const MessageTypeMap: Record<MessageType, string> = {
  GLOBAL: "기본 제공형",
  CUSTOM: "빠른 시작형",
  FULLY_CUSTOM: "완전 맞춤형",
} as const;

export interface MessageListItem {
  id: number;
  name: string;
  sendType: MessageSendType;
  type: MessageType;
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

export const KakaoTemplateStatus: Record<KakaoTemplateStatus, string> = {
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

export interface CustomKakaoTemplateDto {
  id: number;
  name: string;
  description: string;
  content: string;
  imageUrl?: string;
  extra?: string;
  buttons: KakaoButtonType[];
}

export interface MessageDto {
  id: number;
  name: string;
  sendType: MessageSendType;
  type: MessageType;
  content?: string;
  contentGroupId?: number;
  contentGroup?: {
    id: number;
    name: string;
  };
  kakaoTemplate: KakaoTemplateDto;
  kakaoTemplateId: number;
  createdAt: Date;
  updatedAt: Date;
  target: MessageTarget;
  customPhone?: string;
}

export const KakaoButtonMapping: Record<KakaoButtonType, string> = {
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
  BUYER: "구매자",
  RECEIVER: "수령자",
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
  sendType: MessageSendType;
  content: string;
  contentGroupId: number;
  kakaoTemplate: KakaoTemplateCreateDto;
  kakaoTemplateId?: number;
  target: MessageTarget;
  customPhone?: string;
  type: MessageType;
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
  content?: string | undefined;
  contentGroupId?: number | undefined;
  variables?:
    | {
        key: string;
        value: string;
      }[]
    | undefined;
  kakaoTemplate?: KakaoTemplateUpdateDto | undefined;
  kakaoTemplateId?: number | undefined;
  target?: MessageTarget;
  type?: MessageType;
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
