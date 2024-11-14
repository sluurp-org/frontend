export interface ProductsDto {
  id: number;
  name: string;
  productImageUrl: string;
  productId: string;
  store: {
    id: number;
    name: string;
  };
}

export interface PaginatedProductsResponse {
  total: number;
  nodes: ProductsDto[];
}

export interface ProductsFilters {
  page?: number;
  size?: number;
  storeId?: number;
  name?: string;
}

export interface ProductDto {
  id: number;
  name: string;
  productImageUrl: string;
  productId: string;
  event: {
    id: number;
    name: string;
    productId: number;
    productVariantId: number;
    messageId: number;
    message: {
      id: number;
      name: string;
      type: string;
      variables: Record<string, string>;
      contentGroupId: number;
      status: string;
      webhookUrl: string;
      webhookHeaders: Record<string, string>;
      webhookBody: string;
      emailTitle: string;
      emailBody: string;
      createdAt: string;
      updatedAt: string;
    };
    type: string;
  }[];
  store: {
    id: number;
    name: string;
    type: string;
    enabled: boolean;
    lastProductSyncAt: string;
    lastOrderSyncAt: string;
    smartStoreCredentials: {
      id: number;
      applicationId: string;
      applicationSecret: string;
      name: string;
      channelId: number;
      emailParseable: boolean;
    };
  };
  disableGlobalEvent: boolean;
}

export interface ProductOptionFilters {
  name?: string;
  page?: number;
  size?: number;
}

export interface ProductOptionDto {
  id: number;
  name: string;
  variantId: string;
  event: {
    id: number;
    name: string;
    productId: number;
    productVariantId: number;
    messageId: number;
    message: {
      id: number;
      name: string;
      type: string;
      variables: Record<string, string>;
      contentGroupId: number;
      status: string;
      webhookUrl: string;
      webhookHeaders: Record<string, string>;
      webhookBody: string;
      emailTitle: string;
      emailBody: string;
      createdAt: string;
      updatedAt: string;
    };
    type: string;
  }[];
}

export interface UpdateProductDto {
  disableGlobalEvent: boolean;
}

export interface PaginatedProductOptionsResponse {
  total: number;
  nodes: ProductOptionDto[];
}
