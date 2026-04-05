export default function StockIndicator({ stock }) {
  const getStockInfo = () => {
    const stockValue = stock ?? 0 // Treat null/undefined as 0
    if (stockValue === 0) {
      return { color: '#ff6b6b', bg: 'rgba(139,26,26,0.15)', label: 'Out of Stock', icon: '✕' }
    }
    if (stockValue < 5) {
      return { color: '#ff8080', bg: 'rgba(139,26,26,0.15)', label: `Only ${stockValue} left`, icon: '⚠️' }
    }
    if (stockValue < 20) {
      return { color: '#C9A84C', bg: 'rgba(201,168,76,0.15)', label: `Low stock (${stockValue})`, icon: '◔' }
    }
    return { color: '#4ade80', bg: 'rgba(45,122,45,0.15)', label: `In stock (${stockValue})`, icon: '✓' }
  }

  const { color, bg, label, icon } = getStockInfo()

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      background: bg,
      border: `1px solid ${color}40`,
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '500',
      color: color,
      whiteSpace: 'nowrap'
    }}>
      <span style={{ fontSize: '13px' }}>{icon}</span>
      {label}
    </span>
  )
}
