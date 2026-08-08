import "./SuccessHero.css";
import { Check } from "lucide-react";

const SuccessHero = ({ orderNumber, orderId }) => {
  return (
    <section className="success-hero">

      <div className="success-icon">
        <Check size={34} color="#E46A53" strokeWidth={2.5} />
      </div>

      <h1>Thank you for your order.</h1>

      <p className="order-message">
        Your order <strong>#{orderNumber || orderId || 'AS12345'}</strong> has been placed successfully.
        A confirmation email has been sent to your inbox.
      </p>

    </section>
  );
};

export default SuccessHero;
