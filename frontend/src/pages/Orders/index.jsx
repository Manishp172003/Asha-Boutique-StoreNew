import "./Orders.css";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { ShoppingBag, Package } from "lucide-react";
import { animateOrdersPage, cleanupAnimations } from "../../animations/gsapAnimations";
import { Button } from "@/components/ui/button";
import { OrdersSkeleton } from "../../components/Skeleton";
import { EmptyState } from "../../components/EmptyState";

import AccountLayout from "../../components/layout/AccountLayout";

import OrdersHeader from "./components/OrdersHeader/OrdersHeader";
import OrdersList from "./components/OrdersList/OrdersList";

const Orders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { orders, user, authLoading, cart, mobileMenuOpen, setCartOpen, setBookingOpen, setMobileMenuOpen, handleLogout } = useApp();
  const navigate = useNavigate();

  const ordersRef = useRef(null);

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleBookingOpen = () => {
    setBookingOpen(true);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Initialize animations after data loads
  useEffect(() => {
    if (!isLoading && orders && orders.length > 0) {
      const contexts = animateOrdersPage({ ordersRef });
      return () => cleanupAnimations(contexts);
    }
  }, [isLoading, orders]);

  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const isEmpty = orders.length === 0;

  return (
    <AccountLayout activeTab="orders">
      <div className="orders-content">
        <OrdersHeader />

        {isEmpty ? (
          <EmptyState
            icon={Package}
            title="No Orders Yet"
            description="Once you place your first order, it will appear here."
            buttonText="Shop Now"
            buttonRoute="/shop"
          />
        ) : (
          <div ref={ordersRef}>
            <OrdersList orders={sortedOrders} />
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default Orders;
