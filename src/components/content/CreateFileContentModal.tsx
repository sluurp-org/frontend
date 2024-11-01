import {
  useCreateFileContent,
  useDeleteContent,
  useUpdateContent,
} from "@/hooks/queries/useContent";
import { ContentStatus, ContentType } from "@/types/content";
import { Alert, Button, Form, Image, Modal, Upload } from "antd";
import errorHandler from "@/utils/error";
import router from "next/router";
import { useEffect } from "react";
import { InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { RcFile } from "antd/es/upload";
import axios from "axios";

export default function CreateFileContentModal({
  open,
  onClose,
  workspaceId,
  contentGroupId,
}: {
  open: boolean;
  onClose: () => void;
  workspaceId: number;
  contentGroupId: number;
}) {
  const [form] = Form.useForm();
  const { mutateAsync: createFileContent } = useCreateFileContent(
    workspaceId,
    contentGroupId
  );
  const { mutateAsync: updateFileContent } = useUpdateContent(
    workspaceId,
    contentGroupId
  );
  const { mutateAsync: deleteFileContent } = useDeleteContent(
    workspaceId,
    contentGroupId
  );

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [form, open]);

  const handleSubmit = async () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="디지털 컨텐츠 추가"
      destroyOnClose
      onClose={onClose}
      cancelButtonProps={{ className: "hidden" }}
      okButtonProps={{ className: "hidden" }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Alert
          type="info"
          className="mb-4"
          message={
            <>
              <p className="mb-3">
                디지털 컨텐츠를 추가할때 파일을 드래그해 업로드 할 수 있습니다.
              </p>
              <Image
                src="/guide/upload-files.gif"
                alt="content-add"
                className="w-full"
              />
              <p className="text-sm text-gray-500">눌러서 이미지 크게 보기</p>
            </>
          }
          showIcon
          icon={<InfoCircleOutlined />}
        />
        <Form.Item name="file">
          <Upload.Dragger
            multiple
            name="file"
            onRemove={(file) => {
              const { response } = file;
              if (!response || !response.contentId) return;

              toast.promise(deleteFileContent(response.contentId), {
                loading: "디지털 컨텐츠를 삭제하는 중입니다.",
                success: () => "디지털 컨텐츠가 삭제되었습니다.",
                error: (error) => {
                  errorHandler(error, router);
                  return "디지털 컨텐츠 삭제에 실패했습니다.";
                },
              });
            }}
            customRequest={async (options) => {
              const { onProgress, onSuccess, onError, file } = options;
              const { type, size, name } = file as RcFile;

              try {
                const nameArray = name.split(".");
                const createdFileContent = await createFileContent({
                  name: nameArray.slice(0, -1).join("."),
                  size,
                  mimeType: type,
                  extension: name.split(".").pop() || "",
                });

                const { url } = createdFileContent;
                await axios.put(url, file, {
                  onUploadProgress: (progress) => {
                    onProgress?.({
                      percent: (progress.loaded / (progress.total || 1)) * 100,
                    });
                  },
                });

                await updateFileContent({
                  contentId: createdFileContent.id,
                  dto: {
                    status: ContentStatus.READY,
                  },
                });

                onSuccess?.({ contentId: createdFileContent.id });
                toast.success("디지털 컨텐츠가 추가되었습니다.");
              } catch (err) {
                errorHandler(err, router);
                onError?.({
                  status: 500,
                  message: "디지털 컨텐츠 추가에 실패했습니다.",
                  name: name,
                });
              }
            }}
          >
            <UploadOutlined className="mr-3" />
            <span>드래그 해서 파일을 옮기거나 클릭하세요</span>
          </Upload.Dragger>
        </Form.Item>
        <Button type="primary" htmlType="submit" className="mt-4 w-full">
          닫기
        </Button>
      </Form>
    </Modal>
  );
}
