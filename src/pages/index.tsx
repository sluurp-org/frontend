import React, { ReactElement, useEffect, useState } from "react";
import AlimTalk from "@/components/kakao/AlimTalk";
import Cal, { getCalApi } from "@calcom/embed-react";
import Image from "next/image";
import moment from "moment";
import {
  TruckOutlined,
  LinkOutlined,
  RocketOutlined,
  InboxOutlined,
  PhoneOutlined,
  MessageOutlined,
  CustomerServiceOutlined,
  UserOutlined,
  LockOutlined,
  CloudOutlined,
  FileOutlined,
} from "@ant-design/icons";
import Footer from "@/components/main/Footer";
import Navigation from "@/components/main/Navigation";
import Link from "next/link";
import { Button, Form, Input } from "antd";
import { useRequestMessageSample } from "@/hooks/queries/useApp";
import toast from "react-hot-toast";

const reviewRequestAlimTalkContentSample =
  "안녕하세요! 임태현 고객님 :)\n스르륵 스토어에서 주문하신 영어 한큐에 pdf 상품은 만족스러우신가요?\n\n7일 동안 사용해보신 후 만족하셨다면 리뷰를 남겨주세요 :)\n\n고객님의 소중한 리뷰가 저희에게 큰 힘이 됩니다!";
const downloadAlimTalkContentSample =
  "#{구매자명} 고객님, 상품을 구매해주셔서 감사합니다.\n\n▶ 주문번호: #{주문번호}\n▶ 상품 주문번호: #{상품주문번호}\n\n▶ 상품: #{상품명}\n▶ 옵션명: #{상품옵션명}\n\n스르륵에서 주문 수집 시 발송되는 알림톡 입니다!\n\n메시지에 디지털 컨텐츠를 첨부하거나 구매 확정 또는 리뷰 작성 요청을 할 수 있습니다 ☺️";

const comments: {
  author: string;
  content: ReactElement;
}[] = [
  {
    author: "안OO",
    content: (
      <>
        스르륵을 사용하기 전에는 배송 안내를 직접 하고 톡톡으로 들어오는
        문의들에 대해서 일일이 대응하여야 하였는데,
        <span className="text-indigo-500">
          {" "}
          스르륵을 이용하고 나서부터는 배송 상태가 변경될 때마다 카톡을 보낼 수
          있어서 고객 문의가 많이 줄었습니다!
        </span>{" "}
        그리고 리뷰 작성 요청 알림톡을 사용하여 고객 실제 리뷰를 많이 수집할 수
        있게 되어 잘 도입하였다는 생각이 들어요.
      </>
    ),
  },
  {
    author: "김OO",
    content: (
      <>
        스마트 스토어를 통해 변질되기 쉬운 음식을 판매하고 있는데{" "}
        <span className="text-indigo-500">
          스르륵을 통하여 보관 방법 및 가장 맛있는 조리방법등을 카카오
          알림톡으로 발송하여 고객들의 만족도가 높아져 후기 작성률이
          높아졌습니다.
        </span>{" "}
        또한 상품에 대해 자주 안내하는 사항을 알림톡으로 발송하여 반복되는
        문의도 줄어 업무시간을 효율적으로 이용할 수 있게 되었습니다.
      </>
    ),
  },
  {
    author: "이OO",
    content: (
      <>
        이전부터 다운로드 상품을 발송하기 위하여 주문을 매일 확인하고 발송하는
        번거로움이 있었는데,{" "}
        <span className="text-indigo-500">
          스르륵을 사용하고 나서 부터는 재고를 추가하는것 이외에는 별도로 작업이
          필요없어져 일상 생활의 자유를 찾을 수 있었어요!{" "}
        </span>
        그리고 주문 즉시 카카오톡으로 알림톡이 발송되니 고객분들도 만족해주시고
        배송 문의도 아예 안들어오는 수준이 되어 정말 만족스러워요!! ☺️
      </>
    ),
  },
];

