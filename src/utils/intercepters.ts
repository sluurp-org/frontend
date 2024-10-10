import { AxiosError, InternalAxiosRequestConfig, isAxiosError } from "axios";

import axiosClient from "./axios";

export const addAuthInterceptor = (req: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken") || "";
  req.headers.Authorization = `Bearer ${token}`;

  return req;
};

export const refreshIntercepter = async (err: AxiosError | Error) => {
  if (!isAxiosError(err)) return Promise.reject(err);

  const { config, response } = err;
  if (response?.status !== 401) return Promise.reject(err);
  if (config?.url === "/auth/refresh") return Promise.reject(err);

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("NoRefreshToken");

  const { data } = await axiosClient.post("/auth/refresh", {
    refreshToken,
  });
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  if (config) {
    return axiosClient.request(config);
  } else {
    throw new Error("Invalid request configuration");
  }
};
