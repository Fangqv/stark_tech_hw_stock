'use client'

import React, { useRef, useEffect } from 'react'
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
  Divider,
} from '@mui/material'
import { DetailTableProps, ComposedData } from '../types'
import { formatRevenue, formatPrice, formatPercentage } from '../utils/format'
import { TABLE_ROW_CONFIG } from '../constants'

const DetailTable: React.FC<DetailTableProps> = ({ composedData }) => {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tableContainerRef.current) {
      const { scrollWidth, clientWidth } = tableContainerRef.current
      tableContainerRef.current.scrollLeft = scrollWidth - clientWidth
    }
  }, [composedData])

  const renderCellValue = (data: ComposedData, dataKey: string) => {
    switch (dataKey) {
      case 'revenue':
        return formatRevenue(data.revenue * 1000)
      case 'revenueGrowth':
        return formatPercentage(data.revenueGrowth)
      case 'avgPrice':
        return formatPrice(data.avgPrice)
      default:
        return ''
    }
  }

  const getCellStyle = (
    data: ComposedData,
    dataKey: string,
    rowIndex: number,
  ) => {
    const baseStyle = {
      backgroundColor: rowIndex % 2 === 0 ? 'white' : '#f9f9f9',
      borderRight: '1px solid #e0e0e0',
      fontSize: '0.75rem',
    }

    if (dataKey === 'revenueGrowth') {
      return {
        ...baseStyle,
        color: data.revenueGrowth >= 0 ? 'green' : 'red',
      }
    }

    return baseStyle
  }

  return (
    <Card elevation={0} sx={{ mt: 2, border: '1px solid #e0e0e0' }}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 0,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, mb: 2, ml: 2, mt: 2 }}>
          <Button variant="contained" size="large" disableElevation>
            詳細數據
          </Button>
        </Box>
        <Divider />
        <TableContainer
          ref={tableContainerRef}
          component={Paper}
          sx={{
            boxShadow: 'none',
            overflowX: 'auto',
            maxWidth: '100%',
          }}
        >
          <Table size="small" sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    minWidth: 120,
                    fontWeight: 'bold',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: '#f5f5f5',
                    zIndex: 1,
                    borderRight: '1px solid #e0e0e0',
                    fontSize: '0.75rem',
                  }}
                >
                  指標
                </TableCell>
                {composedData.map((data, index) => (
                  <TableCell
                    key={data.month}
                    align="right"
                    sx={{
                      minWidth: 100,
                      fontWeight: 'bold',
                      borderRight:
                        index < composedData.length - 1
                          ? '1px solid #e0e0e0'
                          : 'none',
                      backgroundColor: '#f5f5f5',
                      fontSize: '0.75rem',
                    }}
                  >
                    {data.month}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {TABLE_ROW_CONFIG.map((row, rowIndex) => (
                <TableRow
                  key={row.label}
                  sx={{
                    backgroundColor: rowIndex % 2 === 0 ? '#f9f9f9' : 'white',
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      position: 'sticky',
                      left: 0,
                      zIndex: 1,
                      backgroundColor: rowIndex % 2 === 0 ? 'white' : '#f9f9f9',
                      borderRight: '1px solid #e0e0e0',
                      fontSize: '0.75rem',
                    }}
                  >
                    {row.label}
                  </TableCell>
                  {composedData.map((data, dataIndex) => (
                    <TableCell
                      key={`${row.dataKey}-${data.month}`}
                      align="right"
                      sx={{
                        ...getCellStyle(data, row.dataKey, rowIndex),
                        borderRight:
                          dataIndex < composedData.length - 1
                            ? '1px solid #e0e0e0'
                            : 'none',
                      }}
                    >
                      {renderCellValue(data, row.dataKey)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
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
