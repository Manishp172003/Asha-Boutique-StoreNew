import './StatusBadge.css';

const StatusBadge = ({ status, variant = 'default' }) => {
  const statusConfig = {
    published: {
      className: 'status-published',
      label: 'Published'
    },
    draft: {
      className: 'status-draft',
      label: 'Draft'
    },
    'out of stock': {
      className: 'status-out-of-stock',
      label: 'Out of Stock'
    },
    processing: {
      className: 'status-processing',
      label: 'Processing'
    },
    shipped: {
      className: 'status-shipped',
      label: 'Shipped'
    },
    delivered: {
      className: 'status-delivered',
      label: 'Delivered'
    },
    cancelled: {
      className: 'status-cancelled',
      label: 'Cancelled'
    },
    confirmed: {
      className: 'status-confirmed',
      label: 'Confirmed'
    },
    pending: {
      className: 'status-pending',
      label: 'Pending'
    },
  };

  const config = statusConfig[status?.toLowerCase()] || {
    className: 'status-default',
    label: status || 'Unknown'
  };

  return (
    <span className={`status-badge ${config.className} ${variant}`}>
      <span className="status-dot"></span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
