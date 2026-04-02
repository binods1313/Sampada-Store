export default function StatusBadge({ status }) {
  const styles = {
    active: { bg: 'rgba(45,122,45,0.15)', border: 'rgba(45,122,45,0.4)', color: '#4ade80', label: 'Active' },
    draft: { bg: 'rgba(201,168,76,0.15)', border: 'rgba(201,168,76,0.4)', color: '#C9A84C', label: 'Draft' },
    archived: { bg: 'rgba(139,26,26,0.15)', border: 'rgba(139,26,26,0.4)', color: '#ff6b6b', label: 'Archived' },
  }

  const style = styles[status] || styles.draft

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '4px 10px',
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      color: style.color,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: style.color
      }} />
      {style.label}
    </span>
  )
}
