import "./CartTable.css";

import CartItem from "../CartItem/CartItem";
import CartActions from "../CartActions/CartActions";

const CartTable = ({ cartItems }) => {
  return (

    <section className="cart-table">

      <h1>Your Cart</h1>

      <div className="cart-header">

        <span>Product</span>
        <span>Price</span>
        <span>Quantity</span>
        <span>Subtotal</span>

      </div>

      <div className="cart-divider"></div>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))
      )}

      {cartItems.length > 0 && <CartActions />}

    </section>

  );
};

export default CartTable;