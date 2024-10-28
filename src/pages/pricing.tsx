import { useRouter } from "next/router";
import Navigation from "@/components/main/Navigation";
import Footer from "@/components/main/Footer";
import Section from "@/components/main/Section";
import { useSubscriptions } from "@/hooks/queries/useSubscription";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { NextSeo } from "next-seo";

export function PricingCard({
  title,
  price,
  buttonText = "무료로 시작하기",
  description,
  features,
  sendPrice,
  onClick,
}: {
  title: string;
  price: number;
  buttonText?: string;
  description: string;
  features: { value: string; isEnabled: boolean }[];
  sendPrice: { name: string; price: number }[];
  onClick: () => void;
}) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-xl relative bg-gradient-to-br duration-1000 hover:shadow-2xl border border-gray-200">
      <h1 className="text-2xl font-bold">{title}</h1>
      <h2 className="text-3xl font-bold mt-1">
        {price.toLocaleString("ko-KR")}원
        <span className="text-sm text-gray-500"> / 1개월 (30일)</span>
      </h2>
      <p className="mt-1 text-gray-500 h-20">{description || "요금제"}</p>

      <button
        onClick={onClick}
        className="w-full p-3 mt-3 bg-indigo-400 text-white rounded-md font-semibold hover:bg-indigo-500 duration-75"
      >
        {buttonText}
      </button>

      <div className="mt-5">
        <p className="text-indigo-500 text-lg font-bold mb-1">플랜 기능</p>
        <div className="flex flex-col gap-1">
          {features.map((feature) => (
            <div key={feature.value} className="flex items-center gap-2">
              <span
                className={`${
                  feature.isEnabled ? "text-green-400" : "text-red-500"
                }`}
              >
                {feature.isEnabled ? (
                  <CheckCircleOutlined />
                ) : (
                  <CloseCircleOutlined />
                )}
              </span>
              <span>{feature.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-indigo-500 text-lg font-bold mb-1">
          메세지 발송 요금
        </p>
        <ul className="list-disc list-inside">
          {sendPrice.map((price) => (
            <li key={price.name}>
              {price.name} 발송당 {price.price.toLocaleString("ko-KR")} 크레딧
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Pricing() {
  const router = useRouter();
  const onClick = () => {
    router.push("/auth/login");
  };
  const { data: subscriptions, isLoading, isError } = useSubscriptions();

  if (isLoading) return <Loading isFullPage={false} />;
  if (isError) return <Error isFullPage={false} />;

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
      <Section className="mt-32 h-min-[1000px]">
        <h1 className="text-4xl sm:text-5xl font-bold text-center">
          <span className="text-indigo-400">스르륵</span> 서비스 이용 요금
        </h1>
        <p className="mt-3 text-center text-gray-600">
          스르륵의 서비스 이용 요금은 다음과 같습니다.
        </p>
        <p className="text-center text-gray-600">
          1개월 단위로 결제 되며 30일 동안 사용할 수 있습니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {subscriptions?.map((subscription) => {
            const {
              isContentEnabled,
              storeLimit,
              contentLimit,
              messageLimit,
              alimTalkCredit,
              contentCredit,
            } = subscription;

            const sendPrice = [
              {
                name: "알림톡",
                price: alimTalkCredit,
              },
              {
                name: "디지털 콘텐츠",
                price: contentCredit,
              },
            ];

            const features = [
              { value: "1분 간격 주문 수집", isEnabled: true },
              { value: "제한 없는 주문 처리", isEnabled: true },
              {
                value: "최대 3분이내 메세지 발송",
                isEnabled: true,
              },
              storeLimit > 0
                ? {
                    value: `최대 ${storeLimit}개 스토어 연동 가능`,
                    isEnabled: true,
                  }
                : { value: "스토어 무제한 연동", isEnabled: true },
              messageLimit > 0
                ? {
                    value: `최대 ${messageLimit}개 메시지 등록 가능`,
                    isEnabled: true,
                  }
                : { value: "메시지 무제한 등록", isEnabled: true },
              isContentEnabled
                ? contentLimit > 0
                  ? {
                      value: `디지털 콘텐츠 최대 ${contentLimit}개 등록 가능`,
                      isEnabled: true,
                    }
                  : { value: "디지털 콘텐츠 무제한 등록", isEnabled: true }
                : { value: "디지털 콘텐츠 등록 불가", isEnabled: false },
            ];

            return (
              <PricingCard
                key={subscription.id}
                title={subscription.name}
                price={subscription.price}
                sendPrice={sendPrice}
                description={subscription.description || ""}
                features={features}
                onClick={onClick}
              />
            );
          })}
        </div>
      </Section>
      <Footer />
    </>
  );
}
