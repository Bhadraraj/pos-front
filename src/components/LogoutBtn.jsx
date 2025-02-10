import React from 'react';
import { useAuth } from './Auth/AuthContext'
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';

import { IoMdLogOut } from "react-icons/io";

const LogoutBtn = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout(); 
            notification.success({
                message: 'Logout Successful',
                description: 'You have been logged out.',
                placement: 'top',
                duration: 0.5,
                style: {
                    transition: 'transform 0.5s ease-in-out',
                    transform: 'translateY(0)',
                },
                onClose: () => {
                    navigate('/login');
                },
            });
        } catch (error) {
            notification.error({
                message: 'Logout Failed',
                description: 'There was an issue logging you out. Please try again.',
                placement: 'top',
                duration: 0.5, 
                style: {
                    transition: 'transform 0.5s ease-in-out',
                    transform: 'translateY(0)',
                },
            });
        }
    };

    return (
        <button onClick={handleLogout} className="btn btn-">
            <IoMdLogOut /> 
        </button>
    );
};

export default LogoutBtn;
