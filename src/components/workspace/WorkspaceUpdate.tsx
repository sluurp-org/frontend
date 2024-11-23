import {
  useDeleteWorkspace,
  useUpdateWorkspace,
  useWorkspace,
} from "@/hooks/queries/useWorkspace";
import Loading from "../Loading";
import { Button, Card, Form, Input, Popover } from "antd";
import toast from "react-hot-toast";
import { useForm } from "antd/es/form/Form";
import { KakaoConnection } from "../kakao/KakaoConnection";

export default function WorkspaceUpdate({
  workspaceId,
}: {
  workspaceId: number;
}) {
  const { data: workspace, isLoading } = useWorkspace(workspaceId);
  const { mutateAsync: updateWorkspace } = useUpdateWorkspace(workspaceId);
  const { mutateAsync: deleteWorkspace } = useDeleteWorkspace(workspaceId);
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

  const handleDeleteWorkspace = async () => {
    toast.promise(deleteWorkspace(), {
      loading: "워크스페이스 삭제 중...",
      success: "워크스페이스 삭제 완료",
      error: "워크스페이스 삭제 실패",
    });
  };

  return (
    <div className="max-w-[500px] flex flex-col gap-4">
      <Card>
        <p className="text-lg font-bold mb-4">
          {workspace?.name} 워크스페이스 설정
        </p>
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
      </Card>
      <Card>
        <KakaoConnection workspaceId={workspaceId} />
      </Card>
      {/* <Popover
        title="워크스페이스 삭제"
        trigger="click"
        content={
          <div>
            <p className="text-sm text-gray-500">
              워크스페이스를 삭제하시겠습니까? 삭제 후 복구가 불가능합니다.
            </p>
            <Button
              type="primary"
              className="mt-3"
              danger
              onClick={handleDeleteWorkspace}
            >
              삭제
            </Button>
          </div>
        }
      >
        <Button type="primary" className="w-min" danger disabled>
          워크스페이스 삭제
        </Button>
      </Popover> */}
    </div>
  );
}
