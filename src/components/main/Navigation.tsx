import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const onReturnClick = () => {
    router.push("/");
  };

  const navigateToAuth = () => {
    router.push("/auth/login");
  };

  const navigateToPricing = () => {
    router.push("/pricing");
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 bg-white z-10 duration-150 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container w-11/12 mx-auto flex justify-between items-center py-3">
        <Image
          src="/logo.png"
          alt="스르륵"
          width={60}
          height={80}
          onClick={onReturnClick}
          className="cursor-pointer"
        />
        <div className="flex gap-5 items-center">
          <button
            onClick={navigateToPricing}
            className="text-gray-500 hover:text-gray-700"
          >
            요금 안내
          </button>
          <a
            href="https://docs.sluurp.io"
            target="_blank"
            className="text-gray-500 hover:text-gray-700"
          >
            이용 가이드
          </a>
          <button
            onClick={navigateToAuth}
            className="px-4 p-3 bg-indigo-400 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600"
          >
            무료로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
