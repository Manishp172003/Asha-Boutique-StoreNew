import "./Checkout.css";
import { useRef, useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { animateCheckoutPage, cleanupAnimations } from "../../animations/gsapAnimations";

import Navigation from "../../components/layout/Navigation";
import Footer from "../../components/layout/Footer";

import CheckoutForm from "./components/CheckoutForm/CheckoutForm";
import OrderSummary from "./components/OrderSummary/OrderSummary";
import MockPaymentModal from "./components/MockPaymentModal/MockPaymentModal";

import { initializePayment, verifyPayment } from "../../services/paymentService";
import { getOrderById } from "../../services/orderService";

const Checkout = () => {
  const { cart, initializeOrder, finalizeOrder, user, mobileMenuOpen, setCartOpen, setBookingOpen, setMobileMenuOpen, handleLogout } = useApp();
  const navigate = useNavigate();

  const [mockModalOpen, setMockModalOpen] = useState(false);
  const [mockData, setMockData] = useState({ amount: 0, orderNumber: "", orderId: null });
  const [processingOrderId, setProcessingOrderId] = useState(null);

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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    const targetOrderId = paymentDetails.orderId || processingOrderId;
    const toastId = toast.loading("Verifying transaction credentials...");
    try {
      setMockModalOpen(false);
      const verifyRes = await verifyPayment({
        orderId: targetOrderId,
        razorpayPaymentId: paymentDetails.razorpayPaymentId,
        razorpayOrderId: paymentDetails.razorpayOrderId,
        razorpaySignature: paymentDetails.razorpaySignature,
        isMock: paymentDetails.isMock
      });

      toast.dismiss(toastId);
      if (verifyRes.success) {
        toast.success("Payment verified successfully!");
        
        // Fetch fresh order details and finalize client context states
        const updatedOrder = await getOrderById(targetOrderId);
        finalizeOrder(updatedOrder);
        navigate('/order-success');
      } else {
        toast.error(verifyRes.message || "Payment verification failed");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message || "Payment verification failed");
    }
  };

  const handlePlaceOrder = async (shippingInfo, paymentMethod) => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      navigate('/shop');
      return;
    }

    const toastId = toast.loading("Initializing checkout order...");
    try {
      // 1. Create order database record (Status PENDING, Payment PENDING)
      const order = await initializeOrder(shippingInfo);
      setProcessingOrderId(order.id);

      if (paymentMethod === "cod") {
        toast.dismiss(toastId);
        // Direct Cash on Delivery (COD) route - bypass active online checkout dialogs
        handlePaymentSuccess({
          orderId: order.id,
          razorpayPaymentId: "COD-PAY-" + Date.now(),
          razorpayOrderId: "order_COD_" + Math.random().toString(36).substring(2, 11).toUpperCase(),
          razorpaySignature: "cod_signature_bypass",
          isMock: true
        });
      } else {
        // 2. Initialize payments session
        const paymentInit = await initializePayment(order.id);
        toast.dismiss(toastId);

        if (paymentMethod === "upi" || paymentInit.isMock) {
          // Force mock modal fallback to showcase our dynamic UPI QR code
          setMockData({
            amount: paymentInit.amount,
            orderNumber: paymentInit.orderNumber || order.id.toString(),
            orderId: order.id,
            defaultTab: paymentMethod === "upi" ? "upi" : "card",
            upiId: paymentInit.upiId
          });
          setMockModalOpen(true);
        } else {
          // Native Razorpay Checkout Popup
          const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error("Failed to load Razorpay Payment Gateway. Check your internet connection.");
          return;
        }

        const options = {
          key: paymentInit.razorpayKeyId,
          amount: Math.round(paymentInit.amount * 100), // convert to paisa
          currency: paymentInit.currency,
          name: "Asha Boutique",
          description: `Checkout Order #${paymentInit.orderNumber}`,
          order_id: paymentInit.razorpayOrderId,
          handler: function (response) {
            handlePaymentSuccess({
              orderId: order.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              isMock: false
            });
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: user?.phone || ""
          },
          theme: {
            color: "#E46A53"
          },
          modal: {
            ondismiss: function () {
              toast.info("Payment session dismissed.");
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message || "Checkout transaction initialization failed");
    }
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

      <MockPaymentModal
        isOpen={mockModalOpen}
        onClose={() => setMockModalOpen(false)}
        amount={mockData.amount}
        orderNumber={mockData.orderNumber}
        onPaymentSuccess={handlePaymentSuccess}
        defaultTab={mockData.defaultTab}
        upiId={mockData.upiId}
      />

    </div>
  );
};

export default Checkout;
