import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Calendar, Users, BarChart3, Settings, Plus, HelpCircle, LogOut, MessageSquare, Ticket } from 'lucide-react';
import './AdminSidebar.css';

const iconMap = {
  dashboard: LayoutDashboard,
  inventory_2: Package,
  shopping_bag: ShoppingBag,
  calendar_month: Calendar,
  group: Users,
  monitoring: BarChart3,
  settings: Settings,
  add: Plus,
  help: HelpCircle,
  logout: LogOut,
  reviews: MessageSquare,
  coupons: Ticket,
};

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNewProductClick = () => {
    navigate('/admin/products?new=true');
  };

  const navItems = [
    { path: '/admin', icon: 'dashboard', label: 'Overview' },
    { path: '/admin/products', icon: 'inventory_2', label: 'Products' },
    { path: '/admin/orders', icon: 'shopping_bag', label: 'Orders' },
    { path: '/admin/appointments', icon: 'calendar_month', label: 'Appointments' },
    { path: '/admin/customers', icon: 'group', label: 'Customers' },
    { path: '/admin/reviews', icon: 'reviews', label: 'Reviews' },
    { path: '/admin/coupons', icon: 'coupons', label: 'Coupons' },
    { path: '/admin/analytics', icon: 'monitoring', label: 'Analytics' },
    { path: '/admin/settings', icon: 'settings', label: 'Settings' },
  ];

  const isActive = (path) => location.pathname === path;

  const IconComponent = ({ iconName, className }) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon className={className} size={20} /> : null;
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img 
            src="/images/logo.png"
            alt="Asha Boutique Logo"
            className="admin-avatar"
          />
        </div>
        <div className="brand-info">
          <h1>Asha Boutique</h1>
          <p>Management Suite</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <IconComponent iconName={item.icon} className="nav-icon" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="new-product-btn" onClick={handleNewProductClick}>
          <IconComponent iconName="add" className="nav-icon filled" />
          <span>New Product</span>
        </button>
        <Link to="/admin/help" className="footer-link">
          <IconComponent iconName="help" className="nav-icon" />
          <span>Help Center</span>
        </Link>
        <Link to="/login" className="footer-link logout">
          <IconComponent iconName="logout" className="nav-icon" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
