// components/SupportContactCard.jsx
import { useRouter } from 'next/router'

export default function SupportContactCard({ card, onOpenModal }) {
  const router = useRouter()
  const { title, subtitle, description, icon, actionType, actionValue } = card

  const handleClick = (e) => {
    // Prevent double triggers if nested links exist
    if (e) e.preventDefault()

    switch (actionType) {
      case 'email':
        window.location.href = `mailto:${actionValue}`
        break
      case 'phone':
        window.location.href = `tel:${actionValue}`
        break
      case 'whatsapp':
        // Ensure phone number format is correct (digits only)
        const phone = actionValue.replace(/\D/g, '')
        window.open(`https://wa.me/${phone}?text=Hello%20Sampada%20Team`, '_blank')
        break
      case 'link':
        router.push(actionValue)
        break
      case 'modal':
        if (onOpenModal) onOpenModal(actionValue)
        break
      default:
        break
    }
  }

  return (
    <div 
      className="support-card" 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      aria-label={`${title}: ${subtitle}`}
    >
      {(() => {
        if (icon && typeof icon === 'object' && icon.asset?.url) {
          return (
            <div className="card-icon-wrap">
              <img src={icon.asset.url} alt="" aria-hidden="true" />
            </div>
          )
        }
        
        const iconName = (typeof icon === 'string' ? icon : actionType || '').toLowerCase()
        let emoji = '✉️'
        if (iconName.includes('phone') || iconName.includes('call')) emoji = '📞'
        else if (iconName.includes('whatsapp')) emoji = '💬'
        else if (iconName.includes('chat') || iconName.includes('envelope')) emoji = '✉️'
        else if (iconName.includes('ticket') || iconName.includes('modal')) emoji = '🎫'
        else if (iconName.includes('link')) emoji = '🔗'
        
        return (
          <div className="card-icon-wrap" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {emoji}
          </div>
        )
      })()}
      <h3 className="card-title">{title}</h3>
      <p className="card-subtitle">{subtitle}</p>
      <p className="card-desc">{description}</p>
      <span className="card-action">
        {actionType === 'email' && 'Send Email'}
        {actionType === 'phone' && 'Call Now'}
        {actionType === 'whatsapp' && 'Message Us'}
        {actionType === 'link' && 'Learn More'}
        {actionType === 'modal' && 'Open Ticket'}
        <span style={{ fontSize: '1.1em', marginLeft: '4px' }}>→</span>
      </span>
    </div>
  )
}
