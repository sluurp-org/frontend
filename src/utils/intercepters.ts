import { AuthAPI } from "@/pages/api/auth";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";
import { getCookie } from "cookies-next";

import axiosClient from "./axios";

export const addAuthInterceptor = (req: InternalAxiosRequestConfig) => {
  const token = getCookie("accessToken") || "";
  req.headers.Authorization = `Bearer ${token}`;

  return req;
};

export const refreshIntercepter = async (err: AxiosError | Error) => {
  if (!isAxiosError(err)) return Promise.reject(err);

  const { config, response } = err;
  if (response?.status !== 401) return Promise.reject(err);
  if (config?.url === "/auth/refresh") return Promise.reject(err);

  const refreshToken = getCookie("refreshToken") || "";
  if (!refreshToken) return Promise.reject(err);

  await AuthAPI.refresh({ refreshToken });

  if (config) {
    return axiosClient.request(config);
  } else {
    throw new Error("Invalid request configuration");
  }
};
