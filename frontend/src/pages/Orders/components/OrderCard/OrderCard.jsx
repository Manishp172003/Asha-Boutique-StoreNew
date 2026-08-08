import "./OrderCard.css";
import StatusBadge from "../StatusBadge/StatusBadge";
import { useNavigate } from "react-router-dom";
import LazyImage from "../../../../components/common/LazyImage";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
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

  const firstItem = order.items?.[0];
  const additionalItems = order.items?.length > 1 ? order.items.length - 1 : 0;

  const handleViewDetails = () => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <div className="order-card">
      <div className="order-card-left">
        <div className="order-image">
          {(firstItem?.product?.imageUrl || firstItem?.imageUrl) ? (
            <LazyImage src={firstItem.product?.imageUrl || firstItem.imageUrl} alt={firstItem.product?.name || firstItem.name} loading="lazy" />
          ) : (
            <div className="order-image-placeholder"></div>
          )}
        </div>
        <div className="order-info">
          <h3 className="order-product-name">{firstItem?.product?.name || firstItem?.name || 'Product'}</h3>
          {additionalItems > 0 && (
            <span className="additional-items">+{additionalItems} more item{additionalItems > 1 ? 's' : ''}</span>
          )}
          <div className="order-meta">
            <span className="order-id">Order #{order.orderNumber || order.id}</span>
            <span className="order-date">{formatDate(order.createdAt)}</span>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </div>
      <div className="order-card-right">
        <span className="order-total">{formatPrice(order.totalPrice ?? order.totalAmount ?? order.total ?? 0)}</span>
        <button className="view-details-btn" onClick={handleViewDetails}>View Details</button>
      </div>
    </div>
  );
};

export default OrderCard;
