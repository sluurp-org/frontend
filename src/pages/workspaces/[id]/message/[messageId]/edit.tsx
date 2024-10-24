import Header from "@/components/Header";
import Component from "../../../../../components/Container";
import { useRouter } from "next/router";
import {
  ArrowLeftOutlined,
  CloseCircleOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import AlimTalk from "@/components/kakao/AlimTalk";
import { useForm } from "react-hook-form";
import {
  useCancelInspection,
  useMessage,
  useRequestInspection,
  useUpdateMessage,
} from "@/hooks/queries/useMessage";
import Loading from "@/components/Loading";
import errorHandler from "@/utils/error";
import { NextRouter } from "next/router";
import {
  CloseOutlined,
  DownOutlined,
  MessageOutlined,
  UpOutlined,
} from "@ant-design/icons";
import {
  KakaoButtonMapping,
  KakaoButtonType,
  KakaoTemplateStatus,
  MessageUpdateDto,
} from "@/types/message";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Button,
  Input,
  Select,
  Form,
  Tag,
  Empty,
  Popover,
  Alert,
  Checkbox,
  Upload,
} from "antd";
import toast from "react-hot-toast";
import { isURL } from "validator";
import {
  useKakaoTemplateCategories,
  useVariables,
} from "@/hooks/queries/useMessage";
import axiosClient from "@/utils/axios";
import { UploadChangeParam } from "antd/es/upload";
import { useContentGroup, useContentGroups } from "@/hooks/queries/useContent";
import Error from "@/components/Error";

const { TextArea } = Input;
const { Option } = Select;

