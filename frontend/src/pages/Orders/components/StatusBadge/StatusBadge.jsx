import "./StatusBadge.css";

const StatusBadge = ({ status }) => {
  const getStatusClass = (statusStr) => {
    const s = (statusStr || '').toLowerCase();
    switch (s) {
      case 'confirmed':
      case 'published':
      case 'delivered':
        return 'delivered';
      case 'cancelled':
      case 'out-of-stock':
        return 'cancelled';
      case 'processing':
      case 'pending':
      case 'shipped':
      case 'draft':
        return 'processing';
      default:
        return 'processing';
    }
  };

  const statusClass = getStatusClass(status);

  return (
    <span className={`status-badge ${statusClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
