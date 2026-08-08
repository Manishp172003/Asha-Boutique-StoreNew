import { useState, useEffect } from 'react';
import { IndianRupee, ShoppingCart, Users, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import './Analytics.css';
import AdminSidebar from '../../../components/admin/Sidebar/AdminSidebar';
import AdminTopNav from '../../../components/admin/TopNav/AdminTopNav';
import AdminButton from '../../../components/admin/Button/AdminButton';
import { getAllOrdersAdmin } from '../../../services/orderService';
import { getAllUsersAdmin } from '../../../services/userService';
import { toast } from 'sonner';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('monthly');
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const orderList = await getAllOrdersAdmin();
      const customerList = await getAllUsersAdmin();
      setOrders(orderList);
      setCustomers(customerList);
    } catch (err) {
      toast.error("Failed to load store statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Aggregated Sales Calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  // Dynamic Category Sales Breakdown matching Shop page categories
  const getCategoryBreakdown = () => {
    // Standard Shop page categories
    const categoriesMap = {
      'Dresses': { count: 0, revenue: 0, color: '#E46A53' },
      'Tops': { count: 0, revenue: 0, color: '#2D211C' },
      'Tailoring': { count: 0, revenue: 0, color: '#6b5b55' },
      'Accessories': { count: 0, revenue: 0, color: '#d7c2be' },
      'Sale': { count: 0, revenue: 0, color: '#a2918a' }
    };

    let totalMatchedRevenue = 0;

    // Loop through database records
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          const category = item.product?.category;
          if (category && categoriesMap[category]) {
            const itemRevenue = (item.price || 0) * (item.quantity || 0);
            categoriesMap[category].revenue += itemRevenue;
            categoriesMap[category].count += item.quantity || 0;
            totalMatchedRevenue += itemRevenue;
          }
        });
      }
    });

    // Format list with percentages
    const list = Object.keys(categoriesMap).map(key => {
      const item = categoriesMap[key];
      const percent = totalMatchedRevenue > 0 ? Math.round((item.revenue / totalMatchedRevenue) * 100) : 0;
      return {
        name: key,
        value: percent,
        revenue: item.revenue,
        color: item.color
      };
    });

    // Fallback if no matching sales exist in DB yet (for dynamic mock demo)
    const hasSales = list.some(item => item.value > 0);
    if (!hasSales) {
      return [
        { name: 'Dresses', value: 45, color: '#E46A53' },
        { name: 'Tops', value: 30, color: '#2D211C' },
        { name: 'Tailoring', value: 15, color: '#6b5b55' },
        { name: 'Accessories', value: 8, color: '#d7c2be' },
        { name: 'Sale', value: 2, color: '#a2918a' }
      ];
    }

    return list;
  };

  const categoryData = getCategoryBreakdown();

  const kpiData = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      change: '+12.5%',
      icon: <IndianRupee size={24} />,
      trend: 'up',
      progress: 72
    },
    {
      title: 'Orders',
      value: orders.length.toLocaleString(),
      change: '+8.1%',
      icon: <ShoppingCart size={24} />,
      trend: 'up',
      progress: 58
    },
    {
      title: 'Active Users',
      value: customers.length.toLocaleString(),
      change: '-2.4%',
      icon: <Users size={24} />,
      trend: 'down',
      progress: 45
    },
    {
      title: 'Conv. Rate',
      value: '3.85%',
      change: '+4.2%',
      icon: <TrendingUp size={24} />,
      trend: 'up',
      progress: 63
    }
  ];

  const revenueData = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 62 },
    { month: 'Mar', value: 55 },
    { month: 'Apr', value: 80 },
    { month: 'May', value: 95, highlight: true },
    { month: 'Jun', value: 75 },
    { month: 'Jul', value: 85 },
    { month: 'Aug', value: 60 },
  ];

  const getConicGradient = () => {
    let currentTotal = 0;
    const slices = categoryData.map(slice => {
      const start = currentTotal;
      currentTotal += slice.value;
      return `${slice.color} ${start}% ${currentTotal}%`;
    });
    return `conic-gradient(${slices.join(', ')})`;
  };

  return (
    <div className="admin-page">
      <AdminSidebar />
      <AdminTopNav />
      
      <main className="admin-main">
        {/* Header */}
        <div className="admin-page-header" style={{ marginBottom: "20px" }}>
          <div className="admin-page-header__content">
            <nav className="admin-breadcrumb">
              <span>Dashboard</span>
              <span>/</span>
              <span className="admin-breadcrumb__active">Analytics</span>
            </nav>
            <h2 className="admin-page-header__title">Business Analytics</h2>
            <p className="admin-page-header__description">
              Audit operational metrics, trace revenue gains, and review category sales trends.
            </p>
          </div>
          <div className="admin-page-header__actions">
            <AdminButton variant="outline" icon={<RefreshCw size={18} />} onClick={fetchAnalyticsData}>
              Sync Data
            </AdminButton>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="analytics-kpi-grid">
          {kpiData.map((kpi, index) => (
            <div key={index} className="analytics-kpi-card">
              <div className="analytics-kpi-card__header">
                <div className="analytics-kpi-card__icon">
                  {kpi.icon}
                </div>
                <span className={`analytics-kpi-card__change ${kpi.trend === 'up' ? 'analytics-kpi-card__change--up' : 'analytics-kpi-card__change--down'}`}>
                  {kpi.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {kpi.change}
                </span>
              </div>
              <p className="analytics-kpi-card__label">{kpi.title}</p>
              <p className="analytics-kpi-card__value">{kpi.value}</p>
              <div className="analytics-kpi-card__progress">
                <div 
                  className="analytics-kpi-card__progress-bar" 
                  style={{ width: `${kpi.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="analytics-charts-grid">
          {/* Revenue Chart */}
          <div className="analytics-chart-card analytics-chart-card--wide">
            <div className="analytics-chart-card__header">
              <div>
                <h3 className="analytics-chart-card__title">Revenue Trend</h3>
                <p className="analytics-chart-card__subtitle">Monthly performance of boutique sales across all channels.</p>
              </div>
              <div className="analytics-time-toggle">
                <button 
                  className={`analytics-time-toggle__btn ${timeframe === 'monthly' ? 'analytics-time-toggle__btn--active' : ''}`}
                  onClick={() => setTimeframe('monthly')}
                >
                  Monthly
                </button>
                <button 
                  className={`analytics-time-toggle__btn ${timeframe === 'weekly' ? 'analytics-time-toggle__btn--active' : ''}`}
                  onClick={() => setTimeframe('weekly')}
                >
                  Weekly
                </button>
              </div>
            </div>
            <div className="analytics-bar-chart">
              {revenueData.map((data, index) => (
                <div key={index} className="analytics-bar-chart__column">
                  <div 
                    className={`analytics-bar-chart__bar ${data.highlight ? 'analytics-bar-chart__bar--highlight' : ''}`}
                    style={{ height: `${data.value}%` }}
                  ></div>
                  <span className={`analytics-bar-chart__label ${data.highlight ? 'analytics-bar-chart__label--active' : ''}`}>
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Pie Chart */}
          <div className="analytics-chart-card">
            <h3 className="analytics-chart-card__title">Categories Breakdown</h3>
            <p className="analytics-chart-card__subtitle">Sales distribution by product category.</p>
            <div className="analytics-pie-chart">
              <div 
                className="analytics-pie-chart__circle"
                style={{ background: getConicGradient() }}
              >
                <div className="analytics-pie-chart__inner">
                  <div className="analytics-pie-chart__center">
                    <p className="analytics-pie-chart__value">{categoryData[0].value}%</p>
                    <p className="analytics-pie-chart__label">{categoryData[0].name}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="analytics-legend">
              {categoryData.map((category, index) => (
                <div key={index} className="analytics-legend__item">
                  <div className="analytics-legend__color" style={{ backgroundColor: category.color }}></div>
                  <span className="analytics-legend__label">{category.name} ({category.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
