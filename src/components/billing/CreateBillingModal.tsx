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
      expiryMonth,
      expiryYear,
      birthOrBusinessRegistrationNumber,
      passwordTwoDigits,
    } = values;

    toast.promise(
      createBilling({
        number,
        expiryYear: expiryYear.slice(-2),
        expiryMonth,
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
          label="만료 월"
          name="expiryMonth"
          rules={[
            { required: true, message: "2자리 만료 월을 입력해주세요." },
            {
              pattern: /^(0[1-9]|1[0-2])$/,
              message: "만료 월을 입력해주세요.",
            },
          ]}
        >
          <Input placeholder="2자리 만료 월을 입력해주세요." />
        </Form.Item>
        <Form.Item
          label="만료 연도"
          name="expiryYear"
          rules={[
            { required: true, message: "4자리 만료 연도를 입력해주세요." },
            {
              pattern: /^(20[2-9][0-9]|2100)$/,
              message: "만료 연도를 입력해주세요.",
            },
          ]}
        >
          <Input placeholder="4자리 만료 연도를 입력해주세요." />
        </Form.Item>
        <Form.Item
          label="생년월일 6자리 또는 사업자번호"
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
          <Input.Password placeholder="카드 비밀번호 두자리를 입력해주세요." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
