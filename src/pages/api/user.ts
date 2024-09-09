import User from "@/types/user";
import { SignupUserReqBodyDto, UpdateUserReqBodyDto } from "@/types/user.dto";
import axiosClient from "@/utils/axios";

interface UserAPI {
  register: (body: SignupUserReqBodyDto) => Promise<User>;
  update(body: UpdateUserReqBodyDto): Promise<User>;
  me: () => Promise<User>;
}

export const UserAPI: UserAPI = {
  register: async (body) => {
    const uri = "/users";
    const { data } = await axiosClient.post<User>(uri, body);

    return data;
  },
  update: async (body) => {
    const uri = "/users/me";
    const { data } = await axiosClient.patch<User>(uri, body);

    return data;
  },
  me: async () => {
    const uri = "/users/me";
    const { data } = await axiosClient.get<User>(uri);

    return data;
  },
};
