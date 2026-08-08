import "./StatisticsCards.css";
import { Package, Heart, MapPin, ShoppingBag } from "lucide-react";

const StatisticsCards = ({ ordersCount, wishlistCount, addressesCount, cartCount }) => {
  const stats = [
    {
      title: "Orders",
      value: ordersCount,
      icon: Package,
      color: "#E46A53",
    },
    {
      title: "Wishlist",
      value: wishlistCount,
      icon: Heart,
      color: "#D57B5A",
    },
    {
      title: "Addresses",
      value: addressesCount,
      icon: MapPin,
      color: "#E46A53",
    },
    {
      title: "Cart Items",
      value: cartCount,
      icon: ShoppingBag,
      color: "#B86048",
    },
  ];

  return (
    <div className="statistics-grid">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15` }}>
              <Icon size={24} style={{ color: stat.color }} />
            </div>
            <div className="stat-content">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-title">{stat.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;

