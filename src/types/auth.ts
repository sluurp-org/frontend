export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  name: string;
  email: string;
  phone: string;
  code: string;
  password: string;
}

export interface TokenDto {
  accessToken: string;
  refreshToken: string;
}

export interface RequestSignupCodeDto {
  phone: string;
  name: string;
}
