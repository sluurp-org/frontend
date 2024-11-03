import DurationInput from "../common/DurationInput";
import { useCreateContentGroup } from "@/hooks/queries/useContent";
import { ContentType, CreateContentGroupDto } from "@/types/content";
import errorHandler from "@/utils/error";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Checkbox,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function CreateContentGroupDrawer({
  workspaceId,
  open,
  onClose,
}: {
  workspaceId: number;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [form] = Form.useForm<CreateContentGroupDto>();
  const [downloadLimit, setDownloadLimit] = useState<boolean>(false);

  const { mutateAsync: createContentGroup } =
    useCreateContentGroup(workspaceId);
  const [expireMinute, setExpireMinute] = useState<boolean>(false);

  const onSubmit = async () => {
    try {
      const formData = form.getFieldsValue();
      if (formData.expireMinute && formData.expireMinute < 10) {
        toast.error("만료 시간은 최소 10분 이상이어야 합니다.");
        return;
      }

      toast.promise(createContentGroup(formData), {
        loading: "디지털 컨텐츠 생성중...",
        success: () => {
          form.resetFields();
          onClose();
          return "디지털 컨텐츠 생성 완료";
        },
        error: (error) => {
          errorHandler(error, router);
          return "디지털 컨텐츠 생성 실패";
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleExpireMinuteChange = (e: CheckboxChangeEvent) => {
    setExpireMinute(e.target.checked);
    if (!e.target.checked) {
      form.setFieldValue("expireMinute", null);
    }
  };

  const handleDownloadLimitChange = (e: CheckboxChangeEvent) => {
    setDownloadLimit(e.target.checked);
    if (!e.target.checked) {
      form.setFieldValue("downloadLimit", null);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="디지털 컨텐츠 생성"
      size="large"
      destroyOnClose
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          name="name"
          label="디지털 컨텐츠 이름"
          rules={[
            { required: true, message: "디지털 컨텐츠 이름을 입력해주세요." },
          ]}
        >
          <Input placeholder="디지털 컨텐츠 이름을 입력해주세요." />
        </Form.Item>
        <Form.Item
          name="type"
          label="디지털 컨텐츠 유형"
          className="mb-2"
          rules={[
            { required: true, message: "디지털 컨텐츠 유형을 선택해주세요." },
          ]}
        >
          <Select placeholder="디지털 컨텐츠 유형을 선택해주세요.">
            {Object.entries(ContentType).map(([key, value]) => (
              <Select.Option key={key} value={key}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item noStyle>
          <Alert
            message="설정 후 수정할 수 없습니다."
            showIcon
            type="warning"
            className="mb-2"
            icon={<ExclamationCircleOutlined />}
          />
        </Form.Item>
        <Form.Item
          initialValue={false}
          name="oneTime"
          label="디지털 컨텐츠 지급 유형"
          required
          className="mb-2"
        >
          <Select placeholder="디지털 컨텐츠 지급 방식을 선택해주세요.">
            <Select.Option value={true}>일회성</Select.Option>
            <Select.Option value={false}>재사용</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item noStyle>
          <Alert
            message="설정 후 수정할 수 없습니다."
            showIcon
            type="warning"
            className="mb-2"
            icon={<ExclamationCircleOutlined />}
          />
          <ul className="list-disc list-inside mb-5">
            <li>
              <strong>일회성 디지털 컨텐츠</strong>
              <ul className="list-disc list-inside ml-5">
                <li>
                  주문 한 번당 디지털 컨텐츠 한개를 지급하는 일회성 지급
                  방식입니다.
                </li>
                <li>
                  주문시 일회성 디지털 컨텐츠 잔여 수량이 없을 경우 메세지가
                  발송되지 않습니다.
                </li>
              </ul>
            </li>
            <li>
              <strong>재사용 디지털 컨텐츠</strong>
              <ul className="list-disc list-inside ml-5">
                <li>
                  한개의 디지털 컨텐츠를 모든 주문이 공유하는 재사용 지급
                  방식입니다.
                </li>
                <li>
                  주문시 재사용 디지털 컨텐츠가 없을 경우 메세지가 발송되지
                  않습니다.
                </li>
              </ul>
            </li>
          </ul>
        </Form.Item>
        <Form.Item noStyle>
          <div className="flex gap-3 mb-2 items-center">
            <Checkbox
              checked={expireMinute}
              onChange={handleExpireMinuteChange}
            >
              만료 시간 설정
            </Checkbox>
            <span className="text-sm text-gray-500">
              디지털 컨텐츠를 지급한 후 만료 시간을 설정할 수 있습니다.
            </span>
          </div>
        </Form.Item>
        {expireMinute && (
          <Form.Item name="expireMinute" label="만료 시간" required>
            <DurationInput
              value={form.getFieldValue("expireMinute")}
              onChange={(value) => form.setFieldValue("expireMinute", value)}
            />
          </Form.Item>
        )}

        <Form.Item noStyle>
          <div className="flex gap-3 mb-2">
            <Checkbox
              checked={downloadLimit}
              onChange={handleDownloadLimitChange}
            >
              다운로드 횟수 제한 설정
            </Checkbox>
            <span className="text-sm text-gray-500">
              디지털 컨텐츠를 지급한 후 다운로드 횟수를 제한할 수 있습니다.
            </span>
          </div>
        </Form.Item>
        {downloadLimit && (
          <Form.Item
            name="downloadLimit"
            label="다운로드 횟수 제한 설정"
            required
          >
            <InputNumber min={0} formatter={(value) => `${value}회`} />
          </Form.Item>
        )}
        <Form.Item>
          <div className="flex gap-3">
            <Button type="primary" htmlType="submit">
              주문 생성
            </Button>
            <Button type="primary" danger onClick={onClose}>
              취소
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
