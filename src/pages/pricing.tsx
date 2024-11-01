import { useRouter } from "next/router";
import Navigation from "@/components/main/Navigation";
import Footer from "@/components/main/Footer";
import { NextSeo } from "next-seo";
import { usePurchaseConfig } from "@/hooks/queries/usePurcahse";
import { Card } from "@/components/common/Card";
import Section from "@/components/main/Section";

export default function Pricing() {
  const router = useRouter();

  const { data, isLoading, isError } = usePurchaseConfig();

  return (
    <>
      <NextSeo
        title="스르륵 | 서비스 이용 요금"
        description="스르륵 서비스 이용 요금 안내."
        openGraph={{
          title: "서비스 이용 요금",
          description: "스르륵 서비스 이용 요금 안내.",
        }}
      />
      <Navigation />
      <Section className="mt-32 h-[730px] text-center">
        <h1 className="text-5xl font-bold text-center">
          <span className="text-indigo-400">서비스 이용 요금</span>
        </h1>
        <p className="mt-3 text-center text-gray-600 break-words px-5">
          스르륵의 서비스 이용 요금을 안내합니다.
        </p>

        <div className="mt-12">
          <p className="text-2xl font-bold">🎉 지금 가입하면 한달 무료체험</p>
        </div>
        <Card className="w-[400px] mx-auto p-8 mt-3 text-left">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">기본 요금</h2>
              <p className="text-lg font-bold">
                월 {data?.defaultPrice.toLocaleString("ko-KR")}원
              </p>
            </div>

            <div className="flex justify-between">
              <h2 className="text-xl font-bold ">카카오톡</h2>
              <p className="text-lg">
                <span className="font-bold">
                  {data?.alimtalkSendPrice.toLocaleString("ko-KR")}원
                </span>
                <span className="text-gray-500 text-sm"> / 발송 건</span>
              </p>
            </div>

            <div className="flex justify-between">
              <h2 className="text-xl font-bold ">디지털 컨텐츠</h2>
              <p className="text-lg">
                <span className="font-bold">
                  {data?.contentSendPrice.toLocaleString("ko-KR")}원
                </span>
                <span className="text-gray-500 text-sm"> / 발송 건</span>
              </p>
            </div>

            <button
              onClick={() => router.push("/auth/login")}
              className="w-full mt-8 bg-indigo-500 hover:bg-indigo-600 font-semibold text-white py-2 rounded-md"
            >
              무료체험 시작하기
            </button>
          </div>
        </Card>
        <p className="text-sm text-gray-500 mt-1">
          * 스르륵은 기본 요금과 발송 건당 요금을 부과합니다.
        </p>
      </Section>
      <Footer />
    </>
  );
}
