import React from 'react';
import './Skeleton.css';

const OrderDetailsSkeleton = () => {
  return (
    <div className="order-details-skeleton">
      <div className="skeleton skeleton-breadcrumb"></div>
      <div className="skeleton skeleton-order-header"></div>
      <div className="skeleton skeleton-order-items">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="skeleton-order-item">
            <div className="skeleton skeleton-item-image"></div>
            <div className="skeleton-item-details">
              <div className="skeleton skeleton-item-name"></div>
              <div className="skeleton skeleton-item-price"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="skeleton skeleton-order-summary"></div>
    </div>
  );
};

export default OrderDetailsSkeleton;
