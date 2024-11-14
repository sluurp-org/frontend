import { useCreateEvent } from "@/hooks/queries/useEvent";
import { useMessages } from "@/hooks/queries/useMessage";
import {
  useProductOptions,
  useProducts,
  useSyncProductOptions,
} from "@/hooks/queries/useProduct";
import { CreateEventDto } from "@/types/events";
import { OrderStatus, OrderStatusMap } from "@/types/orders";
import { PaginatedProductsResponse } from "@/types/product";
import errorHandler from "@/utils/error";
import { Button, Cascader, Drawer, Form, InputNumber, Select } from "antd";
import { getJosaPicker } from "josa";
import { min } from "moment";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface Option {
  value: number;
  label: string;
  children?: Option[];
}

export default function EventCreateDrawer({
  workspaceId,
  open,
  onClose,
}: {
  workspaceId: number;
  open: boolean;
  onClose: () => void;
}) {
  const [form] = Form.useForm<CreateEventDto>();

  const { mutateAsync: createEvent } = useCreateEvent(workspaceId);
  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useProducts(workspaceId, {});

  const [selectedProduct, setSelectedProduct] = useState<number | null>();
  const {
    data: productOptionData,
    isLoading: productOptionLoading,
    error: productOptionError,
  } = useProductOptions(workspaceId, selectedProduct);

  const {
    data: messageData,
    isLoading: messageLoading,
    error: messageError,
  } = useMessages(workspaceId);

  const onSelectProduct = (value: (number | null)[]) => {
    const productId = value[value.length - 1] as number;

    setSelectedProduct(productId);
    form.setFieldsValue({ productVariantId: undefined, productId });
  };

  const syncOptionsMutation = useSyncProductOptions(
    workspaceId,
    selectedProduct ?? 0
  );
  const handleSyncOptions = () => {
    if (!selectedProduct) return;

    toast.promise(syncOptionsMutation.mutateAsync(), {
      loading: "옵션을 불러오는 중...",
      success: "옵션을 성공적으로 불러왔습니다.",
      error: (error) =>
        errorHandler(error) || "옵션을 불러오는데 실패했습니다.",
    });
  };

  const groupByStore = (product: PaginatedProductsResponse | undefined) => {
    if (!product) return [];
    const grouped: Record<number, Option> = {};

    product.nodes.map((node) => {
      const storeId = node.store.id;

      if (!grouped[storeId]) {
        grouped[storeId] = {
          value: storeId,
          label: node.store.name,
          children: [],
        };
      }

      grouped[storeId].children?.push({
        value: node.id,
        label: node.name,
      });
    });

    return Object.values(grouped);
  };

  const onSubmit = async () => {
    try {
      const formData = form.getFieldsValue();

      toast.promise(createEvent(formData), {
        loading: "규칙 생성중...",
        success: () => {
          form.resetFields();
          onClose();
          return "규칙 생성 완료";
        },
        error: (error) => {
          errorHandler(error);
          return "규칙 생성 실패";
        },
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (productError || productOptionError || messageError) {
    toast.error(
      errorHandler(productError || productOptionError || messageError)
    );
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="자동발송 규칙 생성"
      size="large"
      destroyOnClose
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item hidden name="productId">
          <InputNumber hidden />
        </Form.Item>
        <Form.Item
          label="상품 선택"
          name="selectedProduct"
          className="mb-1"
          required
        >
          <Cascader
            placeholder="상품을 선택해주세요."
            loading={productLoading}
            disabled={productLoading}
            multiple={false}
            onChange={onSelectProduct}
            showSearch
            options={[
              {
                label: "모든 상품",
                value: null,
              },
              ...groupByStore(productData),
            ]}
          />
        </Form.Item>
        {productOptionData?.total === 0 && (
          <div className="text-red-500">
            <span>선택한 상품에 옵션이 없습니다. 또는</span>
            <Button type="link" size="small" onClick={handleSyncOptions}>
              동기화
            </Button>
          </div>
        )}
        {selectedProduct && productOptionData?.total ? (
          <Form.Item
            name="productVariantId"
            label="상품 옵션 선택"
            className="mt-6"
            required
          >
            <Select
              loading={productOptionLoading}
              disabled={productOptionLoading}
              allowClear
              showSearch
              placeholder="상품 옵션을 선택해주세요."
            >
              <Select.Option value={null}>모든 옵션</Select.Option>
              {productOptionData?.nodes.map((productOption) => (
                <Select.Option key={productOption.id} value={productOption.id}>
                  {productOption.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <></>
        )}
        <div className="w-full border-b border-gray-200 my-2 mt-6" />
        <Form.Item
          name="type"
          label="주문 상태"
          rules={[{ required: true, message: "주문 상태를 선택해주세요." }]}
        >
          <Select placeholder="주문 상태를 선택해주세요.">
            {Object.entries(OrderStatusMap).map(([key, value]) => (
              <Select.Option key={key} value={key}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="messageId"
          label="메시지 선택"
          rules={[{ required: true, message: "메시지를 선택해주세요." }]}
        >
          <Select loading={messageLoading} placeholder="메시지를 선택해주세요.">
            {messageData?.nodes.map((message) => (
              <Select.Option key={message.id} value={message.id}>
                {message.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="발송 지연 일수"
          name="delayDays"
          className="w-full"
          rules={[
            { type: "number", message: "숫자만 입력해주세요." },
            {
              type: "number",
              min: 1,
              warningOnly: true,
              message: "1 이상의 숫자를 입력해주세요.",
              transform(value) {
                return Number(value || 1);
              },
            },
          ]}
        >
          <InputNumber
            type="number"
            placeholder="발송 지연 일수"
            suffix="일"
            className="w-full"
          />
        </Form.Item>
        <Form.Item
          label="발송 시간"
          name="sendHour"
          className="w-full mb-0"
          rules={[
            {
              type: "number",
              max: 23,
              min: 0,
              warningOnly: true,
              message: "0부터 23까지 입력해주세요.",
              transform(value) {
                return Number(value || 1);
              },
            },
          ]}
        >
          <InputNumber
            className="w-full"
            placeholder="발송 시간"
            suffix="시"
            min={0}
            max={23}
          />
        </Form.Item>
        <Form.Item
          className="mt-0"
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.messageId !== currentValues.messageId ||
            prevValues.type !== currentValues.type ||
            prevValues.delayDays !== currentValues.delayDays ||
            prevValues.sendHour !== currentValues.sendHour
          }
        >
          {({ getFieldValue }) => {
            const type = getFieldValue("type") as OrderStatus;
            const delayDays = getFieldValue("delayDays") as number;
            const sendHour = getFieldValue("sendHour") as number;
            const messageId = getFieldValue("messageId") as number;
            const josaPicker = getJosaPicker("으로");

            if (!messageId) return <></>;

            return (
              <>
                <div>
                  {type && (
                    <span>
                      주문 상태가 {OrderStatusMap[type]}
                      {josaPicker(OrderStatusMap[type])} 변경되면{" "}
                    </span>
                  )}
                  {delayDays && <span> {delayDays}일 후 </span>}
                  {sendHour && <span>{sendHour}시에 </span>}
                  {!delayDays && !sendHour && <span>구매 후 즉시 </span>}
                  {messageData?.nodes.find(
                    (message) => message.id === getFieldValue("messageId")
                  )?.name ?? ""}{" "}
                  메시지가 발송됩니다.
                </div>
                {!delayDays && sendHour && (
                  <span>
                    상품 구매 일의 {sendHour}시에 발송됩니다. 이미 {sendHour}
                    시가 지났다면 즉시 발송됩니다.
                  </span>
                )}
              </>
            );
          }}
        </Form.Item>
        <Form.Item>
          <div className="flex gap-3">
            <Button type="primary" htmlType="submit">
              규칙 생성
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
