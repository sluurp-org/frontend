import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Footer({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <footer
      className={cn(
        "flex justify-center items-center bg-indigo-400 text-white py-10",
        className
      )}
    >
      <div className="container w-11/12 mx-auto text-left">
        <Image src={"/logo.png"} alt="스르륵" width={80} height={80} />
        <div className="flex-col flex gap-1 mt-6">
          <p className="font-bold">금오고소렌탈</p>
          <p>대표: 임철수</p>
          <p>주소지: 경상북도 구미시 비산로 79-10(비산로)</p>
          <p>사업자 등록번호: 540-09-02493</p>
          <a href="mailto:contact@sluurp.io" target="_blank">
            고객센터: contact@sluurp.io
          </a>
          <Link href="tel:010-3719-0245">전화번호: 010-3719-0245</Link>
          <Link href="https://docs.sluurp.io/ko/articles/e7388652">
            서비스 이용약관
          </Link>
          <Link href="https://docs.sluurp.io/ko/articles/4ebd780f">
            개인정보 처리방침
          </Link>
          {children}
        </div>
      </div>
    </footer>
  );
}
