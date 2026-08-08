import "./OrderDetails.css";
import { Package } from "lucide-react";
import LazyImage from "../../../../components/common/LazyImage";

const OrderDetails = ({ order }) => {
  const hasOrderData = order && order.items && order.items.length > 0;

  const formatDeliveryDate = (dateString) => {
    if (!dateString) return 'July 28 - July 30, 2026';
    const date = new Date(dateString);
    const deliveryDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    return deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <section className="order-details">

      <div className="details-card">

        {/* LEFT */}

        <div className="details-left">

          <div className="info-block">

            <h5>Shipping Address</h5>

            {hasOrderData && (order.shippingAddress || order.shippingInfo) ? (
              <>
                {typeof order.shippingAddress === 'string' ? (
                  <div>
                    {order.shippingAddress.split(',').map((part, index) => (
                      <p key={index}>{part.trim()}</p>
                    ))}
                  </div>
                ) : order.shippingAddress ? (
                  <>
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}</p>
                    <p>{order.shippingAddress.country}</p>
                  </>
                ) : (
                  <>
                    <p>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                    <p>{order.shippingInfo.address}</p>
                    <p>{order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.zipCode}</p>
                    <p>{order.shippingInfo.country}</p>
                  </>
                )}
              </>
            ) : (
              <>
                <p>Manish Pawar</p>
                <p>Nagpur</p>
                <p>Maharashtra - 440001</p>
                <p>India</p>
              </>
            )}

          </div>

          <div className="info-block">

            <h5>Estimated Delivery</h5>

            <p>{hasOrderData ? formatDeliveryDate(order.estimatedDelivery) : 'July 28 - July 30, 2026'}</p>

          </div>

        </div>

        {/* RIGHT */}

        <div className="details-right">

          <h5>Order Summary</h5>

          {hasOrderData ? (
            <>
                {order.items.map((item) => {
                  const productImg = item.product?.imageUrl || item.product?.image || item.imageUrl || item.image;
                  const productName = item.product?.name || item.name || item.productName;
                  const productPrice = item.price ?? item.product?.price ?? 0;
                  return (
                    <div key={item.id} className="summary-item">
                      {productImg ? (
                        <LazyImage src={productImg} alt={productName} loading="lazy" />
                      ) : (
                        <div className="placeholder-image">
                          <Package size={32} color="#9B8B84" strokeWidth={1.5} />
                        </div>
                      )}
                      <div>
                        <h4>{productName}</h4>
                        <span>Qty: {item.quantity} | Size: {item.size || 'S'}</span>
                      </div>
                      <strong>{formatPrice(productPrice * item.quantity)}</strong>
                    </div>
                  );
                })}
            </>
          ) : (
            <>
              <div className="summary-item">
                <div className="placeholder-image">
                  <Package size={32} color="#9B8B84" strokeWidth={1.5} />
                </div>
                <div>
                  <h4>Atelier Maxi Dress</h4>
                  <span>Size S</span>
                </div>
                <strong>₹2,499</strong>
              </div>

              <div className="summary-item">
                <div className="placeholder-image">
                  <Package size={32} color="#9B8B84" strokeWidth={1.5} />
                </div>
                <div>
                  <h4>Leather Tote</h4>
                  <span>Brown</span>
                </div>
                <strong>₹1,999</strong>
              </div>
            </>
          )}

          <div className="success-summary-total">

            <div>
              <span>Subtotal</span>
              <span>{hasOrderData ? formatPrice(order.totalPrice + (order.discountAmount || 0)) : '₹4,498'}</span>
            </div>

            {hasOrderData && order.discountAmount > 0 && (
              <div>
                <span>Discount</span>
                <span style={{ color: "#E46A53", fontWeight: 500 }}>- {formatPrice(order.discountAmount)}</span>
              </div>
            )}

            <div>
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="grand-total">
              <strong>Total</strong>
              <strong>{hasOrderData ? formatPrice(order.totalPrice) : '₹4,498'}</strong>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default OrderDetails;