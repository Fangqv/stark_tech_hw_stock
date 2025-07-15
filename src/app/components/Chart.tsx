'use client'

import React from 'react'
import { Card, CardContent } from '@mui/material'
import { ChartProps } from '../types'
import { useChartData } from '../hooks/useChartData'
import ChartHeader from './Chart/ChartHeader'
import ChartRenderer from './Chart/ChartRenderer'
import ChartDataSelector from './Chart/ChartDataSelector'

const Chart: React.FC<ChartProps> = ({
  composedData,
  timeRange,
  onTimeRangeChange,
}) => {
  const { selectedData, handleDataToggle } = useChartData()

  return (
    <Card elevation={0} sx={{ mt: 2, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <ChartHeader
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
        />

        <ChartRenderer
          composedData={composedData}
          selectedData={selectedData}
        />

        <ChartDataSelector
          selectedData={selectedData}
          onDataToggle={handleDataToggle}
        />
      </CardContent>
    </Card>
  )
}

export default Chart
