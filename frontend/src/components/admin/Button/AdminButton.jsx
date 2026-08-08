import './AdminButton.css';

const AdminButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  onClick, 
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`admin-btn admin-btn--${variant} admin-btn--${size} ${className}`}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="admin-btn__icon">{icon}</span>}
      {children}
    </button>
  );
};

export default AdminButton;
