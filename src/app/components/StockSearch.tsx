'use client'

import React from 'react'
import {
  Autocomplete,
  TextField,
  Box,
  Chip,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { StockSearchProps, Stock } from '../types'
import { useStockSearch } from '../hooks/useStockSearch'

const StockSearch: React.FC<StockSearchProps> = ({ onStockSelect }) => {
  const {
    stocks,
    selectedStock,
    loading,
    open,
    handleStockChange,
    filterOptions,
    handleOpen,
    handleClose,
  } = useStockSearch(onStockSelect)

  return (
    <Autocomplete
      options={stocks}
      getOptionLabel={(option) => `${option.stock_id} ${option.stock_name}`}
      value={selectedStock}
      onChange={handleStockChange}
      loading={loading}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      filterOptions={filterOptions}
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
        },
      }}
    />
  )
}

export default StockSearch
