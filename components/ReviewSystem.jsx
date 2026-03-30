/**
 * ReviewSystem — Masonry Layout with Customer Photos
 * 
 * Pinterest-style masonry grid for review cards
 * Image-first design with verified badges
 * Filter pills, lightbox, and full accessibility
 * 
 * Brand: Gold (#C9A227), Dark (#1E1E2E, #13131F)
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FaStar, FaUser, FaThumbsUp, FaThumbsDown, FaCamera } from 'react-icons/fa';
import { X, Upload, CheckCircle, Image as ImageIcon } from 'lucide-react';

// COLORS - hardcoded
const COLORS = {
  gold: '#C9A227',
  goldMuted: '#B8941F',
  dark: '#1E1E2E',
  darkDarker: '#13131F',
  textLight: '#F5F0E8',
  textMuted: '#9E9E9E',
  border: 'rgba(201, 162, 39, 0.12)',
  borderLight: 'rgba(255, 255, 255, 0.05)',
  green: '#22C55E',
  red: '#EF4444',
};

// Star Rating Component
export const StarRating = ({ rating = 0, readonly = false, size = 16 }) => {
  return (
    <div style={{ display: 'flex', gap: '2px' }} role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          aria-hidden="true"
          style={{
            color: star <= rating ? COLORS.gold : 'rgba(201, 162, 39, 0.3)',
            fontSize: `${size}px`,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// Rating Summary with Filter Pills
export const RatingSummary = ({ reviews = [], onFilterChange, activeFilter }) => {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1)
    : '0.0';

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: totalReviews > 0 ? (reviews.filter(r => r.rating === stars).length / totalReviews) * 100 : 0,
  }));

  const reviewsWithPhotos = reviews.filter(r => r.images && r.images.length > 0).length;

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'photos', label: `With Photos (${reviewsWithPhotos})` },
    { id: '5', label: '5★' },
    { id: '4', label: '4★' },
    { id: 'critical', label: 'Critical' },
  ];

  const getColorForStar = (stars) => {
    const colors = { 5: COLORS.green, 4: '#4ADE80', 3: '#FCD34D', 2: '#F97316', 1: COLORS.red };
    return colors[stars] || COLORS.gold;
  };

  return (
    <div
      style={{
        background: COLORS.dark,
        borderRadius: '16px',
        padding: '24px',
        border: `1px solid ${COLORS.border}`,
        marginBottom: '24px',
      }}
    >
      {/* Summary */}
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {/* Left: Big rating */}
        <div style={{ minWidth: '180px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '48px', fontWeight: 'bold', color: COLORS.gold }}>{averageRating}</span>
            <FaStar size={32} style={{ color: COLORS.gold }} />
          </div>
          <p style={{ color: COLORS.textMuted, fontSize: '13px' }}>
            {totalReviews} {totalReviews === 1 ? 'rating' : 'ratings'}
          </p>
          {reviewsWithPhotos > 0 && (
            <button
              onClick={() => onFilterChange('photos')}
              style={{
                background: 'none',
                border: 'none',
                color: COLORS.gold,
                cursor: 'pointer',
                fontSize: '12px',
                marginTop: '4px',
                textDecoration: activeFilter === 'photos' ? 'underline' : 'none',
              }}
            >
              {reviewsWithPhotos} reviews with photos
            </button>
          )}
        </div>

        {/* Right: Breakdown bars */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          {ratingCounts.map(({ stars, count, percentage }) => (
            <div
              key={stars}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '6px',
                cursor: 'pointer',
              }}
              onClick={() => onFilterChange(stars === 1 ? 'critical' : stars.toString())}
            >
              <span style={{ color: COLORS.textLight, fontSize: '13px', minWidth: '40px' }}>
                {stars} ★
              </span>
              <div
                style={{
                  flex: 1,
                  height: '6px',
                  background: COLORS.darkDarker,
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: getColorForStar(stars),
                    borderRadius: '3px',
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
              <span style={{ color: COLORS.textMuted, fontSize: '12px', minWidth: '30px', textAlign: 'right' }}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderTop: `1px solid ${COLORS.borderLight}`, paddingTop: '16px' }}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeFilter === filter.id ? COLORS.gold : 'transparent',
              color: activeFilter === filter.id ? COLORS.dark : COLORS.gold,
              border: `1px solid ${activeFilter === filter.id ? COLORS.gold : COLORS.gold}`,
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== filter.id) {
                e.currentTarget.style.background = 'rgba(201, 162, 39, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== filter.id) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Individual Review Card (Masonry)
export const ReviewCard = ({ review, onOpenLightbox }) => {
  const [helpful, setHelpful] = useState(review?.helpful || 0);
  const [userVoted, setUserVoted] = useState(false);

  const handleHelpful = (vote) => {
    if (!userVoted) {
      setHelpful(prev => prev + (vote === 'yes' ? 1 : -1));
      setUserVoted(true);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatName = (name) => {
    if (!name) return 'Anonymous';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[parts.length - 1][0]}.`;
    }
    return name;
  };

  return (
    <div
      className="review-card"
      style={{
        breakInside: 'avoid',
        marginBottom: '12px',
        display: 'inline-block',
        width: '100%',
        background: COLORS.dark,
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${COLORS.border}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 4px 12px rgba(201, 162, 39, 0.15)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Customer Photo (if exists) */}
      {review.images && review.images.length > 0 && (
        <div style={{ position: 'relative' }}>
          <img
            src={review.images[0].url || review.images[0]}
            alt={`Customer photo by ${review.reviewerName || 'reviewer'}`}
            onClick={() => onOpenLightbox(review.images, 0)}
            style={{
              width: '100%',
              display: 'block',
              cursor: 'pointer',
              objectFit: 'cover',
            }}
            loading="lazy"
          />
          {review.verified && (
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                background: 'rgba(34, 197, 94, 0.9)',
                color: 'white',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CheckCircle size={10} />
              Verified
            </div>
          )}
        </div>
      )}

      {/* Reviewer Info */}
      <div style={{ padding: '12px 14px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldMuted})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FaUser size={12} style={{ color: COLORS.dark }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: COLORS.textLight, fontWeight: 600, margin: 0, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {formatName(review.reviewerName)}
              {review.verified && (
                <span style={{ color: COLORS.green, marginLeft: '4px', fontSize: '11px' }}>✓</span>
              )}
            </p>
            <StarRating rating={review.rating} size={14} />
          </div>
        </div>
      </div>

      {/* Review Text */}
      {review.text && (
        <div style={{ padding: '8px 14px 14px' }}>
          {review.title && (
            <p style={{ color: COLORS.textLight, fontWeight: 600, margin: '0 0 6px', fontSize: '13px' }}>
              {review.title}
            </p>
          )}
          <p style={{ color: COLORS.textMuted, margin: 0, lineHeight: 1.6, fontSize: '13px' }}>
            {review.text}
          </p>
        </div>
      )}

      {/* Helpful Row */}
      <div style={{ padding: '8px 14px', borderTop: `1px solid ${COLORS.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: COLORS.textMuted }}>
          Helpful?
        </span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => handleHelpful('yes')}
            disabled={userVoted}
            style={{
              background: 'none',
              border: 'none',
              cursor: userVoted ? 'default' : 'pointer',
              color: userVoted ? COLORS.gold : COLORS.textMuted,
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              opacity: userVoted ? 1 : 0.7,
            }}
          >
            👍 Yes ({helpful})
          </button>
          <span style={{ fontSize: '11px', color: COLORS.textMuted }}>
            {formatDate(review.date)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Image Lightbox
export const ImageLightbox = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const goToPrev = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          zIndex: 10,
        }}
        aria-label="Close lightbox"
      >
        <X size={24} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
            style={{
              position: 'absolute',
              left: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
            }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            style={{
              position: 'absolute',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
            }}
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}

      <img
        src={images[currentIndex].url || images[currentIndex]}
        alt={`Customer photo ${currentIndex + 1} of ${images.length}`}
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          objectFit: 'contain',
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <div style={{ position: 'absolute', bottom: '20px', color: 'white', fontSize: '12px' }}>
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

// Review Form Modal
export const ReviewForm = ({ productId, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !submitted) onCancel();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel, submitted]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPG, PNG, and WebP formats allowed');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image must be under 5MB');
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const previews = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages(prev => [...prev, ...previews]);
      setError('');
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a star rating');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a review title');
      return;
    }
    if (!text.trim()) {
      setError('Please write your review');
      return;
    }
    if (!reviewerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsSubmitting(true);

    const uploadedImages = images.map(({ file, preview }) => ({
      url: preview,
      name: file.name,
    }));

    const reviewData = {
      productId,
      rating,
      title,
      text,
      reviewerName,
      images: uploadedImages,
      date: new Date().toISOString(),
      verified: false,
    };

    await onSubmit(reviewData);
    setSubmitted(true);

    setTimeout(() => {
      onCancel();
    }, 2000);
  };

  if (submitted) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}
      >
        <div
          style={{
            background: COLORS.dark,
            borderRadius: '20px',
            padding: '40px',
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center',
            border: `1px solid ${COLORS.gold}`,
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✓</div>
          <h3 style={{ color: COLORS.textLight, margin: '0 0 8px', fontSize: '20px' }}>Thank You!</h3>
          <p style={{ color: COLORS.textMuted, margin: 0, fontSize: '14px' }}>
            Your review is pending approval.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={onCancel}
      role="presentation"
    >
      <div
        ref={(el) => {
          if (el) {
            const firstInput = el.querySelector('input, textarea, button');
            if (firstInput) firstInput.focus();
          }
        }}
        style={{
          background: COLORS.dark,
          borderRadius: '20px',
          padding: '32px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: `1px solid ${COLORS.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-form-title"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 id="review-form-title" style={{ color: COLORS.textLight, margin: 0, fontSize: '20px' }}>Write a Review</h3>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: COLORS.textMuted,
              padding: '4px',
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: COLORS.textLight, fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Your Rating *
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: star <= rating ? COLORS.gold : 'rgba(201, 162, 39, 0.3)',
                    fontSize: '32px',
                    padding: 0,
                    transition: 'color 0.2s',
                  }}
                  aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: COLORS.textLight, fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Review Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: COLORS.darkDarker,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                color: COLORS.textLight,
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: COLORS.textLight, fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Your Review *
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tell others what you think..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: COLORS.darkDarker,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                color: COLORS.textLight,
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: COLORS.textLight, fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Add Photos (optional)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${COLORS.border}`,
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(201, 162, 39, 0.05)',
                transition: 'all 0.2s',
              }}
            >
              <FaCamera size={32} style={{ color: COLORS.gold, marginBottom: '8px' }} />
              <p style={{ color: COLORS.textLight, margin: '0 0 4px', fontSize: '14px' }}>
                📷 Add photos (up to 5)
              </p>
              <span style={{ color: COLORS.textMuted, fontSize: '12px' }}>
                JPG, PNG up to 5MB each
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>

            {images.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                {images.map(({ preview }, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      width: '80px',
                      height: '80px',
                    }}
                  >
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      aria-label={`Remove image ${idx + 1}`}
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: COLORS.red,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: COLORS.textLight, fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Your Name *
            </label>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: COLORS.darkDarker,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                color: COLORS.textLight,
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <p style={{ color: COLORS.red, fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '14px',
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldMuted})`,
              border: 'none',
              borderRadius: '8px',
              color: COLORS.dark,
              fontWeight: 600,
              fontSize: '15px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Main ReviewSystem Component with Masonry Grid
export const ReviewSystem = ({ productId, reviews = [], onAddReview, onUpdateReview }) => {
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxImages, setLightboxImages] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [localReviews, setLocalReviews] = useState(reviews || []);

  const handleAddReview = async (reviewData) => {
    const newReview = {
      ...reviewData,
      _id: `review-${Date.now()}`,
      helpful: 0,
    };
    setLocalReviews(prev => [newReview, ...prev]);
    await onAddReview?.(newReview);
    setShowForm(false);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleOpenLightbox = (images, index) => {
    setLightboxImages(images);
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxImages(null);
    setLightboxIndex(0);
  };

  // Filter reviews
  const filteredReviews = localReviews.filter(review => {
    if (activeFilter === 'photos') {
      return review.images && review.images.length > 0;
    }
    if (activeFilter === 'critical') {
      return review.rating <= 2;
    }
    if (['1', '2', '3', '4', '5'].includes(activeFilter)) {
      return review.rating === parseInt(activeFilter);
    }
    return true;
  });

  return (
    <div style={{ position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ color: COLORS.textLight, margin: 0, fontSize: '20px' }}>Customer Reviews</h3>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            border: `2px solid ${COLORS.gold}`,
            borderRadius: '8px',
            color: COLORS.gold,
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Write a Review
        </button>
      </div>

      {/* Rating Summary + Filters */}
      <RatingSummary
        reviews={localReviews}
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
      />

      {/* Masonry Grid */}
      {filteredReviews.length > 0 ? (
        <>
          <style>{`
            .reviews-grid {
              columns: 2;
              column-gap: 12px;
            }
            @media (min-width: 768px) {
              .reviews-grid {
                columns: 3;
                column-gap: 16px;
              }
            }
            .review-card {
              break-inside: avoid;
              margin-bottom: 12px;
              display: inline-block;
              width: 100%;
            }
          `}</style>
          <div className="reviews-grid">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onOpenLightbox={(images, index) => handleOpenLightbox(images, index)}
              />
            ))}
          </div>
        </>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: COLORS.dark,
            borderRadius: '16px',
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div style={{ fontSize: '64px', color: COLORS.gold, marginBottom: '16px' }}>☆</div>
          <p style={{ color: COLORS.textLight, fontSize: '18px', marginBottom: '8px' }}>
            No reviews yet
          </p>
          <p style={{ color: COLORS.textMuted, fontSize: '14px', marginBottom: '20px' }}>
            Be the first to share your experience
          </p>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '12px 24px',
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldMuted})`,
              border: 'none',
              borderRadius: '8px',
              color: COLORS.dark,
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Write a Review
          </button>
        </div>
      )}

      {/* Review Form Modal */}
      {showForm && (
        <ReviewForm
          productId={productId}
          onSubmit={handleAddReview}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Image Lightbox */}
      {lightboxImages && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={handleCloseLightbox}
        />
      )}
    </div>
  );
};

export default ReviewSystem;
