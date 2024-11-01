export interface UserMeDto {
  id: number;
  name: string;
  loginId: string;
  phone: string;
  hash: string;
}

export interface UserUpdateDto {
  name?: string;
  password?: string;
}
