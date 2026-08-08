import React from 'react';
import './Skeleton.css';

const ProfileSkeleton = () => {
  return (
    <div className="profile-skeleton">
      <div className="skeleton skeleton-sidebar"></div>
      <div className="skeleton-content">
        <div className="skeleton skeleton-header"></div>
        <div className="skeleton skeleton-info-card">
          <div className="skeleton skeleton-info-line"></div>
          <div className="skeleton skeleton-info-line"></div>
          <div className="skeleton skeleton-info-line"></div>
          <div className="skeleton skeleton-info-line"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
