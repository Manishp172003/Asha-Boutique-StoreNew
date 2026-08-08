import React from 'react';
import './Skeleton.css';

const DashboardSkeleton = () => {
  return (
    <div className="dashboard-skeleton">
      <div className="skeleton skeleton-sidebar"></div>
      <div className="skeleton-content">
        <div className="skeleton skeleton-welcome"></div>
        <div className="skeleton skeleton-stats">
          <div className="skeleton skeleton-stat-card"></div>
          <div className="skeleton skeleton-stat-card"></div>
          <div className="skeleton skeleton-stat-card"></div>
          <div className="skeleton skeleton-stat-card"></div>
        </div>
        <div className="skeleton skeleton-recent-order"></div>
        <div className="skeleton skeleton-wishlist"></div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
