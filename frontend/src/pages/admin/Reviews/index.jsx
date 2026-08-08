import { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, RefreshCw, MessageSquare } from 'lucide-react';
import './Reviews.css';
import AdminSidebar from '../../../components/admin/Sidebar/AdminSidebar';
import AdminTopNav from '../../../components/admin/TopNav/AdminTopNav';
import AdminButton from '../../../components/admin/Button/AdminButton';
import EmptyState from '../../../components/EmptyState/EmptyState';
import { getAllTestimonialsAdmin, approveTestimonialAdmin, deleteTestimonialAdmin } from '../../../services/testimonialService';
import { toast } from 'sonner';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchReviewsData = async () => {
    setLoading(true);
    try {
      const data = await getAllTestimonialsAdmin();
      setReviews(data);
    } catch (err) {
      toast.error("Failed to load customer reviews ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsData();
  }, []);

  const handleApproveToggle = async (id, isCurrentlyApproved) => {
    const nextStatus = !isCurrentlyApproved;
    const actionText = nextStatus ? "Approving" : "Unapproving";
    const actionToast = toast.loading(`${actionText} review...`);
    try {
      await approveTestimonialAdmin(id, nextStatus);
      toast.dismiss(actionToast);
      toast.success(nextStatus ? "Review published to storefront!" : "Review hidden from storefront!");
      fetchReviewsData();
    } catch (err) {
      toast.dismiss(actionToast);
      toast.error(err.message || "Operation failed");
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
    const actionToast = toast.loading("Deleting review...");
    try {
      await deleteTestimonialAdmin(id);
      toast.dismiss(actionToast);
      toast.success("Review deleted successfully!");
      fetchReviewsData();
    } catch (err) {
      toast.dismiss(actionToast);
      toast.error(err.message || "Failed to delete review");
    }
  };

  // Render gold stars helper
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, idx) => {
      const filled = idx < rating;
      return (
        <Star 
          key={idx} 
          size={14} 
          className={filled ? "review-card__star review-card__star--filled" : "review-card__star"} 
          fill={filled ? "#fbbf24" : "none"}
        />
      );
    });
  };

  // Date formatter
  const getFormattedDate = (dateString) => {
    if (!dateString) return 'Just now';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter criteria
  const filteredReviews = reviews.filter(r => {
    if (activeFilter === 'Approved') return r.approved;
    if (activeFilter === 'Pending') return !r.approved;
    return true; // All
  });

  return (
    <div className="admin-page">
      <AdminSidebar />
      <AdminTopNav />
      
      <main className="admin-main">
        {/* Header */}
        <div className="admin-page-header" style={{ marginBottom: "20px" }}>
          <div className="admin-page-header__content">
            <nav className="admin-breadcrumb">
              <span>Dashboard</span>
              <span>/</span>
              <span className="admin-breadcrumb__active">Reviews</span>
            </nav>
            <h2 className="admin-page-header__title">Customer Reviews Manager</h2>
            <p className="admin-page-header__description">
              Moderate and audit user quotes, approve ratings to publish them to the storefront, or remove spam.
            </p>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="reviews-filters-bar">
          <div className="reviews-filter-chips">
            {['All', 'Pending', 'Approved'].map(filter => (
              <button
                key={filter}
                className={`reviews-filter-chip ${activeFilter === filter ? 'reviews-filter-chip--active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === 'All' ? 'All Reviews' : filter === 'Pending' ? 'Pending Approval' : 'Approved'} ({
                  filter === 'All' ? reviews.length : 
                  filter === 'Pending' ? reviews.filter(r => !r.approved).length : 
                  reviews.filter(r => r.approved).length
                })
              </button>
            ))}
          </div>
          <div>
            <AdminButton variant="outline" icon={<RefreshCw size={18} />} onClick={fetchReviewsData}>
              Refresh List
            </AdminButton>
          </div>
        </div>

        {/* Reviews Grid List */}
        {loading ? (
          <div className="text-center py-16 text-[#7A655D]">Loading customer feedback...</div>
        ) : filteredReviews.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No Reviews Found"
            description="Reviews matching your active selection filter will display here."
          />
        ) : (
          <div className="reviews-grid">
            {filteredReviews.map((review) => (
              <div key={review.id} className="review-card">
                <div>
                  <div className="review-card__header">
                    <img 
                      src={review.avatarUrl || '/images/avatar1.jpg'} 
                      alt={review.name} 
                      className="review-card__avatar"
                      onError={(e) => { e.target.src = '/images/avatar1.jpg'; }}
                    />
                    <div>
                      <h4 className="review-card__name">{review.name}</h4>
                      <p className="review-card__date">{getFormattedDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <div className="review-card__stars">
                    {renderStars(review.rating)}
                  </div>
                  <p className="review-card__quote">
                    "{review.quote}"
                  </p>
                </div>

                <div className="review-card__footer">
                  <span className={`review-card__status-badge ${
                    review.approved ? 'review-card__status-badge--approved' : 'review-card__status-badge--pending'
                  }`}>
                    {review.approved ? 'Approved' : 'Pending Approval'}
                  </span>
                  
                  <div className="review-card__actions">
                    <button 
                      className="review-card__action-btn"
                      title={review.approved ? "Hide from Storefront" : "Approve & Publish"}
                      onClick={() => handleApproveToggle(review.id, review.approved)}
                    >
                      {review.approved ? <X size={16} /> : <Check size={16} />}
                    </button>
                    <button 
                      className="review-card__action-btn review-card__action-btn--delete"
                      title="Permanently Delete Review"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Reviews;
