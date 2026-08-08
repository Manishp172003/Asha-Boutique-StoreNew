import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import "./CartActions.css";

const CartActions = () => {

  return (

    <div className="cart-actions">

      <Link to="/shop" className="continue-shopping">

        <ArrowLeft size={18} />

        Continue Shopping

      </Link>

    </div>

  );

};

export default CartActions;