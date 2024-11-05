export interface DailyAanlytics {
  orderDate: Date;
  totalOrders: number;
  totalQuantity: number;
  totalSales: number;
  totalRefund: number;
  totalCancelled: number;
}

export interface MonthlyAanlytics {
  orderMonth: Date;
  totalOrders: number;
  totalQuantity: number;
  totalSales: number;
  totalRefund: number;
  totalCancelled: number;
}

export interface AnalyticsQueryDto {
  startDate: Date;
  endDate: Date;
}
