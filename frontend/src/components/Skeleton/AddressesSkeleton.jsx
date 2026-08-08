import React from 'react';
import './Skeleton.css';

const AddressesSkeleton = () => {
  return (
    <div className="addresses-skeleton">
      <div className="skeleton skeleton-sidebar"></div>
      <div className="skeleton-content">
        <div className="skeleton skeleton-header"></div>
        <div className="skeleton-address-grid">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="skeleton-address-card">
              <div className="skeleton skeleton-address-name"></div>
              <div className="skeleton skeleton-address-line"></div>
              <div className="skeleton skeleton-address-line"></div>
              <div className="skeleton skeleton-address-line"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddressesSkeleton;
