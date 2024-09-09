import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";
import Head from "next/head";
import { PagesTopLoader } from "nextjs-toploader/pages";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    ChannelService.loadScript();
    ChannelService.boot({ pluginKey: "c293bdb7-4645-4d72-acd7-2f2919ebdc59" });

    return () => {
      ChannelService.shutdown();
    };
  }, []);

  return (
    <>
      <Head>
        <title>스르륵</title>
        <meta name="description" content="스토어 자동 발송은 스르륵" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="top-center" reverseOrder={false} />
      <PagesTopLoader color="#818cf8" height={5} showSpinner={false} />
      <Component {...pageProps} />
    </>
  );
}