const KakaoButton = ({
  index,
  form,
  disableKakaoTemplate = false,
}: {
  index: number;
  form: any;
  disableKakaoTemplate: boolean;
}) => {
  const button = form.watch(`kakaoTemplate.buttons.${index}`);

  const onClickUp = () => {
    const buttons = form.watch("kakaoTemplate.buttons", []);
    if (index === 0) return;

    const temp = buttons[index];
    buttons[index] = buttons[index - 1];
    buttons[index - 1] = temp;
    form.setValue("kakaoTemplate.buttons", buttons);
  };

  const onClickDown = () => {
    const buttons = form.watch("kakaoTemplate.buttons", []);
    if (index === buttons.length - 1) return;

    const temp = buttons[index];
    buttons[index] = buttons[index + 1];
    buttons[index + 1] = temp;
    form.setValue("kakaoTemplate.buttons", buttons);
  };

  const upAble =
    (form.watch("kakaoTemplate.buttons", [])[0].type !== "AC" && index === 1) ||
    index > 1;
  const downAble = index < form.watch("kakaoTemplate.buttons", []).length - 1;

  return (
    <div key={index} className="p-3 border rounded-lg flex items-center gap-3">
      {button.type !== "AC" && (upAble || downAble) && (
        <div className="flex items-center gap-2">
          {upAble && (
            <Button
              disabled={disableKakaoTemplate}
              onClick={onClickUp}
              type="text"
              className="w-min p-0 m-0"
            >
              <UpOutlined />
            </Button>
          )}
          {downAble && (
            <Button
              disabled={disableKakaoTemplate}
              onClick={onClickDown}
              type="text"
              className="w-min p-0 m-0"
            >
              <DownOutlined />
            </Button>
          )}
        </div>
      )}

      <div className="flex justify-between items-center w-full">
        <span className="font-semibold">
          {button.type === "AC" ? "채널 추가" : button.name}
        </span>
        <div className="flex gap-2 items-center ml-4">
          <a
            href={button.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 text-ellipsis overflow-hidden whitespace-nowrap w-[150px] hidden sm:block"
          >
            {button.url}
          </a>
          <Tag className="text-[14px]">
            {KakaoButtonMapping[button.type as keyof typeof KakaoButtonMapping]}
            형
          </Tag>
          <Button
            type="primary"
            danger
            disabled={disableKakaoTemplate}
            onClick={() => {
              form.setValue("kakaoTemplate.buttons", [
                ...form
                  .watch("kakaoTemplate.buttons", [])
                  .filter((_: any, i: number) => i !== index),
              ]);
            }}
          >
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
};

const MessageForm = ({
  form,
  router,
  workspaceId,
  onSubmit,
  disableKakaoTemplate = false,
}: {
  form: UseFormReturn<MessageUpdateDto>;
  router: NextRouter;
  workspaceId: number;
  onSubmit: (data: MessageUpdateDto, withInspection: boolean) => void;
  disableKakaoTemplate: boolean;
}) => {
  const antForm = Form.useForm()[0];
  const [button, setButton] = useState<{
    name: string;
    type: KakaoButtonType;
    url?: string;
  }>({
    name: "",
    type: "AC",
  });
  const [variables, setVariables] = useState<
    {
      key: string;
      value: string;
    }[]
  >([]);
  const [withInspection, setWithInspection] = useState(false);

  useEffect(() => {
    const formValues = form.getValues();
    antForm.setFieldsValue({
      ...formValues,
      ...formValues.kakaoTemplate,
    });
    setVariables(form.watch("variables") || []);
  }, [antForm, form]);

  const createButton = () => {
    if (!button.name && button.type !== "AC") {
      toast.error("버튼 이름을 입력해주세요.");
      return;
    }
    if (!button.type) {
      toast.error("버튼 타입을 선택해주세요.");
      return;
    }
    if (!button.url && button.type === "WL") {
      toast.error("버튼 URL을 입력해주세요.");
      return;
    }

    if (button.type === "WL" && !isURL(button.url || "")) {
      toast.error("버튼 URL이 올바르지 않습니다.");
      return;
    }

    if ((form.watch("kakaoTemplate.buttons")?.length || 0) >= 5) {
      toast.error("버튼은 최대 5개까지 생성할 수 있습니다.");
      return;
    }

    if (
      form
        .watch("kakaoTemplate.buttons")
        ?.find((button) => button.type === "AC") &&
      button.type === "AC"
    ) {
      toast.error("채널 추가 버튼은 최대 1개까지 생성할 수 있습니다.");
      return;
    }

    form.setValue(
      "kakaoTemplate.buttons",
      button.type === "AC"
        ? [
            {
              type: "AC",
              name: "채널 추가",
            },
            ...(form.watch("kakaoTemplate.buttons", []) || []),
          ]
        : [...(form.watch("kakaoTemplate.buttons", []) || []), button]
    );

    setButton({
      name: "",
      type: "AC",
    });
  };

  const availableVariables = Array.from(
    new Set(form.watch("kakaoTemplate.content", "")?.match(/#\{[^}]+\}/g) || [])
  );

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useKakaoTemplateCategories(workspaceId);
  const {
    data: contentGroup,
    isLoading: contentGroupLoading,
    error: contentGroupError,
  } = useContentGroups(workspaceId);

  const { data: serverVariables, error: variablesError } =
    useVariables(workspaceId);

  if (categoriesError || variablesError || contentGroupError) {
    errorHandler(
      categoriesError || variablesError || contentGroupError,
      router
    );
    return <Error />;
  }

  const onFinish = () => {
    const formValues = form.getValues();
    const formVariables = variables
      .filter((variable) => availableVariables.includes(variable.key))
      .map((variable) => ({
        key: variable.key,
        value: variable.value,
      }));
    onSubmit(
      {
        ...formValues,
        kakaoTemplate: {
          ...formValues.kakaoTemplate,
          extra: formValues?.kakaoTemplate?.extra || undefined,
        },
        variables: formVariables,
      },
      withInspection
    );
  };

  const uploadImage = async (options: any) => {
    const { onSuccess, onError, file } = options;

    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    fmData.append("file", file);
    try {
      const res = await axiosClient.post(
        `/workspace/${workspaceId}/kakao/image`,
        fmData,
        config
      );

      onSuccess("Ok");
      form.setValue("kakaoTemplate.imageId", res.data.fileId);
      form.setValue("kakaoTemplate.imageUrl", res.data.url);
    } catch (err) {
      errorHandler(err, router);
      onError({ err });
    }
  };

  const onFileChange = (info: UploadChangeParam) => {
    const file = info.file;

    if (file.status === "removed") {
      form.setValue("kakaoTemplate.imageId", undefined);
      form.setValue("kakaoTemplate.imageUrl", undefined);
    }
  };

  return (
    <Form
      layout="vertical"
      className="flex flex-col w-full xl:w-2/3"
      onFinish={onFinish}
      form={antForm}
    >
      <Form.Item label="메세지 이름" name="name" required>
        <Input
          required
          value={form.watch("name", "gay")}
          placeholder="메세지 이름을 입력해주세요."
          className="border border-gray-300 rounded-md p-2"
          onChange={(e) => form.setValue("name", e.target.value)}
        />
      </Form.Item>
      <Form.Item label="메세지 카테고리" name="categoryCode" required>
        {categoriesLoading || !categories ? (
          <Loading isFullPage={false} />
        ) : (
          <Select
            showSearch
            disabled={disableKakaoTemplate}
            placeholder="메세지 카테고리를 선택해주세요."
            value={form.watch("kakaoTemplate.categoryCode")}
            onChange={(value) =>
              form.setValue("kakaoTemplate.categoryCode", value)
            }
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
      <Form.Item label="메세지 이미지" name="image">
        <Upload
          disabled={disableKakaoTemplate}
          accept=".jpg,.jpeg,.png"
          name="image"
          onChange={onFileChange}
          customRequest={uploadImage}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />} disabled={disableKakaoTemplate}>
            사진 업로드
          </Button>
        </Upload>
        <ul className="list-disc list-inside text-left mt-2">
          <li>파일 사이즈 최대 500KB</li>
          <li>가로:세로 비율이 2:1</li>
          <li>JPEG, JPG, PNG 확장자</li>
          <li>
            <Button
              danger
              onClick={() => {
                window.open(
                  "https://kakaobusiness.gitbook.io/main/ad/bizmessage/notice-friend/content-guide/image",
                  "_blank"
                );
              }}
            >
              <WarningOutlined />
              필독! 메세지 이미지 가이드
            </Button>
          </li>
        </ul>
      </Form.Item>
      <Form.Item label="콘텐츠 선택" name="contentGroupId">
        <Select
          placeholder="콘텐츠를 선택해주세요. (선택)"
          showSearch
          allowClear
          disabled={disableKakaoTemplate}
          filterOption={(input, option) =>
            (option?.label?.toString() ?? "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          loading={contentGroupLoading}
          value={form.watch("contentGroupId")}
          onChange={(e) => form.setValue("contentGroupId", e)}
        >
          {contentGroup?.nodes.map((contentGroup) => (
            <Option key={contentGroup.id} value={contentGroup.id}>
              {contentGroup.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="메세지 내용" name="content" required>
        <div className="flex items-center gap-2">
          <Button
            className="mb-1"
            disabled={disableKakaoTemplate}
            onClick={() => {
              form.setValue(
                "kakaoTemplate.content",
                form.watch("kakaoTemplate.content", "") + "#{변수명}"
              );
            }}
          >
            변수 추가
          </Button>
          <span className="text-sm text-gray-500">
            변수는 #{"{변수명}"} 형식으로 사용할 수 있습니다.
          </span>
        </div>
        <TextArea
          required
          rows={10}
          disabled={disableKakaoTemplate}
          className="border border-gray-300 rounded-md p-2"
          placeholder="#{구매자명}님 #{상품명}을 구매해주셔서 감사합니다."
          value={form.watch("kakaoTemplate.content")}
          onChange={(e) =>
            form.setValue("kakaoTemplate.content", e.target.value)
          }
        />
      </Form.Item>
      <Form.Item label="메세지 부가정보" name="extra">
        <TextArea
          rows={5}
          disabled={disableKakaoTemplate}
          className="border border-gray-300 rounded-md p-2"
          placeholder="추가정보 (선택, 변수 사용불가능)"
          value={form.watch("kakaoTemplate.extra")}
          onChange={(e) => form.setValue("kakaoTemplate.extra", e.target.value)}
        />
      </Form.Item>
      <Form.Item label="메세지 버튼" name="buttons">
        <div className="flex gap-1">
          <Select
            className="border-gray-300 rounded-md h-[40px]"
            disabled={disableKakaoTemplate}
            value={button.type}
            onChange={(value) =>
              setButton({
                ...button,
                type: value as KakaoButtonType,
              })
            }
          >
            {Object.keys(KakaoButtonMapping).map((type) => (
              <Option key={type} value={type}>
                {KakaoButtonMapping[type as keyof typeof KakaoButtonMapping]}
              </Option>
            ))}
          </Select>
          {button.type !== "AC" && (
            <Input
              className="border border-gray-300 rounded-md p-2"
              placeholder="버튼 이름 (변수 사용 불가)"
              disabled={disableKakaoTemplate}
              value={button.name}
              onChange={(e) =>
                setButton({
                  ...button,
                  name: e.target.value,
                })
              }
            />
          )}
        </div>
        {button.type === "WL" && (
          <Input
            className="border border-gray-300 rounded-md p-2 mt-1"
            placeholder="버튼 URL"
            disabled={disableKakaoTemplate}
            type="url"
            onChange={(e) =>
              setButton({
                ...button,
                url: e.target.value,
              })
            }
          />
        )}
        <Button
          type="primary"
          className="bg-blue-500 text-white rounded-md px-3 w-full py-1 mt-2"
          onClick={createButton}
          disabled={disableKakaoTemplate}
        >
          버튼 추가
        </Button>
        <div className="flex flex-col gap-2 mt-3 border p-3 rounded-lg shadow-sm">
          <p className="text-lg font-semibold mb-2">버튼 목록</p>
          {form
            .watch("kakaoTemplate.buttons", [])
            ?.map((button: any, index: number) => (
              <KakaoButton
                key={index}
                index={index}
                form={form}
                disableKakaoTemplate={disableKakaoTemplate}
              />
            ))}
          {!form.watch("kakaoTemplate.buttons")?.length && (
            <Empty description="버튼 추가를 눌러 버튼을 추가해보세요." />
          )}
        </div>
      </Form.Item>
      <Form.Item noStyle>
        {form.watch("contentGroupId") &&
          !form
            .watch("kakaoTemplate.buttons")
            ?.find((t) => t.type === "PR") && (
            <Alert
              className="mb-6"
              type="error"
              icon={<WarningOutlined />}
              showIcon
              message={
                <span>
                  콘텐츠를 선택하였으나 버튼을 추가하지 않았습니다. <br />
                  버튼 목록에서 &quot;디지털 상품 다운로드&quot; 버튼을
                  추가해주세요.
                  <br />
                  버튼을 추가하지 않을경우 구매자가 상품을 받을 수 없습니다.
                </span>
              }
            />
          )}
      </Form.Item>
      <Form.Item label="변수 설정" name="variables">
        <div className="flex flex-col gap-2 border p-3 rounded-lg shadow-sm">
          {availableVariables?.map((variable, index) => (
            <div className="flex items-center gap-2" key={index}>
              <span className="text-sm text-gray-500 w-[150px]">
                {variable}
              </span>
              <Popover
                placement="topLeft"
                title="사용 가능한 변수"
                trigger={["click"]}
                content={
                  <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                    {serverVariables?.nodes.map((serverVariable) => (
                      <button
                        key={serverVariable.key}
                        className="text-left flex flex-col border p-2 rounded-md hover:bg-gray-100 hover:shadow-sm duration-150"
                        onClick={() => {
                          const findVariable = variables.find(
                            (v) => v.key === variable
                          );

                          setVariables(
                            findVariable
                              ? variables.map((v) =>
                                  v.key === variable
                                    ? {
                                        ...v,
                                        value:
                                          findVariable?.value +
                                          `{${serverVariable.key}}`,
                                      }
                                    : v
                                )
                              : [
                                  ...variables,
                                  {
                                    key: variable,
                                    value: `{${serverVariable.key}}`,
                                  },
                                ]
                          );
                        }}
                      >
                        <span className="font-semibold">
                          {serverVariable.key}
                        </span>
                        <span className="text-sm text-gray-500">
                          {serverVariable.description}
                        </span>
                      </button>
                    ))}
                  </div>
                }
              >
                <Input
                  placeholder="변수 값"
                  value={variables.find((v) => v.key === variable)?.value}
                  onChange={(e) => {
                    const findVariable = variables.find(
                      (v) => v.key === variable
                    );
                    setVariables(
                      findVariable
                        ? variables.map((v) =>
                            v.key === variable
                              ? { ...v, value: e.target.value }
                              : v
                          )
                        : [
                            ...variables,
                            { key: variable, value: e.target.value },
                          ]
                    );
                  }}
                />
              </Popover>
            </div>
          ))}
          {!availableVariables?.length && (
            <Empty description="변수가 없습니다." />
          )}
        </div>
      </Form.Item>
      <Form.Item label="배송 완료" name="completeDelivery">
        <Checkbox
          checked={form.watch("completeDelivery")}
          onChange={(e) => form.setValue("completeDelivery", e.target.checked)}
        >
          메세지 발송 완료 시 배송 완료 처리
        </Checkbox>
      </Form.Item>
      <Form.Item>
        {!disableKakaoTemplate && (
          <Checkbox
            checked={withInspection}
            onChange={(e) => setWithInspection(e.target.checked)}
          >
            수정과 동시에 검수 요청을 진행해주세요.
          </Checkbox>
        )}
        {withInspection && (
          <Alert
            className="mt-2"
            message={
              <p className="text-sm font-light">
                요청의 경우에는 영업일 기준 평균 1~3일 정도 소요됩니다.
                <br />
                검수는 거절될 수 있으며 거절 시 메세지 수정이 필요할 수
                있습니다.
                <br />
                문의 사항이 있으시거나 자체 검수를 원하실 경우 우측 하단
                채널톡을 통하여 문의 주시기 바랍니다.
              </p>
            }
            type="info"
          />
        )}
        <div className="flex gap-3 mt-2">
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
    </Form>
  );
};

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
          <p>현재 변경 가능한 항목은 메세지 이름, 변수 입니다.</p>
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

export default function MessageEdit() {
  const router = useRouter();
  const workspaceId = parseInt(router.query.id as string, 10);
  const messageId = parseInt(router.query.messageId as string, 10);
  const form = useForm<MessageUpdateDto>();
  const { mutateAsync: updateMessage } = useUpdateMessage(
    workspaceId,
    messageId
  );
  const [disableKakaoTemplate, setDisableKakaoTemplate] = useState(false);

  const { mutateAsync: requestInspection } = useRequestInspection(workspaceId);
  const { mutateAsync: cancelInspection } = useCancelInspection(
    workspaceId,
    messageId
  );

  const { data, isLoading, error } = useMessage(workspaceId, messageId);
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || undefined,
        variables: data.variables || undefined,
        contentGroupId: data.contentGroupId || undefined,
        completeDelivery: data.completeDelivery || undefined,
        kakaoTemplate: {
          content: data.kakaoTemplate?.content || undefined,
          buttons: data.kakaoTemplate?.buttons || undefined,
          extra: data.kakaoTemplate?.extra || undefined,
          categoryCode: data.kakaoTemplate?.categoryCode || undefined,
          imageUrl: data.kakaoTemplate?.imageUrl || undefined,
        },
      });

      if (
        data.kakaoTemplate.status === "APPROVED" ||
        data.kakaoTemplate.status === "PENDING"
      ) {
        setDisableKakaoTemplate(true);
      } else {
        setDisableKakaoTemplate(false);
      }
    }
  }, [data, form]);
  if (isLoading) return <Loading />;

  if (error || !data) {
    errorHandler(error, router);
    return <Error />;
  }

  const onInspection = () => {
    toast.promise(requestInspection(messageId), {
      loading: "검수 요청중...",
      success: () => {
        return "검수 요청 완료";
      },
      error: (error) => {
        errorHandler(error, router);
        return "검수 요청 실패";
      },
    });
  };

  const onSubmit = (formData: MessageUpdateDto, withInspection: boolean) => {
    const { name, variables, kakaoTemplate, contentGroupId, completeDelivery } =
      formData;
    const parsedData = {
      name,
      variables,
      contentGroupId,
      completeDelivery,
      kakaoTemplate: disableKakaoTemplate ? undefined : kakaoTemplate,
    };

    toast.promise(updateMessage(parsedData), {
      loading: "메세지 수정중...",
      success: () => {
        if (withInspection) onInspection();
        router.push(`/workspaces/${workspaceId}/message/${messageId}`);
        return "메세지 수정 완료";
      },
      error: (error) => {
        errorHandler(error, router);
        return "메세지 수정 실패";
      },
    });
  };

  const onCancelInspection = () => {
    toast.promise(cancelInspection(), {
      loading: "검수 취소중...",
      success: () => {
        return "검수 취소 완료";
      },
      error: (error) => {
        errorHandler(error, router);
        return "검수 취소 실패";
      },
    });
  };

  const InspectionRejectReason = data.kakaoTemplate.status === "REJECTED" &&
    data.kakaoTemplate.comments.length && (
      <Alert
        type="error"
        className="mb-6"
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
      {disableKakaoTemplate && (
        <InspectionStatusAlert
          status={data.kakaoTemplate.status}
          onCancelInspection={onCancelInspection}
        />
      )}
      {InspectionRejectReason}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="col-span-1 h-min items-center gap-3 flex-col flex lg:flex-none min-w-[280px] lg:sticky lg:top-0">
          <AlimTalk
            content={form.watch("kakaoTemplate.content") || ""}
            buttons={form
              .watch("kakaoTemplate.buttons")
              ?.filter((button) => button.type !== "AC")
              ?.map((button) => ({
                buttonName: button.name,
              }))}
            channelAddButton={form
              .watch("kakaoTemplate.buttons")
              ?.some((button) => button.type === "AC")}
            extra={form.watch("kakaoTemplate.extra")}
            image={form.watch("kakaoTemplate.imageUrl")}
          />
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
        <div className="w-full">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">메세지 정보</h2>
            <div className="flex flex-col gap-1">
              <MessageForm
                form={form}
                disableKakaoTemplate={disableKakaoTemplate}
                workspaceId={workspaceId}
                router={router}
                onSubmit={onSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </Component>
  );
}
