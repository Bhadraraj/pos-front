import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, Container, Row, Col, Form, Button } from 'react-bootstrap';
import { BASE_URL } from "../utils/config"; // Import your base URL
import { useAuth } from "../Auth/AuthContext";

const PaymentsListByUser = () => {
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [paymentsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [userId, setUserId] = useState(''); // Local userId state for input
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const { userID: authUserId } = useAuth(); // Rename to avoid naming conflict

    useEffect(() => {
        if (authUserId) { // Use authUserId here
            setUserId(authUserId); // Initialize local userId with authUserId
        }
    }, [authUserId]);

    const fetchPayments = useCallback(async () => {
        setLoading(true);
        setError(null);

        if (!userId) { // Check the local userId state
            setError("User ID is required.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/api/paymentslistbyuser`, {
                userid: userId, // Send the local userId state to the API
            });

            if (response.data.status === 'success') {
                setPayments(response.data.payments);
                setTotalPages(Math.ceil(response.data.payments.length / paymentsPerPage));
            } else {
                setError(response.data.message || 'Failed to fetch payments.');
                setPayments([]);
                setTotalPages(0);
            }
        } catch (err) {
            console.error("Error fetching payments:", err);
            setError('An error occurred while fetching payments.');
            setPayments([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [userId, paymentsPerPage]); // userId in useCallback dependencies

    useEffect(() => {
        fetchPayments(); // Fetch when userId changes
    }, [userId, fetchPayments]);

    const handleUserIdChange = (e) => {
        setUserId(e.target.value); // Update the local userId state
        setCurrentPage(1); // Reset to page 1 when user id is changed.
    };
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const indexOfLastPayment = currentPage * paymentsPerPage;
    const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
    const currentPayments = payments.slice(indexOfFirstPayment, indexOfLastPayment);

    return (
        <Container>
            <Row className="mb-3">
                <h3>Payment List of User : {authUserId}</h3>
                <Col md={4}>
                    <Form.Label>User ID:</Form.Label>
                    <Form.Control
                        type="text" // Use number input for user ID
                        value={userId}
                        onChange={handleUserIdChange}
                        placeholder="Enter User ID"
                    />
                </Col>
                <Col md={4} className="d-flex align-items-end">
                    <Button variant="primary" onClick={fetchPayments} >
                        Get Payments
                        {/* {loading ? "Loading..." : "Get Payments"} */}
                    </Button>
                </Col>
            </Row>

     

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        {/* <th>Payment ID</th> */}
                        <th>Payment Date</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Order ID</th>
                        {/* Add other relevant columns */}
                    </tr>
                </thead>
                <tbody>
                    {currentPayments.length > 0 ? (
                        currentPayments.map((payment) => (
                            <tr key={payment.PaymentID}>
                                {/* <td>{payment.PaymentID}</td> */}
                                <td>{payment.PaymentDate}</td>
                                <td>{payment.PaymentAmount}</td>
                                <td>{payment.PaymentMethod}</td>
                                <td>{payment.PaymentOrderID}</td>
                                {/* ... other payment details */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No payments found.</td> {/* Adjust colSpan as needed */}
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className="pagination justify-content-end mt-3">
                <button
                    className="btn btn-outline-secondary"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        className={`btn ${currentPage === index + 1 ? "btn-primary" : "btn-outline-secondary"} mx-1`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="btn btn-outline-secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </Container>
    );
};

export default PaymentsListByUser;