// 股票基础信息
export interface Stock {
  stock_id: string
  stock_name: string
}

// 营收数据
export interface RevenueData {
  date: string
  revenue: number
  revenue_month: string
  revenue_year: string
}

// 股价数据
export interface StockPriceData {
  date: string
  close: number
  Trading_Volume?: number
}

// 股票详细信息
export interface StockInfo {
  current_price: number
  change: number
  change_percent: number
  volume: number
  market_cap: number
  date: string
}

// 图表复合数据
export interface ComposedData {
  month: string
  revenue: number
  avgPrice: number
  revenueGrowth: number
}

// 图表数据选择状态
export interface ChartDataSelection {
  revenue: boolean
  avgPrice: boolean
  revenueGrowth: boolean
}

// API响应类型
export interface ApiResponse<T> {
  msg: string
  data: T[]
}

// 组件Props类型
export interface StockSearchProps {
  onStockSelect: (stock: Stock | null) => void
}

export interface FinancialStatementProps {
  stock: Stock | null
}

export interface ChartProps {
  composedData: ComposedData[]
  timeRange: string
  onTimeRangeChange: (value: string) => void
}

export interface DetailTableProps {
  composedData: ComposedData[]
}

export interface StockHeaderProps {
  stock: Stock
  stockInfo: StockInfo | null
}

// 时间范围选项
export interface TimeRangeOption {
  value: string
  label: string
}
