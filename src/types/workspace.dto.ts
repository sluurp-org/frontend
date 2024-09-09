interface LoginUserReqBodyDto {
  email: string;
  password: string;
}

interface RefreshTokenReqBodyDto {
  refreshToken: string;
}

interface LoginUserResDto {
  accessToken: string;
  refreshToken: string;
}

export type { LoginUserReqBodyDto, RefreshTokenReqBodyDto, LoginUserResDto };
