import { useEffect, useState } from "react";
import Image from "next/image";
import { useUserMe } from "@/hooks/queries/useUser";
import Link from "next/link";

export default function Navigation() {
  const { isLoading, error } = useUserMe();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !error) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoading, error]);

  return (
    <header
      className={`w-full max-w-6xl flex justify-between items-center py-6 px-10 sticky top-0 z-10 duration-300 ${
        scrolled && //blur
        "shadow-md border border-gray-200 rounded-2xl top-4 bg-white/70 backdrop-filter backdrop-blur-md"
      }`}
    >
      <Link href="/">
        <Image
          src="/logo.png"
          alt="스르륵"
          width={60}
          height={80}
          className="cursor-pointer"
        />
      </Link>
      <nav className="hidden md:flex gap-8 text-gray-700">
        <Link href="https://docs.sluurp.io">이용 가이드</Link>
        <Link href="/templates">알림톡 예제</Link>
        <Link href="/pricing">요금 안내</Link>
      </nav>
      <Link href={isLoggedIn ? "/workspaces" : "/auth/login"}>
        <button className="bg-black text-white px-4 py-2 rounded-md cursor-pointer">
          {isLoggedIn ? "앱으로 이동" : "무료로 시작하기"}
        </button>
      </Link>
    </header>
  );
}
