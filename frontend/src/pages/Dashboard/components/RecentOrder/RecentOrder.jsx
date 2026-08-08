import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Truck, ArrowRight } from "lucide-react";
import StatusBadge from "../../../Orders/components/StatusBadge/StatusBadge";
import LazyImage from "../../../../components/common/LazyImage";
import "./RecentOrder.css";

const RecentOrder = ({ order }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDeliveryDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (!order) {
    return (
      <div className="recent-order-card empty-state">
        <div className="empty-icon">
          <Calendar size={32} color="#E46A53" />
        </div>
        <h3>No Orders Yet</h3>
        <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
        <Button variant="primary" onClick={() => navigate('/shop')}>
          Start Shopping
        </Button>
      </div>
    );
  }

  const latestItem = order.items?.[0];
  const totalItemsCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 1;

  return (
    <div className="recent-order-card">
      <div className="recent-order-header">
        <div className="recent-order-title-block">
          <h3>Recent Order</h3>
          <span className="order-number">Order #{order.orderNumber || order.id}</span>
        </div>
        <div className="order-status-wrapper">
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="recent-order-body">
        <div className="product-details-section">
          <div className="recent-order-image-container">
            {(latestItem?.product?.imageUrl || latestItem?.product?.image || latestItem?.imageUrl || latestItem?.image) ? (
              <LazyImage 
                className="recent-order-image" 
                src={latestItem.product?.imageUrl || latestItem.product?.image || latestItem.imageUrl || latestItem.image} 
                alt={latestItem.product?.name || latestItem.name || latestItem.productName} 
                loading="lazy" 
              />
            ) : (
              <div className="recent-order-placeholder-image"></div>
            )}
          </div>
          <div className="recent-order-info">
            <h4 className="recent-order-product-name">
              {latestItem?.product?.name || latestItem?.name || latestItem?.productName || 'Product'}
            </h4>
            {totalItemsCount > 1 && (
              <span className="additional-items-tag">+{totalItemsCount - 1} more item{totalItemsCount > 2 ? 's' : ''}</span>
            )}
            <p className="recent-order-price">
              {formatPrice(latestItem?.priceAtOrder ?? latestItem?.product?.price ?? latestItem?.price ?? 0)}
            </p>
          </div>
        </div>

        <div className="recent-order-meta-section">
          <div className="meta-row">
            <Calendar size={14} className="meta-icon" />
            <span className="meta-label">Ordered on:</span>
            <span className="meta-value">{formatDate(order.createdAt)}</span>
          </div>
          <div className="meta-row">
            <Truck size={14} className="meta-icon" />
            <span className="meta-label">Est. Delivery:</span>
            <span className="meta-value">{formatDeliveryDate(order.estimatedDelivery)}</span>
          </div>
        </div>

        <div className="recent-order-action-section">
          <button 
            onClick={() => navigate(`/orders/${order.id}`)}
            className="recent-order-track-btn"
          >
            <span>Track Order</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentOrder;