export default function HomePage() {
  const { mutateAsync: requestMessage, isLoading: messageLoading } =
    useRequestMessageSample();

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "meeting" });
      cal("ui", {
        hideEventTypeDetails: false,
      });
    })();
  }, []);

  const handleRequestMessage = async (to: string) => {
    toast.promise(requestMessage({ to }), {
      loading: "메시지 발송 중...",
      success: "메시지가 발송되었습니다.",
      error: "메시지 발송 도중 오류가 발생하였습니다.",
    });
  };

  const features = [
    { icon: "💳", title: "선불 없는\n후불결제" },
    { icon: "🔒", title: "AWS\n최고의 보안 적용" },
    { icon: "🌍", title: "실시간 주문\n대시보드" },
    { icon: "📋", title: "배송메모 자동 인식" },
    { icon: "📑", title: "디지털 컨텐츠\n확인 및 제한" },
    { icon: "📦", title: "상품별, 옵션별\n메시지 발송 설정" },
    { icon: "🔌", title: "환불, 취소시\n다운로드 제한" },
    { icon: "⚙️", title: "승인 없는\n메시지 작성" },
    { icon: "📅", title: "n일, n시간 후\n메시지 발송 가능" },
    { icon: "📧", title: "커스텀 메시지 생성 가능" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4">
      <Navigation />
      <main className="w-full max-w-6xl flex items-center gap-32 justify-center mt-16 mb-12 bg-white p-10 rounded-xl shadow-md border border-gray-200">
        <div>
          <h1 className="text-3xl lg:text-5xl leading-10 lg:leading-[55px] font-bold mt-4 whitespace-pre-line">
            고객에게 한 걸음 더{"\n"}
            가까워지는 스토어 메시징
          </h1>
          <p className="text-gray-600 mt-4 max-w-md">
            24시간 멈추지 않는 주문 수집, 주문상태 알림, 배송지 확인, 리뷰 작성
            요청, 구매 확정 요청 등 다양한 메시지를 통해 고객과 소통하세요.
          </p>
          <div className="flex gap-4 mt-6">
            <Link href="/auth/register">
              <button className="bg-black text-white py-3 px-6 rounded-md flex items-center gap-2">
                <span className="text-sm">한달 무료로 시작하기</span>
              </button>
            </Link>
          </div>
          <p className="text-gray-400 text-sm mt-2">카드 등록 불필요</p>
        </div>
        <AlimTalk
          className="sm:block hidden h-min"
          content={reviewRequestAlimTalkContentSample}
          channelAddButton
          image="/kakao/review-request.jpg"
          buttons={[{ buttonName: "일주일 리뷰 작성하기" }]}
        />
      </main>

      <section className="w-full max-w-6xl py-8 flex flex-col md:flex-row justify-center px-4 md:px-10 items-center gap-8 md:gap-32">
        <h2 className="text-xl md:text-2xl text-center md:text-left mb-4 md:mb-2 max-w-md">
          스마트 스토어, 카카오 알림톡에서 지원하는 공식 기능으로 개발 없이
          알림톡을 발송하세요.
        </h2>
        <div className="flex gap-4 md:gap-8">
          <div className="flex flex-col items-center">
            <Image
              className="rounded-lg border shadow-md hover:shadow-lg"
              src="/main/kakao.png"
              alt="카카오"
              width={100}
              height={100}
            />
            <p className="text-center mt-2">카카오 알림톡</p>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/main/smartstore.jpg"
              alt="스마트 스토어"
              className="rounded-lg border shadow-md hover:shadow-lg"
              width={100}
              height={100}
            />
            <p className="text-center mt-2">스마트 스토어</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4 flex flex-col items-center">
        <h2 className="text-4xl font-bold text-center mb-2">
          국민 모두가 사용하는 메신저
        </h2>
        <p className="text-gray-600 text-center max-w-xl mb-12">
          하루 평균 72번 열어보는 국민 메신저 카카오톡, 이제 선택 아닌 필수
          입니다.
        </p>

        <div className="max-w-xl justify-center bg-white flex p-10 rounded-xl shadow-lg border gap-10 items-center flex-col sm:flex-row">
          <Image
            className="rounded-lg border shadow-md hover:shadow-lg"
            src="/main/kakao.png"
            alt="카카오"
            width={100}
            height={100}
          />
          <p className="text-lg break-keep text-center sm:text-left">
            스마트 스토어와 카카오 알림톡을 연동하여, 주문 상태 알림, 배송지
            확인, 리뷰 작성 요청, 구매 확정 등 다양한 메시지를 고객에게
            보내보세요.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4 flex flex-col items-center">
        <p className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full mb-4 shadow-sm">
          <CustomerServiceOutlined className="mr-1" /> 고객 후기
        </p>
        <h2 className="text-4xl font-bold text-center mb-2">
          스르륵과 함께한 고객님들
        </h2>
        <p className="text-gray-600 text-center max-w-xl mb-12">
          스르륵을 이용하신 고객님들의 솔직한 후기를 확인해 보세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          {comments.map((comment, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <p className="text-indigo-400 mb-2 text-lg">
                {comment.author} 사장님
              </p>
              <p className="text-gray-800 text-base">{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-gray-50 py-16 px-4 flex flex-col items-center">
        <p className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full mb-4 shadow-sm">
          <RocketOutlined className="mr-1" /> 서비스 시작하기
        </p>
        <h2 className="text-4xl font-bold text-center mb-2">
          스르륵과 함께라면, 손쉽게 시작할 수 있어요.
        </h2>
        <p className="text-gray-600 text-center max-w-xl mb-12">
          불필요한 설정 없이, 원하시는 설정에 따라 1분 이내로 알림톡을 발송해
          보세요.
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start w-full md:w-80">
            <div className="bg-gray-200 text-gray-600 text-xs font-bold rounded-full px-2 py-1">
              01
            </div>
            <h3 className="text-xl font-semibold mt-4 mb-2">
              스마트 스토어 연동
            </h3>
            <p className="text-gray-600 mb-4">
              스르륵과 스마트 스토어를 연동하고, 주문을 수집하거나 주문 상태를
              추적하세요.
            </p>
            <div className="flex items-center gap-2 justify-center w-full mt-5">
              <Image
                src="/main/smartstore.jpg"
                alt="스마트 스토어"
                width={70}
                height={70}
              />
              <LinkOutlined className="text-2xl text-gray-400" />
              <Image src="/logo.png" alt="스르륵" width={70} height={70} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start w-full md:w-80">
            <div className="bg-gray-200 text-gray-600 text-xs font-bold rounded-full px-2 py-1">
              02
            </div>
            <h3 className="text-xl font-semibold mt-4 mb-2">
              발송할 메시지 작성
            </h3>
            <p className="text-gray-600 mb-4">
              알림톡을 발송할 내용을 작성하고, 상품과 연결하세요.
            </p>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2">
                <span className="bg-gray-200 h-6 w-10 rounded-full relative flex items-center">
                  <span className="bg-gray-800 h-4 w-4 rounded-full absolute left-1"></span>
                </span>
                <p>{moment(new Date()).format("MM")}월 프로모션</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-gray-400 h-6 w-10 rounded-full relative flex items-center">
                  <span className="bg-gray-800 h-4 w-4 rounded-full absolute right-1"></span>
                </span>
                <p>구매 확정 알림톡</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-gray-400 h-6 w-10 rounded-full relative flex items-center">
                  <span className="bg-gray-800 h-4 w-4 rounded-full absolute right-1"></span>
                </span>
                <p>리뷰 작성 요청 알림톡</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start w-full md:w-80">
            <div className="bg-gray-200 text-gray-600 text-xs font-bold rounded-full px-2 py-1">
              03
            </div>
            <h3 className="text-xl font-semibold mt-4 mb-2">자유를 누리세요</h3>
            <p className="text-gray-600 mb-4">
              이제 스르륵이 24시간 일하면서 고객과 소통하고, 주문을 수집하고,
              알림톡을 발송 해드립니다.
            </p>

            <div className="flex items-center gap-2 justify-center w-full mt-5">
              <TruckOutlined className="text-xl text-gray-400" />
              <p className="text-gray-400 text-sm">
                24시간 주문 수집, 자동 발송
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-16 px-4 flex flex-col items-center">
        <p className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full mb-4 shadow-sm">
          <InboxOutlined className="mr-1" /> 서비스 기능
        </p>
        <h2 className="text-4xl font-bold text-center mb-2">
          고객을 위한 다양한 발송 기능
        </h2>
        <p className="text-gray-600 text-center max-w-xl mb-12 whitespace-pre-line">
          고객에게 주문 상태 알림, 배송지 확인, 리뷰 작성 요청,{"\n"}구매 확정,
          디지털 상품 등 다양한 메시지를 발송하세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          <div className="bg-white rounded-lg shadow-md px-6 pt-6 flex flex-col items-start">
            <p className="bg-gray-200 text-gray-600 text-xs font-bold rounded-full px-2 py-1">
              01
            </p>
            <h3 className="text-xl font-semibold my-2">
              상품, 옵션 별 알림톡 발송
            </h3>
            <p className="text-gray-600 mb-4">
              스토어에 등록된 상품과 옵션에 따라서 발송할 알림톡 메시지를
              설정하고 상품별 안내사항 또는 옵션별 안내사항을 발송할 수 있어요.
            </p>
            <div className="w-full flex justify-center">
              <Image
                className="select-none"
                src="/main/send-config.png"
                alt="Product Variant"
                width={400}
                height={200}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md px-6 pt-6 flex flex-col items-start">
            <p className="bg-gray-200 text-gray-600 text-xs font-bold rounded-full px-2 py-1">
              02
            </p>
            <h3 className="text-xl font-semibold my-2">
              구매 확정과 리뷰 요청도 한 번에
            </h3>
            <p className="text-gray-600 mb-4">
              카카오 알림톡으로 구매 확정 요청과 리뷰 작성 요청을 동시에 보내
              스토어 단골 고객들의 리뷰를 쉽게 받아보세요.
            </p>
            <div className="w-full flex justify-center mt-auto">
              <Image
                className="select-none"
                src="/main/kakao-alimtalk.png"
                alt="카카오알림톡"
                width={300}
                height={200}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md px-6 pt-6 flex flex-col items-start">
            <p className="bg-gray-200 text-gray-600 text-xs font-bold rounded-full px-2 py-1">
              03
            </p>
            <h3 className="text-xl font-semibold my-2">
              디지털 컨텐츠도 쉽게 전달
            </h3>
            <p className="text-gray-600 mb-4">
              PDF, 이미지, 동영상 등 다양한 디지털 상품을 판매하고, 주문이
              완료되면 고객에게 바로 전달해보세요. 상품 환불, 교환, 취소시 상품
              열람 제한도 가능해요.
            </p>
            <div className="w-full flex justify-center mt-auto">
              <Image
                className="select-none"
                src="/main/download-product.png"
                alt="상품 다운로드"
                width={400}
                height={200}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md px-6 pt-6 flex flex-col items-start">
            <p className="bg-gray-200 text-gray-600 text-xs font-bold rounded-full px-2 py-1">
              04
            </p>
            <h3 className="text-xl font-semibold my-2">
              마무리까지 완벽한 배송 알림
            </h3>
            <p className="text-gray-600 mb-4">
              주문이 완료되면, 상품 배송 처리까지 한 번에 알림톡을 발송하고
              고객에게 배송 상태를 알릴 수 있어요.
            </p>
            <div className="w-full flex justify-center h-40 sm:h-full items-center">
              <Image
                className="select-none h-min"
                src="/main/notification.png"
                alt="배송 알림"
                width={400}
                height={200}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-8 px-4 flex flex-col items-center">
        <h2 className="text-4xl font-bold text-center mb-6">
          ...그리고 더 많은 기능들
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-medium whitespace-pre-line">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-gray-50 py-16 px-4 flex flex-col items-center w-full">
        <p className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full mb-4 shadow-sm flex items-center">
          <LockOutlined className="mr-1" /> 보안 및 안전
        </p>
        <h2 className="text-4xl font-bold text-center mb-8">
          강력하고 안전한 보안
        </h2>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start w-full md:w-80">
            <div className="text-center w-full my-3">
              <LockOutlined className="text-5xl" />
            </div>
            <h3 className="text-xl font-semibold mt-4 mb-2">
              데이터 보호 및 암호화
            </h3>
            <p className="text-gray-600 mb-4">
              데이터 교환에 SSL 암호화 프로토콜이 적용되어 있어요. 사용자의
              개인정보와 중요 데이터는 암호화되어 안전하게 보호됩니다.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start w-full md:w-80">
            <div className="text-center w-full my-3">
              <CloudOutlined className="text-5xl" />
            </div>
            <h3 className="text-xl font-semibold mt-4 mb-2">
              AWS 최고의 보안 적용
            </h3>
            <p className="text-gray-600 mb-4">
              99.9% 이상의 가용성을 보장하는 AWS 클라우드 서비스를 사용하여 최고
              수준의 보안을 제공합니다. 장애가 발생하더라도 데이터는 안전하게
              보관됩니다.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start w-full md:w-80">
            <div className="text-center w-full my-3">
              <FileOutlined className="text-5xl" />
            </div>
            <h3 className="text-xl font-semibold mt-4 mb-2">
              S3 Presigned Url
            </h3>
            <p className="text-gray-600 mb-4">
              파일 저장과 열람시에 Presigned URL이 적용되어 있습니다. 서버에서
              인증된 URL로만 저장과 읽기가 가능하며, 접근 시간 제한이
              존재합니다.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-16 px-4 flex flex-col items-center w-full">
        <p className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full mb-4 shadow-sm flex items-center">
          <MessageOutlined className="mr-1" /> 발송 체험하기
        </p>
        <h2 className="text-4xl font-bold text-center mb-8">
          직접 발송해보고, 스르륵의 기능을 경험해보세요.
        </h2>

        <div className="flex sm:flex-row flex-col w-auto mt-12 bg-white rounded-lg border shadow-md p-6 max-w-5xl justify-center gap-8 items-center sm:h-[400px]">
          <AlimTalk
            content={downloadAlimTalkContentSample}
            buttons={[{ buttonName: "확인하기" }]}
          />
          <div className="h-full border-l sm:block hidden" />
          <Form
            layout="vertical"
            onFinish={({ to }) => handleRequestMessage(to)}
          >
            <Form.Item
              label="발송할 번호"
              name="to"
              rules={[
                { required: true, message: "발송할 번호를 입력해주세요." },
                {
                  pattern: new RegExp(/^010[0-9]{8}$/),
                  message: "올바른 전화번호를 입력해주세요.",
                },
              ]}
            >
              <Input placeholder="발송할 번호를 입력하세요." />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                loading={messageLoading}
                htmlType="submit"
                className="w-full bg-black"
              >
                발송하기
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
      <section className="bg-gray-50 py-16 px-4 flex flex-col items-center w-full">
        <p className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full mb-4 shadow-sm">
          <PhoneOutlined className="mr-1" /> 서비스 도입하기
        </p>
        <h2 className="text-4xl font-bold text-center mb-2">
          스르륵을 도입하기 전 상담을 받아보세요.
        </h2>
        <p className="text-gray-600 text-center max-w-xl mb-12 whitespace-pre-line">
          스르륵을 도입하기 전, 스르륵의 기능과 사용법에 대해 상담을 받아보세요.
          {"\n"}
          상담은 무료이며, 1:1로 진행됩니다.
        </p>

        <div className="max-w-6xl w-full sm:h-full h-[500px] overflow-y-auto sm:overflow-y-hidden">
          <Cal
            className="w-full"
            namespace="meeting"
            calLink="sluurp/meeting"
            config={{ layout: "month_view", theme: "light" }}
          />
        </div>
      </section>
      <section className="w-full max-w-6xl min-h-64 flex flex-col items-center text-center justify-center mt-16 mb-12 bg-white p-10 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-2xl lg:text-4xl leading-10 lg:leading-[45px] font-bold mt-4 whitespace-pre-line">
          빠르고 간편한 메시지 발송{"\n"}
          스르륵과 함께하세요.
        </h1>

        <Link href="/auth/register">
          <button className="bg-black text-white py-3 px-6 rounded-md mt-6 cursor-pointer hover:bg-gray-900">
            한달 무료로 시작하기
          </button>
        </Link>
      </section>
      <Footer />
    </div>
  );
}
