export interface KakaoConnectionDto {
  searchId: string;
  channelId: string;
}

export interface CreateKakaoConnectionTokenDto {
  searchId: string;
  phoneNumber: string;
}

export interface CreateKakaoConnectionDto {
  searchId: "string";
  phoneNumber: "string";
  categoryCode: "string";
  token: "string";
}
