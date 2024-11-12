import Navigation from "@/components/main/Navigation";
import Footer from "@/components/main/Footer";
import Section from "@/components/main/Section";
import AlimTalk, { AlimTalkProps } from "@/components/kakao/AlimTalk";
import { useState } from "react";
import { NextSeo } from "next-seo";

interface AlimTalkTemplate extends AlimTalkProps {
  name: string;
}

const alimTalkTemplate: AlimTalkTemplate[] = [
  {
    name: "배송 출발시",
    content:
      "안녕하세요! 임태현 고객님 :)\n스르륵 스토어에서 주문하신 1개월 무료 체험 상품 상품이 배송 출발하였습니다.\n\n▶ 주문 번호: 0092384019212\n▶ 배송 업체: CJ 대한통운\n▶ 송장 번호: 1875923874239\n\n배송이 완료되면 알림톡을 다시 보내드릴게요 :)\n구매해 주셔서 감사합니다!",
    buttons: [{ buttonName: "배송 조회" }],
    image: "/kakao/delivery-start.png",
  },
  {
    name: "배송 완료시",
    content:
      "안녕하세요! 임태현 고객님 :)\n스르륵 스토어에서 주문하신 1개월 무료 체험 상품이 배송 완료되었습니다.\n\n▶ 주문 번호: 0092384019212\n▶ 배송 업체: CJ 대한통운\n▶ 송장 번호: 1875923874239\n\n만족하셨다면 구매 확정을 눌러주세요 :)\n구매해 주셔서 감사합니다!",
    buttons: [{ buttonName: "구매 확정" }],
    image: "/kakao/delivery-done.jpg",
  },
  {
    name: "리뷰 요청시",
    content:
      "안녕하세요! 임태현 고객님 :)\n스르륵 스토어에서 주문하신 1개월 무료 체험 상품은 만족스러우신가요?\n\n7일 동안 사용해보신 후 만족하셨다면 리뷰를 남겨주세요 :)\n\n고객님의 소중한 리뷰가 저희에게 큰 힘이 됩니다!",
    buttons: [{ buttonName: "리뷰 남기기" }],
    image: "/kakao/review-request.jpg",
  },
  {
    name: "주문 완료시",
    content:
      "안녕하세요! 임태현 고객님 :)\n스르륵 스토어에서 주문하신 1개월 무료 체험 상품 주문이 완료되었습니다.\n\n▶ 주문 번호: 0092384019212\n▶ 결제 금액: 1024원\n\n빠른 배송을 위해 노력하는 스르륵이 되겠습니다\n감사합니다!",
    buttons: [{ buttonName: "주문 조회" }],
    channelAddButton: true,
    extra: "채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기",
  },
  {
    name: "이벤트 안내",
    content:
      "안녕하세요! 임태현 고객님 :)\n이벤트 기간에 상품 구매하셔서 안내드립니다!\n\n스르륵 스토어에서 1주년 이벤트를 진행하고 있습니다.\n\n▶ 이벤트 기간: 2021.08.01 ~ 2021.08.31\n▶ 이벤트 내용: 1주년을 맞아 모든 상품 50% 할인!\n\n이벤트에 참여하시어 특별한 혜택을 누려보세요 :)\n감사합니다!",
    buttons: [{ buttonName: "이벤트 참여" }],
  },
  {
    name: "ESIM 등록 안내",
    content:
      "안녕하세요! 임태현 고객님 :)\n스르륵 스토어에서 주문하신 ESIM 상품 사용 등록 안내입니다.\n\n▶ 주문 번호: 0092384019212\n▶ 등록 기기: iPhone 12 Pro Max\n▶ 등록 일자: 2021.08.01\n\nESIM 사용 등록이 완료되었습니다.\n감사합니다!",
    buttons: [{ buttonName: "ESIM 등록 확인" }],
    channelAddButton: true,
    extra: "채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기",
  },
  {
    name: "채널 추가 안내",
    content:
      "안녕하세요! 임태현 고객님 :)\n스르륵 스토어에서 주문하신 상품이 배송 완료되었습니다.\n\n더 많은 소식을 구독하기 위해 아래 채널 추가 버튼을 눌러주세요 :)\n감사합니다!",
    buttons: [{ buttonName: "채널 추가" }],
    channelAddButton: true,
    extra: "채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기",
  },
  {
    name: "구매 확정 안내",
    content:
      "안녕하세요! 임태현 고객님 :)\n스르륵 스토어에서 구매하신 상품은 마음에 드시나요?\n\n저희 상품을 마음에 들어하신다면 구매 확정을 눌러주세요 :)",
    buttons: [{ buttonName: "구매 확정" }],
    channelAddButton: true,
    extra: "채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기",
  },
  {
    name: "문화 상품권 안내",
    content:
      "안녕하세요! 임태현 고객님 :)\n스르륵 스토어에서 주문하신 문화 상품권이 발송되었습니다.\n\n▶ 주문 번호: 0092384019212\n▶ 발송 일자: 2021.08.01\n\n문화 상품권을 사용하실 때는 위 코드를 입력해주세요 :)\n감사합니다!",
    channelAddButton: true,
    buttons: [{ buttonName: "문화 상품권 확인" }],
    extra: "채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기",
  },
];

export default function Templates() {
  return (
    <>
      <NextSeo
        title="스르륵 | 알림톡 예제"
        description="스르륵 알림톡 예제 페이지입니다."
        openGraph={{
          title: "알림톡 예제",
          description: "스르륵 알림톡 예제 페이지입니다.",
        }}
      />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4">
        <Navigation />
        <div className="max-w-5xl w-full mt-20">
          <h1 className="text-5xl font-bold text-center">알림톡 예제</h1>
          <p className="mt-3 text-center text-gray-600 break-words px-5">
            예시로 제공되는 알림톡 템플릿입니다. 실제 서비스에서는 사용자가 직접
            템플릿을 생성하실 수 있습니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-10">
            {alimTalkTemplate.map((template, index) => (
              <div key={index} className="flex flex-col items-center">
                <p className="text-2xl font-bold mb-3 mt-10">{template.name}</p>
                <AlimTalk
                  key={index}
                  content={template.content}
                  buttons={template.buttons}
                  image={template.image}
                  channelAddButton={template.channelAddButton}
                  extra={template.extra}
                />
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
