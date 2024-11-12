import Navigation from "@/components/main/Navigation";
import Footer from "@/components/main/Footer";
import { NextSeo } from "next-seo";
import { usePurchaseConfig } from "@/hooks/queries/usePurcahse";
import { Card } from "@/components/common/Card";
import { CheckCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import Loading from "@/components/Loading";

export default function Pricing() {
  const { data, isLoading } = usePurchaseConfig();

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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4">
        <Navigation />
        <div className="max-w-6xl w-full mx-auto mt-10 mb-20">
          <h1 className="text-5xl font-bold text-center">서비스 이용 요금</h1>
          <p className="mt-3 text-center text-gray-600 break-words px-5">
            스르륵의 서비스 이용 요금을 안내합니다.
          </p>

          <div className="flex sm:flex-row flex-col gap-8 mt-10 mx-auto items-center justify-center">
            <div className="text-left flex flex-col gap-4">
              <div>
                <p className="text-2xl font-bold">
                  🎉 지금 가입하면{" "}
                  <span className="text-indigo-500">한달 무료체험</span> 🎉
                </p>
                <p className="text-sm text-gray-500 font-normal">
                  무료체험시 카드 등록 필요 없음
                </p>
              </div>
              <p className="text-2xl font-bold">
                👻 메세지 발송 없을 시{" "}
                <span className="text-indigo-500">기본 요금 제외</span>
              </p>
              <p className="text-2xl font-bold">
                🚀 매달 알림톡 발송{" "}
                <span className="text-indigo-500">100건 무료 제공</span>
              </p>
              <p className="text-2xl font-bold">
                🚚 선불 없는{" "}
                <span className="text-indigo-500">후불 청구형 결제</span>
              </p>
              <p className="text-2xl font-bold">
                📈 <span className="text-indigo-500">멈추지 않는 업데이트</span>
              </p>
              <p className="text-2xl font-bold">
                📞 <span className="text-indigo-500">24시간 고객센터</span> 운영
              </p>
            </div>
            <Card className="w-[400px] p-8">
              {isLoading ? (
                <Loading isFullPage={false} />
              ) : (
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

                  <ul className="flex flex-col gap-1 list-outside">
                    <li>
                      <CheckCircleOutlined className="text-green-500" /> 실시간
                      주문 정보 업데이트
                    </li>
                    <li>
                      <CheckCircleOutlined className="text-green-500" /> 실시간
                      주문 대시보드
                    </li>
                    <li>
                      <CheckCircleOutlined className="text-green-500" /> 24시간
                      자동 발송
                    </li>
                    <li>
                      <CheckCircleOutlined className="text-green-500" /> 카카오
                      알림톡 관리
                    </li>
                    <li>
                      <CheckCircleOutlined className="text-green-500" /> 디지털
                      컨텐츠 관리
                    </li>
                    <li>
                      <CheckCircleOutlined className="text-green-500" /> 주문
                      매출 통계
                    </li>
                    <li>
                      <CheckCircleOutlined className="text-green-500" /> 제한
                      없는 스토어 연동
                    </li>
                  </ul>

                  <Link href="/auth/register">
                    <button className="w-full mt-4 bg-black font-semibold text-white py-2 rounded-md">
                      무료체험 시작하기
                    </button>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
