import Header from "@/components/Header";
import Component from "../../../../../components/Container";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import InfoRow from "@/components/InfoRow";
import moment from "moment";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  ReadOutlined,
  SendOutlined,
} from "@ant-design/icons";
import errorHandler from "@/utils/error";
import {
  useCancelInspection,
  useDeleteMessage,
  useKakaoTemplateCategories,
  useMessage,
  useRequestInspection,
} from "@/hooks/queries/useMessage";
import AlimTalk from "@/components/kakao/AlimTalk";
import {
  KakaoButtonMapping,
  KakaoTemplateStatus,
  MessageTargetMapping,
} from "@/types/message";
import { Alert, Button, Popover, Tag } from "antd";
import toast from "react-hot-toast";
import { useState } from "react";
import { isAxiosError } from "axios";
import Error from "@/components/Error";
import { Card } from "@/components/common/Card";

function Variable({
  variable,
}: {
  variable: {
    key: string;
    value: string;
  };
}) {
  return (
    <div className="grid grid-cols-3 justify-between items-center border px-3 gap-10 py-2 rounded-md">
      <span className="font-semibold col-span-2">{variable.key}</span>
      <span className="text-sm text-gray-500">{variable.value}</span>
    </div>
  );
}

function KakaoButton({
  button,
}: {
  button: {
    name: string;
    type: string;
    url?: string;
  };
}) {
  return (
    <div className="grid grid-cols-3 justify-between items-center border px-3 gap-10 py-2 rounded-md w-6/12">
      <span className="font-semibold col-span-2">
        {button.type === "AC" ? "채널 추가" : button.name}
      </span>
      <div className="flex gap-2 ml-4 items-center">
        <a
          href={button.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 text-ellipsis overflow-hidden whitespace-nowrap w-[150px] hidden sm:block"
        >
          {button.url}
        </a>
        <Tag className="text-[14px]">
          {KakaoButtonMapping[button.type as keyof typeof KakaoButtonMapping]}형
        </Tag>
      </div>
    </div>
  );
}

export default function WorkspaceMessageDetail() {
  const router = useRouter();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const workspaceId = parseInt(router.query.id as string, 10);
  const messageId = parseInt(router.query.messageId as string, 10);
  const { data, isLoading, error } = useMessage(workspaceId, messageId);
  const {
    data: kakaoTemplateCategories,
    isLoading: isKakaoTemplateCategoriesLoading,
    error: kakaoTemplateCategoriesError,
  } = useKakaoTemplateCategories(workspaceId);

  const { mutateAsync: deleteMessage } = useDeleteMessage(
    workspaceId,
    messageId
  );
  const { mutateAsync: requestInspection } = useRequestInspection(workspaceId);
  const { mutateAsync: cancelInspection } = useCancelInspection(
    workspaceId,
    messageId
  );

  if (isLoading || isKakaoTemplateCategoriesLoading) return <Loading />;
  if (error || !data || kakaoTemplateCategoriesError) {
    errorHandler(error, router);
    return <Error />;
  }

  const onRequestInspection = () => {
    toast.promise(requestInspection(messageId), {
      loading: "검수 요청중...",
      success: "검수 요청 완료",
      error: (error) => {
        if (isAxiosError(error) && error.response) {
          return error.response.data.messsage || "검수 요청 실패";
        }
        return "검수 요청 실패";
      },
    });
  };

  const onCancelInspection = () => {
    toast.promise(cancelInspection(), {
      loading: "검수 취소중...",
      success: "검수 취소 완료",
      error: (error) => {
        if (isAxiosError(error) && error.response) {
          return error.response.data.messsage || "검수 취소 실패";
        }
        return "검수 취소 실패";
      },
    });
  };

  const InspectionButton = (
    <>
      {data.kakaoTemplate.status === "PENDING" && (
        <Popover
          trigger="click"
          content={
            <div className="flex flex-col gap-2">
              <p>정말 검수를 취소하시겠습니까?</p>
              <p className="text-sm text-gray-500">
                검수 취소 후에는 다시 검수 요청을 해야합니다.
                <br />
                영업일 기준 평균 1~3일 정도 소요됩니다.
              </p>
              <Button type="primary" danger onClick={onCancelInspection}>
                네 취소합니다
              </Button>
            </div>
          }
        >
          <Button type="primary" danger className="w-[280px]">
            <CloseCircleOutlined />
            검수 취소
          </Button>
        </Popover>
      )}
      {(data.kakaoTemplate.status === "REJECTED" ||
        data.kakaoTemplate.status === "UPLOADED") && (
        <Popover
          trigger="click"
          content={
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-lg">
                정말 카카오에 검수를 요청하시겠습니까?
              </p>
              <p className="text-sm font-light text-gray-400">
                요청의 경우에는 영업일 기준 평균 1~3일 정도 소요됩니다.
                <br />
                검수는 거절될 수 있으며 거절 시 메세지 수정이 필요할 수
                있습니다.
                <br />
                문의 사항이 있으시거나 자체 검수를 원하실 경우 우측 하단
                채널톡을 통하여 문의 주시기 바랍니다.
              </p>
              <Button type="primary" onClick={onRequestInspection}>
                네 요청합니다
              </Button>
            </div>
          }
        >
          <Button type="default" className="w-[280px] text-green-500">
            <SendOutlined />
            검수 요청
          </Button>
        </Popover>
      )}
    </>
  );

  const InspectionStatus = (
    <>
      <div className="flex items-center gap-2">
        {data.kakaoTemplate.status === "APPROVED" && (
          <CheckCircleOutlined className="text-green-500" />
        )}
        {data.kakaoTemplate.status === "PENDING" && (
          <LoadingOutlined className="text-blue-500" />
        )}
        {data.kakaoTemplate.status === "REJECTED" && (
          <CloseCircleOutlined className="text-red-500" />
        )}
        {data.kakaoTemplate.status === "UPLOADED" && (
          <ExclamationCircleOutlined className="text-yellow-500" />
        )}
        {KakaoTemplateStatus[data.kakaoTemplate.status]}
      </div>
      {data.kakaoTemplate.status !== "APPROVED" && (
        <p className="text-sm font-light text-gray-500">
          (승인 상태만 메세지 전송이 가능합니다.)
        </p>
      )}
      {InspectionButton}
    </>
  );

  const InspectionRejectReason = data.kakaoTemplate.status === "REJECTED" &&
    data.kakaoTemplate.comments.length && (
      <Alert
        type="error"
        message={
          <>
            <h3 className="font-semibold mb-2 text-lg">
              <CloseCircleOutlined className="text-red-500 mr-1" />
              검수 거절 안내
            </h3>
            <p className="whitespace-pre-wrap">
              {
                data.kakaoTemplate.comments[
                  data.kakaoTemplate.comments.length - 1
                ]
              }
            </p>
          </>
        }
      />
    );

  const handleDeleteMessage = () => {
    toast.promise(deleteMessage(), {
      loading: "메세지 삭제중...",
      success: () => {
        router.push(`/workspaces/${workspaceId}/message`);
        return "메세지 삭제 완료";
      },
      error: "메세지 삭제 실패",
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
        title={`${data.name} 메세지 상세`}
        description="메세지의 상세 정보를 확인할 수 있습니다."
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="col-span-1 h-min items-center gap-3 flex-col flex lg:flex-none min-w-[280px]">
          <AlimTalk
            content={data.kakaoTemplate.content}
            buttons={data.kakaoTemplate.buttons
              .filter((button) => button.type !== "AC")
              .map((button) => ({
                buttonName: button.name,
              }))}
            channelAddButton={data.kakaoTemplate.buttons.some(
              (button) => button.type === "AC"
            )}
            extra={data.kakaoTemplate.extra}
            image={data.kakaoTemplate.imageUrl || ""}
          />
          {!data.isGlobal && (
            <>
              <Button
                type="primary"
                className="w-[280px]"
                onClick={() =>
                  router.push(
                    `/workspaces/${workspaceId}/message/${messageId}/edit`
                  )
                }
              >
                <EditOutlined />
                메세지 수정
              </Button>
              <Popover
                open={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
                content={
                  <div className="flex flex-col gap-2">
                    <p>정말 삭제하시겠습니까?</p>
                    <Button type="primary" danger onClick={handleDeleteMessage}>
                      네 삭제합니다
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => setIsPopoverOpen(false)}
                    >
                      아니오
                    </Button>
                  </div>
                }
                trigger="click"
                title="연결 삭제"
              >
                <Button type="primary" danger className="w-[280px]">
                  <DeleteOutlined />
                  메세지 삭제
                </Button>
              </Popover>
            </>
          )}
        </div>
        <Card className="w-full">
          <h2 className="text-2xl font-semibold mb-4">메세지 정보</h2>
          <div className="flex flex-col gap-1">
            <InfoRow label="메세지 이름" copyable>
              {data.name}
            </InfoRow>
            <InfoRow label="메세지 상태">
              <div className="flex flex-col text-left gap-2">
                {InspectionStatus}
                {InspectionRejectReason}
              </div>
            </InfoRow>
            <InfoRow label="메세지 카테고리">
              {
                kakaoTemplateCategories?.categories.find(
                  (category) =>
                    category.code === data.kakaoTemplate.categoryCode
                )?.name
              }
            </InfoRow>
            {!data.isGlobal && (
              <InfoRow label="연결된 콘텐츠">
                <div className="flex gap-1 flex-col">
                  {data.contentGroupId ? (
                    <span
                      className="hover:underline text-blue-500 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/workspaces/${workspaceId}/content/${data.contentGroupId}`
                        )
                      }
                    >
                      <ReadOutlined className="mr-1" />
                      {data.contentGroup?.name}
                    </span>
                  ) : (
                    <span>연결된 콘텐츠가 없습니다.</span>
                  )}
                </div>
              </InfoRow>
            )}
            <InfoRow
              label="메세지 내용"
              copyable
              copytext={data.kakaoTemplate.content}
            >
              <p className="whitespace-pre-wrap p-3 bg-gray-100 rounded-md">
                {data.kakaoTemplate.content}
              </p>
            </InfoRow>
            {data.kakaoTemplate.extra && (
              <InfoRow
                label="메세지 추가정보"
                copyable
                copytext={data.kakaoTemplate.extra}
              >
                <p className="whitespace-pre-wrap p-3 bg-gray-100 rounded-md">
                  {data.kakaoTemplate.extra}
                </p>
              </InfoRow>
            )}
            <InfoRow label="메세지 버튼">
              <div className="flex gap-1 flex-col">
                {data.kakaoTemplate?.buttons.map((button) => (
                  <KakaoButton key={button.name} button={button} />
                ))}
                {data.kakaoTemplate.buttons.length === 0 && (
                  <span>버튼이 없습니다.</span>
                )}
              </div>
            </InfoRow>
            <InfoRow label="메세지 변수">
              <div className="flex gap-1 flex-col">
                {data.variables.map((variable) => (
                  <Variable key={variable.key} variable={variable} />
                ))}
                {data.variables.length === 0 && <span>변수가 없습니다.</span>}
              </div>
            </InfoRow>
            <InfoRow label="배송 완료 처리">
              {data.completeDelivery
                ? "메세지 발송시 배송 완료 처리됨"
                : "수동으로 배송 완료 처리 필요"}
            </InfoRow>
            <InfoRow label="메세지 발송 대상">
              {MessageTargetMapping[data.target]}
              {data.customPhone &&
                data.target === "CUSTOM" &&
                ` (${data.customPhone.replace(
                  /(\d{2,3})(\d{3,4})(\d{4})/,
                  "$1-$2-$3"
                )})`}
            </InfoRow>
            <InfoRow label="메세지 생성일">
              {moment(data.createdAt).format("YYYY년 MM월 DD일 HH시 mm분 ss초")}
            </InfoRow>
            <InfoRow label="메세지 수정일">
              {moment(data.updatedAt).format("YYYY년 MM월 DD일 HH시 mm분 ss초")}
            </InfoRow>
          </div>
        </Card>
      </div>
    </Component>
  );
}
