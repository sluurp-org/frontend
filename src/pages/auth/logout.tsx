import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Container from "@/components/Container";
import { deleteCookie } from "cookies-next";
import { AuthAPI } from "../api/auth";

export default function Logout() {
  const router = useRouter();

  const logout = async () => {
    await AuthAPI.logout();
    deleteCookie("accessToken");
    deleteCookie("refreshToken");

    toast.success("로그아웃 되었습니다.");
    router.push("/auth/login");
  };

  useEffect(() => {
    logout();
  });

  return <Container>로그아웃 처리중입니다.</Container>;
}
