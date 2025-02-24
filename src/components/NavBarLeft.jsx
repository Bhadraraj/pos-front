import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineMenuBook } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { TbReport } from "react-icons/tb";
import { RiDashboardFill, RiBillFill, RiMoneyRupeeCircleFill } from "react-icons/ri";
import "../styles/navLeft.css";

const NavBarLeft = () => {
    const [userData, setUserData] = useState(null);
    const [role, setRole] = useState(""); // Initialize role as an empty string

    useEffect(() => {
        // Get user data from localStorage
        const storedData = localStorage.getItem("userData");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setUserData(parsedData);
            setRole(parsedData.UserRole?.toLowerCase() || ""); // Ensure role is lowercase
        }
    }, []);

    useEffect(() => {
        if (userData) {
            console.log("User Role:", userData.UserRole);
        }
    }, [userData]);

    const menuItems = [
        { to: "/", icon: <RiDashboardFill />, label: "Dashboard", roles: ["superadmin", "admin", "cashier"] },
        { to: "/kitchen-view", icon: <TbReport />, label: "Kitchen View", roles: ["superadmin", "admin", "kitchen"] },
        { to: "/cashier", icon: <RiMoneyRupeeCircleFill />, label: "Cashier", roles: ["superadmin", "admin", "cashier"] },
        { to: "/add-menus", icon: <MdOutlineMenuBook />, label: "Add Menus", roles: ["superadmin", "admin", "waiter"] },
        { to: "/order-status", icon: <FaClipboardList />, label: "Order Status", roles: ["superadmin", "admin"] },
        { to: "/order-form", icon: <RiBillFill />, label: "Order Form", roles: ["superadmin", "admin", "waiter"] },
        { to: "/resturant-form", icon: <RiBillFill />, label: "Restaurant Form", roles: ["superadmin", "admin", "resturantwaiter"] },
        { to: "/restaurant-billing", icon: <RiBillFill />, label: "Restaurant Billing", roles: ["superadmin", "admin", "resturantcashier"] },
    ];

    return (
        <div className="navBarLeft">
            <ul className="m-0 p-0">
                {menuItems
                    .filter(menu => role && menu.roles.includes(role)) // Ensure role exists before filtering
                    .map((menu, index) => (
                        <li key={index}>
                            <NavLink to={menu.to} className={({ isActive }) => (isActive ? "active-link" : "")}>
                                <span className="icon">{menu.icon}</span>
                                <span className="label">{menu.label}</span>
                            </NavLink>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default NavBarLeft;
