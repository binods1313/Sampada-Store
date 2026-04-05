// components/admin/AIImageGenerator.jsx
/**
 * AI Image Generator Component
 * 
 * Generates product images using Pollinations.ai (free) and Stability AI
 * Shows preview, allows download, and can auto-save to Sanity
 */

import React, { useState } from 'react'
import { generateProductImage, trackStabilityUsage, getStabilityCredits } from '@/utils/aiImageGenerator'
import { Sparkles, Download, RefreshCw, Check, X } from 'lucide-react'

export default function AIImageGenerator({ productName, category, onImageGenerated }) {
  const [generating, setGenerating] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState(null)
  const [error, setError] = useState(null)
  const [provider, setProvider] = useState(null)
  const credits = getStabilityCredits()

  const handleGenerate = async () => {
    if (!productName) return

    setGenerating(true)
    setError(null)
    setGeneratedUrl(null)

    try {
      const imageUrl = await generateProductImage(productName, category)

      if (imageUrl) {
        setGeneratedUrl(imageUrl)
        setProvider(
          imageUrl.includes('pollinations') ? 'Pollinations.ai' :
          imageUrl.startsWith('data:') ? 'Stability AI' : 'Unknown'
        )

        // Track Stability usage if it was used
        if (!imageUrl.includes('pollinations')) {
          trackStabilityUsage()
        }

        if (onImageGenerated) {
          onImageGenerated(imageUrl)
        }
      } else {
        setError('Failed to generate image. Please try again.')
      }
    } catch (err) {
      setError(err.message || 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedUrl) return

    try {
      const response = await fetch(generatedUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${productName?.replace(/\s+/g, '-').toLowerCase() || 'product'}-ai-image.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  return (
    <div className="ai-image-generator" style={{
      padding: 'var(--admin-space-4)',
      background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.05) 0%, rgba(139, 26, 26, 0.05) 100%)',
      border: '1px solid var(--admin-border-subtle)',
      borderRadius: 'var(--admin-radius-md)',
      marginTop: 'var(--admin-space-4)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--admin-space-3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-space-2)' }}>
          <Sparkles style={{ width: '16px', height: '16px', color: 'var(--admin-gold)' }} />
          <span className="admin-text-sm admin-font-semibold" style={{ color: 'var(--admin-text-primary)' }}>
            AI Image Generator
          </span>
        </div>
        {credits.remaining < 25 && (
          <span className="admin-badge admin-badge-warning" style={{ fontSize: 'var(--admin-text-xs)' }}>
            {credits.remaining}/25 Stability credits left
          </span>
        )}
      </div>

      {/* Generate Button */}
      {!generatedUrl && (
        <button
          onClick={handleGenerate}
          disabled={generating || !productName}
          className="admin-btn admin-btn-primary"
          style={{
            width: '100%',
            padding: 'var(--admin-space-3)',
            gap: 'var(--admin-space-2)',
            opacity: generating || !productName ? 0.5 : 1,
            cursor: generating || !productName ? 'not-allowed' : 'pointer'
          }}
        >
          {generating ? (
            <>
              <RefreshCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles style={{ width: '16px', height: '16px' }} />
              Generate Product Image
            </>
          )}
        </button>
      )}

      {/* Generated Image Preview */}
      {generatedUrl && (
        <div>
          <div style={{
            position: 'relative',
            borderRadius: 'var(--admin-radius-md)',
            overflow: 'hidden',
            backgroundColor: 'var(--admin-surface-0)',
            aspectRatio: '1/1',
            marginBottom: 'var(--admin-space-3)'
          }}>
            <img
              src={generatedUrl}
              alt={productName || 'Generated product image'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
            {provider && (
              <div style={{
                position: 'absolute',
                bottom: 'var(--admin-space-2)',
                left: 'var(--admin-space-2)',
                padding: '4px 8px',
                background: 'rgba(0,0,0,0.7)',
                borderRadius: 'var(--admin-radius-sm)',
                fontSize: '10px',
                color: 'white'
              }}>
                Generated by {provider}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 'var(--admin-space-2)' }}>
            <button
              onClick={handleDownload}
              className="admin-btn admin-btn-primary"
              style={{ flex: 1, gap: 'var(--admin-space-2)' }}
            >
              <Download style={{ width: '14px', height: '14px' }} />
              Download
            </button>
            <button
              onClick={handleGenerate}
              className="admin-btn admin-btn-secondary"
              style={{ flex: 1, gap: 'var(--admin-space-2)' }}
            >
              <RefreshCw style={{ width: '14px', height: '14px' }} />
              Regenerate
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          marginTop: 'var(--admin-space-3)',
          padding: 'var(--admin-space-3)',
          background: 'var(--admin-error-subtle)',
          border: '1px solid rgba(139, 26, 26, 0.3)',
          borderRadius: 'var(--admin-radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--admin-space-2)',
          color: 'var(--admin-error-text)'
        }}>
          <X style={{ width: '14px', height: '14px' }} />
          <span className="admin-text-sm">{error}</span>
        </div>
      )}

      {/* Style CSS */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
