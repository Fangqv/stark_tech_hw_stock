import { useState, useEffect, useCallback, useRef } from 'react'
import { Stock, ApiResponse } from '../types'
import { API_ENDPOINTS, DEFAULT_STOCK_ID } from '../constants'

export const useStockSearch = (
  onStockSelect: (stock: Stock | null) => void,
) => {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  // 使用 useRef 存储最新的 onStockSelect 回调
  const onStockSelectRef = useRef(onStockSelect)
  onStockSelectRef.current = onStockSelect

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true)
        const apiToken = process.env.NEXT_PUBLIC_FINMIND_API_TOKEN
        const response = await fetch(
          `${API_ENDPOINTS.TAIWAN_STOCK_INFO}&token=${apiToken}`,
        )
        const data = (await response.json()) as ApiResponse<Stock>

        if (data.msg === 'success') {
          const uniqueStocks = data.data.filter(
            (stock: Stock, index: number, self: Stock[]) =>
              index === self.findIndex((s) => s.stock_id === stock.stock_id),
          )
          setStocks(uniqueStocks)

          // 默认选择 2330 台积电
          const defaultStock = uniqueStocks.find(
            (stock: Stock) => stock.stock_id === DEFAULT_STOCK_ID,
          )
          if (defaultStock) {
            setSelectedStock(defaultStock)
            onStockSelectRef.current(defaultStock)
          }
        }
      } catch (error) {
        console.error('Error fetching stocks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStocks()
  }, []) // 移除 onStockSelect 依赖

  const handleStockChange = useCallback(
    (event: React.SyntheticEvent<Element, Event>, newValue: Stock | null) => {
      setSelectedStock(newValue)
      onStockSelectRef.current(newValue)
    },
    [], // 移除 onStockSelect 依赖
  )

  const filterOptions = useCallback(
    (options: Stock[], { inputValue }: { inputValue: string }) => {
      return options.filter(
        (option) =>
          option.stock_id.toLowerCase().includes(inputValue.toLowerCase()) ||
          option.stock_name.toLowerCase().includes(inputValue.toLowerCase()),
      )
    },
    [],
  )

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  return {
    stocks,
    selectedStock,
    loading,
    open,
    handleStockChange,
    filterOptions,
    handleOpen,
    handleClose,
  }
}
