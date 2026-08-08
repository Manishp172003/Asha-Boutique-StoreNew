import "./DashboardSidebar.css";
import { useNavigate } from "react-router-dom";
import {
  Home,
  User,
  ShoppingBag,
  MapPin,
  Heart,
  LogOut,
} from "lucide-react";

const DashboardSidebar = ({ activeTab, onLogout }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      route: "/dashboard",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      route: "/profile",
    },
    {
      id: "orders",
      label: "Order History",
      icon: ShoppingBag,
      route: "/orders",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: Heart,
      route: "/wishlist",
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: MapPin,
      route: "/profile/addresses",
    },
  ];

  return (
    <aside className="dashboard-sidebar">
      <h1>My Account</h1>
      <p className="welcome-text">WELCOME BACK</p>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.route)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default DashboardSidebar;
