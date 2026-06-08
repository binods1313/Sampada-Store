// components/SupportContactCard.jsx
import React from 'react'

export default function SupportContactCard({ card, onOpenModal }) {
  const { method, value, description, icon, title, subtitle, actionType, actionValue } = card

  const handleCardClick = () => {
    const finalMethod = actionType || method
    const finalValue = actionValue || value

    switch(finalMethod) {
      case 'email':
        window.location.href = `mailto:${finalValue}`;
        break;
      case 'phone':
        window.location.href = `tel:${finalValue}`;
        break;
      case 'whatsapp':
        // Ensure phone number format is correct (digits only)
        const phone = (finalValue || '').replace(/\D/g, '');
        window.open(`https://wa.me/${phone}?text=Hello`, '_blank');
        break;
      case 'chat':
        // trigger your existing live chat widget here
        if (typeof Tawk_API !== 'undefined') {
          Tawk_API.maximize();
        } else if (onOpenModal) {
          onOpenModal('chat');
        }
        break;
      default:
        break;
    }
  }

  // Get display label for method
  const getMethodLabel = () => {
    const finalMethod = actionType || method
    switch(finalMethod) {
      case 'email': return 'Email Us';
      case 'phone': return 'Call Us';
      case 'whatsapp': return 'WhatsApp';
      case 'chat': return 'Live Chat';
      default: return 'Contact';
    }
  }

  return (
    <div 
      className="support-contact-card" 
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {(() => {
        if (icon && typeof icon === 'object' && icon.asset?.url) {
          return (
            <div className="card-icon-wrap">
              <img src={icon.asset.url} alt="" aria-hidden="true" />
            </div>
          )
        }
        
        const iconName = (typeof icon === 'string' ? icon : actionType || method || '').toLowerCase()
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
      <h3 className="card-title">{title || (method === 'email' ? 'Email Support' : method === 'phone' ? 'Call Us' : method === 'whatsapp' ? 'WhatsApp' : 'Live Chat')}</h3>
      <p className="card-subtitle">{subtitle || value}</p>
      <p className="card-desc">{description}</p>
      <div className="card-cta">
        {getMethodLabel()} <span style={{ marginLeft: '4px' }}>→</span>
      </div>
    </div>
  )
}
