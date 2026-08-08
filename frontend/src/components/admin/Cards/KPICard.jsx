import { TrendingUp, TrendingDown } from 'lucide-react';
import './KPICard.css';

const KPICard = ({ title, value, change, icon, trend, color = 'primary' }) => {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-on-surface-variant';
  
  const colorClasses = {
    primary: 'bg-primary-fixed/30 text-primary',
    secondary: 'bg-secondary-fixed/30 text-secondary',
    tertiary: 'bg-tertiary-fixed text-tertiary',
    accent: 'bg-primary-container/20 text-primary',
  };

  return (
    <div className="kpi-card">
      <div className="kpi-card__header">
        <div className={`kpi-card__icon ${colorClasses[color]}`}>
          <span className="kpi-icon">{icon}</span>
        </div>
        {change && (
          <span className={`kpi-card__change ${trendColor}`}>
            {change} <TrendIcon size={14} />
          </span>
        )}
      </div>
      <p className="kpi-card__label">{title}</p>
      <h3 className="kpi-card__value">{value}</h3>
    </div>
  );
};

export default KPICard;
