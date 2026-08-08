import "./Checkout.css";
import { useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { animateCheckoutPage, cleanupAnimations } from "../../animations/gsapAnimations";

import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

import CheckoutForm from "./components/CheckoutForm/CheckoutForm";
import OrderSummary from "./components/OrderSummary/OrderSummary";

const Checkout = () => {
  const { cart, placeOrder, user, mobileMenuOpen, setCartOpen, setBookingOpen, setMobileMenuOpen, handleLogout } = useApp();
  const navigate = useNavigate();

  const formRef = useRef(null);
  const summaryRef = useRef(null);

  // Initialize animations
  useEffect(() => {
    const contexts = animateCheckoutPage({
      formRef,
      summaryRef
    });
    return () => cleanupAnimations(contexts);
  }, []);

  const handlePlaceOrder = (shippingInfo, paymentMethod) => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      navigate('/shop');
      return;
    }

    placeOrder(shippingInfo, paymentMethod);
    navigate('/order-success');
  };

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleBookingOpen = () => {
    setBookingOpen(true);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="checkout-page">

      <Navigation
        user={user}
        cart={cart}
        onCartOpen={handleCartOpen}
        onLogout={handleLogout}
        onBookingOpen={handleBookingOpen}
        onScrollToSection={() => {}}
        trendingRef={null}
        styleEditRef={null}
        atelierRef={null}
        heroRef={null}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
      />

      <div className="checkout-header-section">
        <h1>Checkout</h1>
        <div className="checkout-breadcrumb">
          <span>Home</span>
          <span className="separator">/</span>
          <span>Cart</span>
          <span className="separator">/</span>
          <span className="active">Checkout</span>
        </div>
      </div>

      <div className="checkout-container">
        <div ref={formRef} className="checkout-form">
          <CheckoutForm onPlaceOrder={handlePlaceOrder} />
        </div>
        <div ref={summaryRef} className="checkout-summary">
          <OrderSummary />
        </div>
      </div>

      <Footer
        onScrollToSection={() => {}}
        trendingRef={null}
        styleEditRef={null}
        atelierRef={null}
        heroRef={null}
        onBookingOpen={handleBookingOpen}
      />

    </div>
  );
};

export default Checkout;
