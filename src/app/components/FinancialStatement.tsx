'use client'

import React, { useEffect, useState } from 'react'
import { FinancialStatementProps } from '../types'
import { useStockData } from '../hooks/useStockData'
import { DEFAULT_TIME_RANGE } from '../constants'
import StockHeader from './FinancialStatement/StockHeader'
import {
  WaitingForSelection,
  LoadingCard,
} from './FinancialStatement/StatusCards'
import Chart from './Chart'
import DetailTable from './DetailTable'

const FinancialStatement: React.FC<FinancialStatementProps> = ({ stock }) => {
  const [timeRange, setTimeRange] = useState(DEFAULT_TIME_RANGE)
  const { composedData, stockInfo, loading, fetchStockData } = useStockData()

  useEffect(() => {
    if (stock) {
      fetchStockData(stock, timeRange)
    }
  }, [stock, timeRange, fetchStockData])

  if (!stock) return <WaitingForSelection />

  const hasChartData = composedData.length > 0

  return (
    <>
      <StockHeader stock={stock} stockInfo={stockInfo} />

      {loading && <LoadingCard />}

      {hasChartData && !loading && (
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

export default FinancialStatement
