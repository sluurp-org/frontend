import Header from "@/components/Header";
import Component from "@/components/Container";
import { useRouter } from "next/router";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import {
  useContentGroup,
  useDeleteContentGroup,
  useUpdateContentGroup,
} from "@/hooks/queries/useContent";
import Loading from "@/components/Loading";
import errorHandler from "@/utils/error";
import InfoRow from "@/components/InfoRow";
import { ContentType } from "@/types/content";
import { Button, Checkbox, Popover, Typography } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ContentTable from "@/components/content/ContentTable";
import DurationInput from "@/components/common/DurationInput";
import { Card } from "@/components/common/Card";

export default function ContentDetailPage() {
  const router = useRouter();

  const workspaceId = Number(router.query.id);
  const contentId = Number(router.query.contentId);
  const { data, isLoading, error } = useContentGroup(workspaceId, contentId);
  const [editingContentName, setEditingContentName] = useState(false);
  const [editingDownloadLimit, setEditingDownloadLimit] = useState(false);
  const [enableExpireMinute, setEnableExpireMinute] = useState<boolean>(false);
  const [expireMinute, setExpireMinute] = useState(0);
  const { mutateAsync: updateContentGroup } = useUpdateContentGroup(
    workspaceId,
    contentId
  );
  const { mutateAsync: deleteContentGroup } =
    useDeleteContentGroup(workspaceId);

  useEffect(() => {
    if (data) {
      const isExpireIsNtNull = data.expireMinute !== null;
      setEnableExpireMinute(isExpireIsNtNull);
      setExpireMinute(data.expireMinute);
    }
  }, [data]);

  if (isLoading || !data) return <Loading />;
  if (error) {
    errorHandler(error, router);
    router.back();
  }

  const handleContentNameChange = (value: string) => {
    toast.promise(updateContentGroup({ name: value }), {
      loading: "디지털 컨텐츠명 수정 중...",
      success: "디지털 컨텐츠명 수정 완료",
      error: "디지털 컨텐츠명 수정 실패",
    });
    setEditingContentName(false);
  };

  const handleDownloadLimitChange = (value: string) => {
    if (isNaN(Number(value))) {
      toast.error("다운로드 제한 횟수는 숫자로 입력해주세요.");
      return;
    }

    if (Number(value) < 1 && value) {
      toast.error("다운로드 제한 횟수는 0 초과이어야 합니다.");
      return;
    }

    const downloadLimit = value ? Number(value) : null;
    toast.promise(updateContentGroup({ downloadLimit }), {
      loading: "다운로드 제한 횟수 수정 중...",
      success: "다운로드 제한 횟수 수정 완료",
      error: "다운로드 제한 횟수 수정 실패",
    });
    setEditingDownloadLimit(false);
  };

  const handleExpireMinuteSubmit = () => {
    const updatedExpireMinute = enableExpireMinute ? expireMinute : null;
    if (enableExpireMinute && expireMinute < 10) {
      toast.error("디지털 컨텐츠 만료 시간은 최소 10분 이상이어야 합니다.");
      return;
    }

    toast.promise(updateContentGroup({ expireMinute: updatedExpireMinute }), {
      loading: "상품 만료 시간 수정 중...",
      success: "상품 만료 시간 수정 완료",
      error: "상품 만료 시간 수정 실패",
    });
    setExpireMinute(expireMinute);
  };

  const handleDeleteContentGroup = () => {
    toast.promise(deleteContentGroup(contentId), {
      loading: "디지털 컨텐츠 삭제 중...",
      success: () => {
        router.push(`/workspaces/${workspaceId}/content`);
        return "디지털 컨텐츠 삭제 완료";
      },
      error: (error) => {
        errorHandler(error, router);
        return "디지털 컨텐츠 삭제 실패";
      },
    });
  };

  return (
    <Component>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 mb-3 transition-colors duration-300 ease-in-out hover:text-blue-500 p-2"
      >
        <ArrowLeftOutlined />
        뒤로 가기
      </button>

      <Header
        title="디지털 컨텐츠 상세"
        description={`${data.name} 디지털 컨텐츠 상세`}
      />
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-y-6 xl:gap-6 w-full">
        <Card className="h-min">
          <div>
            <p className="text-sm text-gray-400">디지털 컨텐츠명</p>
            <Typography.Text
              className="text-2xl font-semibold"
              editable={{
                editing: editingContentName,
                onStart: () => setEditingContentName(true),
                onCancel: () => setEditingContentName(false),
                onChange: handleContentNameChange,
                tooltip: "수정하려면 클릭하세요",
                icon: <EditOutlined />,
                text: data.name,
              }}
            >
              {data.name}
            </Typography.Text>
            <div className="flex flex-col w-full divide-y space-y-3">
              <InfoRow label="유형">{ContentType[data.type]}</InfoRow>
              <InfoRow label="제공 유형">
                {data.oneTime ? "일회성" : "재사용"} 디지털 컨텐츠
              </InfoRow>
              <InfoRow label="상품 만료 시간" className="flex flex-col">
                <div className="flex flex-col gap-2 mt-2 w-full">
                  <p className="text-sm text-gray-500">
                    사용자가 상품을 구매한 날로부터 몇일, 몇시간, 몇분 후
                    만료되도록 설정할 수 있습니다.
                  </p>
                  <Checkbox
                    checked={enableExpireMinute}
                    onChange={(e) => {
                      setEnableExpireMinute(e.target.checked);
                    }}
                  >
                    만료 시간 설정
                  </Checkbox>
                  {enableExpireMinute && (
                    <DurationInput
                      value={expireMinute}
                      onChange={(value) => {
                        setExpireMinute(value);
                      }}
                    />
                  )}
                  <Button
                    type="primary"
                    className="w-full"
                    onClick={handleExpireMinuteSubmit}
                  >
                    만료 시간 저장
                  </Button>
                </div>
              </InfoRow>
              <InfoRow label="다운로드 제한 횟수">
                <Typography.Text
                  editable={{
                    editing: editingDownloadLimit,
                    onStart: () => setEditingDownloadLimit(true),
                    onCancel: () => setEditingDownloadLimit(false),
                    onChange: handleDownloadLimitChange,
                    tooltip: "수정하려면 클릭하세요",
                    icon: <EditOutlined />,
                    text: "0",
                  }}
                >
                  {data.downloadLimit ? data.downloadLimit + "회" : "무제한"}
                </Typography.Text>
              </InfoRow>
            </div>
          </div>
          <Popover
            title="디지털 컨텐츠 삭제"
            trigger="click"
            content={
              <div>
                <p>정말로 삭제하시겠습니까?</p>
                <p>삭제된 디지털 컨텐츠는 복구할 수 없습니다.</p>
                <p className="text-red-500">
                  디지털 컨텐츠에 연결된 모든 메세지가 수정됩니다.
                </p>

                <Button
                  type="primary"
                  danger
                  className="mt-3 w-full"
                  onClick={handleDeleteContentGroup}
                >
                  디지털 컨텐츠 삭제
                </Button>
              </div>
            }
          >
            <Button type="primary" danger className="mt-6">
              디지털 컨텐츠 삭제
            </Button>
          </Popover>
        </Card>
        <div className="space-y-6 col-span-3">
          <Card>
            <h2 className="text-2xl font-semibold mb-4">디지털 컨텐츠 목록</h2>
            <ContentTable
              workspaceId={workspaceId}
              contentGroupId={contentId}
              contentType={data.type}
            />
          </Card>
        </div>
      </div>
    </Component>
  );
}
