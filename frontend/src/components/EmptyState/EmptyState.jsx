import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import './EmptyState.css';

const EmptyState = ({ icon: Icon, title, description, buttonText, buttonRoute, onButtonClick }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (buttonRoute) {
      navigate(buttonRoute);
    }
  };

  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <div className="empty-state-icon">
          <Icon size={48} />
        </div>
        <h2 className="empty-state-title">{title}</h2>
        <p className="empty-state-description">{description}</p>
        {buttonText && (
          <Button 
            className="empty-state-button" 
            onClick={handleButtonClick}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
