import React from 'react'
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
  Label,
} from 'recharts'
import { ComposedData, ChartDataSelection } from '../../types'
import {
  formatPrice,
  formatRevenue,
  formatPercentage,
} from '../../utils/format'
import { CHART_COLORS } from '../../constants'

interface ChartRendererProps {
  composedData: ComposedData[]
  selectedData: ChartDataSelection
}

const ChartRenderer: React.FC<ChartRendererProps> = ({
  composedData,
  selectedData,
}) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={composedData}
        margin={{ top: 40, right: 20, left: 40, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={true}
          vertical={true}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10 }}
          interval="preserveEnd"
          tickLine={false}
        />
        {selectedData.revenue && (
          <YAxis
            yAxisId="revenue"
            orientation="left"
            tickFormatter={(value) => formatRevenue(value * 1000)}
          >
            <Label value="千元" position="insideTop" offset={-30} />
          </YAxis>
        )}
        {selectedData.avgPrice && !selectedData.revenueGrowth && (
          <YAxis yAxisId="avgPrice" orientation="right">
            <Label value="元" position="insideTop" offset={-30} />
          </YAxis>
        )}
        {selectedData.avgPrice && selectedData.revenueGrowth && (
          <YAxis yAxisId="avgPrice" orientation="left">
            <Label value="元" position="insideTop" offset={-30} />
          </YAxis>
        )}
        {selectedData.revenueGrowth && (
          <YAxis yAxisId="revenueGrowth" orientation="right">
            <Label value="%" position="insideTop" offset={-30} />
          </YAxis>
        )}
        <Tooltip
          contentStyle={{
            fontSize: '12px',
            backgroundColor: '#00000099',
            color: '#FFFFFF',
            fontWeight: 'bold',
            borderRadius: '4px',
          }}
          animationDuration={50}
          itemStyle={{
            color: '#FFFFFF',
            fontWeight: 'bold',
          }}
          labelStyle={{
            color: '#FFFFFF',
            fontWeight: 'bold',
          }}
          formatter={(value, name) => {
            switch (name) {
              case '每月營收':
                return [`${formatRevenue((value as number) * 1000)} 千元`, name]
              case '月均價':
                return [`${formatPrice(value as number)} 元`, name]
              case '單月營收年增率':
                return [formatPercentage(value as number), name]
              default:
                return [value, name]
            }
          }}
        />
        <Legend iconType="square" />
        {selectedData.revenue && (
          <Bar
            animationDuration={200}
            yAxisId="revenue"
            dataKey="revenue"
            fill={CHART_COLORS.revenue}
            activeBar={{ fill: CHART_COLORS.revenueActive }}
            name="每月營收"
          />
        )}
        {selectedData.avgPrice && (
          <Line
            yAxisId="avgPrice"
            type="monotone"
            dataKey="avgPrice"
            stroke={CHART_COLORS.avgPrice}
            strokeWidth={2}
            animationDuration={200}
            name="月均價"
            dot={false}
            activeDot={{ r: 5, fill: CHART_COLORS.avgPrice }}
          />
        )}
        {selectedData.revenueGrowth && (
          <Line
            yAxisId="revenueGrowth"
            type="monotone"
            dataKey="revenueGrowth"
            stroke={CHART_COLORS.revenueGrowth}
            strokeWidth={2}
            animationDuration={200}
            name="單月營收年增率"
            dot={false}
            activeDot={{ r: 5, fill: CHART_COLORS.revenueGrowth }}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default ChartRenderer
