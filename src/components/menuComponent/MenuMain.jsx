// App.js
import React from 'react';
import { CartProvider } from './CartContext'; // Adjust the import path as necessary
import HotDishes from './HotDishes';
import ColdDishes from './ColdDishes';
import Cart from './Cart';

const MenuMain = () => {
    return (
        <CartProvider>
            <HotDishes />
            <ColdDishes />
            <Cart />
        </CartProvider>
    );
};

export default MenuMain;
