import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import { PagesTopLoader } from "nextjs-toploader/pages";
import { QueryClient, QueryClientProvider } from "react-query";
import ChannelTalk from "@/components/ChannelTalk";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>스르륵</title>
        <meta name="description" content="스토어 자동 발송은 스르륵" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="top-center" reverseOrder={false} />
      <PagesTopLoader color="#818cf8" height={5} showSpinner={false} />
      <QueryClientProvider client={queryClient}>
        <ChannelTalk />
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}
