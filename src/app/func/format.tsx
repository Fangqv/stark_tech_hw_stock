'use client'
export const formatRevenue = (value: number) => {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
export const formatPrice = (value: number) => {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
