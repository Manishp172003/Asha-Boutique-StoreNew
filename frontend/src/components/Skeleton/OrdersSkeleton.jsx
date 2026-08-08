import React from 'react';
import './Skeleton.css';

const OrdersSkeleton = () => {
  return (
    <div className="orders-skeleton">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="skeleton skeleton-order-card"></div>
      ))}
    </div>
  );
};

export default OrdersSkeleton;
