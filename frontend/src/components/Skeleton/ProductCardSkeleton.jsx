import React from 'react';
import './Skeleton.css';

const ProductCardSkeleton = () => {
  return (
    <div className="product-card-skeleton">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton-details">
        <div className="skeleton skeleton-category"></div>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-price"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
