import {
  useEventHistory,
  useResetEventHistoryDownloadCount,
  useUpdateEventHistory,
} from "@/hooks/queries/useEventHistory";
import Loading from "../Loading";
import Error from "../Error";
import { Button, DatePicker, Modal, Popover, Switch, Tag } from "antd";
import moment from "moment";
import { EventHistory, EventHistoryStatusMap } from "@/types/event-history";
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

function ContentItem({
  item,
  index,
  workspaceId,
  refetch,
}: {
  item: EventHistory["contents"][number];
  index: number;
  workspaceId: number;
  refetch: () => Promise<unknown>;
}) {
  const { mutateAsync: resetDownloadCount } = useResetEventHistoryDownloadCount(
    workspaceId,
    item.id
  );

  const { mutateAsync: updateEventHistory } = useUpdateEventHistory(
    workspaceId,
    item.id
  );

  const downloadFile = async (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    a.click();
  };

  const handleDownloadFileContent = async (id: number) => {
    toast.promise(
      fetchDownloadFileContent(workspaceId, item.content.contentGroupId, id),
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

  const handleResetDownloadCount = async () => {
    toast.promise(resetDownloadCount(), {
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

  const handleUpdateDisableDownload = async (checked: boolean) => {
    toast.promise(
      updateEventHistory({
        disableDownload: checked,
      }),
      {
        loading: "컨텐츠 열람 제한 수정 중...",
        success: () => {
          refetch();
          return "컨텐츠 열람 제한 수정 완료";
        },
        error: (error) => {
          errorHandler(error);
          return "컨텐츠 열람 제한 수정 실패";
        },
      }
    );
  };

  const handleUpdateExpiredAt = async (newExpiredAt: Date) => {
    toast.promise(
      updateEventHistory({
        expiredAt: newExpiredAt,
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

  return (
    <div key={item.id} className="flex flex-col gap-2">
      <Card>
        <p className="font-semibold text-indigo-500 text-[16px]">
          컨텐츠 #{index + 1}
        </p>
        <InfoRow label="발송한 컨텐츠">
          <div className="flex items-center gap-2">
            <p>{item.content.name || item.content.text || "-"}</p>
            <Link
              href={`/workspaces/${workspaceId}/content/${item.content.contentGroupId}`}
              className="text-indigo-500"
            >
              <Button size="small" icon={<FileOutlined />} type="link">
                컨텐츠 목록
              </Button>
            </Link>
            {item.content.type === "FILE" && (
              <Button
                icon={<DownloadOutlined />}
                type="primary"
                size="small"
                onClick={() => handleDownloadFileContent(item.id)}
              >
                다운로드
              </Button>
            )}
          </div>
        </InfoRow>
        <InfoRow label="다운로드 횟수" className="pt-2">
          <div className="flex flex-col items-start">
            {item.downloadCount || 0}회{" "}
            {item.downloadLimit &&
              item.downloadLimit > 0 &&
              `(${item.downloadLimit}회 다운로드 가능)`}
            <Button
              size="small"
              type="link"
              className="pl-0"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleResetDownloadCount()}
            >
              다운로드 횟수 초기화
            </Button>
          </div>
        </InfoRow>
        <InfoRow label="다운로드 만료일" className="pt-2">
          <div className="flex flex-col items-start">
            {item.expiredAt
              ? moment(item.expiredAt).format("YYYY년 MM월 DD일 HH시 mm분 ss초")
              : "-"}
            <Popover
              title="다운로드 만료일 수정"
              content={
                <div>
                  <DatePicker
                    showTime
                    onChange={(value) => handleUpdateExpiredAt(value.toDate())}
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
        <InfoRow label="최초 다운로드 일시" className="pt-2">
          {item.firstDownloadAt
            ? moment(item.firstDownloadAt).format(
                "YYYY년 MM월 DD일 HH시 mm분 ss초"
              )
            : "-"}
        </InfoRow>
        <InfoRow label="마지막 다운로드 일시" className="pt-2">
          {item.lastDownloadAt
            ? moment(item.lastDownloadAt).format(
                "YYYY년 MM월 DD일 HH시 mm분 ss초"
              )
            : "-"}
        </InfoRow>
        <InfoRow label="컨텐츠 열람 제한" className="pt-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={item.disableDownload}
              onChange={(checked) => handleUpdateDisableDownload(checked)}
            />
            {item.disableDownload ? (
              <Tag color="red">다운로드 제한됨</Tag>
            ) : (
              <Tag color="green">다운로드 가능</Tag>
            )}
          </div>
        </InfoRow>
      </Card>
    </div>
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
  const { data, isLoading, isError, refetch } = useEventHistory(
    workspaceId,
    eventHistoryId
  );

  if (isLoading) return <Loading isFullPage={false} />;
  if (isError) return <Error isFullPage={false} />;
  if (!data)
    return <Error isFullPage={false} message="데이터를 불러올 수 없습니다." />;

  return (
    <Modal
      destroyOnClose
      cancelButtonProps={{ hidden: true }}
      open={open}
      onClose={onClose}
      onCancel={onClose}
      onOk={onClose}
      title="이벤트 상세"
      width={600}
    >
      <InfoRow label="발송 고유아이디" copyable copytext={data.id}>
        <div className="flex flex-col items-start">
          <p className="text-gray-500 text-[14px]">{data.id}</p>
          <p className="text-gray-500 text-[12px]">
            발송 오류 발생시 고객센터로 위 아이디를 알려주세요.
          </p>
        </div>
      </InfoRow>
      <InfoRow label="발송 상태">{EventHistoryStatusMap[data.status]}</InfoRow>
      <InfoRow label="발송 상태 메세지">{data.message || "-"}</InfoRow>
      <InfoRow label="발송 일시">
        {data.processedAt
          ? moment(data.processedAt).format("YYYY년 MM월 DD일 HH시 mm분 ss초")
          : "-"}
      </InfoRow>
      {data.eventMessage && (
        <InfoRow label="발송 메세지 상세보기">
          <Link
            href={`/workspace/${workspaceId}/message/${data.eventMessage.id}`}
            className="text-indigo-500"
          >
            <MessageOutlined className="mr-1" />
            {data.eventMessage.name}
          </Link>
        </InfoRow>
      )}
      <InfoRow label="발송 메세지">
        <p className="whitespace-pre-wrap p-3 bg-gray-100 rounded-md">
          {data.messageContent || "-"}
        </p>
      </InfoRow>

      <div className="mt-6">
        <p className="font-semibold text-indigo-500 text-[16px] mb-1">
          발송 컨텐츠
        </p>
        <p className="text-gray-500 text-[14px] mb-3">
          총 {data.contents.length}개의 컨텐츠를 발송하였습니다.
        </p>
        <div className="flex flex-col gap-3">
          {data.contents.map((item, index) => (
            <ContentItem
              key={item.id}
              item={item}
              index={index}
              workspaceId={workspaceId}
              refetch={refetch}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}
