'use client'

import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Chip,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
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
            option.stock_id.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.stock_name.toLowerCase().includes(inputValue.toLowerCase()),
        )
      }}
      // 渲染选项
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
      // 渲染输入框
      renderInput={(params) => (
        <TextField
          {...params}
          label="输入台 / 美股票代码, 查看公司财报"
          placeholder="例如：2330 台積電"
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
      noOptionsText="找不到匹配的股票"
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'background.paper',
          // height: 50,
        },
      }}
    />
  )
}
