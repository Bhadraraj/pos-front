import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, InputGroup, Button } from 'react-bootstrap';
import { BASE_URL } from '../utils/config'
const ApplyCoupon = ({ setDiscount, setCouponCodeInOrder, overallTotal, couponCodeProp, refreshKey }) => {
    const [couponCode, setCouponCode] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);

    // Synchronize local state with parent component state
    useEffect(() => {
        setCouponCode(couponCodeProp);
    }, [couponCodeProp]);
    useEffect(() => {
        console.log('ApplyCoupon component refreshed');
    }, [refreshKey]);
    const handleApplyCoupon = async (event) => {
        event.preventDefault();
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

    return (
        <div>
            <Row>
                {/* <Col  className="mb-2 col-6">
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Enter Coupon Code"
                            onChange={(e) => setCouponCode(e.target.value)}
                            value={couponCode}
                            disabled={buttonDisabled}
                        />
                    </Form.Group>
                </Col>
                <Col   className='d-flex justify-content-end align-items-center col-6'>    
                    <button
                        onClick={handleApplyCoupon} 
                        className='btn btn-sm  btn-primary'
                        disabled={buttonDisabled}
                    >
                        Apply Coupon
                    </button>
                </Col> */}


                <Col className="mb-2 col-12 applyCoupon">
                    <InputGroup>
                        <Form.Control style={{ border: 'none !important' }}
                            type="text"
                            placeholder="Enter Coupon Code"
                            onChange={(e) => setCouponCode(e.target.value)}
                            value={couponCode}
                            disabled={buttonDisabled}
                        />
                        <Button
                            onClick={handleApplyCoupon}
                            className='btn btn-sm btn-primary'
                            disabled={buttonDisabled}
                        >
                            Apply Coupon
                        </Button>
                    </InputGroup>
                </Col>
            </Row>
        </div>
    );
};

export default ApplyCoupon;
