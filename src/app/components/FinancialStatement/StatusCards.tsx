import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'

export const WaitingForSelection: React.FC = () => {
  return (
    <Card elevation={0} sx={{ mt: 2, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Typography variant="h6" color="text.secondary">
          請選擇一個股票查看財務資料
        </Typography>
      </CardContent>
    </Card>
  )
}

export const LoadingCard: React.FC = () => {
  return (
    <Card elevation={0} sx={{ mt: 2, border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Typography>載入中...</Typography>
      </CardContent>
    </Card>
  )
}
