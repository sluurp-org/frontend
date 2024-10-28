import {
  useCreateKakaoConnection,
  useCreateKakaoConnectionToken,
  useDeleteKakaoConnection,
  useKakaoConnectionCategories,
} from "@/hooks/queries/useKakao";
import Error from "../Error";
import { Button, Cascader, Form, Input } from "antd";
import toast from "react-hot-toast";
import Loading from "../Loading";
import { MessageOutlined } from "@ant-design/icons";

export function CreateKakaoConnection({
  workspaceId,
}: {
  workspaceId: number;
}) {
  const [form] = Form.useForm();
  const { mutateAsync: createKakaoConnectionToken } =
    useCreateKakaoConnectionToken(workspaceId);
  const { mutateAsync: createKakaoConnection } =
    useCreateKakaoConnection(workspaceId);
  const { mutateAsync: deleteKakaoConnection } =
    useDeleteKakaoConnection(workspaceId);
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useKakaoConnectionCategories(workspaceId);

  if (isCategoriesError) {
    return <Error isFullPage={false} />;
  }

  if (isCategoriesLoading) {
    return <Loading isFullPage={false} />;
  }

  const handleCreateKakaoConnection = async () => {
    const { searchId, phoneNumber, categoryCode, token } =
      form.getFieldsValue();
    if (!searchId || !phoneNumber || !categoryCode || !token) {
      toast.error("모든 항목을 입력해주세요");
      return;
    }

    toast.promise(
      createKakaoConnection({
        searchId,
        phoneNumber,
        categoryCode: categoryCode[categoryCode.length - 1],
        token,
      }),
      {
        loading: "연동 중...",
        success: "연동 완료",
        error: (error) => {
          return error.response?.data.message || "연동 실패";
        },
      }
    );
  };

  const handleCreateKakaoConnectionToken = async () => {
    const { searchId, phoneNumber } = form.getFieldsValue();
    if (!searchId || !phoneNumber) {
      toast.error("검색 아이디, 전화번호를 입력해주세요");
      return;
    }

    toast.promise(createKakaoConnectionToken({ searchId, phoneNumber }), {
      loading: "인증번호 요청 중...",
      success: "인증번호 요청 완료",
      error: (error) => {
        return error.response?.data.message || "인증번호 요청 실패";
      },
    });
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-gray-800">카카오톡 채널 연동</h2>
      <div className="flex flex-col mt-3">
        <Form
          onFinish={handleCreateKakaoConnection}
          form={form}
          layout="vertical"
        >
          <Form.Item label="카카오톡 검색 아이디" name="searchId" required>
            <Input placeholder="검색 아이디를 입력해주세요" />
          </Form.Item>
          <Form.Item
            label="카카오톡 담당자 전화번호"
            name="phoneNumber"
            required
            rules={[
              {
                pattern: /^010\d{4}\d{4}$/,
                message:
                  "전화번호 형식이 올바르지 않습니다. - 없이 입력해주세요",
              },
            ]}
          >
            <Input placeholder="전화번호를 입력해주세요" />
          </Form.Item>
          <Form.Item label="인증번호 요청">
            <Button
              type="primary"
              onClick={handleCreateKakaoConnectionToken}
              icon={<MessageOutlined />}
            >
              인증번호 요청
            </Button>
          </Form.Item>
          <Form.Item
            label="카카오톡 알림톡 카테고리"
            name="categoryCode"
            required
          >
            <Cascader
              options={categories}
              allowClear
              autoClearSearchValue
              placeholder="카테고리를 선택해주세요"
            />
          </Form.Item>
          <Form.Item label="인증번호" name="token" required>
            <Input placeholder="인증번호를 입력해주세요" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              연동하기
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
