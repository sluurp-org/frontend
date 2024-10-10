import { useCreateWorkspace } from "@/hooks/quries/useWorkspace";
import { CreateWorkspaceDto } from "@/types/workspace";
import errorHandler from "@/utils/error";
import { Button, Drawer, Form, Input } from "antd";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function WorkspaceDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [form] = Form.useForm<CreateWorkspaceDto>();
  const { mutateAsync: createWorkspace } = useCreateWorkspace();

  const handleSubmit = async () => {
    const values = await form.validateFields();

    toast.promise(createWorkspace(values), {
      loading: "워크스페이스 생성중...",
      success: "워크스페이스 생성 완료",
      error: (error) => {
        errorHandler(error, router);
        return "워크스페이스 생성 실패";
      },
    });

    onClose();
  };

  return (
    <Drawer open={open} onClose={onClose} title="워크스페이스 생성">
      <Form onFinish={handleSubmit} form={form} layout="vertical">
        <Form.Item label="워크스페이스 이름" name="name" required>
          <Input required />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          생성
        </Button>
      </Form>
    </Drawer>
  );
}
