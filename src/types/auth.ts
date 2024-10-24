export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  name: string;
  email: string;
  password: string;
}

export interface TokenDto {
  accessToken: string;
  refreshToken: string;
}
