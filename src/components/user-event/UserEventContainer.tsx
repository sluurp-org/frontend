import { LoadingOutlined } from "@ant-design/icons";
import { Result } from "antd";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function UserEventContainer({
  children,
  isLoading = false,
}: {
  children: React.ReactNode;
  isLoading?: boolean;
}) {
  return (
    <>
      <Head>
        <title>스르륵 자동 발송</title>
      </Head>
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center p-6 pt-40 md:pt-0">
          <Link href="/" target="_blank">
            <div className="flex gap-3 items-end justify-center">
              <Image src="/logo.png" alt="logo" width={80} height={80} />
              <h1 className="text-sm">스토어 문자 자동 발송</h1>
            </div>
          </Link>
          <div className="flex flex-col shadow-xl gap-3 items-center mt-3 bg-white rounded-lg p-10">
            {isLoading ? (
              <Result
                status="info"
                icon={<LoadingOutlined />}
                title="주문 정보를 불러오는 중입니다."
                subTitle="잠시만 기다려주세요."
              />
            ) : (
              children
            )}
          </div>
          <p className="text-sm mt-5 text-gray-400">
            스르륵의 모든 상품, 상품정보, 거래에 관한 의무와 책임은 상품
            판매자에게 있습니다.
          </p>
          <p className="flex gap-2 text-sm mt-1 text-gray-400">
            <Link
              href="https://docs.sluurp.io/ko/articles/e7388652"
              target="_blank"
            >
              서비스 이용약관
            </Link>
            |
            <Link
              href="https://docs.sluurp.io/ko/articles/4ebd780f"
              target="_blank"
            >
              개인정보 처리방침
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
