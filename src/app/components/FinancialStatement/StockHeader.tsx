import React from 'react'
import { Card, Box, Typography, Chip } from '@mui/material'
import { StockHeaderProps } from '../../types'
import { formatSimplePrice, formatDate } from '../../utils/format'

const StockHeader: React.FC<StockHeaderProps> = ({ stock, stockInfo }) => {
  return (
    <Card elevation={0} sx={{ mt: 1, p: 2, border: '1px solid #e0e0e0' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" component="h2">
            {stock.stock_name} ({stock.stock_id})
          </Typography>
          {stockInfo && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">
                台灣 {stockInfo.date ? formatDate(stockInfo.date) : ''} 收盤價{' '}
                {formatSimplePrice(stockInfo.current_price)} 元
              </Typography>
              <Chip
                label={`${stockInfo.change >= 0 ? '+' : ''}${stockInfo.change.toFixed(2)} (${stockInfo.change_percent.toFixed(2)}%)`}
                color={stockInfo.change >= 0 ? 'success' : 'error'}
                size="small"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  )
}

export default StockHeader
