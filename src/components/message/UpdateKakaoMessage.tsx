import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  ArrowLeftOutlined,
  CloseOutlined,
  MessageOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  useCancelInspection,
  useCustomKakaoTemplates,
  useKakaoTemplateCategories,
  useRequestInspection,
  useUpdateMessage,
  useVariables,
} from "@/hooks/queries/useMessage";
import Loading from "@/components/Loading";
import errorHandler from "@/utils/error";
import {
  CustomKakaoTemplateDto,
  KakaoButtonMapping,
  KakaoButtonType,
  KakaoTemplateStatus,
  MessageDto,
  MessageTargetMapping,
  MessageUpdateDto,
} from "@/types/message";
import {
  Button,
  Popover,
  Form,
  Input,
  Select,
  Upload,
  Tag,
  Checkbox,
  FormInstance,
  Alert,
} from "antd";
import toast from "react-hot-toast";
import { Card } from "@/components/common/Card";
import { UploadChangeParam } from "antd/es/upload";
import axiosClient from "@/utils/axios";
import TextArea from "antd/es/input/TextArea";
import { isURL } from "validator";
import AlimTalk from "@/components/kakao/AlimTalk";
import Component from "@/components/Container";
import Header from "../Header";
import { useContentGroups } from "@/hooks/queries/useContent";
import Link from "next/link";

export function InspectionStatusAlert({
  status,
  onCancelInspection,
}: {
  status: KakaoTemplateStatus;
  onCancelInspection: () => void;
}) {
  return (
    <Alert
      message={
        <>
          <p>
            🚨 해당 메세지는 {KakaoTemplateStatus[status]} 상태입니다. 메세지
            상세 내용은 검수 대기, 거절 상태에서만 수정할 수 있습니다.
          </p>
          <p>변경 가능한 값의 제한이 있을 수 있습니다.</p>
          {status === "PENDING" && (
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
              <Button type="primary" danger className="mt-2">
                검수 취소
              </Button>
            </Popover>
          )}
        </>
      }
      type="error"
      className="mb-6 font-semibold text-red-500"
    />
  );
}

