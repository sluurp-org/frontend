import { useState } from "react";
import { useRouter } from "next/router";
import {
  FlagOutlined,
  HomeOutlined,
  LogoutOutlined,
  MessageOutlined,
  ProductOutlined,
  ReadOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TruckOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { ConfigProvider, Menu, MenuProps, Drawer, Popover } from "antd";
import Link from "next/link";
import Image from "next/image";

type MenuItem = Required<MenuProps>["items"][number];

// 메뉴 항목 정의
const getItems = (workspaceId?: string): MenuItem[] => [
  {
    key: "workspace-group",
    label: "워크스페이스",
    type: "group",
    className: !workspaceId ? "hidden" : "",
    children: [
      {
        key: `/workspaces/${workspaceId}`,
        label: (
          <Popover content="워크스페이스 홈으로 이동" placement="right">
            홈
          </Popover>
        ),
        icon: <HomeOutlined />,
      },
      {
        key: `/workspaces/${workspaceId}/order`,
        label: (
          <Popover
            content="워크스페이스의 주문을 확인합니다."
            placement="right"
          >
            주문
          </Popover>
        ),
        icon: <ShoppingCartOutlined />,
      },
      {
        key: "send-manage",
        label: (
          <Popover content="자동 발송 설정 메뉴" placement="right">
            자동발송 설정
          </Popover>
        ),
        icon: <TruckOutlined />,
        children: [
          {
            key: `/workspaces/${workspaceId}/event`,
            label: (
              <Popover content="자동 발송 메세지 목록입니다." placement="right">
                자동 발송 목록
              </Popover>
            ),
            icon: <FlagOutlined />,
          },
          {
            key: `/workspaces/${workspaceId}/product`,
            label: (
              <Popover
                content="상품을 관리하고 발송할 메세지를 연결합니다."
                placement="right"
              >
                상품 관리
              </Popover>
            ),
            icon: <ProductOutlined />,
          },
          {
            key: `/workspaces/${workspaceId}/message`,
            label: (
              <Popover
                content="발송할 메세지를 생성 또는 관리합니다."
                placement="right"
              >
                메세지 관리
              </Popover>
            ),
            icon: <MessageOutlined />,
          },
          {
            key: `/workspaces/${workspaceId}/content`,
            label: (
              <Popover content="디지털 컨텐츠를 관리합니다" placement="right">
                디지털 컨텐츠 관리
              </Popover>
            ),
            icon: <ReadOutlined />,
          },
        ],
      },
      {
        key: `/workspaces/${workspaceId}/store`,
        label: (
          <Popover content="스토어를 연결하거나 관리합니다" placement="right">
            스토어 관리
          </Popover>
        ),
        icon: <ShopOutlined />,
      },
      {
        key: `/workspaces/${workspaceId}/setting`,
        label: (
          <Popover content="워크스페이스 설정" placement="right">
            워크스페이스 설정
          </Popover>
        ),
        icon: <SettingOutlined />,
      },
    ],
  },
  {
    key: "etc",
    label: workspaceId ? "기타" : "",
    type: "group",
    children: [
      {
        key: "/workspaces",
        label: (
          <Popover content="워크스페이스 목록 보기" placement="right">
            워크스페이스 목록
          </Popover>
        ),
        icon: <HomeOutlined />,
      },
      {
        key: "/profile",
        label: (
          <Popover content="내 프로필 페이지로 이동" placement="right">
            내 프로필
          </Popover>
        ),
        icon: <UserOutlined />,
      },
      {
        key: "/auth/logout",
        label: (
          <Popover content="로그아웃합니다" placement="right">
            로그아웃
          </Popover>
        ),
        icon: <LogoutOutlined />,
      },
    ],
  },
];

function Sidebar() {
  const [isDrawerOpen, setDrawerOpen] = useState(false); // 햄버거 메뉴 상태
  const router = useRouter();
  const { id } = router.query; // workspaceId
  const currentPath = router.asPath;

  // 메뉴 클릭 핸들러
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const path = e.key.replace("[id]", id as string);
    router.push(path);
    setDrawerOpen(false); // 모바일에서는 메뉴 클릭 시 드로어 닫기
  };

  // 현재 경로를 기준으로 열려야 할 키 확인
  const getOpenKeys = (): string[] | undefined => {
    const workspacePaths = [
      `/workspaces/${id}/event`,
      `/workspaces/${id}/product`,
      `/workspaces/${id}/message`,
      `/workspaces/${id}/content`,
    ];
    const matchingPath = workspacePaths.find((path) =>
      currentPath.startsWith(path)
    );
    return matchingPath ? ["send-manage"] : undefined;
  };

  // 선택된 키를 하위 주소에 맞게 처리
  const getSelectedKeys = (): string[] => {
    const basePaths = [
      `/workspaces/${id}/event`,
      `/workspaces/${id}/product`,
      `/workspaces/${id}/message`,
      `/workspaces/${id}/content`,
    ];

    const matchingBasePath = basePaths.find((path) =>
      currentPath.startsWith(path)
    );

    if (matchingBasePath) {
      return [matchingBasePath];
    }

    return [currentPath];
  };

  return (
    <>
      <div className="sm:hidden max-w-screen border-b px-5 py-4">
        <div className="flex items-center justify-between">
          <Link href={"/workspaces"}>
            <Image
              alt="스르륵"
              src="/logo.png"
              width={50}
              height={60}
              className="cursor-pointer"
            />
          </Link>
          <MenuOutlined
            className="text-xl cursor-pointer"
            onClick={() => setDrawerOpen(true)}
          />
        </div>
      </div>

      <div className="hidden sm:block sm:h-screen border-gray-100 sm:border-none sm:shadow-lg sm:w-[270px]">
        <div className="flex flex-col justify-between sm:pt-9 px-7 mb-3">
          <Link href={"/workspaces"}>
            <Image
              alt="스르륵"
              src="/logo.png"
              width={60}
              height={80}
              className="cursor-pointer"
            />
          </Link>
        </div>

        {/* 메뉴 */}
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                groupTitleFontSize: 13,
                fontSize: 14,
                iconMarginInlineEnd: 15,
                iconSize: 17,
              },
            },
          }}
        >
          <Menu
            className="border-none px-3"
            selectedKeys={getSelectedKeys()} // 현재 경로를 선택된 키로 설정
            openKeys={getOpenKeys()} // 동적으로 열려야 할 키 계산
            onClick={handleMenuClick} // 클릭 핸들러
            mode="inline"
            items={getItems(id as string | undefined)}
          />
        </ConfigProvider>
      </div>

      {/* 모바일 드로어 */}
      <Drawer
        title="메뉴"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={isDrawerOpen}
        className="sm:hidden"
      >
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                groupTitleFontSize: 13,
                fontSize: 14,
                iconMarginInlineEnd: 15,
                iconSize: 17,
              },
            },
          }}
        >
          <Menu
            selectedKeys={getSelectedKeys()} // 현재 경로를 선택된 키로 설정
            openKeys={getOpenKeys()} // 동적으로 열려야 할 키 계산
            onClick={handleMenuClick} // 클릭 핸들러
            mode="inline"
            items={getItems(id as string | undefined)}
          />
        </ConfigProvider>
      </Drawer>
    </>
  );
}

export default Sidebar;
