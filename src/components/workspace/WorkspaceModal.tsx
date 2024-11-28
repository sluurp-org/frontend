import { useCreateWorkspace } from "@/hooks/queries/useWorkspace";
import { CreateWorkspaceDto } from "@/types/workspace";
import errorHandler from "@/utils/error";
import { Form, Input, Modal } from "antd";
import toast from "react-hot-toast";

export default function WorkspaceModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form] = Form.useForm<CreateWorkspaceDto>();
  const { mutateAsync: createWorkspace } = useCreateWorkspace();

  const handleSubmit = async () => {
    const values = await form.validateFields();

    toast.promise(createWorkspace(values), {
      loading: "워크스페이스 생성중...",
      success: "워크스페이스 생성 완료",
      error: (error) => {
        return errorHandler(error);
      },
    });

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      onCancel={onClose}
      okText="생성"
      onOk={handleSubmit}
      title="워크스페이스 생성"
    >
      <p className="mb-5 text-gray-400">
        워크스페이스를 생성하면 주문을 수집하고 메시지를 자동 발송할 수
        있습니다.
      </p>
      <Form onFinish={handleSubmit} form={form} layout="vertical">
        <Form.Item label="워크스페이스 이름" name="name" required>
          <Input required placeholder="스르륵 워크스페이스" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
