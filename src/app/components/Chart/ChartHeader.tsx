import React from 'react'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { TIME_RANGE_OPTIONS } from '../../constants'

interface ChartHeaderProps {
  timeRange: string
  onTimeRangeChange: (value: string) => void
}

const ChartHeader: React.FC<ChartHeaderProps> = ({
  timeRange,
  onTimeRangeChange,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
      }}
    >
      <Button variant="contained" size="large" disableElevation>
        每月營收
      </Button>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>時間範圍</InputLabel>
        <Select
          value={timeRange}
          label="時間範圍"
          onChange={(e) => onTimeRangeChange(e.target.value)}
        >
          {TIME_RANGE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default ChartHeader
