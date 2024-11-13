import {
  fetchDownloadFileContent,
  useContents,
  useDeleteContent,
  useUpdateContent,
} from "@/hooks/queries/useContent";
import { ContentDto, ContentFilters, ContentType } from "@/types/content";
import { Button, Popover, Table, Tag, Typography } from "antd";
import Loading from "../Loading";
import errorHandler from "@/utils/error";
import router from "next/router";
import { useState } from "react";
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import CreateContentModal from "./CreateContentModal";
import toast from "react-hot-toast";
import CreateFileContentModal from "./CreateFileContentModal";
import Error from "@/components/Error";

export default function ContentTable({
  workspaceId,
  contentGroupId,
  contentType,
}: {
  workspaceId: number;
  contentGroupId: number;
  contentType: ContentType;
}) {
  const [filter, setFilter] = useState<ContentFilters>({
    page: 1,
    size: 10,
  });
  const [open, setOpen] = useState(false);
  const { data, isLoading, error } = useContents(
    workspaceId,
    contentGroupId,
    filter
  );
  const { mutateAsync: deleteContent } = useDeleteContent(
    workspaceId,
    contentGroupId
  );
  const { mutateAsync: updateContent } = useUpdateContent(
    workspaceId,
    contentGroupId
  );

  if (!data) return <Loading isFullPage={false} />;

  if (error) {
    toast.error(errorHandler(error));
    return <Error />;
  }

  const handleDeleteContent = async (id: number) => {
    toast.promise(deleteContent(id), {
      loading: "디지털 컨텐츠를 삭제하는 중입니다.",
      success: () => {
        return "디지털 컨텐츠가 삭제되었습니다.";
      },
      error: (error) => {
        return errorHandler(error);
      },
    });
  };

  const handleUpdateContent = async (contentId: number, text: string) => {
    toast.promise(updateContent({ contentId, dto: { text } }), {
      loading: "디지털 컨텐츠를 수정하는 중입니다.",
      success: () => {
        return "디지털 컨텐츠가 수정되었습니다.";
      },
      error: (error) => {
        return errorHandler(error);
      },
    });
  };

  const downloadFile = async (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    a.click();
  };

  const handleDownloadFileContent = async (id: number) => {
    toast.promise(fetchDownloadFileContent(workspaceId, contentGroupId, id), {
      loading: "파일 다운로드 대기중...",
      success: ({ url }) => {
        downloadFile(url);
        return "파일 다운로드가 시작되었습니다.";
      },
      error: (error) => {
        return errorHandler(error);
      },
    });
  };

  const columns = [
    {
      title: "아이디",
      dataIndex: "id",
      width: 110,
    },
    {
      title: "내용",
      dataIndex: "text",
      render: (text: string, content: ContentDto) => {
        if (contentType === "FILE") {
          return (
            <div className="flex items-center gap-3">
              <Typography.Text>{content.name}</Typography.Text>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadFileContent(content.id)}
              >
                다운로드
              </Button>
            </div>
          );
        }

        return (
          <Typography.Text
            editable={{
              onChange: (value: string) =>
                handleUpdateContent(content.id, value),
              onCancel: () => {},
            }}
          >
            {text}
          </Typography.Text>
        );
      },
    },
    {
      title: "사용여부",
      dataIndex: "used",
      render: (used: boolean) =>
        used ? <Tag color="green">사용</Tag> : <Tag color="red">미사용</Tag>,
      width: 100,
    },
    {
      title: "삭제",
      dataIndex: "delete",
      render: (_: number, content: ContentDto) => (
        <Popover
          trigger={"click"}
          title="삭제"
          content={
            <div>
              <p>정말로 삭제하시겠습니까?</p>
              <Button
                type="primary"
                danger
                disabled={content.used}
                onClick={() => handleDeleteContent(content.id)}
                className="mt-3 w-full"
              >
                삭제
              </Button>
            </div>
          }
        >
          <Button type="primary" danger disabled={content.used}>
            <DeleteOutlined />
          </Button>
        </Popover>
      ),
      width: 100,
    },
  ];

  return (
    <>
      {contentType === "FILE" ? (
        <CreateFileContentModal
          open={open}
          onClose={() => setOpen(false)}
          workspaceId={workspaceId}
          contentGroupId={contentGroupId}
        />
      ) : (
        <CreateContentModal
          open={open}
          onClose={() => setOpen(false)}
          workspaceId={workspaceId}
          contentGroupId={contentGroupId}
          contentType={contentType}
        />
      )}
      <div className="flex mb-3 gap-3 items-center">
        <Button className="" type="primary" onClick={() => setOpen(true)}>
          디지털 컨텐츠 추가
        </Button>
      </div>
      <Table
        dataSource={data.nodes}
        loading={isLoading}
        scroll={{ x: 450 }}
        pagination={{
          total: data.total,
          current: filter.page,
          pageSize: filter.size,
          pageSizeOptions: [10, 20, 30, 40, 50],
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setFilter({ page, size: pageSize });
          },
          showTotal: (total) => `총 ${total}개의 디지털 컨텐츠가 있습니다.`,
        }}
        columns={columns}
      />
    </>
  );
}
