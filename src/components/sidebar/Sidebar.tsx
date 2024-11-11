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
  TruckOutlined,
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
        <Image
          alt="스르륵"
          src="/logo.png"
          width={60}
          height={80}
          onClick={() => router.push("/workspaces")}
          className="cursor-pointer"
        />
        <MenuOutlined
          className="sm:hidden cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <div
        className={`sm:block w-full shadow-lg sm:shadow-none absolute sm:static z-50 bg-white ${
          isOpen ? "" : "hidden"
        }`}
      >
        {isWorkspace && (
          <>
            <SidebarButton
              id="home-sidebar-button"
              setClose={setClose}
              icon={<HomeOutlined />}
              text="홈"
            />
            <SidebarButton
              id="order-sidebar-button"
              setClose={setClose}
              url="order"
              icon={<ShoppingCartOutlined />}
              text="주문"
            />
            <SidebarButton
              id="product-sidebar-button"
              setClose={setClose}
              url="product"
              icon={<ProductOutlined />}
              text="상품"
            />
            <SidebarButton
              id="message-sidebar-button"
              setClose={setClose}
              url="message"
              icon={<MessageOutlined />}
              text="메세지"
            />
            <SidebarButton
              id="order-sidebar-button"
              setClose={setClose}
              url="event"
              icon={<TruckOutlined />}
              text="자동발송 설정"
            />
            <SidebarButton
              id="content-sidebar-button"
              setClose={setClose}
              url="content"
              icon={<ReadOutlined />}
              text="디지털 컨텐츠"
            />
            <SidebarButton
              id="store-sidebar-button"
              setClose={setClose}
              url="store"
              icon={<ShopOutlined />}
              text="스토어 연동"
            />
            <SidebarButton
              id="setting-sidebar-button"
              setClose={setClose}
              url="setting"
              icon={<SettingOutlined />}
              text="워크스페이스 설정"
            />
            <div className="border-b-2 border-gray-100 mx-9" />
          </>
        )}
        <SidebarButton
          id="workspace-sidebar-button"
          setClose={setClose}
          url="/workspaces"
          icon={<HomeOutlined />}
          text="워크스페이스"
        />
        <SidebarButton
          id="profile-sidebar-button"
          setClose={setClose}
          url="/profile"
          icon={<UserOutlined />}
          text="내 프로필"
        />
        <SidebarButton
          id="logout-sidebar-button"
          setClose={setClose}
          url="/auth/logout"
          icon={<LogoutOutlined />}
          text="로그아웃"
        />
      </div>
    </div>
  );
}
