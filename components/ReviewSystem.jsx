// components/ReviewSystem.jsx
import React, { useState, useEffect } from 'react';
import { FaStar, FaUser, FaThumbsUp, FaThumbsDown, FaReply } from 'react-icons/fa';

// Star Rating Component
export const StarRating = ({ rating = 0, onRatingChange, readonly = false, size = 'medium' }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-xl'
  };
  
  const handleStarClick = (starRating) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };
  
  const handleMouseEnter = (starRating) => {
    if (!readonly) {
      setHoverRating(starRating);
    }
  };
  
  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };
  
  const displayRating = hoverRating || rating;
  
  return (
    <div className={`star-rating ${sizeClasses[size]} ${readonly ? 'readonly' : 'interactive'}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= displayRating ? 'filled' : 'empty'}`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={readonly}
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <FaStar />
        </button>
      ))}
      {rating > 0 && (
        <span className="rating-text">({rating.toFixed(1)})</span>
      )}
    </div>
  );
};

// Rating Summary Component
export const RatingSummary = ({ reviews = [] }) => {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });
  
  return (
    <div className="rating-summary">
      <div className="rating-overview">
        <div className="average-rating">
          <span className="rating-number">{averageRating.toFixed(1)}</span>
          <StarRating rating={averageRating} readonly size="large" />
          <span className="total-reviews">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <div className="rating-distribution">
        {ratingDistribution.map(({ rating, count, percentage }) => (
          <div key={rating} className="rating-bar">
            <span className="rating-label">{rating} star</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="rating-count">({count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Individual Review Component
export const ReviewCard = ({ review, onHelpful, onReply }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim() && onReply) {
      onReply(review._id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.user?.image ? (
              <img src={review.user.image} alt={review.user.name} />
            ) : (
              <FaUser />
            )}
          </div>
          <div className="reviewer-details">
            <h4 className="reviewer-name">{review.user?.name || 'Anonymous'}</h4>
            <p className="review-date">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} readonly size="small" />
      </div>
      
      <div className="review-content">
        <h5 className="review-title">{review.title}</h5>
        <p className="review-text">{review.comment}</p>
        
        {review.images && review.images.length > 0 && (
          <div className="review-images">
            {review.images.map((image, index) => (
              <img key={index} src={image} alt={`Review ${index + 1}`} />
            ))}
          </div>
        )}
      </div>
      
      <div className="review-actions">
        <button 
          className="helpful-btn"
          onClick={() => onHelpful && onHelpful(review._id, true)}
        >
          <FaThumbsUp /> Helpful ({review.helpfulCount || 0})
        </button>
        
        <button 
          className="reply-btn"
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          <FaReply /> Reply
        </button>
      </div>
      
      {showReplyForm && (
        <form className="reply-form" onSubmit={handleReplySubmit}>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
            required
          />
          <div className="reply-actions">
            <button type="submit" className="submit-reply">Post Reply</button>
            <button 
              type="button" 
              className="cancel-reply"
              onClick={() => setShowReplyForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      
      {review.replies && review.replies.length > 0 && (
        <div className="review-replies">
          {review.replies.map((reply, index) => (
            <div key={index} className="reply">
              <div className="reply-author">
                <strong>{reply.user?.name || 'Anonymous'}</strong>
                <span className="reply-date">{formatDate(reply.createdAt)}</span>
              </div>
              <p className="reply-text">{reply.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Review Form Component
export const ReviewForm = ({ productId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      alert('Please provide a rating');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        productId,
        createdAt: new Date().toISOString()
      });
      // Reset form
      setFormData({ rating: 0, title: '', comment: '', images: [] });
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you'd upload these to a cloud service
    // For now, we'll just create object URLs
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };
  
  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Write a Review</h3>
      
      <div className="form-group">
        <label>Rating *</label>
        <StarRating 
          rating={formData.rating}
          onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
          size="large"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="review-title">Title</label>
        <input
          id="review-title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Summarize your review"
          maxLength={100}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="review-comment">Review *</label>
        <textarea
          id="review-comment"
          value={formData.comment}
          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
          placeholder="Share your experience with this product"
          rows={5}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="review-images">Add Photos (Optional)</label>
        <input
          id="review-images"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />
        {formData.images.length > 0 && (
          <div className="uploaded-images">
            {formData.images.map((image, index) => (
              <img key={index} src={image} alt={`Upload ${index + 1}`} />
            ))}
          </div>
        )}
      </div>
      
      <div className="form-actions">
        <button 
          type="submit" 
          className="submit-review"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
        <button 
          type="button" 
          className="cancel-review"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Main ReviewSystem Component
export const ReviewSystem = ({ productId, reviews = [], onAddReview, onUpdateReview }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  const handleAddReview = async (reviewData) => {
    if (onAddReview) {
      await onAddReview(reviewData);
      setShowReviewForm(false);
    }
  };
  
  const handleHelpful = async (reviewId, isHelpful) => {
    if (onUpdateReview) {
      await onUpdateReview(reviewId, { helpful: isHelpful });
    }
  };
  
  const handleReply = async (reviewId, replyText) => {
    if (onUpdateReview) {
      await onUpdateReview(reviewId, { reply: replyText });
    }
  };
  
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });
  
  return (
    <div className="review-system">
      <div className="review-header">
        <h3>Customer Reviews</h3>
        <button 
          className="write-review-btn"
          onClick={() => setShowReviewForm(true)}
        >
          Write a Review
        </button>
      </div>
      
      <RatingSummary reviews={reviews} />
      
      {showReviewForm && (
        <div className="review-form-overlay">
          <div className="review-form-container">
            <ReviewForm 
              productId={productId}
              onSubmit={handleAddReview}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        </div>
      )}
      
      <div className="reviews-controls">
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        </div>
      </div>
      
      <div className="reviews-list">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <ReviewCard 
              key={review._id}
              review={review}
              onHelpful={handleHelpful}
              onReply={handleReply}
            />
          ))
        ) : (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default {
  ReviewSystem,
  StarRating,
  RatingSummary,
  ReviewCard,
  ReviewForm
};