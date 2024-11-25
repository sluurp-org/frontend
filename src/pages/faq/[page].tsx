import Navigation from "@/components/main/Navigation";
import Footer from "@/components/main/Footer";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { NotionAPI } from "notion-client";
import { NotionRenderer } from "react-notion-x";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ExtendedRecordMap } from "notion-types";
import { GetServerSideProps } from "next";
import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";

const Code = dynamic(
  () => import("react-notion-x/build/third-party/code").then((m) => m.Code),
  {
    ssr: false,
  }
);
const Collection = dynamic(
  () =>
    import("react-notion-x/build/third-party/collection").then(
      (m) => m.Collection
    ),
  {
    ssr: false,
  }
);
const Equation = dynamic(
  () =>
    import("react-notion-x/build/third-party/equation").then((m) => m.Equation),
  {
    ssr: false,
  }
);
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
);

export default function Notice({
  data,
  rootPageId,
  currentPageId,
}: {
  data: ExtendedRecordMap | null;
  rootPageId?: string;
  currentPageId?: string;
}) {
  if (!data) {
    return (
      <>
        <NextSeo
          title="스르륵 | 자주 묻는 질문"
          description="스르륵 서비스 자주 묻는 질문."
          openGraph={{
            title: "서비스 자주 묻는 질문",
            description: "스르륵 서비스 자주 묻는 질문.",
          }}
        />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4">
          <Navigation />
          <div className="max-w-3xl w-full mx-auto mt-10 mb-20">
            <h1 className="text-5xl font-bold text-center">
              자주 묻는 질문 불러오기 실패
            </h1>
            <p className="mt-3 text-center text-gray-600">
              자주 묻는 질문 데이터를 불러오지 못했습니다. 다시 시도해주세요.
            </p>
            <Link href="/">
              <a>홈으로 돌아가기</a>
            </Link>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <NextSeo
        title="스르륵 | 자주 묻는 질문"
        description="스르륵 서비스 자주 묻는 질문."
        openGraph={{
          title: "서비스 자주 묻는 질문",
          description: "스르륵 서비스 자주 묻는 질문.",
        }}
      />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4">
        <Navigation />
        <div className="max-w-3xl w-full mx-auto mt-10 mb-20">
          <h1 className="text-5xl font-bold text-center">
            서비스 자주 묻는 질문
          </h1>
          <p className="mt-3 text-center text-gray-600 break-words px-5">
            스르륵 서비스 자주 묻는 질문입니다.
          </p>
          <div className="flex min-h-[500px] sm:flex-row flex-col gap-8 mt-10 mx-auto justify-center">
            <div>
              {rootPageId && (
                <div className="w-full">
                  <Link
                    className="font-semibold text-lg"
                    href={`/faq/${rootPageId}`}
                  >
                    뒤로 가기
                  </Link>
                </div>
              )}
              <NotionRenderer
                recordMap={data}
                fullPage={rootPageId ? true : false}
                disableHeader={true}
                darkMode={false}
                mapPageUrl={(pageId) =>
                  `/faq/${pageId}${
                    currentPageId ? `?rootPageId=${currentPageId}` : ""
                  }`
                }
                components={{
                  Code,
                  Collection,
                  Equation,
                  Modal,
                  nextImage: Image,
                  nextLink: Link,
                }}
                bodyClassName="border-none"
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  const api = new NotionAPI();
  const page = params?.page as string;
  const rootPageId = query?.rootPageId || null;

  try {
    const recordMap = await api.getPage(page);
    return {
      props: {
        data: recordMap,
        rootPageId,
        currentPageId: page,
      },
    };
  } catch (error) {
    console.error("Failed to fetch Notion page:", error);
    return {
      props: {
        data: null,
        rootPageId,
        currentPageId: page,
      },
    };
  }
};
