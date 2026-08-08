import { Link } from "react-router-dom";
import "./OrdersHeader.css";

const OrdersHeader = () => {
  return (
    <section className="orders-header">

      <div className="orders-title-row">

        <h1>My Orders</h1>

        <p>
          Track your orders and view order history.
        </p>

      </div>

      <div className="orders-divider"></div>

    </section>
  );
};

export default OrdersHeader;
