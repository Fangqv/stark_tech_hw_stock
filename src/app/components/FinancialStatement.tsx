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

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function FinancialStatement({ stock }: FinancialStatementProps) {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [composedData, setComposedData] = useState<ComposedData[]>([])
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null)
  const [tabValue, setTabValue] = useState(0)
  const [timeRange, setTimeRange] = useState('5')
  const [isTracked, setIsTracked] = useState(false)

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
    return revenues
      .map((revenue) => {
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
          revenue: revenue.revenue / 1000000, // 转换为百万
          avgPrice: Math.round(avgPrice),
          revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        }
      })
      .slice(-60) // 最近5年数据
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
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

  if (!stock) {
    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            請選擇一個股票查看財務資料
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        {/* 股票标题和基本信息 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
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
          <Button
            variant={isTracked ? 'contained' : 'outlined'}
            onClick={() => setIsTracked(!isTracked)}
          >
            {isTracked ? '已追蹤' : '追蹤'}
          </Button>
        </Box>

        {/* Tab選項和時間選擇器 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="每月營收" />
            <Tab label="月每股營收" />
          </Tabs>
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

        <TabPanel value={tabValue} index={0}>
          {composedData.length > 0 ? (
            <>
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
                  />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value: number | string, name: string) => {
                      const numValue =
                        typeof value === 'string' ? parseFloat(value) : value
                      if (name === 'revenue')
                        return [`${formatRevenue(numValue)} 億`, '每月營收']
                      if (name === 'avgPrice')
                        return [`${formatPrice(numValue)} 元`, '月均價']
                      return [value, name]
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    fill="#ffa726"
                    name="每月營收"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgPrice"
                    stroke="#d32f2f"
                    strokeWidth={2}
                    name="月均價"
                  />
                </ComposedChart>
              </ResponsiveContainer>

              {/* 詳細數據表格 */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button variant="contained" size="small">
                    詳細數據
                  </Button>
                  <Button variant="outlined" size="small">
                    指標解釋
                  </Button>
                </Box>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>年度/月份</TableCell>
                        <TableCell align="right">每月營收</TableCell>
                        <TableCell align="right">單月營收年增率 (%)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {revenueData.slice(-12).map((row) => {
                        const revenueGrowth =
                          composedData.find(
                            (d) => d.month === row.date.slice(0, 7),
                          )?.revenueGrowth || 0
                        return (
                          <TableRow key={row.date}>
                            <TableCell>{row.date.slice(0, 7)}</TableCell>
                            <TableCell align="right">
                              {formatRevenue(row.revenue)}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                color: revenueGrowth >= 0 ? 'green' : 'red',
                              }}
                            >
                              {revenueGrowth.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  表格單位：千元，數據來自公開資訊觀測站
                  <br />
                  網頁圖表數據僅供引用，請註明出處為財報狗
                </Typography>
              </Box>
            </>
          ) : (
            <Typography>載入中...</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography>月每股營收功能開發中...</Typography>
        </TabPanel>
      </CardContent>
    </Card>
  )
}
