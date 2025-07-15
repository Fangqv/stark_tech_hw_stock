'use client'

import React from 'react'
import { Card, CardContent, Box, Typography, Chip } from '@mui/material'
import DetailTable from './DetailTable'
import Chart from './Chart'
import { useEffect, useState, useCallback } from 'react'
import { ComposedData } from '../types'

/** 股票基础信息 */
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

/** 股票拓展信息 */
interface StockInfo {
  current_price: number
  change: number
  change_percent: number
  volume: number
  market_cap: number
  date: string
}

interface FinancialStatementProps {
  stock: Stock | null
}

const WaitingForSelection = () => {
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

const Loading = () => {
  return (
    <Card elevation={0} sx={{ mt: 2, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Typography>載入中...</Typography>
      </CardContent>
    </Card>
  )
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
                {stockInfo.date
                  ? new Date(stockInfo.date).toLocaleDateString('zh-TW', {
                      month: '2-digit',
                      day: '2-digit',
                    })
                  : ''}{' '}
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

const combineDataForChart = (
  revenues: RevenueData[],
  prices: StockPriceData[],
  timeRange: string,
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

  // 组合营收和价格数���
  const result = revenues.map((revenue) => {
    const revenueDate = new Date(revenue.date)
    revenueDate.setMonth(revenueDate.getMonth() - 1)
    const month = revenueDate.toISOString().slice(0, 7)
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
      revenue: revenue.revenue / 1_000_000, // 保持千元單位，不進行轉換
      avgPrice: parseFloat(avgPrice.toFixed(2)),
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
    }
  })

  // 根据时间范围动态确定显示的月份数量
  const monthsToShow = parseInt(timeRange) * 12
  return result.slice(-monthsToShow)
}

export default function FinancialStatement({ stock }: FinancialStatementProps) {
  const [, setRevenueData] = useState<RevenueData[]>([])
  const [composedData, setComposedData] = useState<ComposedData[]>([])
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null)
  const [timeRange, setTimeRange] = useState('5')

  const fetchData = useCallback(async () => {
    if (!stock) return

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

      // 获取营收数据
      const revenueResponse = await fetch(
        `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockMonthRevenue&data_id=${stock.stock_id}&start_date=${startDateStr}&end_date=${endDateStr}&token=${apiToken}`,
      )
      const revenueResult = await revenueResponse.json()

      // 获取股价数据
      const priceResponse = await fetch(
        `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockPrice&data_id=${stock.stock_id}&start_date=${startDateStr}&end_date=${endDateStr}&token=${apiToken}`,
      )
      const priceResult = await priceResponse.json()

      if (revenueResult.msg === 'success') {
        const revenues = revenueResult.data
        setRevenueData(revenues)

        if (priceResult.msg === 'success' && priceResult.data.length > 0) {
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
              date: latestPrice.date,
            })
          }

          // 组合数据用于图表
          const combined = combineDataForChart(revenues, prices, timeRange)
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

  if (!stock) return <WaitingForSelection />

  const hasChartData = composedData.length > 0

  return (
    <>
      {/* 股票标题和基本信息 */}
      <StockHeader stock={stock} stockInfo={stockInfo} />
      {!hasChartData && <Loading />}
      {hasChartData && (
        <>
          <Chart
            composedData={composedData}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
          <DetailTable composedData={composedData} />
        </>
      )}
    </>
  )
}
