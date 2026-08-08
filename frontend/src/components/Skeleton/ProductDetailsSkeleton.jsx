import React from 'react';
import './Skeleton.css';

const ProductDetailsSkeleton = () => {
  return (
    <div className="product-details-skeleton">
      <div className="skeleton skeleton-gallery"></div>
      <div className="skeleton-info">
        <div className="skeleton skeleton-breadcrumb"></div>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-price"></div>
        <div className="skeleton skeleton-description"></div>
        <div className="skeleton skeleton-button"></div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
