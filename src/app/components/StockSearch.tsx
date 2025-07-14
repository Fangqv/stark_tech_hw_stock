'use client'

import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

interface Stock {
  stock_id: string
  stock_name: string
}

interface StockSearchProps {
  onStockSelect: (stock: Stock | null) => void
}

export default function StockSearch({ onStockSelect }: StockSearchProps) {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch(
          'https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockInfo',
        )
        const data = await response.json()
        if (data.msg === 'success') {
          const uniqueStocks = data.data.filter(
            (stock: Stock, index: number, self: Stock[]) =>
              index === self.findIndex((s) => s.stock_id === stock.stock_id),
          )
          setStocks(uniqueStocks)
        }
      } catch (error) {
        console.error('Error fetching stocks:', error)
      }
    }

    fetchStocks()
  }, [])

  const handleStockChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: Stock | null,
  ) => {
    setSelectedStock(newValue)
    onStockSelect(newValue)
  }

  return (
    <Autocomplete
      options={stocks}
      getOptionLabel={(option) => `${option.stock_id} ${option.stock_name}`}
      value={selectedStock}
      onChange={handleStockChange}
      renderInput={(params) => (
        <TextField {...params} label="Search for a stock" />
      )}
    />
  )
}
