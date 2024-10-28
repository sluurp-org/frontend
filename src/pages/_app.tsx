import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { PagesTopLoader } from "nextjs-toploader/pages";
import { QueryClient, QueryClientProvider } from "react-query";
import ChannelTalk from "@/components/ChannelTalk";
import { ConfigProvider } from "antd";
import ko_KR from "antd/es/locale/ko_KR";
import "moment/locale/ko";
import { DefaultSeo } from "next-seo";

import moment from "moment";
import { TourProvider } from "@/components/common/TourContext";
import MyTour from "@/components/common/Tour";
moment.locale("ko");

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const DEFAULT_SEO = {
  title: "스르륵 | 고객과 가까워지는 스토어 메세징",
  description: "스마트 스토어(스토어팜) 카카오 알림톡 자동 발송 지원",
  canonical: "https://www.sluurp.io",
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://sluurp.io",
    title: "스르륵 | 고객과 가까워지는 스토어 메세징",
    site_name: "스르륵",
    images: [
      {
        url: "https://sluurp.io/seo.png",
        width: 285,
        height: 167,
        alt: "스르륵",
      },
    ],
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...DEFAULT_SEO} />
      <Toaster position="top-center" reverseOrder={false} />
      <PagesTopLoader color="#818cf8" height={5} showSpinner={false} />
      <TourProvider>
        <MyTour />
        <QueryClientProvider client={queryClient}>
          <ChannelTalk />
          <ConfigProvider locale={ko_KR}>
            <Component {...pageProps} />
          </ConfigProvider>
        </QueryClientProvider>
      </TourProvider>
    </>
  );
}
