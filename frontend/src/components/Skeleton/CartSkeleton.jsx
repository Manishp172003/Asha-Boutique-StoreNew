import React from 'react';
import './Skeleton.css';

const CartSkeleton = () => {
  return (
    <div className="cart-skeleton">
      <div className="skeleton-cart-items">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="skeleton-cart-item">
            <div className="skeleton skeleton-item-image"></div>
            <div className="skeleton-item-details">
              <div className="skeleton skeleton-item-name"></div>
              <div className="skeleton skeleton-item-price"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="skeleton skeleton-order-summary">
        <div className="skeleton skeleton-summary-line"></div>
        <div className="skeleton skeleton-summary-line"></div>
        <div className="skeleton skeleton-summary-line"></div>
        <div className="skeleton skeleton-summary-total"></div>
        <div className="skeleton skeleton-checkout-btn"></div>
      </div>
    </div>
  );
};

export default CartSkeleton;
