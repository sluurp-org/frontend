import {
  useEventHistory,
  useResetEventHistoryDownloadCount,
  useUpdateEventHistory,
} from "@/hooks/queries/useEventHistory";
import Loading from "../Loading";
import Error from "../Error";
import { Button, DatePicker, Form, Modal, Switch, Tag, TimePicker } from "antd";
import moment from "moment";
import { EventHistoryStatusMap } from "@/types/event-history";
import InfoRow from "../InfoRow";
import { ReloadOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import errorHandler from "@/utils/error";

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
  const { data, isLoading, isError } = useEventHistory(
    workspaceId,
    eventHistoryId
  );

  const { mutateAsync: resetDownloadCount } = useResetEventHistoryDownloadCount(
    workspaceId,
    eventHistoryId
  );

  const { mutateAsync: updateEventHistory } = useUpdateEventHistory(
    workspaceId,
    eventHistoryId
  );

  if (isLoading) return <Loading isFullPage={false} />;
  if (isError) return <Error isFullPage={false} />;
  if (!data)
    return <Error isFullPage={false} message="데이터를 불러올 수 없습니다." />;

  const handleUpdateEventHistory = async () => {
    toast.promise(
      updateEventHistory({
        disableDownload: !data.disableDownload,
      }),
      {
        loading: "이벤트 상태 수정 중...",
        success: "이벤트 상태 수정 완료",
        error: (error) => {
          errorHandler(error);
          return "이벤트 상태 수정 실패";
        },
      }
    );
  };

  const handleResetDownloadCount = async () => {
    toast.promise(resetDownloadCount(), {
      loading: "다운로드 횟수 초기화 중...",
      success: "다운로드 횟수 초기화 완료",
      error: (error) => {
        errorHandler(error);
        return "다운로드 횟수 초기화 실패";
      },
    });
  };

  const handleUpdateExpiredAt = async (newExpiredAt: Date) => {
    toast.promise(
      updateEventHistory({
        expiredAt: newExpiredAt,
      }),
      {
        loading: "다운로드 만료일 수정 중...",
        success: "다운로드 만료일 수정 완료",
        error: (error) => {
          errorHandler(error);
          return "다운로드 만료일 수정 실패";
        },
      }
    );
  };

  return (
    <Modal
      destroyOnClose
      open={open}
      onClose={onClose}
      onCancel={onClose}
      onOk={onClose}
      title="이벤트 상세"
    >
      <InfoRow label="발송 상태">{EventHistoryStatusMap[data.status]}</InfoRow>
      <InfoRow label="발송 메세지">{data.message || "-"}</InfoRow>
      <InfoRow label="발송 일시">
        {data.processedAt
          ? moment(data.processedAt).format("YYYY년 MM월 DD일 HH시 mm분 ss초")
          : "-"}
      </InfoRow>
      <InfoRow label="다운로드 만료일">
        {data.expiredAt
          ? moment(data.expiredAt).format("YYYY년 MM월 DD일 HH시 mm분 ss초")
          : "-"}
      </InfoRow>
      <InfoRow label="다운로드 횟수">
        <div>
          <p>{data.downloadCount}회</p>
          <Button
            className="mt-3"
            type="primary"
            danger
            onClick={handleResetDownloadCount}
            icon={<ReloadOutlined />}
          >
            다운로드 횟수 초기화
          </Button>
        </div>
      </InfoRow>
      <InfoRow label="다운로드 제한">
        <Switch
          checked={data.disableDownload}
          onChange={handleUpdateEventHistory}
          checkedChildren="다운로드 제한됨"
          unCheckedChildren="다운로드 가능"
        />
      </InfoRow>
    </Modal>
  );
}
