import { useState, useCallback } from 'react'
import { ChartDataSelection } from '../types'

export const useChartData = () => {
  const [selectedData, setSelectedData] = useState<ChartDataSelection>({
    revenue: true,
    avgPrice: true,
    revenueGrowth: false,
  })
  const [selectionOrder, setSelectionOrder] = useState(['revenue', 'avgPrice'])

  const handleDataToggle = useCallback(
    (dataType: keyof ChartDataSelection) => {
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
          newSelected[oldestData as keyof ChartDataSelection] = false
        }
      }

      setSelectedData(newSelected)
      setSelectionOrder(newOrder)
    },
    [selectedData, selectionOrder],
  )

  return {
    selectedData,
    selectionOrder,
    handleDataToggle,
  }
}
