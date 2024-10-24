import { useCreateContent } from "@/hooks/queries/useContent";
import { ContentType } from "@/types/content";
import { Alert, Button, Form, Image, Input, Modal } from "antd";
import errorHandler from "@/utils/error";
import router from "next/router";
import { useEffect } from "react";
import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { Rule } from "antd/es/form";

export default function CreateContentModal({
  open,
  onClose,
  workspaceId,
  contentGroupId,
  contentType,
}: {
  open: boolean;
  onClose: () => void;
  workspaceId: number;
  contentGroupId: number;
  contentType: ContentType;
}) {
  const [form] = Form.useForm();
  const { mutateAsync: createContent } = useCreateContent(
    workspaceId,
    contentGroupId
  );

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData("text");
      if (text) {
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        const currentFields = form.getFieldValue("text") || [];
        const newFields = [...currentFields, ...lines];
        form.setFieldsValue({ text: newFields });
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [form]);

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [form, open]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (values.text.length === 0) {
      toast.error("콘텐츠를 추가해주세요.");
      return;
    }

    toast.promise(createContent(values), {
      loading: "콘텐츠를 추가하는 중입니다.",
      success: () => {
        onClose();
        return "콘텐츠가 추가되었습니다.";
      },
      error: (error) => {
        errorHandler(error, router);
        return "콘텐츠 추가에 실패했습니다.";
      },
    });
  };

  const formRules: Rule[] = [
    contentType === "BARCODE"
      ? {
          validator: (rule, value) => {
            if (isNaN(value)) {
              return Promise.reject();
            }
            return Promise.resolve();
          },
          message: "바코드 형식(숫자)의 콘텐츠를 입력해주세요.",
        }
      : { required: true, message: "콘텐츠를 입력해주세요." },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="콘텐츠 추가"
      destroyOnClose
      onClose={onClose}
      cancelButtonProps={{ className: "hidden" }}
      okButtonProps={{ className: "hidden" }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Alert
          type="info"
          message={
            <>
              <p className="mb-3">
                콘텐츠를 추가할때 엑셀 또는 메모장에서 엔터로 구분된 문자를
                붙여넣기 할 수 있습니다.
              </p>
              <Image
                src="/guide/upload-texts.gif"
                alt="content-add"
                className="w-full"
              />
              <p className="text-sm text-gray-500">눌러서 이미지 크게 보기</p>
            </>
          }
          showIcon
          icon={<InfoCircleOutlined />}
        />
        {contentType === "BARCODE" && (
          <Alert
            type="info"
            message="바코드 형식(숫자)의 콘텐츠를 입력해주세요."
            showIcon
            icon={<InfoCircleOutlined />}
            className="mt-2"
          />
        )}
        <Form.List name="text">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <div key={field.key}>
                  <p className="mt-2 mb-1">컨텐츠 내용 {field.name + 1}</p>
                  <div className="flex gap-2">
                    <Form.Item
                      noStyle
                      name={field.name}
                      required
                      rules={formRules}
                    >
                      <Input placeholder="콘텐츠 내용을 입력해주세요." />
                    </Form.Item>
                    <Button
                      type="primary"
                      danger
                      onClick={() => remove(field.name)}
                    >
                      <DeleteOutlined />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                block
                className="mt-4"
              >
                콘텐츠 내용 추가
              </Button>
            </>
          )}
        </Form.List>
        <Button type="primary" htmlType="submit" className="mt-4 w-full">
          콘텐츠 추가
        </Button>
      </Form>
    </Modal>
  );
}
