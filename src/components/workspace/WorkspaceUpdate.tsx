import { useUpdateWorkspace, useWorkspace } from "@/hooks/queries/useWorkspace";
import Loading from "../Loading";
import { Button, Form, Input } from "antd";
import toast from "react-hot-toast";
import { useForm } from "antd/es/form/Form";

export default function WorkspaceUpdate({
  workspaceId,
}: {
  workspaceId: number;
}) {
  const { data: workspace, isLoading } = useWorkspace(workspaceId);
  const { mutateAsync: updateWorkspace } = useUpdateWorkspace(workspaceId);
  const [form] = useForm();

  const handleUpdate = async () => {
    const name = form.getFieldValue("name");
    toast.promise(updateWorkspace({ name }), {
      loading: "워크스페이스 업데이트 중...",
      success: "워크스페이스 업데이트 완료",
      error: "워크스페이스 업데이트 실패",
    });
  };

  if (isLoading) return <Loading isFullPage={false} />;

  return (
    <div>
      <p className="text-lg font-bold mb-4">워크스페이스 설정</p>
      <Form
        layout="vertical"
        onFinish={handleUpdate}
        form={form}
        initialValues={{ name: workspace?.name }}
      >
        <Form.Item
          label="워크스페이스 이름"
          name="name"
          rules={[
            { required: true, message: "워크스페이스 이름을 입력해주세요." },
          ]}
        >
          <Input required />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            저장
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
