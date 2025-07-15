import { TimeRangeOption } from '../types'

// 时间范围选项
export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { value: '1', label: '近 1 年' },
  { value: '3', label: '近 3 年' },
  { value: '5', label: '近 5 年' },
  { value: '10', label: '近 10 年' },
]

// 默认时间范围
export const DEFAULT_TIME_RANGE = '5'

// 默认股票代码
export const DEFAULT_STOCK_ID = '2330'

// 图表颜色配置
export const CHART_COLORS = {
  revenue: '#ffc756',
  revenueActive: '#ffa726',
  avgPrice: '#d32f2f',
  revenueGrowth: '#1976d2',
}

// API 端点
export const API_ENDPOINTS = {
  TAIWAN_STOCK_INFO:
    'https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockInfo',
  TAIWAN_STOCK_REVENUE:
    'https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockMonthRevenue',
  TAIWAN_STOCK_PRICE:
    'https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockPrice',
}

// 表格行配置
export const TABLE_ROW_CONFIG = [
  {
    label: '每月營收 (千元)',
    dataKey: 'revenue' as const,
  },
  {
    label: '單月營收年增率 (%)',
    dataKey: 'revenueGrowth' as const,
  },
  {
    label: '月均價 (元)',
    dataKey: 'avgPrice' as const,
  },
]

// 圖表數據按鈕配置
export const CHART_DATA_BUTTONS = [
  { key: 'revenue' as const, label: '每月營收' },
  { key: 'avgPrice' as const, label: '月均價' },
  { key: 'revenueGrowth' as const, label: '營收年增率' },
]
