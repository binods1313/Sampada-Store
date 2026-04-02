export default function StockIndicator({ stock }) {
  const getStockInfo = () => {
    if (stock === undefined || stock === null) {
      return { color: '#666', bg: 'rgba(102,102,102,0.15)', label: 'N/A', icon: '?' }
    }
    if (stock === 0) {
      return { color: '#ff6b6b', bg: 'rgba(139,26,26,0.15)', label: 'Out of Stock', icon: '✕' }
    }
    if (stock < 5) {
      return { color: '#ff8080', bg: 'rgba(139,26,26,0.15)', label: `Only ${stock} left`, icon: '⚠️' }
    }
    if (stock < 20) {
      return { color: '#C9A84C', bg: 'rgba(201,168,76,0.15)', label: `Low stock (${stock})`, icon: '◔' }
    }
    return { color: '#4ade80', bg: 'rgba(45,122,45,0.15)', label: `In stock (${stock})`, icon: '✓' }
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
