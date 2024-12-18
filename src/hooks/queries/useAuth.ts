import { useMutation, useQueryClient } from "react-query";
import {
  LoginDto,
  RequestSignupCodeDto,
  SignupDto,
  TokenDto,
  RequestPasswordResetCodeDto,
  ChangePasswordDto,
  SignupByProviderDto,
} from "@/types/auth";
import axiosClient from "@/utils/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { AxiosError } from "axios";

const login = async (credentials: LoginDto): Promise<TokenDto> => {
  const { data } = await axiosClient.post("/auth/login", credentials);
  return data;
};

const naverLogin = async (code: string): Promise<TokenDto> => {
  const { data } = await axiosClient.get("/auth/naver/callback", {
    params: { code },
  });
  return data;
};

const googleLogin = async (code: string): Promise<TokenDto> => {
  const { data } = await axiosClient.get("/auth/google/callback", {
    params: { code },
  });
  return data;
};

const logout = async (): Promise<void> => {
  await axiosClient.post("/auth/logout");
};

const register = async (credentials: SignupDto): Promise<void> => {
  await axiosClient.post("/users", credentials);
};

const registerByProvider = async (
  credentials: SignupByProviderDto
): Promise<void> => {
  await axiosClient.post("/users/provider", credentials);
};

const requestSignupCode = async (dto: RequestSignupCodeDto): Promise<void> => {
  await axiosClient.post("/users/code", dto);
};

const requestPasswordResetCode = async (dto: RequestPasswordResetCodeDto) => {
  await axiosClient.post("/users/change-password", dto);
};

const resetPassword = async (dto: ChangePasswordDto) => {
  await axiosClient.put("/users/change-password", dto);
};

export const useRequestPasswordResetCode = () => {
  return useMutation((dto: RequestPasswordResetCodeDto) =>
    requestPasswordResetCode(dto)
  );
};

export const useResetPassword = () => {
  return useMutation((dto: ChangePasswordDto) => resetPassword(dto));
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation((credentials: LoginDto) => login(credentials), {
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      queryClient.invalidateQueries("user");
    },
  });
};

export const useNaverLogin = () => {
  const queryClient = useQueryClient();

  return useMutation((code: string) => naverLogin(code), {
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      queryClient.invalidateQueries("user");
    },
  });
};

export const useRegisterByProvider = () => {
  return useMutation((credentials: SignupByProviderDto) =>
    registerByProvider(credentials)
  );
};

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();

  return useMutation((code: string) => googleLogin(code), {
    onSuccess: (data) => {
      if (data.isRegister) return;

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      queryClient.invalidateQueries("user");
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
