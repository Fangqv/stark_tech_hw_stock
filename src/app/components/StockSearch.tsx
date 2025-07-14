'use client'

import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Chip,
} from '@mui/material'
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
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true)
        const apiToken = process.env.NEXT_PUBLIC_FINMIND_API_TOKEN
        const response = await fetch(
          `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockInfo&token=${apiToken}`,
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
      } finally {
        setLoading(false)
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
    <Box sx={{ width: '100%' }}>
      <Autocomplete
        options={stocks}
        getOptionLabel={(option) => `${option.stock_id} ${option.stock_name}`}
        value={selectedStock}
        onChange={handleStockChange}
        loading={loading}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        filterOptions={(options, { inputValue }) => {
          return options.filter(
            (option) =>
              option.stock_id
                .toLowerCase()
                .includes(inputValue.toLowerCase()) ||
              option.stock_name
                .toLowerCase()
                .includes(inputValue.toLowerCase()),
          )
        }}
        renderOption={(props, option) => {
          const { key, ...rest } = props
          return (
            <Box
              component="li"
              key={key}
              {...rest}
              sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}
            >
              <Box>
                <Chip
                  label={option.stock_id}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1, minWidth: 60 }}
                />
                {option.stock_name}
              </Box>
            </Box>
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="搜尋股票代號或名稱"
            placeholder="例如：2330 台積電"
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        noOptionsText="找不到匹配的股票"
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
          },
        }}
      />

      {selectedStock && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`已選擇: ${selectedStock.stock_id} ${selectedStock.stock_name}`}
            color="primary"
            onDelete={() => {
              setSelectedStock(null)
              onStockSelect(null)
            }}
          />
        </Box>
      )}
    </Box>
  )
}
