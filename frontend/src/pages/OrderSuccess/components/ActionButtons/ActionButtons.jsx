import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import "./ActionButtons.css";

const ActionButtons = () => {

  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate("/shop");
  };

  const handleManageOrder = () => {
    navigate("/orders");
  };

  return (

    <section className="order-actions">

      <div className="action-buttons">

        <Button
          variant="primary"
          onClick={handleContinueShopping}
        >
          Continue Shopping
        </Button>

        <Button
          variant="outline"
          onClick={handleManageOrder}
        >
          Manage Order
        </Button>

      </div>

      <p className="support-text">
        Need help? Contact our Atelier at{" "}
        <a href="mailto:hello@ashaboutique.com">
          hello@ashaboutique.com
        </a>
      </p>

    </section>

  );

};

export default ActionButtons;