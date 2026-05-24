// components/SupportTicketForm.jsx
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function SupportTicketForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/support-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success('Ticket submitted successfully!');
        if (onSuccess) onSuccess();
      } else {
        throw new Error('Failed to submit ticket');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label htmlFor="name" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A0A08' }}>Full Name</label>
        <input
          required
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          style={{
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1.5px solid rgba(201, 168, 76, 0.4)',
            backgroundColor: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label htmlFor="email" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A0A08' }}>Email Address</label>
        <input
          required
          type="email"
          id="email"
          name="email"
          placeholder="your@email.com"
          style={{
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1.5px solid rgba(201, 168, 76, 0.4)',
            backgroundColor: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label htmlFor="message" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A0A08' }}>How can we help?</label>
        <textarea
          required
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us about your inquiry..."
          style={{
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1.5px solid rgba(201, 168, 76, 0.4)',
            backgroundColor: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem',
            resize: 'vertical'
          }}
        />
      </div>

      <button
        disabled={loading}
        type="submit"
        style={{
          marginTop: '8px',
          padding: '12px',
          backgroundColor: '#8B1A1A',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'background-color 180ms ease'
        }}
      >
        {loading ? 'Submitting...' : 'Submit Ticket'}
      </button>
    </form>
  );
}
