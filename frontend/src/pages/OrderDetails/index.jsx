import "./OrderDetails.css";
import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../Orders/components/StatusBadge/StatusBadge";
import { animateOrderDetailsPage, cleanupAnimations } from "../../animations/gsapAnimations";
import { Button } from "@/components/ui/button";
import { OrderDetailsSkeleton } from "../../components/Skeleton";
import LazyImage from "../../components/common/LazyImage";

import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

const OrderDetails = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { orders, user, authLoading, cart, mobileMenuOpen, setCartOpen, setBookingOpen, setMobileMenuOpen, handleLogout } = useApp();

  const breadcrumbRef = useRef(null);
  const detailsRef = useRef(null);
  const timelineRef = useRef(null);

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

  const order = orders.find(o => o.id.toString() === id.toString());

  useEffect(() => {
    if (!order) {
      navigate('/orders');
    }
  }, [order, navigate]);

  // Simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Initialize animations after data loads
  useEffect(() => {
    if (!isLoading && order) {
      const contexts = animateOrderDetailsPage({
        breadcrumbRef,
        detailsRef,
        timelineRef
      });
      return () => cleanupAnimations(contexts);
    }
  }, [isLoading, order]);

  if (!order) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDeliveryDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  const handleBackToOrders = () => {
    navigate('/orders');
  };

  return (
    <div className="order-details-page">

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

      <div ref={breadcrumbRef} className="order-details-header order-breadcrumb">
        <button className="back-btn" onClick={handleBackToOrders}>
          ← Back to Orders
        </button>
        <h1>Order Details</h1>
      </div>

      <div ref={detailsRef} className="order-details-container">

        {/* Top Info Panel */}
        <div className="order-info-card">
          <div className="order-info-row">
            <span className="label">Order ID</span>
            <span className="value">#{order.orderNumber || order.id}</span>
          </div>

          <div className="order-info-row">
            <span className="label">Order Date</span>
            <span className="value">{formatDate(order.createdAt)}</span>
          </div>

          <div className="order-info-row">
            <span className="label">Status</span>
            <div className="value">
              <StatusBadge status={order.status} />
            </div>
          </div>

          <div className="order-info-row">
            <span className="label">Estimated Delivery</span>
            <span className="value">{formatDeliveryDate(order.estimatedDelivery)}</span>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="order-details-grid">

          {/* Left Column: Items */}
          <div className="order-details-left">
            <div className="order-products-card">
              <h3>Order Items</h3>
              <div className="products-list">
                {order.items.map((item) => (
                  <div key={item.id} className="product-row">
                    <div className="product-image">
                      {(item.product?.imageUrl || item.imageUrl || item.image) ? (
                        <LazyImage 
                          src={item.product?.imageUrl || item.imageUrl || item.image} 
                          alt={item.product?.name || item.name || item.productName} 
                          loading="lazy" 
                        />
                      ) : (
                        <div className="product-image-placeholder"></div>
                      )}
                    </div>
                    <div className="product-details">
                      <h4>{item.product?.name || item.name || item.productName}</h4>
                      <span className="product-quantity">Qty: {item.quantity} | Size: {item.size || 'S'}</span>
                    </div>
                    <div className="product-pricing">
                      <span className="unit-price">{formatPrice(item.priceAtOrder ?? item.price ?? 0)}</span>
                      <span className="line-total">{formatPrice((item.priceAtOrder ?? item.price ?? 0) * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Address, Payment, Summary */}
          <div className="order-details-right">
            {(() => {
              const addressLines = order.shippingAddress ? order.shippingAddress.split(', ') : [];
              const discount = order.discountAmount || 0;
              const subtotal = (order.totalPrice || 0) + discount;
              const total = order.totalPrice || 0;
              
              return (
                <>
                  <div className="shipping-card">
                    <h3>Shipping Address</h3>
                    {addressLines.length > 0 ? (
                      <div className="address-content">
                        {addressLines.map((line, idx) => (
                          <p key={idx} className={idx === 0 ? "name" : ""}>{line}</p>
                        ))}
                      </div>
                    ) : (
                      <div className="address-content">
                        <p className="name">{user?.name || 'Guest User'}</p>
                        <p className="no-info">No shipping details provided. Using default profile address.</p>
                      </div>
                    )}
                  </div>

                  <div className="payment-card">
                    <h3>Payment Method</h3>
                    <div className="payment-content">
                      <p>
                        {order.paymentId && order.paymentId.trim() !== "" && !order.paymentId.startsWith("COD") ? (
                          order.paymentId.startsWith("pay_") || order.paymentId.startsWith("MOCK") ? (
                            "Online Payment (Razorpay)"
                          ) : (
                            "Prepaid Online"
                          )
                        ) : (
                          "Cash on Delivery (COD)"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="order-summary-card">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="summary-row discount-row">
                        <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                        <span className="discount-value" style={{ color: '#E46A53', fontWeight: '500' }}>
                          - {formatPrice(discount)}
                        </span>
                      </div>
                    )}
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="summary-row total">
                      <strong>Total</strong>
                      <strong>{formatPrice(total)}</strong>
                    </div>
                    <div className="order-actions">
                      <Button variant="primary" onClick={handleContinueShopping} className="action-btn-primary">
                        Continue Shopping
                      </Button>
                      <Button variant="outline" onClick={handleBackToOrders} className="action-btn-outline">
                        Back to Orders
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

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

export default OrderDetails;
