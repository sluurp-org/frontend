import {
  useCreateKakaoConnection,
  useCreateKakaoConnectionToken,
  useDeleteKakaoConnection,
  useKakaoConnectionCategories,
} from "@/hooks/queries/useKakao";
import Error from "../Error";
import { Alert, Button, Cascader, Form, Input } from "antd";
import toast from "react-hot-toast";
import Loading from "../Loading";
import { InfoCircleOutlined, MessageOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useChannel } from "@/contexts/ChannelContext";

export function CreateKakaoConnection({
  workspaceId,
}: {
  workspaceId: number;
}) {
  const [form] = Form.useForm();
  const ChannelService = useChannel();

  const { mutateAsync: createKakaoConnectionToken } =
    useCreateKakaoConnectionToken(workspaceId);
  const { mutateAsync: createKakaoConnection } =
    useCreateKakaoConnection(workspaceId);

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

  const onKakaoConnectionCreateRequest = () => {
    const channelMessage = `카카오 채널 연결 대행 요청을 위해\n아래 정보를 입력해주세요.\n\n워크스페이스 아이디: ${workspaceId} (변경 금지)\n요청자명:\n전화번호:`;

    ChannelService.openChat(undefined, channelMessage);
  };

  return (
    <>
      <h2 className="text-lg font-bold text-gray-800">카카오톡 채널 연동</h2>
      <Alert
        message={
          <>
            <Link
              target="_blank"
              href="https://docs.channel.io/sluurp/ko/articles/09912109-%EC%B9%B4%EC%B9%B4%EC%98%A4-%EC%95%8C%EB%A6%BC%ED%86%A1-%EC%97%B0%EB%8F%99%ED%95%98%EA%B8%B0"
            >
              <span className="font-bold text-indigo-500">
                해당 연동 가이드
              </span>
              를 참고하여 카카오 알림톡을 연동할 수 있습니다.
            </Link>
            <Button
              type="link"
              size="small"
              className="pl-0 text-indigo-500"
              onClick={onKakaoConnectionCreateRequest}
            >
              또는 카카오 연동 대행 요청하기
            </Button>
          </>
        }
        type="info"
        className="mt-3"
        showIcon
        icon={<InfoCircleOutlined />}
      />
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
    </>
  );
}
