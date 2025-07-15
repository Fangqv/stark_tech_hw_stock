import React from 'react'
import { Container, AppBar, Typography, Box } from '@mui/material'
import { Stock } from '../../types'
import StockSearch from '../StockSearch'

interface AppHeaderProps {
  onStockSelect: (stock: Stock | null) => void
}

const AppHeader: React.FC<AppHeaderProps> = ({ onStockSelect }) => {
  return (
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
          <StockSearch onStockSelect={onStockSelect} />
        </Container>
        <Box sx={{ flex: 1 }} />
      </Box>
    </AppBar>
  )
}

export default AppHeader
