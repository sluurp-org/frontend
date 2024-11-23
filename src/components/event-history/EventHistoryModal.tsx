import {
  useEventHistory,
  useResetEventHistoryDownloadCount,
  useUpdateEventHistory,
} from "@/hooks/queries/useEventHistory";
import {
  Button,
  DatePicker,
  Modal,
  Popover,
  Switch,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import moment from "moment";
import {
  EventHistoryContent,
  EventHistoryStatusMap,
} from "@/types/event-history";
import InfoRow from "../InfoRow";
import {
  CalendarOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import errorHandler from "@/utils/error";
import Link from "next/link";
import { fetchDownloadFileContent } from "@/hooks/queries/useContent";
import { Card } from "../common/Card";
import { useEffect } from "react";
import AlimTalk from "../kakao/AlimTalk";

function Contents({
  data,
  workspaceId,
  refetch,
}: {
  data: EventHistoryContent[];
  workspaceId: number;
  refetch: () => Promise<unknown>;
}) {
  const { mutateAsync: resetDownloadCount } =
    useResetEventHistoryDownloadCount(workspaceId);

  const { mutateAsync: updateEventHistory, isLoading: isUpdateLoading } =
    useUpdateEventHistory(workspaceId);

  const downloadFile = async (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    a.click();
  };

  const handleDownloadFileContent = async (
    contentGroupId: number,
    contentId: number
  ) => {
    toast.promise(
      fetchDownloadFileContent(workspaceId, contentGroupId, contentId),
      {
        loading: "파일 다운로드 대기중...",
        success: ({ url }) => {
          downloadFile(url);
          return "파일 다운로드가 시작되었습니다.";
        },
        error: (error) => {
          errorHandler(error);
          return "파일 다운로드에 실패하였습니다.";
        },
      }
    );
  };

  const handleResetDownloadCount = async (eventHistoryContentId: number) => {
    toast.promise(resetDownloadCount(eventHistoryContentId), {
      loading: "다운로드 횟수 초기화 중...",
      success: () => {
        refetch();
        return "다운로드 횟수 초기화 완료";
      },
      error: (error) => {
        errorHandler(error);
        return "다운로드 횟수 초기화 실패";
      },
    });
  };

  const handleUpdateDisableDownload = async (
    eventHistoryContentId: number,
    checked: boolean
  ) => {
    toast.promise(
      updateEventHistory({
        eventHistoryContentId,
        dto: {
          disableDownload: checked,
        },
      }),
      {
        loading: "디지털 컨텐츠 열람 제한 수정 중...",
        success: () => {
          refetch();
          return "디지털 컨텐츠 열람 제한 수정 완료";
        },
        error: (error) => {
          errorHandler(error);
          return "디지털 컨텐츠 열람 제한 수정 실패";
        },
      }
    );
  };

  const handleUpdateExpiredAt = async (
    eventHistoryContentId: number,
    newExpiredAt: Date | undefined
  ) => {
    toast.promise(
      updateEventHistory({
        eventHistoryContentId,
        dto: { expiredAt: newExpiredAt },
      }),
      {
        loading: "다운로드 만료일 수정 중...",
        success: () => {
          refetch();
          return "다운로드 만료일 수정 완료";
        },
        error: (error) => {
          errorHandler(error);
          return "다운로드 만료일 수정 실패";
        },
      }
    );
  };

  const expandedRowRender = (record: EventHistoryContent) => {
    return (
      <div>
        <InfoRow className="flex-col" label="발송한 디지털 컨텐츠">
          <div className="flex items-center gap-2">
            <Link
              href={`/workspaces/${workspaceId}/content/${record.content.contentGroupId}`}
              className="text-indigo-500"
            >
              <Button size="small" icon={<FileOutlined />} type="link">
                디지털 컨텐츠 목록
              </Button>
            </Link>
            {record.content.type === "FILE" && (
              <Button
                icon={<DownloadOutlined />}
                type="primary"
                size="small"
                onClick={() =>
                  handleDownloadFileContent(
                    record.content.contentGroupId,
                    record.content.id
                  )
                }
              >
                다운로드
              </Button>
            )}
          </div>
        </InfoRow>
        <InfoRow className="flex-col" label="다운로드 횟수">
          <div className="flex flex-col items-start">
            {record.downloadCount || 0}회{" "}
            {record.downloadLimit &&
              record.downloadLimit > 0 &&
              `(${record.downloadLimit}회 다운로드 가능)`}
            <Button
              size="small"
              type="link"
              className="pl-0"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleResetDownloadCount(record.id)}
            >
              다운로드 횟수 초기화
            </Button>
          </div>
        </InfoRow>
        <InfoRow className="flex-col" label="다운로드 만료일">
          <div className="flex flex-col items-start">
            {record.expiredAt
              ? moment(record.expiredAt).format(
                  "YYYY년 MM월 DD일 HH시 mm분 ss초"
                )
              : "-"}
            <Popover
              title="다운로드 만료일 수정"
              content={
                <div>
                  <DatePicker
                    showTime
                    onChange={(value) =>
                      handleUpdateExpiredAt(
                        record.id,
                        value ? value.toDate() : undefined
                      )
                    }
                  />
                </div>
              }
              trigger={"click"}
            >
              <Button
                icon={<CalendarOutlined />}
                danger
                className="pl-0"
                type="link"
                size="small"
              >
                다운로드 만료일 수정
              </Button>
            </Popover>
          </div>
        </InfoRow>
        <InfoRow className="flex-col" label="최초 다운로드 일시">
          {record.firstDownloadAt
            ? moment(record.firstDownloadAt).format(
                "YYYY년 MM월 DD일 HH시 mm분 ss초"
              )
            : "-"}
        </InfoRow>
        <InfoRow className="flex-col" label="마지막 다운로드 일시">
          {record.lastDownloadAt
            ? moment(record.lastDownloadAt).format(
                "YYYY년 MM월 DD일 HH시 mm분 ss초"
              )
            : "-"}
        </InfoRow>
        <InfoRow className="flex-col" label="디지털 컨텐츠 열람 제한">
          <div className="flex items-center gap-2">
            <Switch
              checked={record.disableDownload}
              onChange={(checked) =>
                handleUpdateDisableDownload(record.id, checked)
              }
            />
            {record.disableDownload ? (
              <Tag color="red">다운로드 제한됨</Tag>
            ) : (
              <Tag color="green">다운로드 가능</Tag>
            )}
          </div>
        </InfoRow>
      </div>
    );
  };

  const columns: TableColumnsType<EventHistoryContent> = [
    {
      title: "아이디",
      key: "id",
      dataIndex: "id",
      width: 100,
    },
    {
      title: "내용",
      key: "content",
      dataIndex: "content",
      render: (_, obj) => obj.content.name || obj.content.text,
    },
    {
      title: "다운로드 비활성화",
      key: "disableDownload",
      dataIndex: "disableDownload",
      render: (v, obj) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={v}
            loading={isUpdateLoading}
            disabled={isUpdateLoading}
            onClick={() =>
              handleUpdateDisableDownload(obj.id, !obj.disableDownload)
            }
          />
          {v ? (
            <Tag color="red">다운로드 제한됨</Tag>
          ) : (
            <Tag color="green">다운로드 가능</Tag>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card className="p-0">
      <Table
        dataSource={data}
        scroll={{ x: 550 }}
        columns={columns}
        expandable={{
          expandRowByClick: true,
          rowExpandable: (record) => record !== undefined,
          expandedRowRender: (record) => expandedRowRender(record),
        }}
      />
    </Card>
  );
}

export default function EventHistoryModal({
  open,
  onClose,
  workspaceId,
  eventHistoryId,
}: {
  open: boolean;
  onClose: () => void;
  workspaceId: number;
  eventHistoryId: string;
}) {
  const { data, isLoading, error, isError, refetch } = useEventHistory(
    workspaceId,
    eventHistoryId
  );

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  if (isLoading) return null;
  if (isError) {
    toast.error(errorHandler(error));
    onClose();
    return null;
  }
  if (!data) {
    onClose();
    return null;
  }

  const messageVariables = data?.messageVariables;
  const keyToVarName = Object.fromEntries(
    Object.entries(messageVariables).map(([key, value]) => [
      key.slice(2, -1),
      value,
    ])
  );

  const messageContent = data.messageContent.replace(
    /#\{([^}]+)\}/g,
    (match, p1) => {
      const varName = keyToVarName[p1];
      return varName ? `${varName}` : match;
    }
  );

  return (
    <Modal
      destroyOnClose
      cancelButtonProps={{ hidden: true }}
      open={open}
      onClose={onClose}
      onCancel={onClose}
      onOk={onClose}
      title="이벤트 상세"
      width={data.contents.length > 0 ? "min-content" : 600}
    >
      <div className="flex gap-10 lg:flex-row flex-col lg:h-min-[800px]">
        <div className={`${data.contents.length > 0 && "lg:w-[300px]"} w-full`}>
          <InfoRow
            className="flex-col"
            label="발송 고유아이디"
            copyable
            copytext={data.id}
          >
            <div className="flex flex-col items-start">
              <p className="text-gray-500 text-[14px]">{data.id}</p>
              <p className="text-gray-500 text-[12px]">
                발송 오류 발생시 고객센터로 위 아이디를 알려주세요.
              </p>
            </div>
          </InfoRow>
          <InfoRow className="flex-col" label="발송 상태">
            {EventHistoryStatusMap[data.status]}
          </InfoRow>
          <InfoRow className="flex-col" label="발송 상태 메시지">
            {data.rawMessage || "-"}
          </InfoRow>
          <InfoRow className="flex-col" label="발송 예정 일시">
            {data.scheduledAt
              ? moment(data.scheduledAt).format("YYYY년 MM월 DD일 HH시 mm분")
              : "-"}
          </InfoRow>
          <InfoRow className="flex-col" label="발송 일시">
            {data.processedAt
              ? moment(data.processedAt).format(
                  "YYYY년 MM월 DD일 HH시 mm분 ss초"
                )
              : "-"}
          </InfoRow>
          {data.eventMessage && (
            <InfoRow className="flex-col" label="발송 메시지 상세보기">
              <Link
                href={`/workspaces/${workspaceId}/message/${data.eventMessage.id}`}
                className="text-indigo-500"
              >
                <MessageOutlined className="mr-1" />
                {data.eventMessage.name}
              </Link>
            </InfoRow>
          )}
          <InfoRow label="발송 메시지" className="flex-col">
            <AlimTalk content={messageContent} className="mt-3" />
          </InfoRow>
        </div>
        {data.contents.length > 0 && (
          <div>
            <p className="font-semibold text-indigo-500 text-[16px]">
              발송한 디지털 컨텐츠
            </p>
            <p className="text-gray-500 text-[14px] mb-3">
              총 {data.contents.length}개의 디지털 컨텐츠를 발송하였습니다.
            </p>
            <div className="lg:overflow-y-auto max-w-[600px] h-[calc(100%-60px)] rounded-lg">
              <Contents
                data={data.contents}
                workspaceId={workspaceId}
                refetch={refetch}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
