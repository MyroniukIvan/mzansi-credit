const ZAR_FORMATTER = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  maximumFractionDigits: 0,
})

export function formatRand(amount: number): string {
  return ZAR_FORMATTER.format(amount)
}
