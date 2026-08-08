import { useNavigate } from "react-router-dom";
import { useApp } from "../../../../context/AppContext";
import LazyImage from "../../../../components/common/LazyImage";
import "./ActiveOrders.css";

const ActiveOrders = () => {
  const navigate = useNavigate();
  const { orders } = useApp();

  // Get the latest active order (first in array since orders are sorted by date)
  const latestOrder = orders.length > 0 ? orders[0] : null;

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    // status is an uppercase enum from the backend
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'CONFIRMED':
        return 'confirmed';
      case 'PROCESSING':
        return 'processing';
      case 'SHIPPED':
        return 'shipped';
      case 'DELIVERED':
        return 'delivered';
      case 'CANCELLED':
        return 'cancelled';
      default:
        return 'processing';
    }
  };

  const handleViewAllOrders = () => {
    navigate('/orders');
  };

  if (!latestOrder) {
    return (
      <section className="active-orders-card">

        <div className="active-orders-header">
          <div>
            <h2>Active Orders</h2>
            <p>Track your latest boutique purchases</p>
          </div>

          <button className="view-all-btn" onClick={handleViewAllOrders}>
            View All Orders
          </button>
        </div>

        <div className="empty-state">
          <h3>No Active Orders</h3>
          <p>Browse our latest collection.</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>

      </section>
    );
  }

  const firstItem = latestOrder.items?.[0];

  return (
    <section className="active-orders-card">

      <div className="active-orders-header">
        <div>
          <h2>Active Orders</h2>
          <p>Track your latest boutique purchases</p>
        </div>

        <button className="view-all-btn" onClick={handleViewAllOrders}>
          View All Orders
        </button>
      </div>

      <div className="active-order">

        <div className="order-image">
          {(firstItem?.product?.imageUrl || firstItem?.product?.image || firstItem?.imageUrl || firstItem?.image) ? (
            <LazyImage
              src={firstItem.product?.imageUrl || firstItem.product?.image || firstItem.imageUrl || firstItem.image}
              alt={firstItem.product?.name || firstItem.name || firstItem.productName}
              loading="lazy"
            />
          ) : (
            <div className="placeholder-image"></div>
          )}
        </div>

        <div className="order-content">

          <h3>{firstItem?.product?.name || firstItem?.name || firstItem?.productName || 'Product'}</h3>

          <p className="order-id">
            Order #{latestOrder.orderNumber || latestOrder.id}
          </p>

          <p className="delivery">
            Estimated Delivery:
            <span> {formatDate(latestOrder.estimatedDelivery)}</span>
          </p>

          <div className={`status ${getStatusClass(latestOrder.status)}`}>
            {latestOrder.status
              ? latestOrder.status.charAt(0).toUpperCase() + latestOrder.status.slice(1).toLowerCase()
              : 'Processing'}
          </div>

        </div>

      </div>

    </section>
  );
};

export default ActiveOrders;