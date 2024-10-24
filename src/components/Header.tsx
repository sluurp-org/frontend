import Head from "next/head";

export default function Header({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const windowTitle = `스르륵 | ${title}`;

  return (
    <>
      <Head>
        <title>{windowTitle}</title>
      </Head>
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-400 mt-3 mb-6">{description}</p>
    </>
  );
}
