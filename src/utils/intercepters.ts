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

  try {
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
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    if (!window.location.pathname.startsWith("/workspaces"))
      return Promise.reject(error); // Redirect to login page if not in workspace page

    const pathname = window.location.pathname || "/workspaces";
    window.location.href = `/auth/login?redirect=${pathname}`;
    return Promise.reject(error);
  }
};
