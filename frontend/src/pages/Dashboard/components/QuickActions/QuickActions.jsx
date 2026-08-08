import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User, Package, MapPin } from "lucide-react";
import "./QuickActions.css";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Shop Now",
      icon: ShoppingBag,
      route: "/shop",
    },
    {
      title: "Edit Profile",
      icon: User,
      route: "/profile",
    },
    {
      title: "Manage Orders",
      icon: Package,
      route: "/orders",
    },
    {
      title: "Manage Addresses",
      icon: MapPin,
      route: "/profile/addresses",
    },
  ];

  return (
    <div className="quick-actions-card">
      <h3>Quick Actions</h3>
      <div className="quick-actions-grid">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="outline"
              onClick={() => navigate(action.route)}
              className="quick-action-btn"
            >
              <Icon size={18} />
              {action.title}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
