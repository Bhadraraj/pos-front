import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/invoiceListing.css'
import { Table, Form, Col, InputGroup, Row, Modal, Button } from "react-bootstrap";
import { BASE_URL } from '../utils/config'
import useBackButton from "../hooks/useBackButton";
const InvoiceListing = () => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const invoicesPerPage = 10;
    const goBack = useBackButton();
    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.post(`${BASE_URL}/api/invoicelist`);
                if (response.data.status === 'success' && response.data.invoices) { //Check for invoices data
                    setInvoices(response.data.invoices);
                    setTotalPages(Math.ceil(response.data.invoices.length / invoicesPerPage));
                } else {
                    setError(response.data.message || 'Failed to fetch invoices. Invoices data may be missing.'); // Improved error message
                }
            } catch (err) {
                setError(err.message || 'An error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const startIndex = (currentPage - 1) * invoicesPerPage;
    const endIndex = Math.min(startIndex + invoicesPerPage, invoices.length);
    const currentInvoices = invoices.slice(startIndex, endIndex);

    return (
        <div>

            <Row className="mb-3">
                <Col md={6}>
                    <h3>Invoice Listing  </h3>
                </Col>
                <Col md={6} className="d-flex justify-content-end align-items-center">
                    <button className="btn btn-sm btn-dark" onClick={goBack}>
                        {" "}
                        Back
                    </button>
                </Col>
            </Row>
            {loading ? (
                <div>Loading invoices...</div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : invoices && invoices.length > 0 ? (
                <div className="table-responsive invoiceListingTable">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Invoice ID</th>
                                <th>Bill Number</th>
                                <th>Ref No</th>
                                <th>Order ID</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Discount</th>
                                <th>GST</th>
                                <th>Total</th>
                                <th>Card No</th>
                                <th>Mobile No</th>
                                <th>Payment Status</th>
                                <th>Payment Type</th>
                                {/* <th>Items</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {currentInvoices.map((invoice) => (
                                <tr key={invoice.InvoiceID}>
                                    <td>{invoice.InvoiceID}</td>
                                    <td>{invoice.InvoiceBillNumber}</td>
                                    <td>{invoice.InvoiceRefNo}</td>
                                    <td>{invoice.InvoiceOrderID}</td>
                                    <td>{invoice.InvoiceType}</td>
                                    <td>{invoice.InvoiceDate}</td>
                                    <td>{invoice.InvoiceTime}</td>
                                    <td>{invoice.InvoiceDiscount}</td>
                                    <td>{invoice.InvoiceGst}</td>
                                    <td>{invoice.InvoiceTotal}</td>
                                    <td>{invoice.InvoiceCardNo}</td>
                                    <td>{invoice.InvoiceMobNo}</td>
                                    <td>{invoice.InvoicePaymentStatus}</td>
                                    <td>{invoice.InvoicePaymentType}</td>
                                    {/* <td>
                                        {invoice.invoiceitems && invoice.invoiceitems.length > 0 ? (
                                            <table className="table table-sm table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Item ID</th>
                                                        <th>Product Name</th>
                                                        <th>Qty</th>
                                                        <th>Unit Price</th>
                                                        <th>Total Price</th>
                                                        <th>Tax</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {invoice.invoiceitems.map((item) => (
                                                        <tr key={item.InvItemID}>
                                                            <td>{item.InvItemID}</td>
                                                            <td>{item.InvItemProdName}</td>
                                                            <td>{item.InvItemQty}</td>
                                                            <td>{item.InvItemUnitPrice}</td>
                                                            <td>{item.InvItemTotalPrice}</td>
                                                            <td>{item.InvItemTax}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div>No items found for this invoice.</div>
                                        )}
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            ) : (
                <div>No invoices found.</div>
            )}

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
        </div>
    );
};

export default InvoiceListing;