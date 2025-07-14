'use client'

import { useState } from 'react'
import StockSearch from './components/StockSearch'
import FinancialStatement from './components/FinancialStatement'
import {
  Container,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
} from '@mui/material'

interface Stock {
  stock_id: string
  stock_name: string
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
})

export default function Home() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)

  const handleStockSelect = (stock: Stock | null) => {
    setSelectedStock(stock)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: '#f5f5f5', color: 'text.primary' }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: '#1976d2', fontWeight: 'bold' }}
          >
            財報狗 - 台股財務數據平台
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ color: '#333', mb: 1 }}
          >
            股票財務報表查詢
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            選擇股票查看詳細的營收數據和財務指標
          </Typography>

          <Box sx={{ maxWidth: 600, mb: 2 }}>
            <StockSearch onStockSelect={handleStockSelect} />
          </Box>
        </Box>

        <FinancialStatement stock={selectedStock} />
      </Container>
    </ThemeProvider>
  )
}
