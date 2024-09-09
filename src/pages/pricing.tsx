import { useRouter } from "next/router";
import Navigation from "@/components/main/Navigation";
import Footer from "@/components/main/Footer";
import Section from "@/components/main/Section";

function PricingCard({
  title,
  price,
  description,
  features,
  onClick,
}: {
  title: string;
  price: number;
  description: string;
  features: string[];
  onClick: () => void;
}) {
  return (
    <div className="p-5 rounded-lg shadow-xl relative h-[400px] bg-gradient-to-br from-indigo-500 to-indigo-500 hover:to-indigo-600 duration-1000 hover:shadow-2xl">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <h2 className="text-3xl font-bold text-white mt-1">
        {price.toLocaleString("ko-KR")}원
        <span className="text-sm text-gray-300"> / 월</span>
      </h2>
      <p className="mt-1 text-gray-200">{description}</p>
      <ul className="mt-3 text-white list-disc list-inside leading-relaxed">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <button
          onClick={onClick}
          className="w-full p-3 bg-white text-indigo-400 rounded-md font-semibold hover:bg-gray-200 duration-75"
        >
          무료로 시작하기
        </button>
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <div>
      <Navigation />
      <Section className="mt-32">
        <h1 className="text-5xl font-bold text-center">
          <span className="text-indigo-400">스르륵</span> 서비스 이용 요금
        </h1>
        <p className="mt-3 text-center text-gray-600">
          스르륵의 서비스 이용 요금은 다음과 같습니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
          <PricingCard
            title="Basic"
            price={5000}
            description="단순 메시지 전송에 최적화된 요금제입니다."
            features={[
              "무제한 상품 등록",
              "무제한 메시지 전송",
              "알림톡 제작 및 검수 대행",
              "최대 1개의 스토어 연동",
            ]}
            onClick={() => {}}
          />
          <PricingCard
            title="Standard"
            price={10000}
            description="디지털 상품 판매에 최적화된 요금제입니다."
            features={[
              "Basic 요금제 기능 포함",
              "최대 5개의 스토어 연동",
              "디지털 상품 판매 가능",
              "알림톡 빠른 검수 대행",
            ]}
            onClick={() => {}}
          />
          <PricingCard
            title="Premium"
            price={15000}
            description="다양한 상품 판매에 최적화된 요금제입니다."
            features={[
              "Standard 요금제 기능 포함",
              "무제한 스토어 연동",
              "외부 디지털 상품 연동 가능",
              "고객센터 우선 지원",
            ]}
            onClick={() => {}}
          />
        </div>
      </Section>
      <Footer />
    </div>
  );
}
