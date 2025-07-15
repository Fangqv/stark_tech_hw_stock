/**
 * 格式化营收数值
 */
export const formatRevenue = (value: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * 格式化价格数值
 */
export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * 格式化简单价格（整数）
 */
export const formatSimplePrice = (value: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * 格式化百分比
 */
export const formatPercentage = (
  value: number,
  decimals: number = 2,
): string => {
  return `${value.toFixed(decimals)}%`
}

/**
 * 格式化日期
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    month: '2-digit',
    day: '2-digit',
  })
}
