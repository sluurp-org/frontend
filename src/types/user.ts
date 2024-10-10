export interface UserMeDto {
  id: number;
  name: string;
  email: string;
  hash: string;
}

export interface UserUpdateDto {
  name?: string;
  email?: string;
  password?: string;
}
