export interface LoginDto {
  loginId: string;
  password: string;
}

export interface SignupDto {
  name: string;
  loginId: string;
  phone: string;
  code: string;
  password: string;
}

export type Provider = "NAVER" | "KAKAO" | "GOOGLE";

export interface SignupByProviderDto {
  name: string;
  phone: string;
  code: string;
  providerId: string;
  provider: Provider;
}

export interface TokenDto {
  accessToken: string;
  refreshToken: string;
  isRegister?: boolean;
  id?: string;
}

export interface RequestSignupCodeDto {
  phone: string;
  name: string;
}

export interface RequestPasswordResetCodeDto {
  name: string;
  phone: string;
}

export interface ChangePasswordDto {
  phone: string;
  code: string;
  password: string;
}
