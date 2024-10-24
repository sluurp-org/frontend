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
          <p className="font-bold">스택</p>
          <p>대표: 임태현</p>
          <p>
            주소지: 경상북도 칠곡군 석적읍 석적로 955-19 (우방신천지아파트),
            105동 901호
          </p>
          <p>사업자 등록번호: 740-05-02299</p>
          <a href="mailto:contact@sluurp.io" target="_blank">
            고객센터: contact@sluurp.io
          </a>
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
