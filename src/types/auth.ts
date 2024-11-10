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

export interface TokenDto {
  accessToken: string;
  refreshToken: string;
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
