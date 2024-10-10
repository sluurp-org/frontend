import { useRouter } from "next/router";

export default function SidebarButton({
  icon,
  text,
  url,
  setClose,
}: {
  icon: JSX.Element;
  text: string;
  url: string;
  setClose: () => void;
}) {
  const router = useRouter();
  const currentUrl = router.pathname;
  const isActive =
    currentUrl.split("/").slice(-1)[0] === url.split("/").slice(-1)[0];
  const workspaceId = router.query.id;

  const onClick = () => {
    url.startsWith("/")
      ? router.push(url)
      : router.push(`/workspaces/${workspaceId}/${url}`);
    setClose();
  };

  return (
    <div
      className={`flex items-center w-auto space-x-4 my-3 hover:bg-gray-100 pl-4 mx-9 focus:bg-gray-400 rounded-lg py-3 cursor-pointer select-none duration-75 ${
        isActive ? "bg-gray-100" : ""
      }`}
      onClick={onClick}
    >
      {icon}
      <p>{text}</p>
    </div>
  );
}
