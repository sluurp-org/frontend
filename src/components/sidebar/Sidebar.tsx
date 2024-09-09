import {
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  MessageOutlined,
  ProductOutlined,
  ReadOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import SidebarButton from "./SidebarButton";

export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const pattern = /^\/workspaces\/[^\/]+\/?.*$/;
  const isWorkspace = pattern.test(router.pathname);
  const setClose = () => setIsOpen(false);

  return (
    <div className="sm:h-screen border-gray-100 sm:border-none sm:shadow-lg sm:w-[270px] w-screen">
      <div className="flex justify-between sm:pt-9 px-9 py-5">
        <Image alt="스르륵" src="/logo.png" width={60} height={80} />
        <MenuOutlined
          className="sm:hidden cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <div
        className={`px-9 sm:block w-full shadow-lg sm:shadow-none absolute sm:static bg-white ${
          isOpen ? "" : "hidden"
        }`}
      >
        {isWorkspace && (
          <>
            <SidebarButton
              setClose={setClose}
              url="order"
              icon={<ShoppingCartOutlined />}
              text="주문"
            />
            <SidebarButton
              setClose={setClose}
              url="product"
              icon={<ProductOutlined />}
              text="상품"
            />
            <SidebarButton
              setClose={setClose}
              url="message"
              icon={<MessageOutlined />}
              text="메세지"
            />
            <SidebarButton
              setClose={setClose}
              url="content"
              icon={<ReadOutlined />}
              text="발송 컨텐츠"
            />
            <SidebarButton
              setClose={setClose}
              url="store"
              icon={<ShopOutlined />}
              text="스토어 연동"
            />
            <SidebarButton
              setClose={setClose}
              url="setting"
              icon={<SettingOutlined />}
              text="워크스페이스 설정"
            />
            <div className="border-b-2 border-gray-100" />
          </>
        )}
        <SidebarButton
          setClose={setClose}
          url="/workspaces"
          icon={<HomeOutlined />}
          text="워크스페이스"
        />
        <SidebarButton
          setClose={setClose}
          url="/profile"
          icon={<UserOutlined />}
          text="내 프로필"
        />
        <SidebarButton
          setClose={setClose}
          url="/auth/logout"
          icon={<LogoutOutlined />}
          text="로그아웃"
        />
      </div>
    </div>
  );
}
