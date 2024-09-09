interface SignupUserReqBodyDto {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserReqBodyDto {
  name?: string;
  email?: string;
  password?: string;
}

export type { SignupUserReqBodyDto, UpdateUserReqBodyDto };
