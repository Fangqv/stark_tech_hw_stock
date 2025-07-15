import React from 'react'
import { Box, Button } from '@mui/material'
import { ChartDataSelection } from '../../types'
import { CHART_DATA_BUTTONS } from '../../constants'

interface ChartDataSelectorProps {
  selectedData: ChartDataSelection
  onDataToggle: (dataType: keyof ChartDataSelection) => void
}

const ChartDataSelector: React.FC<ChartDataSelectorProps> = ({
  selectedData,
  onDataToggle,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mt: 2,
        justifyContent: 'center',
      }}
    >
      {CHART_DATA_BUTTONS.map((button) => (
        <Button
          key={button.key}
          disableElevation
          variant={selectedData[button.key] ? 'contained' : 'outlined'}
          size="small"
          onClick={() => onDataToggle(button.key)}
          sx={{ minWidth: 100 }}
        >
          {button.label}
        </Button>
      ))}
    </Box>
  )
}

export default ChartDataSelector
