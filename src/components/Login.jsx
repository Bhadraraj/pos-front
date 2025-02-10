import React, { useState } from 'react';
import { FaLock } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { useAuth } from './Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import axios from 'axios';
import img1 from '../images/loginLeft.png';
import '../styles/login.css';
import { BASE_URL } from './utils/config'
const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();  // Use the login function from AuthContext
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/api/login`, formData);
            console.log('API Response:', response);

            // Check response status (case-insensitive)
            if (response.data.status.toLowerCase() === 'success') {
                const userData = response.data.result.user;

                // Store user data in localStorage
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('auth', 'true'); // Mark user as authenticated

                // Call the login function from AuthContext
                login(userData);
                console.log('Login successful, redirecting...');

                notification.success({
                    message: 'Login Successful!',
                    description: `Welcome back, ${userData.UserFname}!`,
                    placement: 'top',
                    duration: 2,
                });
 
                navigate('/');
            } else {
                console.log('Login failed:', response.data.message);
                notification.error({
                    message: 'Login Failed!',
                    description: response.data.message || 'Invalid email or password.',
                    placement: 'top',
                    duration: 2,
                });
            }
        } catch (error) {
            console.error('Login Error:', error);
            notification.error({
                message: 'Login Failed!',
                description: 'An error occurred. Please try again.',
                placement: 'top',
                duration: 2,
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <section>
            <div className="container d-flex justify-content-center align-items-center">
                <div className="loginSection">
                    <div className="row">
                        <div className="col-md-6 d-flex justify-content-center">
                            <img src={img1} alt="Login Section" className='img-fluid loginSecImg' />
                        </div>
                        <div className="col-md-6 d-flex justify-content-center align-items-center">
                            <div className="formContainer">
                                {/* <h1 className='mb-4'>Welcome Back!</h1> */}
                                <h2 className='mb-4'>MG Food Court</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text" id="basic-addon1">
                                                <MdAlternateEmail />
                                            </span>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                placeholder="Email Address"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text" id="basic-addon1">
                                                <FaLock />
                                            </span>
                                            <input
                                                type="password"
                                                name="password"
                                                className="form-control"
                                                placeholder="Password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="loginBtn" disabled={isLoading}>
                                        {isLoading ? "Loading..." : "LOGIN"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
