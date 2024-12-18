import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { PagesTopLoader } from "nextjs-toploader/pages";
import { QueryClient, QueryClientProvider } from "react-query";
import { ConfigProvider } from "antd";
import ko_KR from "antd/es/locale/ko_KR";
import "moment/locale/ko";
import { DefaultSeo } from "next-seo";
import { GoogleAnalytics } from "@next/third-parties/google";

import moment from "moment";
import { ChannelProvider } from "@/contexts/ChannelContext";
import { StepbyProvider } from "@/contexts/StepbyContext";
import { ReactElement } from "react";
import { ReactNode } from "react";
import { NextPage } from "next";
moment.locale("ko");

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

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
      <QueryClientProvider client={queryClient}>
        <DefaultSeo {...DEFAULT_SEO} />
        <Toaster position="top-center" reverseOrder={false} />
        <PagesTopLoader color="#818cf8" height={5} showSpinner={false} />
        <GoogleAnalytics gaId="G-NY5LVEW8RS" />
        <ChannelProvider>
          <StepbyProvider>
            <ConfigProvider locale={ko_KR}>
              <Component {...pageProps} />
            </ConfigProvider>
          </StepbyProvider>
        </ChannelProvider>
      </QueryClientProvider>
    </>
  );
}
