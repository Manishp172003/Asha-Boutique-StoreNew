import { Minus, Plus, X } from "lucide-react";
import { toast } from 'sonner';
import { useApp } from "../../../../context/AppContext";
import LazyImage from "../../../../components/common/LazyImage";
import "./CartItem.css";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useApp();

  const handleQuantityChange = (delta) => {
    updateQuantity(item.id, delta);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
    toast.success('Product removed from cart');
  };

  const subtotal = item.price * item.quantity;

  return (

    <div className="cart-item">

      <div className="cart-product">

        <LazyImage
          src={item.imageUrl && item.imageUrl.includes(',') ? item.imageUrl.split(',')[0] : (item.imageUrl || '/images/product1.jpg')}
          alt={item.name}
          loading="lazy"
        />

        <div className="cart-details">

          <h3>{item.name}</h3>

          <p>Color: Terracotta</p>
          <p>Size: {item.size || 'S'}</p>

          <button className="remove-btn" onClick={handleRemove}>

            <X size={15} />

            Remove

          </button>

        </div>

      </div>

      <div className="cart-price">

        ₹{item.price.toLocaleString('en-IN')}

      </div>

      <div className="cart-quantity">

        <button onClick={() => handleQuantityChange(-1)}>

          <Minus size={15}/>

        </button>

        <span>{item.quantity}</span>

        <button onClick={() => handleQuantityChange(1)}>

          <Plus size={15}/>

        </button>

      </div>

      <div className="cart-subtotal">

        ₹{subtotal.toLocaleString('en-IN')}

      </div>

    </div>

  );

};

export default CartItem;