import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// import { Table, Container, Row, Col, Form, Pagination } from 'react-bootstrap';
import { FaEye } from "react-icons/fa";
import { BASE_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";
import { Table, Form, Col, InputGroup, Row, Modal, Button } from "react-bootstrap";
const KitchenListView = () => {
    const [kitchenData, setKitchenData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [statusOptions, setStatusOptions] = useState(['Pending', 'Preparing', 'Completed']);
    const [selectedStatuses, setSelectedStatuses] = useState({});
    const [showViewModal, setShowViewModal] = useState(false);
    const printRef = useRef(); // Ref for the print content

    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();
    const handleViewModalPrint = (e) => {
        e.preventDefault();
        if (printRef.current) {
            const printContents = printRef.current.innerHTML;
            const printWindow = window.open('', '_self');

            if (printWindow) {
                printWindow.document.open();
                printWindow.document.write(`
                    <html>
                    <head>
                        <title>Print Kitchen Bill</title>
                        <style>
                            @media print {
                                body { 
                                    margin: 0; 
                                    padding: 0; 
                                    font-family: Arial, sans-serif; 
                                }
                                #bill-content { 
                                    width: 80mm; /* Or 100% if you prefer */
                                    box-sizing: border-box; 
                                }
                                table { 
                                    width: 100%; 
                                    border-collapse: collapse; 
                                    table-layout: fixed; /* Important for consistent column widths */
                                    font-size: 12px; /* Base font size for the table - adjust as needed */
                                }
                                th, td { 
                                    padding: 6px 8px; /* Increased padding for better readability */
                                    text-align: left; 
                                    border-bottom: 1px solid #ddd; /* Add borders between rows */
                                }
                                th { 
                                    font-weight: bold; 
                                    background-color: #f2f2f2; /* Light background for header */
                                }
                                /* Styles for specific elements */
                                .text-end { text-align: right; }
                                .text-center { text-align: center; }
                                .footer-text { margin-top: 10px; }
                                .header-text { 
                                    font-size: 1.4em; /* Slightly larger header */
                                    font-weight: bold; 
                                    margin-bottom: 10px; 
                                }
                                .shop-title { 
                                    font-size: 1.6em; /* Larger shop title */
                                    font-weight: bold; 
                                    margin-bottom: 5px; 
                                }
                                .shop-details {
                                    font-size: 1.2em; 
                                    margin-bottom: 10px; 
                                    white-space: pre-wrap; /* Preserve line breaks */
                                }
                                .small-text { font-size: 1.0em; }
                                .bill-info { margin-bottom: 8px;}
                            }
                        </style>
                    </head>
                    <body>
                        <div id="bill-content">${printContents}</div>
                    
                        <script>
                            window.addEventListener('DOMContentLoaded', () => {
                                window.print();
                                window.close();
                            });
                        </script>
                    </body>
                    </html>
                `);
                printWindow.document.close();
            } else {
                alert("Please allow pop-ups for printing.");
            }
        }
    };

    const handleViewProduct = async (kitchenListItem) => { // Use a more descriptive name
        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/api/kitchenlistview?search=${kitchenListItem.KitchenListTokenNo}` // Use KitchenListTokenNo
            );

            if (response.data.status === "success" && response.data.kitchenview.length > 0) {
                const orderData = response.data.kitchenview[0];
                navigate('/print-kitchen-bill', { state: { orderData } });
            } else {
                console.error("Order details not found:", response.data); // Log the error
                alert("Order details not found.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("An error occurred while fetching the data.");
        } finally {
            setLoading(false);
        }
    };

 
    const getBadgeClass = (status) => {
        switch (status) {
            case "Pending":
                return "badge-warning";
            case "Preparing":
                return "badge-primary";
            case "Completed":
                return "badge-success";
            case "Cancelled":
                return "badge-secondary";
            default:
                return "";
        }
    };

    useEffect(() => {
        const fetchKitchenData = async () => {
            setLoading(true);
            setError(null);

            try {
                const formData = new FormData();
                if (searchTerm) {
                    formData.append('search', searchTerm); // Append the search term to FormData
                }
                const response = await axios.post(`${BASE_URL}/api/kitchenlistview`, formData);


                if (response.data.status === "success" && response.data.kitchenview) {
                    setKitchenData(response.data.kitchenview);
                    setFilteredData(response.data.kitchenview);

                    const initialStatuses = {};
                    response.data.kitchenview.forEach(item => {
                        initialStatuses[item.KitchenOrdersAutoID] = item.KitchenOrdersStatus; // Use KitchenOrdersAutoID
                    });
                    setSelectedStatuses(initialStatuses);

                } else {
                    console.error("Invalid API response:", response.data);
                    setError("Failed to fetch data. Please check the API.");
                    setKitchenData([]);
                    setFilteredData([]);
                }
            } catch (err) {
               
                setKitchenData([]);
                setFilteredData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchKitchenData();
    }, [searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = async (kitchenOrdersAutoID, newStatus) => {
        try {
            const response = await axios.post(`${BASE_URL}/updateKitchenStatusByToken`, {
                token_no: kitchenOrdersAutoID, // Send KitchenOrdersAutoID directly
                status: newStatus,
            });
    
            if (response.data.status === "success") {
                // Update the state:
                setKitchenData(prevData => prevData.map(item =>
                    item.KitchenOrdersAutoID === kitchenOrdersAutoID ? { ...item, KitchenOrdersStatus: newStatus } : item
                ));
    
                setFilteredData(prevData => prevData.map(item =>
                    item.KitchenOrdersAutoID === kitchenOrdersAutoID ? { ...item, KitchenOrdersStatus: newStatus } : item
                ));
    
                setSelectedStatuses(prevStatuses => ({ ...prevStatuses, [kitchenOrdersAutoID]: newStatus }));
    
                console.log("Status updated successfully:", response.data.message);
    
                if (response.data.order) {
                    console.log("Updated Order:", response.data.order);
                }
    
            } else {
                console.error("Error updating status:", response.data.message || "Unknown error");
                alert(response.data.message || "Error updating status. Please try again.");
            }
        } catch (error) {
            console.error("Network error updating status:", error);
            alert("A network error occurred while updating status.");
        }
    };



    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
 

    return (
        <div>
            <div className="row">
                <div className="col-6"><h3> Kitchen View</h3></div>
                <div className="col-6"></div>
            </div>
            <Row className="mb-2">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Search by Token No"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Table responsive bordered hover>
                        <thead>
                            <tr>
                                <th>Kitchen Order Number</th>
                                <th>Token No</th>
                                <th>Order Table Number</th>
                                <th>Status</th>
                                <th>Update Status</th>
                                <th>Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="text-center">Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="7" className="text-center text-danger">{error}</td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan="7" className="text-center">No data found</td></tr>
                            ) : (
                                currentItems.map((item) => (
                                    <tr key={item.KitchenOrdersAutoID}>
                                        <td>{item.KitchenOrdersRefNo}</td>
                                        <td>{item.KitchenOrdersTokenNo}</td>
                                        <td>{item.KitchenOrdersTableNo || "-"}</td>
                                        <td>
                                            <span className={`badge ${getBadgeClass(item.KitchenOrdersStatus)}`}>
                                                {item.KitchenOrdersStatus}
                                            </span>
                                        </td>
                                        <td>
                                            <Form.Select
                                                value={selectedStatuses[item.KitchenOrdersAutoID]}
                                                onChange={e => {
                                                    console.log("Changing status for ID:", item.KitchenOrdersAutoID, "to:", e.target.value); // Add this line
                                                    handleStatusChange(item.KitchenOrdersAutoID, e.target.value);
                                                }}
                                                disabled={item.KitchenOrdersStatus === "Completed"}
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </Form.Select>
                                        </td>
                                        <td>{item.KitchenOrdersTime}</td>
                                        <td>
                                            <FaEye onClick={() => handleViewProduct(item)} style={{ cursor: 'pointer' }} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>

                </Col>

                {totalPages > 1 && (
                    <div className="pagination justify-content-end mt-3">
                        <button
                            className="btn btn-outline-secondary"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                className={`btn ${currentPage === i + 1
                                    ? "btn-primary"
                                    : "btn-outline-secondary"
                                    } mx-1`}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
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
                )}
            </Row>
        </div>
    );
};

export default KitchenListView;