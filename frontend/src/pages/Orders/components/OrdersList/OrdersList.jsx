import "./OrdersList.css";
import OrderCard from "../OrderCard/OrderCard";

const OrdersList = ({ orders }) => {
  return (
    <div className="orders-list">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrdersList;
