import "./Sidebar.css";
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  LogOut,
} from "lucide-react";

const AccountSidebar = ({ onAction, onLogout }) => {
  const menuItems = [
    {
      id: "profile",
      label: "Profile Info",
      icon: User,
    },
    {
      id: "orders",
      label: "Order History",
      icon: ShoppingBag,
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: MapPin,
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: Heart,
    },
  ];

  return (
    <aside className="account-sidebar">
      <h1>My Account</h1>
      <p className="welcome-text">WELCOME BACK</p>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className="menu-item"
              onClick={() => onAction(item.id)}
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

export default AccountSidebar;