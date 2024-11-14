import Header from "@/components/Header";
import Component from "@/components/Container";
import { useRouter } from "next/router";
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
import {
  useCancelInspection,
  useDeleteMessage,
  useKakaoTemplateCategories,
  useRequestInspection,
} from "@/hooks/queries/useMessage";
import AlimTalk from "@/components/kakao/AlimTalk";
import {
  KakaoButtonMapping,
  KakaoTemplateStatus,
  MessageDto,
  MessageTargetMapping,
} from "@/types/message";
import { Alert, Button, Popover, Tag } from "antd";
import toast from "react-hot-toast";
import { useState } from "react";
import { isAxiosError } from "axios";
import { Card } from "@/components/common/Card";

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
    <div className="flex justify-between items-center border px-3 gap-10 py-2 rounded-md">
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

export default function KakaoMessageDetail({
  workspaceId,
  message,
}: {
  workspaceId: number;
  message: MessageDto;
}) {
  const {
    kakaoTemplate,
    contentGroupId,
    customPhone,
    target,
    type,
    content,
    contentGroup,
    name,
    id,
    createdAt,
    updatedAt,
    completeDelivery,
  } = message;

  const router = useRouter();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const {
    data: kakaoTemplateCategories,
    isLoading: isKakaoTemplateCategoriesLoading,
  } = useKakaoTemplateCategories(workspaceId);
  const { mutateAsync: deleteMessage } = useDeleteMessage(workspaceId, id);
  const { mutateAsync: requestInspection } = useRequestInspection(workspaceId);
  const { mutateAsync: cancelInspection } = useCancelInspection(
    workspaceId,
    id
  );

  const onRequestInspection = () => {
    toast.promise(requestInspection(id), {
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
      {kakaoTemplate.status === "PENDING" && (
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
      {(kakaoTemplate.status === "REJECTED" ||
        kakaoTemplate.status === "UPLOADED") && (
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
                검수는 거절될 수 있으며 거절 시 메시지 수정이 필요할 수
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
        {kakaoTemplate.status === "APPROVED" && (
          <CheckCircleOutlined className="text-green-500" />
        )}
        {kakaoTemplate.status === "PENDING" && (
          <LoadingOutlined className="text-blue-500" />
        )}
        {kakaoTemplate.status === "REJECTED" && (
          <CloseCircleOutlined className="text-red-500" />
        )}
        {kakaoTemplate.status === "UPLOADED" && (
          <ExclamationCircleOutlined className="text-yellow-500" />
        )}
        {KakaoTemplateStatus[kakaoTemplate.status]}
      </div>
      {kakaoTemplate.status !== "APPROVED" && (
        <p className="text-sm font-light text-gray-500">
          (승인 상태만 메시지 전송이 가능합니다.)
        </p>
      )}
      {InspectionButton}
    </>
  );

  const InspectionRejectReason = kakaoTemplate.status === "REJECTED" &&
    kakaoTemplate.comments.length && (
      <Alert
        type="error"
        message={
          <>
            <h3 className="font-semibold mb-2 text-lg">
              <CloseCircleOutlined className="text-red-500 mr-1" />
              검수 거절 안내
            </h3>
            <p className="whitespace-pre-wrap">
              {kakaoTemplate.comments[kakaoTemplate.comments.length - 1]}
            </p>
          </>
        }
      />
    );

  const handleDeleteMessage = () => {
    toast.promise(deleteMessage(), {
      loading: "메시지 삭제중...",
      success: () => {
        router.push(`/workspaces/${workspaceId}/message`);
        return "메시지 삭제 완료";
      },
      error: "메시지 삭제 실패",
    });
  };

  const editAllowed =
    (type === "FULLY_CUSTOM" && kakaoTemplate.status !== "APPROVED") ||
    type === "CUSTOM";

  const isGlobal = type === "GLOBAL";

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
        title={`${name} 메시지 상세`}
        description="메시지의 상세 정보를 확인할 수 있습니다."
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="col-span-1 h-min items-center gap-3 flex-col flex lg:flex-none min-w-[280px]">
          <AlimTalk
            content={
              type === "CUSTOM"
                ? kakaoTemplate.content.replace("#{상품안내}", content || "")
                : kakaoTemplate.content
            }
            buttons={kakaoTemplate.buttons
              .filter((button) => button.type !== "AC")
              .map((button) => ({
                buttonName: button.name,
              }))}
            channelAddButton={kakaoTemplate.buttons.some(
              (button) => button.type === "AC"
            )}
            extra={kakaoTemplate.extra}
            image={kakaoTemplate.imageUrl || ""}
          />
          {editAllowed && (
            <>
              <Button
                type="primary"
                className="w-[280px]"
                onClick={() =>
                  router.push(`/workspaces/${workspaceId}/message/${id}/edit`)
                }
              >
                <EditOutlined />
                메시지 수정
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
                  메시지 삭제
                </Button>
              </Popover>
            </>
          )}
        </div>
        <Card className="w-full">
          <h2 className="text-2xl font-semibold mb-4">메시지 정보</h2>
          <div className="flex flex-col gap-1">
            <InfoRow label="메시지 이름" copyable>
              {name}
            </InfoRow>
            <InfoRow label="메시지 상태">
              <div className="flex flex-col text-left gap-2">
                {InspectionStatus}
                {InspectionRejectReason}
              </div>
            </InfoRow>
            <InfoRow label="메시지 카테고리">
              {isKakaoTemplateCategoriesLoading &&
                "카테고리 정보를 불러오는 중입니다."}
              {
                kakaoTemplateCategories?.categories.find(
                  (category) => category.code === kakaoTemplate.categoryCode
                )?.name
              }
            </InfoRow>
            {!isGlobal && (
              <InfoRow label="연결된 디지털 컨텐츠">
                <div className="flex gap-1 flex-col">
                  {contentGroupId ? (
                    <span
                      className="hover:underline text-blue-500 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/workspaces/${workspaceId}/content/${contentGroupId}`
                        )
                      }
                    >
                      <ReadOutlined className="mr-1" />
                      {contentGroup?.name}
                    </span>
                  ) : (
                    <span>연결된 디지털 컨텐츠가 없습니다.</span>
                  )}
                </div>
              </InfoRow>
            )}
            <InfoRow
              label="메시지 내용"
              copyable
              copytext={type === "CUSTOM" ? content : kakaoTemplate.content}
              className="flex flex-col"
            >
              <p className="whitespace-pre-wrap p-3 bg-gray-100 rounded-md mt-2">
                {type === "CUSTOM" ? content : kakaoTemplate.content}
              </p>
            </InfoRow>
            {kakaoTemplate.extra && (
              <InfoRow
                label="메시지 추가정보"
                copyable
                copytext={kakaoTemplate.extra}
                className="flex flex-col"
              >
                <p className="whitespace-pre-wrap p-3 bg-gray-100 rounded-md mt-2">
                  {kakaoTemplate.extra}
                </p>
              </InfoRow>
            )}
            <InfoRow label="메시지 버튼" className="flex flex-col">
              <div className="flex gap-1 flex-col mt-2">
                {kakaoTemplate?.buttons.map((button) => (
                  <KakaoButton key={button.name} button={button} />
                ))}
                {kakaoTemplate.buttons.length === 0 && (
                  <span>버튼이 없습니다.</span>
                )}
              </div>
            </InfoRow>
            <InfoRow label="배송 완료 처리">
              {completeDelivery
                ? "메시지 발송시 배송 완료 처리됨"
                : "수동으로 배송 완료 처리 필요"}
            </InfoRow>
            <InfoRow label="메시지 발송 대상">
              {MessageTargetMapping[target]}
              {customPhone &&
                target === "CUSTOM" &&
                ` (${customPhone.replace(
                  /(\d{2,3})(\d{3,4})(\d{4})/,
                  "$1-$2-$3"
                )})`}
            </InfoRow>
            <InfoRow label="메시지 생성일">
              {moment(createdAt).format("YYYY년 MM월 DD일 HH시 mm분 ss초")}
            </InfoRow>
            <InfoRow label="메시지 수정일">
              {moment(updatedAt).format("YYYY년 MM월 DD일 HH시 mm분 ss초")}
            </InfoRow>
          </div>
        </Card>
      </div>
    </Component>
  );
}
