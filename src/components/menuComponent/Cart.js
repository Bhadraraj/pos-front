import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { addToCart, removeFromCart } from '../redux/actions/actions'; // Assuming you have these actions

const Cart = () => {
  const cart = useSelector((state) => state.cart.cart) || []; // Fallback to an empty array if undefined
  const dispatch = useDispatch();
  const [discount, setDiscount] = useState(0);

  const handleAdd = (item) => {
    dispatch(addToCart(item)); // Increment item quantity
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId)); // Decrement item quantity
  };

  const handleDiscountChange = (e) => {
    setDiscount(e.target.value);
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const gst = (subtotal * 0.16); // 16% GST
    const total = subtotal + gst - discount;
    return total > 0 ? total : 0;
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>

      {cart.length > 0 ? (
        <>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px' }} />
              <p>{item.name}</p>
              <p><MdOutlineCurrencyRupee />{item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <div>
                <button onClick={() => handleAdd(item)}>Add</button>
                <button onClick={() => handleRemove(item.id)}>Remove</button>
              </div>
            </div>
          ))}

          <div className="cart-summary">
            <label htmlFor="discount">Discount:</label>
            <input 
              type="number" 
              id="discount" 
              value={discount} 
              onChange={handleDiscountChange} 
              min="0" 
            />
            <p>Subtotal: <MdOutlineCurrencyRupee /> {cart.reduce((total, item) => total + (item.price * item.quantity), 0)}</p>
            <p>GST (16%): <MdOutlineCurrencyRupee /> {(cart.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.16).toFixed(2)}</p>
            <p>Discount: <MdOutlineCurrencyRupee /> {discount}</p>
            <h3>Total: <MdOutlineCurrencyRupee /> {calculateTotal().toFixed(2)}</h3>
          </div>
        </>
      ) : (
        
        <p>Your cart is empty</p>
      )}
    </div>
  );
};

export default Cart;
