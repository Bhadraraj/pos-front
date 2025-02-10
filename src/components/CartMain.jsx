import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdOutlineCurrencyRupee, MdAdd } from "react-icons/md";
import { TiMinus } from "react-icons/ti"; // Import the minus icon
import { addToCart, removeFromCart } from '../components/redux/actions/actions';
import { Modal } from 'antd'; // Ensure you import Modal if using Ant Design
import '../styles/cart.css';

const CartMain = ({ isOpen, onClose }) => {
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
    <div>
      {cart.length > 0 ? (
        <>
          <div className="cartScrollContainer">
            {cart.map(item => (
              <div className="cartCardMainOuter mt-4" key={item.id}>
                <div className="row">
                  <div className="col-3">
                    <img src={item.image} alt="Cart Item Img" className="img-fluid" />
                  </div>
                  <div className="col-6 me-0 pe-0">
                    <p className="cardItemName mb-0">{item.name}</p>
                    <p className="cardItemPrice mb-0">
                      <MdOutlineCurrencyRupee /> {item.price}
                    </p>
                  </div>
                  <div className="col-3 d-flex justify-content-between align-items-center ps-0">
                    <div className="addRemoBtn">
                      <button className="cartaddBtn" onClick={() => handleAdd(item)}> <MdAdd /> </button>
                      <span className="cartItemAmount mx-1"> {item.quantity}</span>
                      <button className="cartRemoveBtn" onClick={() => handleRemove(item.id)}>
                        <TiMinus />
                      </button>
                    </div>
                    {/* Display the total amount for the current product */}
                    <p className="totalAmount">
                      <MdOutlineCurrencyRupee /> {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Your cart is empty</p>
      )}

      <div className="cartAmountSection">
        <div className="row">
          <div className="col-6">
            <span className="subTotalText">Sub Total</span>
          </div>
          <div className="col-6 text-end">
            <span className="cartSubTotalAmount">Rs.{cart.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <span className="subTotalText">GST 16%</span>
          </div>
          <div className="col-6 text-end">
            <span className="cartSubTotalAmount">Rs. {(cart.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.16).toFixed(2)}</span>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <label htmlFor="discount">Discount:</label>
            <input
              type="text"
              id="discount" className='discountIp ms-2'
              value={discount}
              onChange={handleDiscountChange}
              min="0"
            />

          </div>
          <div className="col-6 text-end">
            <span className="cartSubTotalAmount">Rs. {discount}</span>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <span className="subTotalText">Total</span>
          </div>
          <div className="col-6 text-end">
            <span className="cartSubTotalAmount">Rs. {calculateTotal().toFixed(2)}</span>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-12">
            <button className="placeOrderBtn">Place Order</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartMain;
