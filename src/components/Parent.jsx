import React, { useState } from 'react';
import Demo from './Demo';
import Cart from './Cart';

const Parent = () => {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  return (
    <div>
      <Cart cartItems={cartItems} />
      <Demo onAddToCart={handleAddToCart} />
    </div>
  );
};

export default Parent;
