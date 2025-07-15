'use client'

import { useState, useCallback } from 'react'
import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import { Stock } from './types'
import { theme } from './config/theme'
import AppHeader from './components/Layout/AppHeader'
import FinancialStatement from './components/FinancialStatement'

const Home = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)

  const handleStockSelect = useCallback((stock: Stock | null) => {
    setSelectedStock(stock)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppHeader onStockSelect={handleStockSelect} />

      <Container maxWidth="md" sx={{ mt: 14, mb: 4 }}>
        <FinancialStatement stock={selectedStock} />
      </Container>
    </ThemeProvider>
  )
}

export default Home
