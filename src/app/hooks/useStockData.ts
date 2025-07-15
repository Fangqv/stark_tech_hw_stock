import { useState, useCallback } from 'react'
import {
  Stock,
  RevenueData,
  StockPriceData,
  StockInfo,
  ComposedData,
  ApiResponse,
} from '../types'
import { API_ENDPOINTS } from '../constants'

// 将 combineDataForChart 移到 hook 外部作为纯函数
const combineDataForChart = (
  revenues: RevenueData[],
  prices: StockPriceData[],
  timeRange: string,
): ComposedData[] => {
  const monthlyPrices = new Map<string, number[]>()

  // 按月分组价格数据
  prices.forEach((price) => {
    const month = price.date.slice(0, 4) + '/' + price.date.slice(5, 7) // YYYY/MM
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
    const revenueDate = new Date(revenue.date)
    revenueDate.setMonth(revenueDate.getMonth() - 1)
    const month =
      revenueDate.toISOString().slice(0, 4) +
      '/' +
      revenueDate.toISOString().slice(5, 7)
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
      month: month,
      revenue: revenue.revenue / 1_000_000,
      avgPrice: parseFloat(avgPrice.toFixed(2)),
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
    }
  })

  // 根据时间范围动态确定显示的月份数量
  const monthsToShow = parseInt(timeRange) * 12
  return result.slice(-monthsToShow)
}

export const useStockData = () => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [composedData, setComposedData] = useState<ComposedData[]>([])
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStockData = useCallback(
    async (stock: Stock, timeRange: string) => {
      if (!stock) return

      setLoading(true)
      setError(null)

      try {
        const startDate = new Date()
        const endDate = new Date()
        startDate.setFullYear(
          startDate.getFullYear() - (parseInt(timeRange) + 1),
        )
        endDate.setDate(endDate.getDate() - 1) // 昨天
        const startDateStr = startDate.toISOString().slice(0, 10)
        const endDateStr = endDate.toISOString().slice(0, 10)

        const apiToken = process.env.NEXT_PUBLIC_FINMIND_API_TOKEN

        // 并行获取营收数据和股价数据
        const [revenueResponse, priceResponse] = await Promise.all([
          fetch(
            `${API_ENDPOINTS.TAIWAN_STOCK_REVENUE}&data_id=${stock.stock_id}&start_date=${startDateStr}&end_date=${endDateStr}&token=${apiToken}`,
          ),
          fetch(
            `${API_ENDPOINTS.TAIWAN_STOCK_PRICE}&data_id=${stock.stock_id}&start_date=${startDateStr}&end_date=${endDateStr}&token=${apiToken}`,
          ),
        ])

        const [revenueResult, priceResult] = await Promise.all([
          revenueResponse.json() as Promise<ApiResponse<RevenueData>>,
          priceResponse.json() as Promise<ApiResponse<StockPriceData>>,
        ])

        if (revenueResult.msg === 'success') {
          const revenues = revenueResult.data
          setRevenueData(revenues)

          if (priceResult.msg === 'success' && priceResult.data.length > 0) {
            const prices = priceResult.data

            // 计算当前股票信息
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
                date: latestPrice.date,
              })
            }

            // 组合数据用于图表
            const combined = combineDataForChart(revenues, prices, timeRange)
            setComposedData(combined)
          }
        } else {
          setError('获取数据失败')
        }
      } catch (err) {
        setError('网络请求失败')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    },
    [], // 移除 combineDataForChart 依赖
  )

  return {
    revenueData,
    composedData,
    stockInfo,
    loading,
    error,
    fetchStockData,
  }
}
