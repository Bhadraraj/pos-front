import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import '../../styles/printBill.css';
import axios from "axios";
import { Table, Form, Col, InputGroup, Row, Modal, Button } from "react-bootstrap";
import { MdEditSquare, MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { IoPrint } from "react-icons/io5";
import PrintOrderedBill from "./PrintOrderedBill";
import PrintBill from "./PrintBill";
import useBackButton from "../hooks/useBackButton";
import { BASE_URL } from "../utils/config";
import Scanner from "../../qrscan/Scanner";
const OrderList = () => {
    const navigate = useNavigate();
    const printRef = useRef(null);
    const goBack = useBackButton();
    const [orders, setOrders] = useState([]);

    const [pagination, setPagination] = useState({});

    const [showViewModal, setShowViewModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderData, setOrderData] = useState(null);









    const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [orderStatus, setOrderStatus] = useState("All"); // Initialize to "All"
    const [orderParcelRegular, setOrderParcelRegular] = useState("All"); // Initialize to "All"
    const [orderBillStatus, setOrderBillStatus] = useState("All"); // Initialize to "All"
    const [orderPayStatus, setOrderPayStatus] = useState("All"); // Initialize to "All"
    const ordersPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false); // Add loading state





    const handlePrintCard = async (order) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/api/ordersearch?billid=${order.OrderID}`
            );

            if (response.data.status === "success") {
                const orderData = response.data.orders;
                // Navigate to print-bill with orderData
                window.location.href = `/print_CardBill?data=${encodeURIComponent(
                    JSON.stringify(orderData)
                )}`;
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("An error occurred while fetching the data.");
        } finally {
            setLoading(false);
        }

    };

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

    const fetchOrders = async (
        searchTermRefNo = "",
        searchTermCardNumber = "",
        searchTermMobile = "",
        page = 1, // Add page parameter
        status = "All", // Add status parameter
        payStatus = "All", // Add payStatus parameter
        orderBillStatusParam = "All", // Add orderBillStatus parameter
        parcelType = "All"  // Add parcelType parameter
    ) => {
        setLoading(true);
        try {
            const formData = new FormData();
            const response = await axios.post(`${BASE_URL}/api/allorderlist`);

            formData.append("page", page);  // Append page to form data

            if (searchTermRefNo) {
                formData.append("OrderRefNo", searchTermRefNo);
            }
            if (searchTermCardNumber) {
                formData.append("OrderCardNumber", searchTermCardNumber);
            }
            if (searchTermMobile) {
                formData.append("OrderCustMobileNo", searchTermMobile);
            }

            formData.append("OrderStatus", status);  // Append status to form data
            formData.append("OrderPaymentStatus", payStatus);  // Append payStatus
            formData.append("OrderBillType", orderBillStatusParam);  // orderBillStatus
            formData.append("OrderParcelRegular", parcelType); // parcelType

            if (response.data.status === "success" && Array.isArray(response.data.orders)) {
                const cardOrders = response.data.orders.filter(order => order.OrderPaymentStatus === "NotPaid");
                setAllOrders(cardOrders);
                applyFiltersAndSearch(cardOrders);
                setPagination(response.data.pagination || {}); // Update pagination
            } else {
                console.log("No orders found in API response");
                setAllOrders([]);
                setFilteredOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setAllOrders([]);
            setFilteredOrders([]);
        } finally {
            setLoading(false);
        }
    };

    // Ensure filteredOrders is an array before using slice()
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = Array.isArray(filteredOrders)
        ? filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
        : [];


    // const handleViewProduct = (order) => {
    //   setSelectedOrder(order);
    //   setShowViewModal(true);
    // };
    const applyFiltersAndSearch = (orders) => {
        let filtered = [...orders];

        if (searchTerm) {
            const formattedSearchTerm = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(order => {
                const orderRefNo = order.OrderRefNo ? order.OrderRefNo.toString().toLowerCase() : "";
                const cardNumber = order.OrderCardNumber ? order.OrderCardNumber.toString().toLowerCase() : "";
                const mobileNo = order.OrderCustMobileNo ? order.OrderCustMobileNo.toString().toLowerCase() : "";
                return orderRefNo.includes(formattedSearchTerm) || cardNumber.includes(formattedSearchTerm) || mobileNo.includes(formattedSearchTerm);
            });
        }

        if (orderStatus !== "All") {
            filtered = filtered.filter(order => order.OrderStatus === orderStatus);
        }
        if (orderBillStatus !== "All") {
            filtered = filtered.filter(order => order.OrderBillStatus === orderBillStatus);
        }
        if (orderParcelRegular !== "All") {
            filtered = filtered.filter(order => order.OrderParcelRegular === orderParcelRegular);
        }
        if (orderPayStatus !== "All") {
            filtered = filtered.filter(order => order.OrderPayStatus === orderPayStatus);
        }

        setFilteredOrders(filtered);
        setCurrentPage(1); // Reset to first page after applying filters
    };


    const handleViewProduct = async (order) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/api/ordersearch?billid=${order.OrderID}`
            );


            if (response.data.status === "success") {
                const orderData = response.data.orders;
                // Navigate to print-bill with orderData
                window.location.href = `/print-kitchen-bill?data=${encodeURIComponent(
                    JSON.stringify(orderData)
                )}`;
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("An error occurred while fetching the data.");
        } finally {
            setLoading(false);
        }




    };


    const filterStatus = (e) => {
        const status = e.target.value;
        setOrderStatus(status);
        applyFiltersAndSearch(allOrders);
        fetchOrders("", "", "", 1, status, orderPayStatus, orderBillStatus, orderParcelRegular); // Pass all filter values
    };

    const filterBillStatus = (e) => {
        const status = e.target.value;
        setOrderBillStatus(status);
        applyFiltersAndSearch(allOrders);
        fetchOrders("", "", "", 1, orderStatus, orderPayStatus, status, orderParcelRegular); // Pass all filter values
    };

    const filterParcelRegular = (e) => {
        const parcelType = e.target.value;
        setOrderParcelRegular(parcelType);
        applyFiltersAndSearch(allOrders);
        fetchOrders("", "", "", 1, orderStatus, orderPayStatus, orderBillStatus, parcelType); // Pass all filter values
    };

    const filterPayStatus = (e) => {
        const status = e.target.value;
        setOrderPayStatus(status);
        applyFiltersAndSearch(allOrders);
        fetchOrders("", "", "", 1, orderStatus, status, orderBillStatus, orderParcelRegular); // Pass all filter values
    };


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchOrders(searchTerm, searchTerm, searchTerm, pageNumber, orderStatus, orderPayStatus, orderBillStatus, orderParcelRegular); // Pass all filter values
    };

    const handleEditProduct = (order) => {
        navigate("/update-order", {
            state: { billNo: order.OrderBillNo, orderId: order.OrderID },
        });
    };
    useEffect(() => {
        fetchOrders();
    }, []);

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
    const setResult = async (data) => {
        setSearchTerm(data); // Set the scanned result as input value
        await handleSearchChange(data); // Send scanned result as searchTerm to API
    };

    const handleSearchChange = (searchTerm) => {
        setSearchTerm(searchTerm);
        applyFiltersAndSearch(allOrders);
        fetchOrders(searchTerm, searchTerm, searchTerm, 1, orderStatus, orderPayStatus, orderBillStatus, orderParcelRegular); // Pass all filter values
    };



    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div>
            <Row className="mb-3">
                <Col md={6}>
                    <h3>Add Menus </h3>
                </Col>
                <Col md={6} className="d-flex justify-content-end align-items-center">
                    <button className="btn btn-sm btn-dark" onClick={goBack}>
                        {" "}
                        Back
                    </button>
                </Col>

                <Col lg={4} >

                    <Form.Group controlId="cardNumber">
                        <Form.Label>Search</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="text"
                                id="cardNumberIp"
                                placeholder="Search by Order ID / Bill No / Mobile Number"
                                className="form-control"
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                            <InputGroup.Text id="basic-addon2" className="  btn btn-primary">
                                <Scanner setResult={setResult} />
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                </Col>

                <Col lg={2} className="mb-2">
                    <Form.Group controlId="orderStatusFilter">
                        <Form.Label> Order Status</Form.Label>
                        <Form.Control
                            as="select"
                            value={orderStatus}
                            onChange={filterStatus}
                        >
                            <option value="">Select Order Status</option>
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Completed">Completed</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <div className="table-responsive">
                <Table bordered hover responsive className="overAllOrderListing">
                    <thead>
                        <tr>



                            <th className="text-nowrap">Order Date</th>
                            <th className="text-nowrap">Card Number</th>

                            <th className="text-nowrap">Dine-in / Takeout</th>

                            <th>Status</th>

                            <th className="text-nowrap">Total Amount</th>

                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.length > 0 ? (
                            currentOrders.map((order, index) => (
                                <tr key={order.OrderID}>

                                    <td className="text-nowrap">{order.OrderDate}</td>
                                    <td>{order.OrderCardNumber}</td>
                                    <td>{order.OrderParcelRegular}</td>
                                    <td>
                                        <span className={`badge ${getBadgeClass(order.OrderStatus)}`}>
                                            {order.OrderStatus}
                                        </span>
                                    </td>
                                    <td>{order.OrderOverallTotalWithoutGst}</td>
                                    <td>
                                        <div className="row">
                                            <div className="col-12 d-flex justify-content-evenly align-items-center">
                                                <div
                                                    onClick={() => handleEditProduct(order)}
                                                    className="edit-button"
                                                >
                                                    <MdEditSquare />
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center">
                                    No orders available
                                </td>
                            </tr>
                        )}

                    </tbody>
                </Table>
            </div>

            <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <div id="kitchen_bill" ref={printRef}>
                            <h4 className='text-center'>
                                <strong>Token No:{selectedOrder.OrderTokenNo} </strong>
                            </h4>
                            <p className='text-center'>
                                <strong> </strong> {selectedOrder.OrderDate}
                            </p>
                            <p className='text-center'>
                                <strong> </strong> {selectedOrder.OrderParcelRegular}
                            </p>

                            <table
                                className="table"
                                style={{
                                    width: '100%',
                                    fontSize: '14px',

                                    marginBottom: 0,
                                    tableLayout: 'fixed',
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map((item, index) => (
                                        <tr key={item.OrderItemID}>
                                            <td>{index + 1}</td>
                                            <td>{item.ProdName}</td>
                                            <td>{item.OrderItemQty}</td>

                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleViewModalPrint}>
                        Print
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="pagination justify-content-end mt-3">
                <button
                    className="btn btn-outline-secondary"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </button>

                {[...Array(Math.ceil(filteredOrders.length / ordersPerPage))].map((_, index) => (
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
                    disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>

        </div>
    );
};

export default OrderList;
