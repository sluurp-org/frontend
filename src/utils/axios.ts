import axios, { CreateAxiosDefaults } from "axios";
import { addAuthInterceptor, refreshIntercepter } from "./intercepters";

export const axiosOptions: CreateAxiosDefaults = {
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
};

const instance = axios.create(axiosOptions);
instance.interceptors.request.use(addAuthInterceptor);
instance.interceptors.response.use((res) => res, refreshIntercepter);

export default instance;
