import Cal, { getCalApi } from "@calcom/embed-react";
import { useState, useEffect } from "react";
import {
  ClockCircleFilled,
  FileDoneOutlined,
  FilterFilled,
  HeartFilled,
  LockFilled,
  MergeFilled,
  MoonFilled,
  TruckFilled,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import AlimTalk from "@/components/kakao/AlimTalk";
import Section from "@/components/main/Section";
import { josa } from "josa";
import Navigation from "@/components/main/Navigation";
import Footer from "@/components/main/Footer";

const eventStatusTextList = [
  "결제 완료 시",
  "배송 준비 시",
  "배송 출발 시",
  "배송 완료 시",
  "구매 확정 시",
];

const messageTextList = [
  "디지털 컨텐츠",
  "사용설명서",
  "자주 묻는 질문",
  "배송 정보",
  "할인 쿠폰",
  "구매 확정 요청",
];

const deliveryAlimTalkContentSample =
  "안녕하세요! 임태현 고객님 :)\n스르륵 스토어에서 주문하신 1개월 무료 체험 상품 상품이 배송 출발하였습니다.\n\n▶ 주문 번호: 0092384019212\n▶ 배송 업체: CJ 대한통운\n▶ 송장 번호: 1875923874239\n\n배송이 완료되면 알림톡을 다시 보내드릴게요 :)\n구매해 주셔서 감사합니다!";
const deliveryDoneAlimTalkContentSample =
  "안녕하세요! 임태현 고객님 :)\n스르륵 스토어에서 주문하신 1개월 무료 체험 상품이 배송 완료되었습니다.\n\n▶ 주문 번호: 0092384019212\n▶ 배송 업체: CJ 대한통운\n▶ 송장 번호: 1875923874239\n\n만족하셨다면 구매 확정을 눌러주세요 :)\n구매해 주셔서 감사합니다!";
const reviewRequestAlimTalkContentSample =
  "안녕하세요! 임태현 고객님 :)\n스르륵 스토어에서 주문하신 1개월 무료 체험 상품은 만족스러우신가요?\n\n7일 동안 사용해보신 후 만족하셨다면 리뷰를 남겨주세요 :)\n\n고객님의 소중한 리뷰가 저희에게 큰 힘이 됩니다!";

export default function Home() {
  const router = useRouter();
  const [messageTextIndex, setMessageTextIndex] = useState(0);
  const [eventStatusTextIndex, setEventStatusTextIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setMessageTextIndex(
        (prevIndex) => (prevIndex + 1) % messageTextList.length
      );
      setEventStatusTextIndex(
        (prevIndex) => (prevIndex + 1) % eventStatusTextList.length
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timeout);
  }, [messageTextIndex]);

  const navigateToAuth = () => {
    router.push("/auth/login");
  };

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "meeting" });
      cal("ui", {
        styles: { branding: { brandColor: "#666AF2" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div className="h-screen">
      <Navigation />
      <section className="h-[calc(100vh-200px)] flex gap-20 items-center justify-center">
        <div className="flex gap-16 mx-auto justify-center items-center">
          <AlimTalk
            className="sm:block hidden"
            image="/kakao/delivery-start.png"
            content={deliveryAlimTalkContentSample}
            buttons={[{ buttonName: messageTextList[messageTextIndex] }]}
          />
          <div>
            <div>
              <h1 className="text-3xl font-bold text-center sm:text-left sm:leading-[1.3] sm:text-5xl">
                <span className="text-indigo-400">주문 즉시</span> 고객에게
                <br />
                <span className={`text-slide ${animate ? "animate" : ""}`}>
                  {josa(`${messageTextList[messageTextIndex]}#{을}`)}
                </span>
                <br />
                자동으로 <span className="text-indigo-400">발송</span>
                하세요.
              </h1>
              <p className="mt-3 text-gray-500 sm:text-left text-center">
                반복되는 고객 문의, 주문 확인, 배송 정보 등의 업무를
                <br />
                스르륵 자동화하여 고객 서비스를 향상시키세요.
              </p>
            </div>
            <div className="mt-10 flex justify-center sm:justify-start">
              <button
                onClick={navigateToAuth}
                className="px-5 py-3 bg-indigo-400 text-white rounded-xl font-semibold text-lg hover:bg-indigo-600"
              >
                무료로 시작하기
              </button>
            </div>
          </div>
        </div>
      </section>
      <Section className=" bg-gradient-to-br from-indigo-400 to-indigo-500 text-white">
        <h1 className="text-4xl text-center font-bold sm:text-5xl sm:text-left">
          왜 스르륵을 사용해야 할까요?
        </h1>

        <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5 mt-10">
          <div className="p-10 bg-white text-black rounded-lg shadow-lg hover:shadow-2xl duration-75">
            <TruckFilled className="mb-3 text-4xl text-indigo-500" />
            <h2 className="text-2xl font-bold">주문부터 배송까지 한번에</h2>
            <p className="mt-1">
              더 이상 주문 확인, 메세지 발송 등의 업무를 직접 처리하지 마세요.
              스르륵이 모두 처리해드립니다.
            </p>
          </div>
          <div className="p-10 bg-white text-black  rounded-lg shadow-lg hover:shadow-2xl duration-75">
            <HeartFilled className="mb-3 text-4xl text-red-500" />
            <h2 className="text-2xl font-bold">고객 만족도를 높히는 메시지</h2>
            <p className="mt-1">
              24시간 멈추지 않는 스르륵을 통해 고객에게 자동으로 상품 정보를
              제공하고 배송 정보, 할인 쿠폰 등을 발송하세요.
            </p>
          </div>
          <div className="p-10 bg-white text-black  rounded-lg shadow-lg hover:shadow-2xl duration-75">
            <MoonFilled className="mb-3 text-4xl text-yellow-500" />
            <h2 className="text-2xl font-bold">쉬는 시간이 없는 주문 처리</h2>
            <p className="mt-1">
              24시간 동안 단 1초도 쉬지 않는 스르륵이 주문을 즉시 처리하여
              고객에게 신속한 배송을 보장합니다.
            </p>
          </div>

          <div className="p-10 bg-white text-black  rounded-lg shadow-lg hover:shadow-2xl duration-75">
            <ClockCircleFilled className="mb-3 text-4xl text-green-500" />
            <h2 className="text-2xl font-bold">디지털 컨텐츠도 역시 스르륵</h2>
            <p className="mt-1">
              디지털 컨텐츠의 경우에도 스르륵을 통해 고객에게 즉시 제공할 수
              있습니다. 더 이상 수동으로 메일을 보내거나 문자로 처리하지 마세요.
            </p>
          </div>
        </div>
      </Section>
      <Section>
        <h1 className="text-3xl font-bold text-center sm:leading-[1.3] sm:text-5xl break-keep">
          <span
            className={`text-indigo-400 text-slide ${animate ? "animate" : ""}`}
          >
            {eventStatusTextList[eventStatusTextIndex]}
          </span>
          에 자동으로 메시지를 발송하세요.
        </h1>
        <p className="mt-3 text-gray-500 text-center break-words">
          주문, 배송, 환불, 구매 확정 등의 이벤트에 따라 고객에게 자동으로
          메시지를 발송하세요.
        </p>
        <div className="w-full flex justify-center mt-10">
          <div className="sm:grid sm:grid-cols-3 sm:gap-5 mt-10">
            <AlimTalk
              className="h-min"
              content={deliveryAlimTalkContentSample}
              channelAddButton
              image="/kakao/delivery-start.png"
              buttons={[{ buttonName: "배송 조회" }]}
            />
            <AlimTalk
              className="sm:block hidden h-min"
              content={deliveryDoneAlimTalkContentSample}
              channelAddButton
              image="/kakao/delivery-done.jpg"
              buttons={[{ buttonName: "구매 확정" }]}
            />
            <AlimTalk
              className="sm:block hidden h-min"
              content={reviewRequestAlimTalkContentSample}
              channelAddButton
              image="/kakao/review-request.jpg"
              buttons={[{ buttonName: "일주일 리뷰 작성하기" }]}
            />
          </div>
        </div>
      </Section>
      <Section className="bg-gradient-to-br from-indigo-400 to-indigo-500 text-white">
        <h1 className="text-3xl font-bold text-center sm:text-left sm:leading-[1.3] sm:text-5xl">
          <span className="text-yellow-200">디지털 디지털 컨텐츠</span>도
          스르륵으로
          <br />
          자동 <span className="text-yellow-200">발송</span>하세요.
        </h1>
        <p className="mt-3 text-gray-200 sm:text-left text-center">
          스르륵을 통해 발송된 디지털 컨텐츠은 최대 3분 이내에 고객에게 자동
          발송됩니다.
        </p>
        <div className="grid sm:grid-cols-2 gap-5 mt-10">
          <div className="p-10 bg-white text-black rounded-lg shadow-lg hover:shadow-xl duration-75">
            <h2 className="text-2xl font-bold">
              <ClockCircleFilled className="text-indigo-500 mr-2" />
              주문 즉시 자동 발송
            </h2>
            <p className="mt-1">
              네이버 스마트스토어(스토어팜) 에서 구매한 디지털 컨텐츠은 최대 3분
              이내에 자동으로 발송됩니다.
            </p>
            <p className="mt-2 text-gray-400 text-sm">
              호스팅 업체 다운, 외부 스토어 정책 변경으로 인한 발송 지연이 있을
              수 있습니다. 이 경우 별도의 알림을 사용자에게 제공하고 1일 이내에
              발송을 보장합니다.
            </p>
          </div>

          <div className="p-10 bg-white text-black rounded-lg shadow-lg hover:shadow-xl duration-75 ">
            <h2 className="text-2xl font-bold">
              <FileDoneOutlined className="text-indigo-500 mr-2" />
              취소, 환불 처리도 손쉽게
            </h2>
            <p className="mt-1">
              취소, 환불시에는 스르륵이 자동으로 디지털 컨텐츠 권한을 회수하여
              고객이 더 이상 상품을 이용할 수 없도록 자동 권한 회수를
              지원합니다.
            </p>
          </div>

          <div className="p-10 bg-white text-black rounded-lg shadow-lg hover:shadow-xl duration-75 ">
            <h2 className="text-2xl font-bold">
              <LockFilled className="text-indigo-500 mr-2" />
              열람 확인, 제한도 가능
            </h2>
            <p className="mt-1">
              고객이 디지털 컨텐츠를 열람했는지 확인하거나, 열람 횟수, 만료일을
              설정할 수 있습니다.
              <br />더 이상 디지털 컨텐츠이 무단으로 공유되지 않도록 보호하세요.
            </p>
          </div>

          <div className="p-10 bg-white text-black rounded-lg shadow-lg hover:shadow-xl duration-75 ">
            <h2 className="text-2xl font-bold">
              <MergeFilled className="text-indigo-500 mr-2" />
              일회성 디지털 컨텐츠 발송 지원
            </h2>
            <p className="mt-1">
              일회성 디지털 컨텐츠(상품권, 코드, ESIM)을 스르륵을 통해 자동
              발송할 수 있습니다. 관리자 페이지에서 여러개의 디지털 컨텐츠를
              등록하고, 사용자마다 다른 일회성 디지털 컨텐츠를 제공하세요.
            </p>
          </div>

          <div className="p-10 bg-white text-black rounded-lg shadow-lg hover:shadow-xl duration-75">
            <h2 className="text-2xl font-bold">
              <FilterFilled className="text-indigo-500 mr-2" />
              파일 형식에 구애받지 않는 발송
            </h2>
            <p className="mt-1">
              PDF, ZIP등 다양한 파일 형식의 디지털 컨텐츠도 스르륵을 통해
              자동으로 발송할 수 있습니다.
              <br />더 이상 무거운 파일을 수동으로 전송하지 마세요.
            </p>
          </div>
          <div className="p-10 bg-white text-black rounded-lg shadow-lg hover:shadow-xl duration-75">
            <h2 className="text-2xl font-bold">
              <TruckFilled className="text-indigo-500 mr-2" />
              발송 즉시 배송 처리
            </h2>
            <p className="mt-1">
              디지털 컨텐츠 발송 즉시 주문 상태를 배송 시작으로 변경하여 고객이
              구매확정이 가능하도록 자동으로 처리합니다.
            </p>
          </div>
        </div>
      </Section>
      <Section>
        <h1 className="text-3xl font-bold text-center sm:text-left sm:leading-[1.3] sm:text-5xl">
          도입 상담 및 문의도 가능합니다.
        </h1>
        <Cal
          className="mt-10"
          namespace="meeting"
          calLink="sluurp/meeting"
          config={{ layout: "month_view" }}
        />
      </Section>
      <Section autoWidth={false}>
        <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 animated-background text-center text-white py-24 sm:p-32 rounded-2xl shadow-lg hover:shadow-xl duration-75">
          <h1 className="text-3xl font-bold sm:leading-[1.3] sm:text-5xl">
            아직 결정하지 못했나요?
            <br />
            <span className="text-yellow-200">무료로 시작</span>해보세요.
          </h1>
          <p className="mt-3 text-gray-200">
            한달 무료체험 후 결정하세요. 언제든지 해지 가능합니다.
          </p>
          <button
            onClick={navigateToAuth}
            className="px-5 py-3 bg-white text-indigo-400 rounded-xl font-semibold text-lg hover:bg-gray-300 mt-10"
          >
            무료로 시작하기
          </button>
        </div>
      </Section>
      <Footer />
    </div>
  );
}
