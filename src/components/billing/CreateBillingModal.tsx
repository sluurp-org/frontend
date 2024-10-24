import { useCreateBilling } from "@/hooks/queries/useBilling";
import errorHandler from "@/utils/error";
import { DatePicker, Form, Input, Modal } from "antd";
import toast from "react-hot-toast";

export function CreateBillingModal({
  workspaceId,
  open,
  onClose,
}: {
  workspaceId: number;
  open: boolean;
  onClose: () => void;
}) {
  const [form] = Form.useForm();
  const { mutateAsync: createBilling } = useCreateBilling(workspaceId);

  const onFinish = (values: any) => {
    const {
      number,
      expirationDate,
      birthOrBusinessRegistrationNumber,
      passwordTwoDigits,
    } = values;

    toast.promise(
      createBilling({
        number,
        expiryYear: expirationDate.year().toString().slice(-2),
        expiryMonth: (expirationDate.month() + 1).toString().padStart(2, "0"),
        birthOrBusinessRegistrationNumber,
        passwordTwoDigits,
      }),
      {
        loading: "카드 등록 중...",
        success: () => {
          onClose();
          return "카드 등록 완료";
        },
        error: (error) => {
          return error.response?.data.message || errorHandler(error);
        },
      }
    );
  };

  return (
    <Modal
      title="카드 등록"
      open={open}
      okText="등록"
      cancelText="취소"
      onCancel={onClose}
      destroyOnClose
      onOk={() => form.submit()}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="카드번호"
          name="number"
          rules={[{ required: true, message: "카드번호를 입력해주세요." }]}
        >
          <Input placeholder="카드번호를 입력해주세요." name="card" />
        </Form.Item>
        <Form.Item
          label="만료일"
          name="expirationDate"
          rules={[{ required: true, message: "만료일을 선택해주세요." }]}
        >
          <DatePicker
            picker="month"
            placeholder="만료일을 선택해주세요."
            className="w-full"
            format="YYYY-MM"
          />
        </Form.Item>
        <Form.Item
          label="생년월일 또는 사업자번호"
          name="birthOrBusinessRegistrationNumber"
          rules={[
            {
              required: true,
              message: "생년월일 또는 사업자번호를 입력해주세요.",
            },
            {
              min: 6,
              max: 10,
              message: "생년월일 또는 사업자번호를 입력해주세요.",
            },
          ]}
        >
          <Input placeholder="생년월일 또는 사업자번호를 입력해주세요." />
        </Form.Item>
        <Form.Item
          label="카드 비밀번호"
          name="passwordTwoDigits"
          rules={[
            { required: true, message: "카드 비밀번호 두자리를 입력해주세요." },
            { min: 2, max: 2, message: "카드 비밀번호 두자리를 입력해주세요." },
          ]}
        >
          <Input placeholder="카드 비밀번호 두자리를 입력해주세요." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
