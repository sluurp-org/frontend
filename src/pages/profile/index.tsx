import Container from "@/components/Container";
import useSWR from "swr";
import { UserAPI } from "../api/user";
import errorHandler from "@/utils/error";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function Profile() {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const fetchDefaultValues = async () => {
      try {
        const data = await UserAPI.me();
        setValue("name", data.name);
        setValue("email", data.email);
      } catch (error) {
        errorHandler(error, router);
      }
    };

    fetchDefaultValues();
  }, [setValue, router]);

  const onSubmit = async (data: {}) => {
    try {
      const processedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === "" ? null : value,
        ])
      );

      await UserAPI.update(processedData);
      toast.success("프로필이 수정되었습니다.");
      router.push("/profile");
    } catch (error) {
      errorHandler(error, router);
    }
  };

  return (
    <Container>
      <Header title="프로필" description="프로필 정보" />
      <form className="w-full sm:w-[450px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4">
          <label className="block text-gray-600">이름</label>
          <input
            type="text"
            required
            {...register("name", { required: true })}
            className="w-full mt-2 p-3 border border-gray-200 rounded-md"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-600">이메일</label>
          <input
            type="email"
            required
            {...register("email", { required: true })}
            className="w-full mt-2 p-3 border border-gray-200 rounded-md"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-600">비밀번호</label>
          <input
            type="password"
            {...register("password")}
            className="w-full mt-2 p-3 border border-gray-200 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-6 p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 duration-75"
        >
          프로필 수정
        </button>
      </form>
    </Container>
  );
}
