import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import PrintBill from './PrintBill';
import { BASE_URL } from '../utils/config'
import useBackButton from '../hooks/useBackButton';
const SearchBill = () => {
    const goBack = useBackButton()
    const [billId, setBillId] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!billId) {
            alert('Please enter a Bill ID');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/api/ordersearch?billid=${billId}`);
            if (response.data.status === 'success') {
                setOrderData(response.data.orders);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching the data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div >
            <Row>
                <Col md={12} className='d-flex justify-content-end'>
                    <button className='btn btn-sm btn-dark' onClick={goBack}> Back</button></Col>
                <Col md={6} className='mb-2' >
                    <Form.Group controlId="parcelRegular">
                        <Form.Control
                            type="text"
                            placeholder="Enter Bill ID"
                            value={billId}
                            onChange={(e) => setBillId(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={6} className='mb-2 d-flex justify-content-start'>
                    <Button className='btn btn-primary' onClick={handleSearch} disabled={loading}>
                        {loading ? 'Loading...' : 'Search'}
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col md={6} className='d-flex justify-content-center'>
                    {orderData && <PrintBill orderData={orderData} />}
                </Col>
            </Row>
        </div>
    );
};

export default SearchBill;
