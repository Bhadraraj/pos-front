import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputGroup, Button } from 'react-bootstrap';
import { BASE_URL } from '../utils/config';
import Scanner from "../../qrscan/Scanner";

const ApplyCoupon = ({ setDiscount, setCouponCodeInOrder, overallTotal, couponCodeProp, refreshKey }) => {
    const [couponCode, setCouponCode] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [scannedCoupon, setScannedCoupon] = useState(null); // Store scanned coupon separately

    const setResult = (data) => {
        setScannedCoupon(data); // Update the scanned coupon state
    };

    useEffect(() => {
        setCouponCode(couponCodeProp);
    }, [couponCodeProp]);

    useEffect(() => {
        console.log('ApplyCoupon component refreshed');
    }, [refreshKey]);

    useEffect(() => {
        // Apply coupon if a new coupon is scanned
        if (scannedCoupon) {
            setCouponCode(scannedCoupon); // Update the coupon code input field
            handleApplyCoupon(null); // Call the apply coupon function
            setScannedCoupon(null); // Reset scanned coupon to prevent repeated calls
        }
    }, [scannedCoupon, overallTotal, setDiscount, setCouponCodeInOrder]); // Add overallTotal, setDiscount, and setCouponCodeInOrder as dependencies

    const handleApplyCoupon = async (event) => {
        if (event) {
            event.preventDefault();
        }

        if (!couponCode || couponCode.trim() === "") {
            alert("Please enter or scan a coupon code.");
            return; // Don't proceed if couponCode is empty
        }

        try {
            const response = await axios.post(`${BASE_URL}/api/applyCoupon`, {
                coupon_code: couponCode,
                total_amount: overallTotal,
            });

            setResponseMessage(response.data.message);
            setDiscount(response.data.discount);
            setCouponCodeInOrder(couponCode);
            setButtonDisabled(true);
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert('An error occurred');
            }
        }
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {  // Check if Enter key was pressed
            event.preventDefault();    // Prevent form submission (if inside a form)
            handleApplyCoupon();       // Apply the coupon
        }
    };
    return (
        <div>
            <Row>
                <Col className="mb-2 col-12 applyCoupon">
                    <InputGroup className="mb-3">
                        <Form.Control
                            style={{ border: 'none!important' }}
                            type="text"
                            placeholder="Enter Coupon Code"
                            name="cardNumber"
                            id="cardNumberIp"
                            value={couponCode}
                            onKeyDown={handleKeyDown} 
                            onChange={(e) => setCouponCode(e.target.value)} // Allow manual entry
                            disabled={buttonDisabled}
                        />
                        <InputGroup.Text id="basic-addon2" className=" btn btn-primary btn-sm">
                            <Scanner
                                setResult={setResult}
                                disabled={buttonDisabled}
                            />
                        </InputGroup.Text>
                      
                    </InputGroup>
                </Col>
            </Row>
        </div>
    );
};

export default ApplyCoupon;