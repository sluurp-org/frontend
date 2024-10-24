import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MenuOutlined } from "@ant-design/icons";
import { useUserMe } from "@/hooks/queries/useUser";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const router = useRouter();
  const { data, isLoading, error } = useUserMe();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    if (isLoggedIn) {
      router.push("/workspaces");
    } else {
      router.push("/auth/login");
    }
  };

  const navigateToPricing = () => {
    router.push("/pricing");
  };

  const onTemplateClick = () => {
    router.push("/templates");
  };

  useEffect(() => {
    if (!isLoading && !error) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoading, error]);

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
          <div className="sm:flex gap-5 hidden">
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
              className="text-gray-500 hover:text-gray-700"
              onClick={onTemplateClick}
            >
              알림톡 예제
            </button>
          </div>
          <div
            className="sm:hidden cursor-pointer"
            onClick={() => setMenu((prev) => !prev)}
          >
            <MenuOutlined className="text-2xl" />
          </div>
          {isLoggedIn ? (
            <button
              onClick={navigateToAuth}
              className="px-4 p-3 bg-indigo-400 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600"
            >
              워크스페이스 목록
            </button>
          ) : (
            <button
              onClick={navigateToAuth}
              className="px-4 p-3 bg-indigo-400 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600"
            >
              무료로 시작하기
            </button>
          )}
        </div>
      </div>
      {menu && (
        <div className="mx-auto pt-3 pb-5 flex flex-col gap-5 text-center shadow-lg w-screen sm:hidden">
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
            className="text-gray-500 hover:text-gray-700"
            onClick={onTemplateClick}
          >
            알림톡 예제
          </button>
        </div>
      )}
    </div>
  );
}
