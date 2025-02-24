import React, { useState } from "react";
import { MdNotificationsActive } from "react-icons/md";
import { GiHotMeal } from "react-icons/gi";
import Cart from './Cart'; // Import the Cart component
import { MdShoppingCart } from "react-icons/md";
import Profile from './Profile'
import LogoutBtn from './LogoutBtn';
import { NavLink } from 'react-router-dom';
import Logo from '../images/mg.png'
const NavBarTop = () => {
    const [showCart, setShowCart] = useState(false);

    // Function to toggle cart visibility
    const toggleCart = () => {
        setShowCart(!showCart);
    };

    return (
        <>
            <div className="navBarTopCartMain">
                <header className="headerSection">
                    <div className="navBar d-flex align-items-center justify-content-between">

                        <div className="logo d-flex align-items-center">
                            {/* <h6 className="me-4">MG Foods</h6>/ */}
                            <img src={Logo} alt="" height="40px" />  <b className="ms-2 primary" >MG FOOD COURT</b>
                        </div>

                        <div className="notificationIconTop me-3">
                            {/* <span className="ms-2"> <MdNotificationsActive /></span> */}
                            {/* <span onClick={toggleCart} className="navBartoggleBtn ms-2">
                                <MdShoppingCart />
                            </span> */}
                            <span className="navBartoggleBtn ms-2">
                                <Profile />
                            </span>
                            <NavLink
                                to='/logout'
                                className={({ isActive }) => isActive ? 'active-link' : ''}>
                                <LogoutBtn />
                            </NavLink>

                        </div>
                    </div >
                </header >

                {/* Cart Modal */}
                < Cart isOpen={showCart} onClose={toggleCart} />
            </div >
        </>
    );
};

export default NavBarTop;
