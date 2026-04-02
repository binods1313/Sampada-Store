export default function SkeletonCard() {
  return (
    <div style={{
      background: '#1a1a1a',
      border: '1px solid rgba(201,168,76,0.12)',
      borderRadius: '12px',
      padding: '22px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          height: '14px',
          width: '80px',
          borderRadius: '6px',
          background: 'linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          marginBottom: '8px'
        }} />
        <div style={{
          height: '28px',
          width: '120px',
          borderRadius: '6px',
          background: 'linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite'
        }} />
      </div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
