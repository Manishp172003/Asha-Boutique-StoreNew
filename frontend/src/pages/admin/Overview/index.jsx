import { useState, useEffect } from 'react';
import { Clock, IndianRupee, ShoppingCart, Calendar, TrendingUp } from 'lucide-react';
import './Overview.css';
import AdminSidebar from '../../../components/admin/Sidebar/AdminSidebar';
import AdminTopNav from '../../../components/admin/TopNav/AdminTopNav';
import KPICard from '../../../components/admin/Cards/KPICard';
import { getAllOrdersAdmin } from '../../../services/orderService';
import { getAllBookingsAdmin } from '../../../services/bookingService';
import { useApp } from '../../../context/AppContext';
import { toast } from 'sonner';

const Overview = () => {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState('just now');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [ordersData, bookingsData] = await Promise.all([
          getAllOrdersAdmin(),
          getAllBookingsAdmin()
        ]);
        setOrders(ordersData);
        setBookings(bookingsData);
        setLastSynced('just now');
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
        toast.error('Failed to sync system statistics');
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Calculate metrics
  const totalSalesVal = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'PROCESSING' || o.status === 'PENDING').length;
  const activeBookingsCount = bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'SCHEDULED').length;
  const totalOrdersCount = orders.length;

  const kpiData = [
    {
      title: 'Total Sales',
      value: `₹${totalSalesVal.toLocaleString('en-IN')}`,
      change: '+100%',
      icon: <IndianRupee size={24} />,
      trend: 'up',
      color: 'primary'
    },
    {
      title: 'Active Orders',
      value: pendingOrdersCount.toString(),
      change: `of ${totalOrdersCount} total`,
      icon: <ShoppingCart size={24} />,
      trend: 'up',
      color: 'secondary'
    },
    {
      title: 'Appointments',
      value: activeBookingsCount.toString(),
      change: `all time: ${bookings.length}`,
      icon: <Calendar size={24} />,
      trend: 'up',
      color: 'tertiary'
    },
    {
      title: 'Total Revenue',
      value: `₹${totalSalesVal.toLocaleString('en-IN')}`,
      change: 'Gross',
      icon: <TrendingUp size={24} />,
      trend: 'up',
      color: 'accent'
    }
  ];

  const getStatusClass = (status) => {
    const statusMap = {
      'SHIPPED': 'status-shipped',
      'PENDING': 'status-processing',
      'PROCESSING': 'status-processing',
      'DELIVERED': 'status-delivered',
      'CANCELLED': 'status-default',
    };
    return statusMap[status?.toUpperCase()] || 'status-default';
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return { date: 'Apt', day: '--' };
    try {
      const d = new Date(dateStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        date: months[d.getMonth()] || 'Apt',
        day: d.getDate().toString()
      };
    } catch {
      return { date: 'Apt', day: '--' };
    }
  };

  const getItemsCount = (order) => {
    return order.items ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
  };

  // Get first 4 upcoming appointments
  const upcomingAppointments = bookings
    .filter(b => b.status !== 'CANCELLED' && b.status !== 'COMPLETED')
    .slice(0, 4);

  // Get first 5 recent orders
  const recentOrdersList = orders.slice(0, 5);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="admin-page">
      <AdminSidebar />
      <AdminTopNav />
      
      <main className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header__greeting">
            <p className="admin-header__subtitle">Welcome Back</p>
            <h2 className="admin-header__title">Morning, {user?.name || 'Admin'}</h2>
          </div>
          <div className="admin-header__meta">
            <p className="admin-header__date">{formattedDate}</p>
            <div className="admin-header__sync">
              <Clock size={16} />
              <span>System last synced {lastSynced}</span>
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="kpi-grid">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">
          {/* Sales Chart */}
          <div className="bento-item bento-item--chart">
            <div className="bento-item__header">
              <div>
                <h4 className="bento-item__title">Sales Performance</h4>
                <p className="bento-item__subtitle">Revenue analytics for the current quarter.</p>
              </div>
              <select className="bento-item__select">
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="chart-container">
              <div className="chart-bars">
                {[60, 45, 75, 55, 90, 65, 80, 40].map((height, index) => (
                  <div 
                    key={index} 
                    className="chart-bar" 
                    style={{ height: `${height}%` }}
                  >
                    {(index === 0 || index === 4) && (
                      <div className="chart-bar__tooltip">
                        {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][index]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="chart-labels">
                {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((label) => (
                  <span key={label} className="chart-label">{label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Appointments */}
          <div className="bento-item bento-item--appointments">
            <div className="bento-item__header">
              <h4 className="bento-item__title">Appointments</h4>
              <a href="/admin/appointments" className="bento-item__link">View All</a>
            </div>
            {upcomingAppointments.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">No upcoming appointments</div>
            ) : (
              <ul className="appointments-list">
                {upcomingAppointments.map((apt, index) => {
                  const dateInfo = parseDate(apt.preferredDate);
                  return (
                    <li key={apt.id || index} className="appointment-item">
                      <div className="appointment-date">
                        <p className="appointment-date__month">{dateInfo.date}</p>
                        <p className="appointment-date__day">{dateInfo.day}</p>
                      </div>
                      <div className="appointment-info">
                        <h5 className="appointment-info__name">{apt.name}</h5>
                        <p className="appointment-info__type">{apt.serviceType} • {apt.preferredTime}</p>
                      </div>
                      {apt.status === 'PENDING' && <div className="appointment-indicator"></div>}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bento-item bento-item--orders">
            <div className="bento-item__header">
              <h4 className="bento-item__title">Recent Orders</h4>
              <a href="/admin/orders" className="bento-item__btn text-center" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>Manage Orders</a>
            </div>
            <div className="orders-table-container">
              {recentOrdersList.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">No orders recorded yet</div>
              ) : (
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrdersList.map((order, index) => {
                      const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      });
                      return (
                        <tr key={order.id || index}>
                          <td className="orders-table__id">#{order.orderNumber || `AB-${order.id}`}</td>
                          <td>{order.user?.name || 'Customer'}</td>
                          <td>{getItemsCount(order)}</td>
                          <td>{orderDate}</td>
                          <td className="orders-table__amount">₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                          <td>
                            <span className={`status-badge ${getStatusClass(order.status)}`}>
                              <span className="status-dot"></span>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Overview;
