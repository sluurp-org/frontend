import { useRouter } from "next/router";
import Component from "@/components/Container";
import { Tabs, TabsProps } from "antd";
import CreateKakaoMessage from "@/components/message/CreateKakaoMessage";
import Header from "@/components/Header";
import { MailOutlined, MessageOutlined } from "@ant-design/icons";
import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";

export default function WorkspaceMessageCreate() {
  const router = useRouter();
  const workspaceId = parseInt(router.query.id as string, 10);

  const items: TabsProps["items"] = [
    {
      icon: <MessageOutlined />,
      key: "kakao",
      label: "카카오 알림톡",
      children: <CreateKakaoMessage workspaceId={workspaceId} />,
    },
    // {
    //   icon: <MailOutlined />,
    //   key: "email",
    //   label: "이메일",
    //   children: "",
    // },
  ];

  return (
    <Component>
      <Header title="메시지 생성" description="워크스페이스 메시지 생성" />
      <Tabs
        size="large"
        addIcon={true}
        items={items}
        activeKey={router.query.tab as string}
        onChange={(key) => {
          router.push({
            pathname: router.pathname,
            query: { ...router.query, tab: key },
          });
        }}
      />
    </Component>
  );
}
