import cs from "classnames";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type PageBlock } from "notion-types";
import { formatDate, getBlockTitle, getPageProperty } from "notion-utils";
import * as React from "react";
import {
  type NotionComponents,
  NotionRenderer,
  useNotionContext,
} from "react-notion-x";
import styles from "./styles.module.css";

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
);
const Modal = dynamic(
  () =>
    import("react-notion-x/build/third-party/modal").then((m) => {
      m.Modal.setAppElement(".notion-viewport");
      return m.Modal;
    }),
  {
    ssr: false,
  }
);

export function NotionPage({ site, recordMap, error, pageId }) {
  const router = useRouter();
  const lite = useSearchParam("lite");

  const components = React.useMemo<Partial<NotionComponents>>(
    () => ({
      nextLegacyImage: Image,
      nextLink: Link,
      Collection,
      Equation,
      Pdf,
      Modal,
    }),
    []
  );

  // lite mode is for oembed
  const isLiteMode = lite === "true";

  const { isDarkMode } = useDarkMode();

  const siteMapPageUrl = React.useMemo(() => {
    const params: any = {};
    if (lite) params.lite = lite;

    const searchParams = new URLSearchParams(params);
    return mapPageUrl(site, recordMap, searchParams);
  }, [site, recordMap, lite]);

  const keys = Object.keys(recordMap?.block || {});
  const block = recordMap?.block?.[keys[0]]?.value;

  // const isRootPage =
  //   parsePageId(block?.id) === parsePageId(site?.rootNotionPageId)
  const isBlogPost =
    block?.type === "page" && block?.parent_table === "collection";

  const showTableOfContents = !!isBlogPost;
  const minTableOfContentsItems = 3;

  const pageAside = React.useMemo(
    () => (
      <PageAside block={block} recordMap={recordMap} isBlogPost={isBlogPost} />
    ),
    [block, recordMap, isBlogPost]
  );

  const footer = React.useMemo(() => <Footer />, []);

  if (router.isFallback) {
    return <Loading />;
  }

  if (error || !site || !block) {
    return <Page404 site={site} pageId={pageId} error={error} />;
  }

  const title = getBlockTitle(block, recordMap) || site.name;

  console.log("notion page", {
    isDev: config.isDev,
    title,
    pageId,
    rootNotionPageId: site.rootNotionPageId,
    recordMap,
  });

  if (!config.isServer) {
    // add important objects to the window global for easy debugging
    const g = window as any;
    g.pageId = pageId;
    g.recordMap = recordMap;
    g.block = block;
  }

  const canonicalPageUrl =
    !config.isDev && getCanonicalPageUrl(site, recordMap)(pageId);

  const socialImage = mapImageUrl(
    getPageProperty<string>("Social Image", block, recordMap) ||
      (block as PageBlock).format?.page_cover ||
      config.defaultPageCover,
    block
  );

  const socialDescription =
    getPageProperty<string>("Description", block, recordMap) ||
    config.description;

  return (
    <>
      <PageHead
        pageId={pageId}
        site={site}
        title={title}
        description={socialDescription}
        image={socialImage}
        url={canonicalPageUrl}
      />

      {isLiteMode && <BodyClassName className="notion-lite" />}
      {isDarkMode && <BodyClassName className="dark-mode" />}

      <NotionRenderer
        bodyClassName={cs(
          styles.notion,
          pageId === site.rootNotionPageId && "index-page"
        )}
        darkMode={isDarkMode}
        components={components}
        recordMap={recordMap}
        rootPageId={site.rootNotionPageId}
        rootDomain={site.domain}
        fullPage={!isLiteMode}
        previewImages={!!recordMap.preview_images}
        showCollectionViewDropdown={false}
        showTableOfContents={showTableOfContents}
        minTableOfContentsItems={minTableOfContentsItems}
        defaultPageIcon={config.defaultPageIcon}
        defaultPageCover={config.defaultPageCover}
        defaultPageCoverPosition={config.defaultPageCoverPosition}
        mapPageUrl={siteMapPageUrl}
        mapImageUrl={mapImageUrl}
        searchNotion={config.isSearchEnabled ? searchNotion : null}
        pageAside={pageAside}
        footer={footer}
      />

      <GitHubShareButton />
    </>
  );
}
