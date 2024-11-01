import { useCreateOrder } from "@/hooks/queries/useOrder";
import { useProductOptions, useProducts } from "@/hooks/queries/useProduct";
import { useStore } from "@/hooks/queries/useStore";
import { CreateOrderDto } from "@/types/order";
import { OrderStatus } from "@/types/orders";
import { ProductsFilters } from "@/types/product";
import errorHandler from "@/utils/error";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast from "react-hot-toast";

const phoneRegex = /^010\d{8}$/;
const phoneValidator = (_: any, value: string) => {
  if (!value) {
    return Promise.resolve();
  }
  if (!phoneRegex.test(value)) {
    return Promise.reject(new Error("전화번호 형식이 올바르지 않습니다."));
  }
  return Promise.resolve();
};

export default function CreateOrderDrawer({
  workspaceId,
  open,
  onClose,
}: {
  workspaceId: number;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [form] = Form.useForm<CreateOrderDto>();

  const {
    data: storeData,
    isLoading: storeLoading,
    error: storeError,
  } = useStore(workspaceId);

  const { mutateAsync: createOrder } = useCreateOrder(workspaceId);

  const [productFilter, setProductFilter] = useState<ProductsFilters>();
  const [selectedStore, setSelectedStore] = useState<number>();
  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useProducts(workspaceId, productFilter);

  const [selectedProduct, setSelectedProduct] = useState<number>();
  const {
    data: productOptionData,
    isLoading: productOptionLoading,
    error: productOptionError,
  } = useProductOptions(workspaceId, selectedProduct);

  const onSelectStore = (value: number) => {
    setSelectedStore(value);
    setSelectedProduct(undefined);
    setProductFilter({ storeId: value });
    form.setFieldsValue({ productId: undefined, productVariantId: undefined });
  };

  const onSelectProduct = (value: number) => {
    setSelectedProduct(value);
    form.setFieldsValue({ productVariantId: undefined });
  };

  const onSubmit = async () => {
    try {
      const formData = form.getFieldsValue();
      const processedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value === "" ? null : value,
        ])
      );

      toast.promise(createOrder(processedData as CreateOrderDto), {
        loading: "주문 생성중...",
        success: () => {
          form.resetFields();
          onClose();
          return "주문 생성 완료";
        },
        error: (error) => {
          errorHandler(error, router);
          return "주문 생성 실패";
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (storeError || productError || productOptionError) {
    errorHandler(storeError || productError || productOptionError, router);
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="주문 생성"
      size="large"
      destroyOnClose
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          name="storeId"
          label="스토어 선택"
          rules={[{ required: true, message: "스토어를 선택해주세요." }]}
        >
          <Select
            placeholder="스토어를 선택해주세요."
            loading={storeLoading}
            disabled={storeLoading}
            onChange={onSelectStore}
          >
            {storeData?.nodes.map((store) => (
              <Select.Option key={store.id} value={store.id}>
                {store.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {selectedStore && (
          <Form.Item
            name="productId"
            label="상품 선택"
            rules={[{ required: true, message: "상품을 선택해주세요." }]}
          >
            <Select
              loading={productLoading}
              disabled={productLoading}
              onChange={onSelectProduct}
              showSearch
              placeholder="상품을 선택해주세요."
            >
              {productData?.nodes.map((product) => (
                <Select.Option key={product.id} value={product.id}>
                  {product.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {selectedProduct && productOptionData?.total ? (
          <Form.Item name="productVariantId" label="상품 옵션 선택">
            <Select
              loading={productOptionLoading}
              disabled={productOptionLoading}
              allowClear
              showSearch
              placeholder="상품 옵션을 선택해주세요."
            >
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
        <div className="w-full border-b border-gray-200 my-2" />
        <Form.Item
          name="status"
          label="주문 상태"
          rules={[{ required: true, message: "주문 상태를 선택해주세요." }]}
        >
          <Select placeholder="주문 상태를 선택해주세요.">
            {Object.keys(OrderStatus).map((status) => (
              <Select.Option key={status} value={status}>
                {OrderStatus[status as keyof typeof OrderStatus]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="ordererName"
          label="주문자 이름"
          rules={[{ required: true, message: "주문자 이름을 입력해주세요." }]}
        >
          <Input placeholder="홍길동" />
        </Form.Item>

        <Form.Item
          name="ordererPhone"
          label="주문자 전화번호"
          rules={[
            { required: true, message: "주문자 전화번호를 입력해주세요." },
            {
              validator: phoneValidator,
              message:
                "전화번호 형식이 올바르지 않습니다. 01012345678 형식으로 입력해주세요.",
            },
          ]}
        >
          <Input placeholder="01012345678" />
        </Form.Item>

        {/* <Form.Item name="ordererEmail" label="주문자 이메일">
          <Input type="email" />
        </Form.Item> */}

        <Form.Item name="receiverName" label="수령인 이름">
          <Input placeholder="입력하지 않으면 주문자 이름으로 저장됩니다." />
        </Form.Item>

        <Form.Item
          name="receiverPhone"
          label="수령인 전화번호"
          rules={[
            {
              validator: phoneValidator,
              message:
                "전화번호 형식이 올바르지 않습니다. 01012345678 형식으로 입력해주세요.",
            },
          ]}
        >
          <Input placeholder="입력하지 않으면 주문자 전화번호로 저장됩니다." />
        </Form.Item>

        {/* <Form.Item name="receiverEmail" label="수령인 이메일">
          <Input type="email" />
        </Form.Item> */}

        <Form.Item name="price" label="가격">
          <InputNumber
            min={0}
            formatter={(value) =>
              `${
                parseInt(value?.toString() || "0")?.toLocaleString("ko-KR") || 0
              }원`
            }
            className="w-full"
          />
        </Form.Item>

        <Form.Item name="quantity" label="수량">
          <InputNumber
            min={1}
            formatter={(value) =>
              `${parseInt(value?.toString() || "0")?.toLocaleString() || 0}개`
            }
            className="w-full"
          />
        </Form.Item>

        <Form.Item name="orderAt" label="주문 일시">
          <DatePicker showTime />
        </Form.Item>

        <Form.Item name="deliveryAddress" label="배송 주소">
          <Input.TextArea
            rows={3}
            placeholder="배송 주소를 입력해주세요. (선택)"
          />
        </Form.Item>

        <Form.Item name="deliveryMessage" label="배송 메시지">
          <Input.TextArea
            rows={2}
            placeholder="배송 메시지를 입력해주세요. (선택)"
          />
        </Form.Item>

        <Form.Item name="deliveryCompany" label="배송 회사">
          <Input placeholder="ex) CJ대한통운, 로젠택배, 한진택배 등" />
        </Form.Item>

        <Form.Item name="deliveryTrackingNumber" label="운송장 번호">
          <Input placeholder="운송장 번호를 입력해주세요. (선택)" />
        </Form.Item>

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