const UpdateKakaoMessage = ({
  workspaceId,
  message: messageDto,
}: {
  workspaceId: number;
  message: MessageDto;
}) => {
  const router = useRouter();
  const { kakaoTemplate, ...message } = messageDto;

  const { mutateAsync: requestInspection } = useRequestInspection(workspaceId);
  const { mutateAsync: updateMessage } = useUpdateMessage(
    workspaceId,
    message.id
  );
  const { mutateAsync: cancelInspection } = useCancelInspection(
    workspaceId,
    message.id
  );

  const { data: categories, isLoading: categoriesLoading } =
    useKakaoTemplateCategories(workspaceId);
  const { data: serverVariables } = useVariables(workspaceId);
  const { data: contentGroup, isLoading: contentGroupLoading } =
    useContentGroups(workspaceId);
  const { data: customKakaoTemplates, isLoading: customKakaoTemplatesLoading } =
    useCustomKakaoTemplates(workspaceId);

  const [form] = Form.useForm<
    MessageUpdateDto & {
      buttonType: KakaoButtonType;
      buttonName: string;
      buttonUrl: string;
      inspection: boolean;
    }
  >();

  useEffect(() => {
    form.setFieldsValue({
      ...message,
      kakaoTemplate,
      buttonType: "AC",
      buttonName: "",
      buttonUrl: "",
      inspection: false,
    });
  }, [message]);

  const cancelInspectionHandler = async () => {
    try {
      toast.promise(cancelInspection(), {
        loading: "검수 취소 중...",
        success: "검수 취소 완료",
        error: "검수 취소 실패",
      });
    } catch (err) {
      errorHandler(err, router);
    }
  };

  const uploadImage = async (options: any) => {
    const { onSuccess, onError, file } = options;

    const fmData = new FormData();
    fmData.append("file", file);

    try {
      const res = await axiosClient.post(
        `/workspace/${workspaceId}/kakao/image`,
        fmData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      onSuccess("Ok");
      form.setFieldsValue({
        kakaoTemplate: {
          ...form.getFieldValue("kakaoTemplate"),
          imageId: res.data.fileId,
          imageUrl: res.data.url,
        },
      });
    } catch (err) {
      errorHandler(err, router);
      form.setFieldsValue({
        kakaoTemplate: {
          ...form.getFieldValue("kakaoTemplate"),
          imageId: null,
          imageUrl: null,
        },
      });
      onError({ err });
    }
  };

  const onFileChange = (info: UploadChangeParam) => {
    if (info.file.status === "removed") {
      form.setFieldsValue({
        kakaoTemplate: {
          ...form.getFieldValue("kakaoTemplate"),
          imageId: null,
          imageUrl: null,
        },
      });
    }
  };

  const onAddVariable = (variable: string, isCustom: boolean) => {
    const content =
      form.getFieldValue(
        isCustom ? ["content"] : ["kakaoTemplate", "content"]
      ) || "";

    form.setFieldsValue({
      ...(isCustom && { content: `${content}#{${variable}}` }),
      ...(!isCustom && {
        kakaoTemplate: {
          ...form.getFieldValue("kakaoTemplate"),
          content: `${content}#{${variable}}`,
        },
      }),
    });
  };

  const onCreateButton = () => {
    const buttonType = form.getFieldValue("buttonType");
    const buttonName = form.getFieldValue("buttonName");
    const buttonUrl = form.getFieldValue("buttonUrl");

    if (!buttonName && buttonType !== "AC") {
      toast.error("버튼 이름을 입력해주세요.");
      return;
    }
    if (!buttonType) {
      toast.error("버튼 타입을 선택해주세요.");
      return;
    }
    if (!buttonUrl && buttonType === "WL") {
      toast.error("버튼 URL을 입력해주세요.");
      return;
    }

    if (buttonType === "WL" && !isURL(buttonUrl || "")) {
      toast.error("버튼 URL이 올바르지 않습니다.");
      return;
    }

    const buttons = form.getFieldValue(["kakaoTemplate", "buttons"]) || [];
    if (buttons.length >= 5) {
      toast.error("버튼은 최대 5개까지 생성할 수 있습니다.");
      return;
    }

    if (buttons.find((btn: any) => btn.type === "AC") && buttonType === "AC") {
      toast.error("채널 추가 버튼은 최대 1개까지 생성할 수 있습니다.");
      return;
    }

    const newButton = {
      name: buttonName,
      type: buttonType,
      url: buttonUrl,
    };

    const newButtons =
      buttonType === "AC" ? [newButton, ...buttons] : [...buttons, newButton];

    form.setFieldsValue({
      kakaoTemplate: {
        ...form.getFieldValue("kakaoTemplate"),
        buttons: newButtons,
      },
      buttonName: "채널 추가",
      buttonUrl: "",
      buttonType: "AC",
    });
  };

  const removeButton = (index: number) => {
    const buttons = form.getFieldValue(["kakaoTemplate", "buttons"]) || [];
    const newButtons = buttons.filter((_: unknown, i: number) => i !== index);
    form.setFieldsValue({
      kakaoTemplate: {
        ...form.getFieldValue("kakaoTemplate"),
        buttons: newButtons,
      },
    });
  };

  const onInspectionSubmit = async () => {
    try {
      toast.promise(requestInspection(message.id), {
        loading: "검수 요청 중...",
        success: "검수 요청 완료",
        error: "검수 요청 실패",
      });
    } catch (err) {
      errorHandler(err, router);
    }
  };

  const onSubmit = async () => {
    try {
      const values = form.getFieldsValue();
      console.log(values);
      toast.promise(
        updateMessage({
          ...values,
          ...(values.type === "CUSTOM"
            ? { content: values.content, kakaoTemplate: undefined }
            : {
                ...values.kakaoTemplate,
              }),
        }),
        {
          loading: "메세지 수정 중...",
          success: () => {
            if (values.inspection && values.type === "FULLY_CUSTOM")
              onInspectionSubmit();

            router.push(`/workspaces/${workspaceId}/message/${message.id}`);
            return "메세지 수정 완료";
          },
          error: "메세지 수정 실패",
        }
      );
    } catch (err) {
      errorHandler(err, router);
    }
  };

  const disableFullyCustomKakaoUpdate =
    message.type === "FULLY_CUSTOM" &&
    (kakaoTemplate.status === "APPROVED" || kakaoTemplate.status === "PENDING");

  const isFullyCustom = (
    <>
      <Form.Item
        label="메세지 카테고리"
        name={["kakaoTemplate", "categoryCode"]}
        required
        rules={[
          {
            required: true,
            message: "메세지 카테고리를 선택해주세요.",
          },
        ]}
      >
        {categoriesLoading || !categories ? (
          <Loading isFullPage={false} />
        ) : (
          <Select
            showSearch
            disabled={disableFullyCustomKakaoUpdate}
            placeholder="메세지 카테고리를 선택해주세요."
            filterOption={(input, option) =>
              (option?.label?.toString() ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={categories.categories.map((category) => ({
              label: category.name,
              value: category.code,
            }))}
          />
        )}
      </Form.Item>
      <Form.Item
        name={["kakaoTemplate", "imageUrl"]}
        className="mb-0"
        label="메세지 이미지"
      >
        <Upload
          accept=".jpg,.jpeg,.png"
          name="image"
          disabled={disableFullyCustomKakaoUpdate}
          onChange={onFileChange}
          customRequest={uploadImage}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>사진 업로드</Button>
        </Upload>
      </Form.Item>
      <Form.Item noStyle>
        <ul className="list-disc list-inside text-left mt-2">
          <li>파일 사이즈 최대 500KB</li>
          <li>가로:세로 비율이 2:1</li>
          <li>JPEG, JPG, PNG 확장자</li>
          <li>
            <Link
              href="https://kakaobusiness.gitbook.io/main/ad/bizmessage/notice-friend/content-guide/image"
              target="_blank"
            >
              <Button danger icon={<WarningOutlined />}>
                필독! 메세지 이미지 가이드
              </Button>
            </Link>
          </li>
        </ul>
      </Form.Item>

      <Form.Item label="메세지 내용" className="mb-0 mt-5">
        <Popover
          placement="topLeft"
          title="사용 가능한 변수"
          trigger={["click"]}
          content={
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
              {serverVariables?.nodes.map((serverVariable) => (
                <button
                  disabled={disableFullyCustomKakaoUpdate}
                  onClick={() => onAddVariable(serverVariable.key, false)}
                  key={serverVariable.key}
                  className="text-left flex flex-col border p-2 rounded-md hover:bg-gray-100 hover:shadow-sm duration-150"
                >
                  <span className="font-semibold">{serverVariable.key}</span>
                  <span className="text-sm text-gray-500">
                    {serverVariable.description}
                  </span>
                  <span className="text-xs text-gray-500 mt-3">
                    예시: {serverVariable.example}
                  </span>
                </button>
              ))}
            </div>
          }
        >
          <Button className="mb-1" disabled={disableFullyCustomKakaoUpdate}>
            변수 추가
          </Button>
        </Popover>
      </Form.Item>
      <Form.Item
        name={["kakaoTemplate", "content"]}
        rules={[{ required: true, message: "메세지 내용을 입력해주세요." }]}
      >
        <TextArea
          disabled={disableFullyCustomKakaoUpdate}
          rows={10}
          placeholder="메세지 내용"
          maxLength={800}
          showCount
        />
      </Form.Item>
      <Form.Item label="메세지 부가정보" name={["kakaoTemplate", "extra"]}>
        <TextArea
          disabled={disableFullyCustomKakaoUpdate}
          rows={5}
          className="border border-gray-300 rounded-md p-2"
          placeholder="추가정보"
        />
      </Form.Item>
      <Form.Item
        label="버튼 추가"
        className="w-full mb-1"
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.buttonType !== currentValues.buttonType
        }
      >
        {(form) => {
          return (
            <>
              <div className="flex gap-1">
                <Form.Item name="buttonType" noStyle initialValue="AC">
                  <Select
                    className="border-gray-300 rounded-md h-[40px]"
                    disabled={disableFullyCustomKakaoUpdate}
                  >
                    {Object.keys(KakaoButtonMapping).map((type) => (
                      <Select.Option key={type} value={type}>
                        {KakaoButtonMapping[type as KakaoButtonType]}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="buttonName"
                  noStyle
                  rules={[
                    {
                      required: form.getFieldValue("buttonType") !== "AC",
                      message: "버튼 이름을 입력해주세요.",
                    },
                  ]}
                >
                  {form.getFieldValue("buttonType") !== "AC" && (
                    <Input
                      disabled={disableFullyCustomKakaoUpdate}
                      className="border border-gray-300 rounded-md p-2"
                      placeholder="버튼 이름 (변수 사용 불가)"
                    />
                  )}
                </Form.Item>
              </div>
              {form.getFieldValue("buttonType") === "WL" && (
                <Form.Item
                  name="buttonUrl"
                  rules={[
                    {
                      required: true,
                      message: "버튼 URL을 입력해주세요.",
                    },
                    {
                      validator: (_, value) =>
                        isURL(value || "")
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("올바른 URL을 입력해주세요.")
                            ),
                    },
                  ]}
                >
                  <Input
                    disabled={disableFullyCustomKakaoUpdate}
                    className="border border-gray-300 rounded-md p-2 mt-1"
                    placeholder="버튼 URL"
                    type="url"
                  />
                </Form.Item>
              )}
              <Button
                disabled={disableFullyCustomKakaoUpdate}
                type="primary"
                onClick={onCreateButton}
                className="bg-blue-500 text-white rounded-md px-3 w-full py-1 mt-2"
              >
                버튼 추가
              </Button>
            </>
          );
        }}
      </Form.Item>
    </>
  );

  const onTemplateChange = (templateId: number) => {
    if (!customKakaoTemplates) return;

    const template = customKakaoTemplates.find(
      (template: CustomKakaoTemplateDto) => template.id === templateId
    );
    if (!template) return;

    form.setFieldsValue({
      kakaoTemplate: {
        ...form.getFieldValue("kakaoTemplate"),
        content: template.content,
        extra: template.extra,
        buttons: template.buttons,
      },
    });
  };

  const isCustom = (
    <>
      <Form.Item label="템플릿 선택" required name={["kakaoTemplateId"]}>
        <Select
          placeholder="템플릿을 선택해주세요."
          className="h-16"
          onChange={(value) => onTemplateChange(value)}
        >
          {customKakaoTemplatesLoading || !customKakaoTemplates ? (
            <Loading isFullPage={false} />
          ) : (
            customKakaoTemplates.map((template) => (
              <Select.Option key={template.id} value={template.id}>
                <div className="flex flex-col">
                  <p>{template.name}</p>
                  <p className="text-xs text-gray-500">
                    {template.description}
                  </p>
                </div>
              </Select.Option>
            ))
          )}
        </Select>
      </Form.Item>
      <Form.Item label="메세지 내용" className="mb-0">
        <Popover
          placement="topLeft"
          title="사용 가능한 변수"
          trigger={["click"]}
          content={
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
              {serverVariables?.nodes.map((serverVariable) => (
                <button
                  onClick={() => onAddVariable(serverVariable.key, true)}
                  key={serverVariable.key}
                  className="text-left flex flex-col border p-2 rounded-md hover:bg-gray-100 hover:shadow-sm duration-150"
                >
                  <span className="font-semibold">{serverVariable.key}</span>
                  <span className="text-sm text-gray-500">
                    {serverVariable.description}
                  </span>
                  <span className="text-xs text-gray-500 mt-3">
                    예시: {serverVariable.example}
                  </span>
                </button>
              ))}
            </div>
          }
        >
          <Button className="mb-1">변수 추가</Button>
        </Popover>
      </Form.Item>
      <Form.Item
        name={["content"]}
        rules={[{ required: true, message: "메세지 내용을 입력해주세요." }]}
      >
        <TextArea
          rows={10}
          placeholder="메세지 내용"
          maxLength={800}
          showCount
        />
      </Form.Item>
      <Form.Item label="메세지 부가정보" name={["kakaoTemplate", "extra"]}>
        <TextArea
          disabled
          rows={5}
          className="border border-gray-300 rounded-md p-2"
          placeholder="추가정보"
        />
      </Form.Item>
    </>
  );

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
        title={`메세지 수정`}
        description="메세지를 수정할 수 있습니다."
      />
      {disableFullyCustomKakaoUpdate && (
        <InspectionStatusAlert
          status={kakaoTemplate.status}
          onCancelInspection={cancelInspectionHandler}
        />
      )}
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="col-span-1 h-min items-center gap-3 flex-col flex lg:flex-none min-w-[280px] lg:sticky lg:top-0">
            <Form.Item
              shouldUpdate={(prevValues, currentValues) =>
                prevValues !== currentValues
              }
              noStyle
            >
              {() => (
                <AlimTalk
                  content={
                    form.getFieldValue("type") === "FULLY_CUSTOM"
                      ? form.getFieldValue(["kakaoTemplate", "content"])
                      : form
                          .getFieldValue(["kakaoTemplate", "content"])
                          ?.replace(
                            "#{상품안내}",
                            form.getFieldValue(["content"]) || ""
                          )
                  }
                  buttons={form
                    .getFieldValue(["kakaoTemplate", "buttons"])
                    ?.filter((item: any) => item.type !== "AC")
                    .map((item: any) => ({ buttonName: item.name }))}
                  channelAddButton={
                    !!form
                      .getFieldValue(["kakaoTemplate", "buttons"])
                      ?.find((item: any) => item.type === "AC")
                  }
                  extra={form.getFieldValue(["kakaoTemplate", "extra"])}
                  image={
                    form.getFieldValue(["kakaoTemplate", "imageUrl"]) ??
                    undefined
                  }
                />
              )}
            </Form.Item>
            <Popover
              title="검수 주의사항"
              content={
                <>
                  <p>카카오에서 작성된 검수 주의사항입니다.</p>
                  <p>
                    해당 주의사항을 따르지 않을 경우 검수가 거절될 수 있습니다.
                  </p>
                </>
              }
              trigger="hover"
            >
              <Button
                danger
                onClick={() => {
                  window.open(
                    "https://kakaobusiness.gitbook.io/main/ad/bizmessage/notice-friend/audit",
                    "_blank"
                  );
                }}
              >
                <WarningOutlined />
                필독! 메세지 작성시 주의사항
              </Button>
            </Popover>
          </div>
          <Card className="w-full">
            <h2 className="text-2xl font-semibold mb-4">메세지 정보</h2>
            <div className="flex flex-col gap-1">
              <Form.Item
                name={["name"]}
                label="메세지 이름"
                rules={[
                  { required: true, message: "메세지 이름을 입력해주세요." },
                ]}
              >
                <Input placeholder="메세지 이름" />
              </Form.Item>
              <Form.Item noStyle dependencies={["type"]}>
                {(form) => {
                  return form.getFieldValue("type") === "FULLY_CUSTOM"
                    ? isFullyCustom
                    : isCustom;
                }}
              </Form.Item>

              <Form.Item name={["kakaoTemplate", "buttons"]} noStyle />
              <Form.Item name="type" noStyle />
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues?.kakaoTemplate?.buttons !==
                  currentValues?.kakaoTemplate?.buttons
                }
              >
                {(form: FormInstance<MessageUpdateDto>) => {
                  return (
                    <div className="flex flex-col gap-1 mb-4">
                      {form
                        .getFieldsValue()
                        .kakaoTemplate?.buttons?.map(
                          (button: any, index: number) => (
                            <div
                              key={index}
                              className="p-3 border rounded-lg flex items-center gap-3"
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className="font-semibold">
                                  {button.type === "AC"
                                    ? "채널 추가"
                                    : button.name}
                                </span>
                                <div className="flex gap-2 items-center ml-4">
                                  {button.url && (
                                    <a
                                      href={button.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:text-blue-600 text-ellipsis overflow-hidden whitespace-nowrap w-[150px] hidden sm:block"
                                    >
                                      {button.url}
                                    </a>
                                  )}
                                  <Tag className="text-[14px]">
                                    {
                                      KakaoButtonMapping[
                                        button.type as KakaoButtonType
                                      ]
                                    }
                                    형
                                  </Tag>
                                  {!isCustom && (
                                    <Button
                                      type="primary"
                                      danger
                                      onClick={() => removeButton(index)}
                                    >
                                      삭제
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  );
                }}
              </Form.Item>

              <Form.Item label="디지털 컨텐츠 선택" name="contentGroupId">
                <Select
                  placeholder="디지털 컨텐츠를 선택해주세요. (선택)"
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  loading={contentGroupLoading}
                >
                  {contentGroup?.nodes.map((contentGroup) => (
                    <Select.Option
                      key={contentGroup.id}
                      value={contentGroup.id}
                    >
                      {contentGroup.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="메세지 발송 대상" name="target">
                <Select placeholder="메세지 발송 대상을 선택해주세요.">
                  {Object.entries(MessageTargetMapping).map(([key, value]) => (
                    <Select.Option key={key} value={key}>
                      {value}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.target !== currentValues.target
                }
              >
                {(form: FormInstance<MessageUpdateDto>) =>
                  form.getFieldValue("target") === "CUSTOM" && (
                    <Form.Item
                      label="지정 발송 번호"
                      name="customPhone"
                      rules={[
                        {
                          required: false,
                          message: "지정 발송 번호를 입력해주세요.",
                        },
                        {
                          min: 11,
                          max: 11,
                          message:
                            '"-"를 제외한 11자리의 휴대폰 번호를 입력해주세요.',
                        },
                      ]}
                    >
                      <Input
                        placeholder="휴대폰 번호를 입력해주세요."
                        type="tel"
                        maxLength={11}
                        minLength={11}
                      />
                    </Form.Item>
                  )
                }
              </Form.Item>
              <Form.Item
                name="completeDelivery"
                noStyle
                dependencies={["completeDelivery"]}
              >
                <Checkbox
                  defaultChecked={false}
                  checked={form.getFieldValue("completeDelivery")}
                  onChange={(e) => {
                    form.setFieldsValue({ completeDelivery: e.target.checked });
                  }}
                >
                  발송 완료 시 주문을 배송 완료로 변경
                </Checkbox>
              </Form.Item>
              <Form.Item name="inspection" noStyle dependencies={["type"]}>
                {form.getFieldValue("type") === "FULLY_CUSTOM" && (
                  <Checkbox
                    className="mt-2"
                    defaultChecked={false}
                    onChange={(e) => {
                      form.setFieldsValue({ inspection: e.target.checked });
                    }}
                  >
                    수정과 동시에 검수 요청
                  </Checkbox>
                )}
              </Form.Item>
              <Form.Item>
                <div className="flex gap-3 mt-4">
                  <Button type="primary" htmlType="submit">
                    <MessageOutlined />
                    메세지 수정
                  </Button>
                  <Button type="primary" onClick={() => router.back()} danger>
                    <CloseOutlined />
                    메세지 수정 취소
                  </Button>
                </div>
              </Form.Item>
            </div>
          </Card>
        </div>
      </Form>
    </Component>
  );
};

export default UpdateKakaoMessage;
