import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Footer({
  logo = true,
  className,
  childrenClassName,
}: {
  logo?: boolean;
  className?: string;
  childrenClassName?: string;
}) {
  return (
    <footer className={cn("bg-gray-50 py-8 border-t w-full", className)}>
      <div
        className={cn(
          "max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8",
          childrenClassName
        )}
      >
        <div className="col-span-2">
          {logo && (
            <Image
              src="/logo.png"
              alt="스르륵"
              width={60}
              height={80}
              className="cursor-pointer mb-4"
            />
          )}
          <p className="text-gray-600 mb-1">금오고소렌탈</p>
          <p className="text-gray-600 mb-1">대표: 임철수</p>
          <p className="text-gray-600 mb-1">
            주소: 경상북도 구미시 비산로 79-10(비산동)
          </p>
          <p className="text-gray-600 mb-1">사업자번호: 540-09-02493</p>
          <p className="text-gray-600 mb-1">
            통신판매업신고번호: 2024-경북구미-1019
          </p>
          <p className="text-gray-600 mb-1">대표전화: 010-3729-0245</p>
          <p className="text-gray-600 mb-1">이메일: sluurp@limtaehyun.dev</p>
          <div className="flex gap-4 mt-4 divide-x">
            <Link href="https://docs.sluurp.io/ko/articles/e7388652">
              서비스 이용약관
            </Link>
            <Link href="https://docs.sluurp.io/ko/articles/4ebd780f">
              개인정보 처리방침
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
