import Header from "@/components/Header";
import Component from "@/components/Container";
import { Button, Popover, Space, Table, Tag } from "antd";
import { useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import errorHandler from "@/utils/error";
import {
  MessageFilters,
  MessageListItem,
  MessageSendType,
  MessageSendTypeMap,
  MessageType,
  MessageTypeMap,
} from "@/types/message";
import { useMessages } from "@/hooks/queries/useMessage";
import { Card } from "@/components/common/Card";
import { useChannel } from "@/contexts/ChannelContext";
import { FormOutlined, MessageOutlined } from "@ant-design/icons";

export default function MessageList() {
  const router = useRouter();
  const [filters, setFilters] = useState<MessageFilters>({ page: 1, size: 15 });
  const ChannelService = useChannel();

  const workspaceId = Number(router.query.id);
  const { data, isLoading, error } = useMessages(workspaceId, filters);

  if (error) {
    errorHandler(error, router);
  }

  const columns = [
    {
      title: "아이디",
      dataIndex: "id",
      key: "id",
      width: "100px",
    },
    {
      title: "유형",
      dataIndex: "sendType",
      key: "sendType",
      width: "100px",
      render: (sendType: MessageSendType, obj: MessageListItem) => (
        <Space size={0}>
          <Tag color="green">
            {MessageSendTypeMap[sendType] || "알 수 없음"}
          </Tag>
          <Tag color="blue">{MessageTypeMap[obj.type] || "알 수 없음"}</Tag>
        </Space>
      ),
    },
    {
      title: "메세지 제목",
      dataIndex: "name",
      key: "name",
    },
  ];

  if (isLoading) return <Loading />;
  if (error) return <div>Error</div>;

  const onTemplateCreateRequestClick = () => {
    const channelMessage = `메세지 제작 대행 요청을 위해\n아래 정보를 입력해주세요.\n\n워크스페이스 아이디: ${workspaceId} (변경 금지)\n요청자명:\n전화번호:\n메세지에 들어가야할 내용:`;

    ChannelService.openChat(undefined, channelMessage);
  };

  return (
    <Component>
      <Header title="메세지 목록" description="모든 스토어의 메세지 목록" />

      <div className="mb-3 flex gap-2">
        <Button
          icon={<MessageOutlined />}
          type="primary"
          onClick={() =>
            router.push(`/workspaces/${workspaceId}/message/create`)
          }
        >
          메세지 생성
        </Button>
        <Popover
          trigger={"hover"}
          content={
            <p className="whitespace-pre-line">
              메세지에 들어가야 하는 내용만 전달해주시면{"\n"}카카오
              가이드라인에 따라 알림톡을 제작 및 검수 대행해주는 서비스입니다.
            </p>
          }
        >
          <Button
            icon={<FormOutlined />}
            type="primary"
            onClick={onTemplateCreateRequestClick}
          >
            메세지 제작 대행 요청
          </Button>
        </Popover>
      </div>
      <Card className="p-0">
        <Table
          scroll={{ x: "700px" }}
          columns={columns}
          dataSource={data?.nodes || []}
          rowKey="id"
          rowClassName={"cursor-pointer"}
          onRow={(record) => ({
            onClick: () =>
              router.push(`/workspaces/${workspaceId}/message/${record.id}`),
          })}
          pagination={{
            className: "pr-4",
            current: filters.page,
            pageSize: filters.size,
            total: data?.total,
            showSizeChanger: true,
            pageSizeOptions: ["15", "20", "30", "40"],
            showTotal: (total) => `총 ${total} 건`,
            onChange: (page, pageSize) =>
              setFilters({ ...filters, page, size: pageSize }),
          }}
        />
      </Card>
    </Component>
  );
}
