'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import { ComposedData } from '../types'

interface ChartProps {
  composedData: ComposedData[]
  timeRange: string
  onTimeRangeChange: (value: string) => void
}

const formatRevenue = (value: number) => {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const Chart: React.FC<ChartProps> = ({
  composedData,
  timeRange,
  onTimeRangeChange,
}) => {
  const [selectedData, setSelectedData] = useState({
    revenue: true,
    avgPrice: true,
    revenueGrowth: false,
  })
  const [selectionOrder, setSelectionOrder] = useState(['revenue', 'avgPrice'])

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

  return (
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
              onChange={(e) => onTimeRangeChange(e.target.value)}
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
              animationDuration={50}
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
                dot={false}
                activeDot={{ r: 5, fill: '#d32f2f' }}
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
            variant={selectedData.revenueGrowth ? 'contained' : 'outlined'}
            size="small"
            onClick={() => handleDataToggle('revenueGrowth')}
            sx={{ minWidth: 100 }}
          >
            營收年增率
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default Chart
