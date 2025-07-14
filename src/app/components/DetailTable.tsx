'use client'

import React from 'react'
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
} from '@mui/material'
import { ComposedData } from '../types'

const formatRevenue = (value: number) => {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface DetailTableProps {
  composedData: ComposedData[]
}

const DetailTable: React.FC<DetailTableProps> = ({ composedData }) => {
  return (
    <Card elevation={0} sx={{ mt: 2, border: '1px solid #e0e0e0' }}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 0,
        }}
      >
        {/* 詳細數據表格 */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, ml: 2, mt: 2 }}>
          <Button variant="contained" size="large" disableElevation>
            詳細數據
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 'none',
            overflowX: 'auto',
            maxWidth: '100%',
          }}
        >
          <Table size="small" sx={{ boxShadow: 'none', minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    minWidth: 120,
                    fontWeight: 'bold',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: 'white',
                    zIndex: 1,
                    borderRight: '1px solid #e0e0e0',
                  }}
                >
                  指標
                </TableCell>
                {composedData.map((data) => (
                  <TableCell
                    key={data.month}
                    align="right"
                    sx={{ minWidth: 100, fontWeight: 'bold' }}
                  >
                    {data.month}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* 營收行 */}
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: 'white',
                    zIndex: 1,
                    borderRight: '1px solid #e0e0e0',
                  }}
                >
                  每月營收 (千元)
                </TableCell>
                {composedData.map((data) => (
                  <TableCell key={`revenue-${data.month}`} align="right">
                    {formatRevenue(data.revenue * 1000000)}
                  </TableCell>
                ))}
              </TableRow>
              {/* 營收年增率行 */}
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: 'white',
                    zIndex: 1,
                    borderRight: '1px solid #e0e0e0',
                  }}
                >
                  單月營收年增率 (%)
                </TableCell>
                {composedData.map((data) => (
                  <TableCell
                    key={`growth-${data.month}`}
                    align="right"
                    sx={{
                      color: data.revenueGrowth >= 0 ? 'green' : 'red',
                    }}
                  >
                    {data.revenueGrowth.toFixed(2)}
                  </TableCell>
                ))}
              </TableRow>
              {/* 均價行 */}
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: 'white',
                    zIndex: 1,
                    borderRight: '1px solid #e0e0e0',
                  }}
                >
                  月均價 (元)
                </TableCell>
                {composedData.map((data) => (
                  <TableCell key={`price-${data.month}`} align="right">
                    {formatPrice(data.avgPrice)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mr: 2,
            mt: 2,
            display: 'block',
            alignSelf: 'flex-end',
            textAlign: 'right',
          }}
        >
          表格單位：千元，數據來自公開資訊觀測站
          <br />
          網頁圖表數據僅供引用，請註明出處為財報狗
        </Typography>
      </CardContent>
    </Card>
  )
}

export default DetailTable
