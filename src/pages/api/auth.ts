import axiosClient from "@/utils/axios";
import {
  LoginUserReqBodyDto,
  RefreshTokenReqBodyDto,
  LoginUserResDto,
} from "@/types/auth.dto";

interface AuthAPI {
  loginByEmail: (body: LoginUserReqBodyDto) => Promise<LoginUserResDto>;
  refresh: (body: RefreshTokenReqBodyDto) => Promise<LoginUserResDto>;
  logout: () => Promise<void>;
}

export const AuthAPI: AuthAPI = {
  loginByEmail: async (body) => {
    const uri = "/auth/login";
    const { data } = await axiosClient.post<LoginUserResDto>(uri, body);

    return data;
  },
  refresh: async (body) => {
    const uri = "/auth/refresh";
    const { data } = await axiosClient.post<LoginUserResDto>(uri, body);

    return data;
  },
  logout: async () => {
    const uri = "/auth/logout";
    await axiosClient.post(uri);
  },
};
