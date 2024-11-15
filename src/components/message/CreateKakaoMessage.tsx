import React from "react";
import { useRouter } from "next/router";
import {
  CloseOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  useCreateMessage,
  useCustomKakaoTemplates,
  useKakaoTemplateCategories,
  useRequestInspection,
  useVariables,
} from "@/hooks/queries/useMessage";
import Loading from "@/components/Loading";
import errorHandler from "@/utils/error";
import {
  CustomKakaoTemplateDto,
  KakaoButtonMapping,
  KakaoButtonType,
  MessageCreateDto,
  MessageTargetMapping,
  MessageType,
  MessageTypeMap,
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
import { useContentGroups } from "@/hooks/queries/useContent";
import Link from "next/link";

const CreateKakaoMessage = ({ workspaceId }: { workspaceId: number }) => {
  const router = useRouter();

  const { data: categories, isLoading: categoriesLoading } =
    useKakaoTemplateCategories(workspaceId);
  const { data: serverVariables } = useVariables(workspaceId);
  const { data: contentGroup, isLoading: contentGroupLoading } =
    useContentGroups(workspaceId);
  const { data: customKakaoTemplates, isLoading: customKakaoTemplatesLoading } =
    useCustomKakaoTemplates(workspaceId);
  const { mutateAsync: requestInspection } = useRequestInspection(workspaceId);
  const { mutateAsync: createMessage } = useCreateMessage(workspaceId);

  const [form] = Form.useForm<
    MessageCreateDto & {
      buttonType: KakaoButtonType;
      buttonName: string;
      buttonUrl: string;
      inspection: boolean;
      isCustom: boolean;
    }
  >();

  const uploadImage = async (options: any) => {
    const { onSuccess, onError, file } = options;

    const fmData = new FormData();
    fmData.append("file", file);

    try {
      const res = await axiosClient.post(
        `/workspaces/${workspaceId}/kakao/image`,
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
      toast.error(errorHandler(err));
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
      buttonType === "AC"
        ? [
            {
              name: "채널 추가",
              type: "AC",
            },
            ...buttons,
          ]
        : [...buttons, newButton];

    form.setFieldsValue({
      kakaoTemplate: {
        ...form.getFieldValue("kakaoTemplate"),
        buttons: newButtons,
      },
      buttonName: "",
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

  const onInspectionSubmit = async (messageId: number) => {
    toast.promise(requestInspection(messageId), {
      loading: "검수 요청 중...",
      success: "검수 요청 완료",
      error: (error) => errorHandler(error),
    });
  };

  const onSubmit = async () => {
    const values = form.getFieldsValue();

    toast.promise(
      createMessage({
        ...values,
        ...(values.isCustom
          ? { content: values.content }
          : values.kakaoTemplate),
        kakaoTemplate: {
          ...values.kakaoTemplate,
          extra:
            values.kakaoTemplate?.extra === ""
              ? undefined
              : values.kakaoTemplate?.extra,
        },
        sendType: "KAKAO",
      }),
      {
        loading: "메시지 생성 중...",
        success: (value) => {
          if (values.inspection && values.type === "FULLY_CUSTOM")
            onInspectionSubmit(value.id);

          router.push(`/workspaces/${workspaceId}/message/${value.id}`);
          return "메시지 생성 완료";
        },
        error: (error) => errorHandler(error),
      }
    );
  };

  const onTypeChange = (type: MessageType) => {
    form.setFieldsValue({
      kakaoTemplate: {
        ...form.getFieldValue("kakaoTemplate"),
        content: "",
        extra: "",
        buttons: [],
        imageUrl: null,
        categoryCode: null,
      },
      type,
      content: "",
      isCustom: type === "CUSTOM",
      kakaoTemplateId: undefined,
    });
  };

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

  const isFullyCustom = (
    <>
      <Form.Item
        label="메시지 카테고리"
        name={["kakaoTemplate", "categoryCode"]}
        required
        rules={[
          {
            required: true,
            message: "메시지 카테고리를 선택해주세요.",
          },
        ]}
      >
        {categoriesLoading || !categories ? (
          <Loading isFullPage={false} />
        ) : (
          <Select
            showSearch
            placeholder="메시지 카테고리를 선택해주세요."
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
      <Form.Item name={["kakaoTemplate", "imageId"]} hidden noStyle />
      <Form.Item name={["kakaoTemplate", "imageUrl"]} hidden noStyle />
      <Form.Item className="mb-0" label="메시지 이미지">
        <Upload
          accept=".jpg,.jpeg,.png"
          name="image"
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
                필독! 메시지 이미지 가이드
              </Button>
            </Link>
          </li>
        </ul>
      </Form.Item>

      <Form.Item label="메시지 내용" className="mb-0 mt-5">
        <Popover
          placement="topLeft"
          title="사용 가능한 변수"
          trigger={["click"]}
          content={
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
              {serverVariables?.nodes.map((serverVariable) => (
                <button
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
          <Button className="mb-1">변수 추가</Button>
        </Popover>
      </Form.Item>
      <Form.Item
        name={["kakaoTemplate", "content"]}
        rules={[{ required: true, message: "메시지 내용을 입력해주세요." }]}
      >
        <TextArea
          rows={10}
          placeholder="메시지 내용"
          maxLength={800}
          showCount
        />
      </Form.Item>
      <Form.Item label="메시지 부가정보" name={["kakaoTemplate", "extra"]}>
        <TextArea
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
                  <Select className="border-gray-300 rounded-md h-[40px]">
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
                    className="border border-gray-300 rounded-md p-2 mt-1"
                    placeholder="버튼 URL"
                    type="url"
                  />
                </Form.Item>
              )}
              <Button
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
      <Form.Item noStyle name={["isCustom"]} hidden initialValue={true} />
      <Form.Item label="메시지 내용" className="mb-0">
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
        rules={[{ required: true, message: "메시지 내용을 입력해주세요." }]}
      >
        <TextArea
          rows={10}
          placeholder="메시지 내용"
          maxLength={800}
          showCount
        />
      </Form.Item>
    </>
  );

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="col-span-1 h-min items-center gap-3 flex-col flex lg:flex-none min-w-[280px] lg:sticky lg:top-0">
          <Form.Item
            shouldUpdate={(prevValues, currentValues) =>
              prevValues !== currentValues
            }
            noStyle
          >
            {(
              form: FormInstance<
                MessageCreateDto & {
                  buttonType: KakaoButtonType;
                  buttonName: string;
                  buttonUrl: string;
                  inspection: boolean;
                  type: MessageType;
                  isCustom: boolean;
                }
              >
            ) => (
              <AlimTalk
                content={
                  !form.getFieldValue("isCustom")
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
                  form.getFieldValue(["kakaoTemplate", "imageUrl"]) ?? undefined
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
              필독! 메시지 작성시 주의사항
            </Button>
          </Popover>
        </div>
        <Card className="w-full">
          <h2 className="text-2xl font-semibold mb-4">메시지 정보</h2>
          <div className="flex flex-col gap-1">
            <Form.Item
              name={["name"]}
              label="메시지 이름"
              rules={[
                { required: true, message: "메시지 이름을 입력해주세요." },
              ]}
            >
              <Input placeholder="메시지 이름" />
            </Form.Item>
            <Form.Item
              label="메시지 유형"
              name="type"
              initialValue="CUSTOM"
              className="mb-0"
            >
              <Select
                placeholder="메시지 유형을 선택해주세요."
                onChange={onTypeChange}
              >
                <Select.Option key={MessageTypeMap.CUSTOM} value={"CUSTOM"}>
                  빠른 시작형
                </Select.Option>
                <Select.Option
                  key={MessageTypeMap.FULLY_CUSTOM}
                  value={"FULLY_CUSTOM"}
                >
                  완전 맞춤형
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.type !== currentValues.type
              }
            >
              {(form: FormInstance<MessageCreateDto>) => {
                return (
                  <div className="mb-4">
                    {form.getFieldValue("type") === "FULLY_CUSTOM" ? (
                      <Alert
                        icon={<InfoCircleOutlined />}
                        showIcon
                        message={`완전 맞춤형은 원하는 메시지 내용을 직접 입력하고 카카오 승인을 받아야 합니다.\n승인을 받는 대신 버튼, 이미지 등 상세 정보를 입력할 수 있습니다.\n카카오 승인은 영업일 기준 1~3일 정도 소요될 수 있습니다.`}
                        className="whitespace-pre-line"
                      />
                    ) : (
                      <Alert
                        icon={<InfoCircleOutlined />}
                        showIcon
                        message={`빠른 시작형은 템플릿을 선택하고 메시지를 생성할 수 있습니다.\n템플릿을 선택하면 내용, 버튼 등이 자동으로 입력됩니다.\n별도의 승인 절차 없이 바로 발송할 수 있습니다.`}
                        className="whitespace-pre-line"
                      />
                    )}
                  </div>
                );
              }}
            </Form.Item>

            <Form.Item noStyle dependencies={["type"]}>
              {(form) => {
                return form.getFieldValue("type") === "FULLY_CUSTOM"
                  ? isFullyCustom
                  : isCustom;
              }}
            </Form.Item>

            <Form.Item name={["kakaoTemplate", "buttons"]} noStyle />
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues?.kakaoTemplate?.buttons !==
                currentValues?.kakaoTemplate?.buttons
              }
            >
              {(form: FormInstance<MessageCreateDto>) => {
                return (
                  <div className="flex flex-col gap-1 mb-3">
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
                                {form.getFieldValue("type") ===
                                  "FULLY_CUSTOM" && (
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

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues?.kakaoTemplate?.buttons !==
                currentValues?.kakaoTemplate?.buttons
              }
            >
              {(form: FormInstance<MessageCreateDto>) => {
                if (
                  form
                    .getFieldValue(["kakaoTemplate", "buttons"])
                    ?.find((item: any) => item.type === "PR")
                ) {
                  return (
                    <Form.Item
                      label="디지털 컨텐츠 선택"
                      name="contentGroupId"
                      className="mt-4"
                    >
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
                  );
                }
              }}
            </Form.Item>
            <Form.Item
              label="메시지 발송 대상"
              name="target"
              rules={[
                {
                  required: true,
                  message: "메시지 발송 대상을 선택해주세요.",
                },
              ]}
            >
              <Select placeholder="메시지 발송 대상을 선택해주세요.">
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
              {(form: FormInstance<MessageCreateDto>) =>
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
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox
                className="mt-2"
                checked={form.getFieldValue("completeDelivery")}
                onChange={(e) => {
                  form.setFieldsValue({ completeDelivery: e.target.checked });
                }}
              >
                발송 완료 시 주문을 배송 완료로 변경
              </Checkbox>
            </Form.Item>
            <Form.Item noStyle dependencies={["type"]}>
              {(form: FormInstance<MessageCreateDto>) =>
                form.getFieldValue("type") === "FULLY_CUSTOM" && (
                  <Form.Item
                    name="inspection"
                    noStyle
                    valuePropName="checked"
                    dependencies={["type"]}
                    initialValue={false}
                  >
                    <Checkbox className="mt-2">
                      수정과 동시에 검수 요청
                    </Checkbox>
                  </Form.Item>
                )
              }
            </Form.Item>
            <Form.Item>
              <div className="flex gap-3 mt-2">
                <Button type="primary" htmlType="submit">
                  <MessageOutlined />
                  메시지 생성
                </Button>
                <Button type="primary" onClick={() => router.back()} danger>
                  <CloseOutlined />
                  메시지 생성 취소
                </Button>
              </div>
            </Form.Item>
          </div>
        </Card>
      </div>
    </Form>
  );
};

export default CreateKakaoMessage;
