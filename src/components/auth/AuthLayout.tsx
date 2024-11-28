import { LeftOutlined } from "@ant-design/icons";
import { Drawer } from "antd";

import { DrawerStyles } from "antd/es/drawer/DrawerPanel";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

function AuthTitle() {
  return (
    <div>
      <Link href={"/"} passHref className="text-indigo-400 font-bold">
        <LeftOutlined className="mr-1" />
        뒤로가기
      </Link>

      <div className="my-4">
        <Image alt="스르륵" src="/logo.png" width={120} height={80} />
        <p className="mt-3">
          더 이상 자동 발송, 고민하지 마세요.
          <br />
          스르륵과 함께 자유를 누리세요.
        </p>
      </div>
    </div>
  );
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [visible, setVisible] = useState(false);
  const drawerStyles: DrawerStyles = {
    mask: {
      display: "none",
    },
    content: {
      boxShadow: "none",
      borderRadius: "0",
      padding: "0",
    },
    body: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      margin: "0 20px",
    },
  };

  // if window min width is less than 1024px, hide drawer
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex items-center lg:bg-gray-50 bg-white h-screen select-none">
      <div className="w-[calc(100vw-500px)] hidden justify-center lg:flex duration-150">
        <Image alt="스르륵" src="/main/auth.png" width={900} height={800} />
        <Drawer
          open={visible}
          closable={false}
          width={500}
          styles={drawerStyles}
        >
          <AuthTitle />
          {children}
        </Drawer>
      </div>
      <div className="w-full lg:hidden p-8">
        <AuthTitle />
        {children}
      </div>
    </div>
  );
}
