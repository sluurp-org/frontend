import { useMutation, useQueryClient } from "react-query";
import {
  LoginDto,
  RequestSignupCodeDto,
  SignupDto,
  TokenDto,
} from "@/types/auth";
import axiosClient from "@/utils/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { AxiosError } from "axios";

const login = async (credentials: LoginDto): Promise<TokenDto> => {
  const { data } = await axiosClient.post("/auth/login", credentials);
  return data;
};

const logout = async (): Promise<void> => {
  await axiosClient.post("/auth/logout");
};

const register = async (credentials: SignupDto): Promise<void> => {
  await axiosClient.post("/users", credentials);
};

const requestSignupCode = async (dto: RequestSignupCodeDto): Promise<void> => {
  await axiosClient.post("/users/code", dto);
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation((credentials: LoginDto) => login(credentials), {
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      queryClient.invalidateQueries("user");
      toast.success("로그인 성공");
      router.push("/workspaces");
    },
    onError: (error: AxiosError) => {
      toast.error("아이디와 비밀번호를 확인해주세요.");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation(() => logout(), {
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      toast.success("로그아웃 되었습니다.");
      queryClient.clear();
    },
  });
};

export const useRegister = () => {
  return useMutation((credentials: SignupDto) => register(credentials));
};

export const useRequestSignupCode = () => {
  return useMutation((dto: RequestSignupCodeDto) => requestSignupCode(dto));
};
