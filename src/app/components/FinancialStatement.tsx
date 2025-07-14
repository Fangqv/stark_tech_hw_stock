'use client'

import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
} from '@mui/material'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useEffect, useState, useCallback } from 'react'

/**
 * 股票基础信息
 */
interface Stock {
  stock_id: string
  stock_name: string
}

interface RevenueData {
  date: string
  revenue: number
  revenue_month: string
  revenue_year: string
}

interface StockPriceData {
  date: string
  close: number
}

interface ComposedData {
  month: string
  revenue: number
  avgPrice: number
  revenueGrowth: number
}

interface StockInfo {
  current_price: number
  change: number
  change_percent: number
  volume: number
  market_cap: number
}

interface FinancialStatementProps {
  stock: Stock | null
}

const formatRevenue = (value: number) => {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * 股票标题和基本信息
 */
const StockHeader = ({
  stock,
  stockInfo,
}: {
  stock: Stock
  stockInfo: StockInfo | null
}) => {
  return (
    <Card elevation={0} sx={{ mt: 1, p: 2, border: '1px solid #e0e0e0' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" component="h2">
            {stock.stock_name} ({stock.stock_id})
          </Typography>
          {stockInfo && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">
                台灣{' '}
                {new Date().toLocaleDateString('zh-TW', {
                  month: '2-digit',
                  day: '2-digit',
                })}{' '}
                收盤價 {formatPrice(stockInfo.current_price)} 元
              </Typography>
              <Chip
                label={`${stockInfo.change >= 0 ? '+' : ''}${stockInfo.change.toFixed(2)} (${stockInfo.change_percent.toFixed(2)}%)`}
                color={stockInfo.change >= 0 ? 'success' : 'error'}
                size="small"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  )
}

export default function FinancialStatement({ stock }: FinancialStatementProps) {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [composedData, setComposedData] = useState<ComposedData[]>([])
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null)
  const [timeRange, setTimeRange] = useState('5')
  const [selectedData, setSelectedData] = useState({
    revenue: true,
    avgPrice: true,
    revenueGrowth: false,
  })
  const [selectionOrder, setSelectionOrder] = useState(['revenue', 'avgPrice'])

  const fetchData = useCallback(async () => {
    if (!stock) return

    try {
      const startDate = new Date()
      startDate.setFullYear(startDate.getFullYear() - parseInt(timeRange))
      const startDateStr = startDate.toISOString().slice(0, 10)

      const apiToken = process.env.NEXT_PUBLIC_FINMIND_API_TOKEN

      // 获取营收数据
      const revenueResponse = await fetch(
        `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockMonthRevenue&data_id=${stock.stock_id}&start_date=${startDateStr}&token=${apiToken}`,
      )
      const revenueResult = await revenueResponse.json()

      // 获取股价数据
      const priceResponse = await fetch(
        `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockPrice&data_id=${stock.stock_id}&start_date=${startDateStr}&token=${apiToken}`,
      )
      const priceResult = await priceResponse.json()

      if (revenueResult.msg === 'success') {
        const revenues = revenueResult.data
        setRevenueData(revenues)

        if (priceResult.msg === 'success') {
          const prices = priceResult.data

          // 模拟当前股票信息
          const latestPrice = prices[prices.length - 1]
          if (latestPrice) {
            const previousPrice = prices[prices.length - 2]
            const change =
              latestPrice.close - (previousPrice?.close || latestPrice.close)
            const changePercent =
              (change / (previousPrice?.close || latestPrice.close)) * 100

            setStockInfo({
              current_price: latestPrice.close,
              change,
              change_percent: changePercent,
              volume: latestPrice.Trading_Volume || 0,
              market_cap: 0, // 需要额外计算
            })
          }

          // 组合数据用于图表
          const combined = combineDataForChart(revenues, prices)
          setComposedData(combined)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [stock, timeRange])

  useEffect(() => {
    if (stock) {
      fetchData()
    }
  }, [stock, timeRange, fetchData])

  const combineDataForChart = (
    revenues: RevenueData[],
    prices: StockPriceData[],
  ) => {
    const monthlyPrices = new Map<string, number[]>()

    // 按月分组价格数据
    prices.forEach((price) => {
      const month = price.date.slice(0, 7) // YYYY-MM
      if (!monthlyPrices.has(month)) {
        monthlyPrices.set(month, [])
      }
      monthlyPrices.get(month)!.push(price.close)
    })

    // 计算月平均价格
    const monthlyAvgPrices = new Map<string, number>()
    monthlyPrices.forEach((priceArray, month) => {
      const avg =
        priceArray.reduce((sum, price) => sum + price, 0) / priceArray.length
      monthlyAvgPrices.set(month, avg)
    })

    // 组合营收和价格数据
    const result = revenues.map((revenue) => {
      const month = revenue.date.slice(0, 7)
      const avgPrice = monthlyAvgPrices.get(month) || 0

      // 计算年增率
      const previousYearRevenue = revenues.find((r) => {
        const currentYear = parseInt(revenue.date.slice(0, 4))
        const currentMonth = revenue.date.slice(5, 7)
        const targetDate = `${currentYear - 1}-${currentMonth}`
        return r.date.startsWith(targetDate)
      })

      const revenueGrowth = previousYearRevenue
        ? ((revenue.revenue - previousYearRevenue.revenue) /
            previousYearRevenue.revenue) *
          100
        : 0

      return {
        month: revenue.date.slice(0, 7),
        revenue: revenue.revenue / 1_000_000, // 保持千元單位，不進行轉換
        avgPrice: Math.round(avgPrice),
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      }
    })

    // 根据时间范围动态确定显示的月份数量
    const monthsToShow = parseInt(timeRange) * 12
    return result.slice(-monthsToShow)
  }

  // 格式化X轴显示
  const formatXAxisTick = (tickItem: string) => {
    const timeRangeNum = parseInt(timeRange)
    const [year, month] = tickItem.split('-')

    if (timeRangeNum === 1) {
      // 1年：显示月份 (01, 02, 03...)
      return month
    } else if (timeRangeNum <= 3) {
      // 2-3年：显示季度 (Q1, Q2, Q3, Q4)
      const monthNum = parseInt(month)
      const quarter = Math.ceil(monthNum / 3)
      return `Q${quarter}`
    } else {
      // 4年以上：显示年份 (2024, 2025...)
      return year
    }
  }

  // 获取当前时间聚合级别的标签
  const getTimeLabel = () => {
    const timeRangeNum = parseInt(timeRange)
    if (timeRangeNum === 1) return '每月營收'
    if (timeRangeNum <= 3) return '每季營收'
    return '每年營收'
  }

  const getRevenueGrowthLabel = () => {
    const timeRangeNum = parseInt(timeRange)
    if (timeRangeNum === 1) return '單月營收年增率'
    if (timeRangeNum <= 3) return '單季營收年增率'
    return '單年營收年增率'
  }

  const getPriceLabel = () => {
    const timeRangeNum = parseInt(timeRange)
    if (timeRangeNum === 1) return '月均價'
    if (timeRangeNum <= 3) return '季均價'
    return '年均價'
  }

  const handleDataToggle = (dataType: keyof typeof selectedData) => {
    const newSelected = { ...selectedData }
    const newOrder = [...selectionOrder]

    if (newSelected[dataType]) {
      // 如果当前数据已选中，则取消选择
      newSelected[dataType] = false
      const index = newOrder.indexOf(dataType)
      if (index > -1) {
        newOrder.splice(index, 1)
      }

      // 确保至少有一个数据被选中
      if (newOrder.length === 0) {
        newSelected[dataType] = true
        newOrder.push(dataType)
      }
    } else {
      // 如果当前数据未选中，则选择它
      newSelected[dataType] = true
      newOrder.push(dataType)

      // 如果超过两个选择，移除最旧的选择
      if (newOrder.length > 2) {
        const oldestData = newOrder.shift()!
        newSelected[oldestData as keyof typeof selectedData] = false
      }
    }

    setSelectedData(newSelected)
    setSelectionOrder(newOrder)
  }

  if (!stock) {
    return (
      <Card elevation={0} sx={{ mt: 2, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            請選擇一個股票查看財務資料
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* 股票标题和基本信息 */}
      <StockHeader stock={stock} stockInfo={stockInfo} />

      {composedData.length > 0 ? (
        <>
          <Card elevation={0} sx={{ mt: 2, border: '1px solid #e0e0e0' }}>
            <CardContent>
              {/* Tab選項和時間選擇器 */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Button variant="contained" size="large" disableElevation>
                  每月營收
                </Button>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>時間範圍</InputLabel>
                  <Select
                    value={timeRange}
                    label="時間範圍"
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <MenuItem value="1">近 1 年</MenuItem>
                    <MenuItem value="3">近 3 年</MenuItem>
                    <MenuItem value="5">近 5 年</MenuItem>
                    <MenuItem value="10">近 10 年</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {/* 復合圖表 */}
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                  data={composedData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                    tickFormatter={formatXAxisTick}
                  />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <YAxis yAxisId="third" orientation="right" />
                  <Tooltip
                    formatter={(value: number | string, name: string) => {
                      const numValue =
                        typeof value === 'string' ? parseFloat(value) : value
                      if (name === 'revenue')
                        return [`${formatRevenue(numValue)} 千元`, '每月營收']
                      if (name === 'avgPrice')
                        return [`${formatPrice(numValue)} 元`, '月均價']
                      if (name === 'revenueGrowth')
                        return [`${numValue.toFixed(2)}%`, '單月營收年增率']
                      return [value, name]
                    }}
                  />
                  <Legend />
                  {selectedData.revenue && (
                    <Bar
                      yAxisId="left"
                      dataKey="revenue"
                      fill="#ffa726"
                      name="每月營收"
                    />
                  )}
                  {selectedData.avgPrice && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgPrice"
                      stroke="#d32f2f"
                      strokeWidth={2}
                      name="月均價"
                    />
                  )}
                  {selectedData.revenueGrowth && (
                    <Line
                      yAxisId="third"
                      type="monotone"
                      dataKey="revenueGrowth"
                      stroke="#1976d2"
                      strokeWidth={2}
                      name="單月營收年增率"
                      dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>

              {/* 數據選擇器 */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mt: 2,
                  justifyContent: 'center',
                }}
              >
                <Button
                  disableElevation
                  variant={selectedData.revenue ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => handleDataToggle('revenue')}
                  sx={{ minWidth: 100 }}
                >
                  每月營收
                </Button>
                <Button
                  disableElevation
                  variant={selectedData.avgPrice ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => handleDataToggle('avgPrice')}
                  sx={{ minWidth: 100 }}
                >
                  月均價
                </Button>
                <Button
                  disableElevation
                  variant={
                    selectedData.revenueGrowth ? 'contained' : 'outlined'
                  }
                  size="small"
                  onClick={() => handleDataToggle('revenueGrowth')}
                  sx={{ minWidth: 100 }}
                >
                  營收年增率
                </Button>
              </Box>
            </CardContent>
          </Card>
          <Card elevation={0} sx={{ mt: 2, border: '1px solid #e0e0e0' }}>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 0,
              }}
            >
              {/* 詳細數據表格 */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, ml: 2, mt: 2 }}>
                <Button variant="contained" size="large" disableElevation>
                  詳細數據
                </Button>
              </Box>
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: 'none',
                  overflowX: 'auto',
                  maxWidth: '100%',
                }}
              >
                <Table size="small" sx={{ boxShadow: 'none', minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          minWidth: 120,
                          fontWeight: 'bold',
                          position: 'sticky',
                          left: 0,
                          backgroundColor: 'white',
                          zIndex: 1,
                          borderRight: '1px solid #e0e0e0',
                        }}
                      >
                        指標
                      </TableCell>
                      {composedData.map((data) => (
                        <TableCell
                          key={data.month}
                          align="right"
                          sx={{ minWidth: 100, fontWeight: 'bold' }}
                        >
                          {data.month}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* 營收行 */}
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 'bold',
                          position: 'sticky',
                          left: 0,
                          backgroundColor: 'white',
                          zIndex: 1,
                          borderRight: '1px solid #e0e0e0',
                        }}
                      >
                        {getTimeLabel()} (千元)
                      </TableCell>
                      {composedData.map((data) => (
                        <TableCell key={`revenue-${data.month}`} align="right">
                          {formatRevenue(data.revenue * 1_000_000)}
                        </TableCell>
                      ))}
                    </TableRow>
                    {/* 營收年增率行 */}
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 'bold',
                          position: 'sticky',
                          left: 0,
                          backgroundColor: 'white',
                          zIndex: 1,
                          borderRight: '1px solid #e0e0e0',
                        }}
                      >
                        {getRevenueGrowthLabel()} (%)
                      </TableCell>
                      {composedData.map((data) => (
                        <TableCell
                          key={`growth-${data.month}`}
                          align="right"
                          sx={{
                            color: data.revenueGrowth >= 0 ? 'green' : 'red',
                          }}
                        >
                          {data.revenueGrowth.toFixed(2)}
                        </TableCell>
                      ))}
                    </TableRow>
                    {/* 均價行 */}
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 'bold',
                          position: 'sticky',
                          left: 0,
                          backgroundColor: 'white',
                          zIndex: 1,
                          borderRight: '1px solid #e0e0e0',
                        }}
                      >
                        {getPriceLabel()} (元)
                      </TableCell>
                      {composedData.map((data) => (
                        <TableCell key={`price-${data.month}`} align="right">
                          {formatPrice(data.avgPrice)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  mr: 2,
                  mt: 2,
                  display: 'block',
                  alignSelf: 'flex-end',
                  textAlign: 'right',
                }}
              >
                表格單位：千元，數據來自公開資訊觀測站
                <br />
                網頁圖表數據僅供引用，請註明出處為財報狗
              </Typography>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card elevation={0} sx={{ mt: 2, border: '1px solid #e0e0e0' }}>
          <CardContent>
            <Typography>載入中...</Typography>
          </CardContent>
        </Card>
      )}
    </>
  )
}
