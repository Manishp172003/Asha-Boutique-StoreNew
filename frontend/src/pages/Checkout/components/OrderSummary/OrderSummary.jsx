import { useState, useEffect } from "react";
import { useApp } from "../../../../context/AppContext";
import { useNavigate } from "react-router-dom";
import LazyImage from "../../../../components/common/LazyImage";
import { getActiveCoupons } from "../../../../services/couponService";
import "./OrderSummary.css";

const OrderSummary = () => {
  const { cart, appliedCoupon, couponDiscount, applyCouponCode, removeCoupon } = useApp();
  const navigate = useNavigate();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [applying, setApplying] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await getActiveCoupons();
        setAvailableCoupons(data || []);
      } catch (err) {
        console.error("Failed to load active coupons", err);
      }
    };
    fetchCoupons();
  }, []);

  const cartTotal = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setApplying(true);
    try {
      await applyCouponCode(couponCodeInput);
      setCouponCodeInput('');
    } catch (err) {
      // Toast error is handled inside context
    } finally {
      setApplying(false);
    }
  };

  return (
    <aside className="checkout-order-summary">
      <h2>Order Summary</h2>

      <div className="order-items">
        {cart.map((item) => {
          const subtotal = item.price * item.quantity;
          return (
            <div key={item.itemId || item.id} className="order-item">
              <div className="item-info">
                <LazyImage src={item.imageUrl} alt={item.name} loading="lazy" />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Qty: {item.quantity} | Size: {item.size || 'S'}</p>
                </div>
              </div>
              <div className="item-price">
                ₹{subtotal.toLocaleString('en-IN')}
              </div>
            </div>
          );
        })}
      </div>

      <div className="summary-divider"></div>

      <div className="summary-row">
        <span>Subtotal</span>
        <span>₹{cartTotal.toLocaleString('en-IN')}</span>
      </div>

      <div className="summary-row">
        <span>Shipping</span>
        <span className="shipping-text">Calculated at checkout</span>
      </div>

      <div className="summary-row">
        <span>Estimated Tax</span>
        <span>₹0</span>
      </div>

      {couponDiscount > 0 && (
        <div className="summary-row text-[#E46A53] font-medium">
          <span>Discount ({appliedCoupon?.code})</span>
          <span>- ₹{couponDiscount.toLocaleString('en-IN')}</span>
        </div>
      )}

      <div className="summary-divider"></div>

      {/* Promo Coupon Form */}
      <div className="coupon-section pb-4">
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-[#E46A53]/5 px-4 py-2.5 rounded-xl border border-[#E46A53]/15">
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-[#E46A53] tracking-wide uppercase">
                {appliedCoupon.code} Applied
              </span>
              <span className="text-[10px] text-[#7A655D]">
                {appliedCoupon.discountType === 'PERCENTAGE' ? `${appliedCoupon.discountValue}% Off` : `₹${appliedCoupon.discountValue} Off`}
              </span>
            </div>
            <button 
              type="button" 
              onClick={removeCoupon}
              className="text-[#E46A53] hover:text-[#d55a43] text-xs font-semibold"
            >
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2 w-full">
            <input
              type="text"
              placeholder="PROMO CODE"
              value={couponCodeInput}
              onChange={(e) => setCouponCodeInput(e.target.value)}
              disabled={applying}
              className="bg-white border border-[#E9E3DD] rounded-xl px-4 py-2 text-xs w-full focus:outline-none focus:border-[#E46A53] uppercase font-mono tracking-wider"
            />
            <button
              type="submit"
              disabled={applying || !couponCodeInput.trim()}
              className="bg-[#2B1E1A] hover:bg-[#E46A53] disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              Apply
            </button>
          </form>
        )}
        {!appliedCoupon && availableCoupons.length > 0 && (
          <div className="coupon-suggestions mt-4">
            <span className="text-[11px] font-semibold text-[#7A655D] block mb-2 text-left">Available Offers:</span>
            <div className="flex flex-wrap gap-2">
              {availableCoupons.map((coupon) => {
                const isDisabled = cartTotal < coupon.minAmount;
                return (
                  <button
                    key={coupon.id}
                    type="button"
                    disabled={isDisabled || applying}
                    onClick={() => {
                      setCouponCodeInput(coupon.code);
                      applyCouponCode(coupon.code);
                    }}
                    className={`text-left px-3 py-2 rounded-xl border text-[11px] transition-all flex flex-col gap-0.5 ${
                      isDisabled 
                        ? 'border-gray-200 bg-gray-50/50 text-gray-400 cursor-not-allowed'
                        : 'border-[#E46A53]/35 bg-[#E46A53]/5 text-[#E46A53] hover:bg-[#E46A53]/10 hover:border-[#E46A53]/55'
                    }`}
                    title={isDisabled ? `Requires minimum purchase of ₹${coupon.minAmount}` : 'Click to apply offer'}
                  >
                    <span className="font-bold tracking-wider font-mono uppercase">{coupon.code}</span>
                    <span className="text-[9px] opacity-90 font-medium">
                      {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% Off` : `₹${coupon.discountValue} Off`}
                      {coupon.minAmount > 0 && ` on ₹${coupon.minAmount}+`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="summary-divider"></div>

      <div className="summary-total">
        <h3>Total</h3>
        <h3>₹{(cartTotal - couponDiscount).toLocaleString('en-IN')}</h3>
      </div>

      <button onClick={handleContinueShopping} className="continue-shopping-btn">
        Continue Shopping
      </button>

      <div className="summary-features">
        <div className="feature">
          <span>Secure Checkout</span>
        </div>
        <div className="feature">
          <span>Fast Delivery</span>
        </div>
        <div className="feature">
          <span>Easy Returns</span>
        </div>
      </div>
    </aside>
  );
};

export default OrderSummary;
