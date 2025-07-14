'use client'

import { useState } from 'react'
import StockSearch from './components/StockSearch'
import FinancialStatement from './components/FinancialStatement'
import {
  Container,
  CssBaseline,
  AppBar,
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
    background: {
      default: '#f5f5f5', // 浅灰色背景
      paper: '#ffffff', // 白色纸张背景
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
      {/* ✅ 是一个副作用组件, 它不是一个容器组件, 当它被渲染是, 会自动在页面的 head 注入全局 CSS 样式*/}
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: '#FFFFFFA0',
          backdropFilter: 'blur(20px)',
          color: 'text.primary',
          display: 'flex',
          justifyContent: 'center',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexGrow: 1,
          }}
        >
          <Container
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: '#1976d2', fontWeight: 'bold' }}
            >
              Stark Tech
            </Typography>
          </Container>
          <Container sx={{ paddingTop: 2, paddingBottom: 2 }} maxWidth="sm">
            <StockSearch onStockSelect={handleStockSelect} />
          </Container>
          <Box sx={{ flex: 1 }} />
        </Box>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 14, mb: 4 }}>
        <FinancialStatement stock={selectedStock} />
      </Container>
    </ThemeProvider>
  )
}
