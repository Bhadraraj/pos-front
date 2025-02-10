import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { Table, Form, Col, Row, Modal, Button } from 'react-bootstrap';
import { MdEditSquare, MdDelete } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { IoPrint } from "react-icons/io5";
import PrintOrderedBill from './PrintOrderedBill'
import PrintBill from './PrintBill'
import useBackButton from '../hooks/useBackButton';
import { BASE_URL } from '../utils/config'
const AllOrderList = () => {
    const navigate = useNavigate();



    const goBack = useBackButton()
    const [orders, setOrders] = useState([]);
    const [orderStatus, setOrderStatus] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);


    const handleViewModalPrint = () => {

        const printContents = `
    <div style=" 
      width: 80mm; 
      padding: 5mm; 
      box-sizing: border-box; 
      font-family: Arial, sans-serif; 
      font-size: 12px; 
      line-height: 1.5; 
      margin: 0 auto; /* Center the div */
      text-align: center; /* Align content inside the div to the center */
    ">
      ${document.getElementById('kitchen_bill').innerHTML}
    </div>
  `;

        const originalStyles = Array.from(document.styleSheets)
            .map(styleSheet => {
                try {
                    return Array.from(styleSheet.cssRules)
                        .map(rule => rule.cssText)
                        .join('');
                } catch (e) {
                    return '';
                }
            })
            .join('');
        const iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        iframe.style.position = 'absolute';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
        <html>
          <head>
            <style>${originalStyles}</style>
          </head>
          <body>${printContents}</body>
        </html>
      `);
        doc.close();
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        iframe.contentWindow.onafterprint = () => {
            document.body.removeChild(iframe);
        };

    };



    const fetchOrders = async (page = 1, status = '') => {
        try {
            const formData = new FormData();
            if (status && status !== 'All') {
                formData.append('orderstatus', status);
            }
            formData.append('page', page);
            const response = await axios.post(`${BASE_URL}/api/allorderlist`, formData);
            if (response.data.status === 'success') {
                setOrders(response.data.orders.data);
                setFilteredOrders(response.data.orders.data);
                setPagination(response.data.pagination);
            } else {
                console.log("No orders found");
                setFilteredOrders([]); // Set empty array for failed requests
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setFilteredOrders([]); // Set empty array on errors
        }
    };

    const handleViewProduct = (order) => {
        setSelectedOrder(order);
        setShowViewModal(true);
    };

    const handleEditProduct = (order) => {

        navigate('/update-order', { state: { billNo: order.OrderBillNo, orderId: order.OrderID } });

        // navigate('/update-order', { state: { billNo: order.OrderBillNo } }); // Use navigate with state
    };


    const getBadgeClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'badge-warning';
            case 'Preparing':
                return 'badge-primary';
            case 'Completed':
                return 'badge-success';
            case 'Cancelled':
                return 'badge-secondary';
            default:
                return '';
        }
    };
    const handleSearchChange = async (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const formData = new FormData();
        formData.append('billno', searchTerm);

        try {
            const response = await axios.post(`${BASE_URL}/api/allorderlist`, formData);
            if (response.data.status === 'success') {
                setFilteredOrders(response.data.orders.data);
                setPagination(response.data.pagination);
            } else {
                console.log("No orders found");
                setFilteredOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleDeleteProduct = async (orderID) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/deleteorder`, {
                orderid: orderID
            });

            alert(response.data.message);
            setFilteredOrders((prevOrders) => prevOrders.filter(order => order.OrderID !== orderID));
            setOrders((prevOrders) => prevOrders.filter(order => order.OrderID !== orderID));
            const totalPages = Math.ceil(filteredOrders.length / pagination.per_page);
            const newPage = currentPage > totalPages ? totalPages : currentPage;
            setPagination(prevPagination => ({
                ...prevPagination,
                total_pages: totalPages
            }));
            await fetchOrders(newPage, orderStatus);
        } catch (error) {
            console.error('Error deleting order:', error.response ? error.response.data : error.message);
        }
    };




    const handlePrintProduct = async (order) => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/api/ordersearch?billid=${order.OrderBillNo}`);
            if (response.data.status === 'success') {
                setOrderData(response.data.orders);
                setShowModal(true); // Show the modal after getting the data
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

    // setRefreshKey((prevKey) => prevKey + 1);

    const handleStatusChange = async (e, orderId, index) => {
        const newStatus = e.target.value;
        try {
            const response = await axios.post(`${BASE_URL}/api/updateorderstatus`, {
                orderid: orderId,
                status: newStatus,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setFilteredOrders((prevOrders) => {
                const updatedOrders = [...prevOrders];
                updatedOrders[index].OrderStatus = newStatus;
                return updatedOrders;
            });
        } catch (error) {
            console.error('Error occurred:', error);
            alert('An error occurred');
        }
    };

    const filterStatus = async (e) => {
        const status = e.target.value;
        setOrderStatus(status);
        setCurrentPage(1);
        await fetchOrders(1, status);
    };
    const handlePageChange = async (page) => {
        if (page < 1 || page > pagination.total_pages) return; // Avoid out-of-bound pages
        setCurrentPage(page);
        await fetchOrders(page, orderStatus);
    };


    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div>
            <Row className='mb-3'>

                <Col md={6}>
                    <h3>Order Details</h3>
                </Col>
                <Col md={6} className='d-flex justify-content-end align-items-center'>
                    <button className='btn btn-sm btn-dark' onClick={goBack}> Back</button></Col>
                <Col>  <input
                    type="text"
                    placeholder="Search by Order ID / Bill No / Mobile Number"
                    className="form-control"
                    onChange={handleSearchChange}
                /></Col>
                <Col md={6}>
                    <Form.Group controlId="orderStatusFilter">
                        <Form.Control as="select" value={orderStatus} onChange={filterStatus}>
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

                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            {/* <th className='text-nowrap'>Order ID</th> */}
                            <th className='text-nowrap'>Order Bill No</th>
                            <th className='text-nowrap'>Table No</th>
                            <th className='text-nowrap'>Payment Status</th>
                            <th className='text-nowrap'>Order Date</th>
                            <th className='text-nowrap'>Card Number</th>
                            <th className='text-nowrap'>Bill Type</th>
                            <th className='text-nowrap'>Dine-in / Takeout</th>
                            <th className='text-nowrap'>Mobile Number</th>
                            <th className='text-nowrap'>Payment Method</th>
                            <th>Status</th>
                            <th className='text-nowrap'>Update Status</th>
                            <th className='text-nowrap'>Total Amount</th>

                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order, index) => (
                                <tr key={order.OrderID}>
                                    <td className="text-nowrap">{order.OrderRefNo}</td>
                                    <td>{order.OrderTableNo}</td>
                                    <td>{order.OrderPaymentStatus}</td>
                                    <td className='text-nowrap'>{order.OrderDate}</td>
                                    <td>{order.OrderCardNumber}</td>
                                    <td>{order.OrderBillType}</td>
                                    <td>{order.OrderParcelRegular}</td>
                                    <td>{order.OrderCustMobileNo}</td>
                                    <td>{order.OrderPaymentMethod}</td>
                                    <td>
                                        <span className={`badge ${getBadgeClass(order.OrderStatus)}`}>
                                            {order.OrderStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <select as="select" className='custom-select' style={{ width: '100px', fontSize: '12px' }} disabled={order.OrderStatus === 'Completed'} value={order.OrderStatus} onChange={(e) => handleStatusChange(e, order.OrderID, index)}>
                                            <option value="Pending">Pending</option>
                                            <option value="Preparing">Preparing</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    <td>{order.OrderOverallTotalWithoutGst}</td>

                                    <td  >
                                        <div className="row  ">
                                            <div className="col-12 d-flex justify-content-start align-items-center">

                                                {order.OrderPaymentMethod == 'Card' ? (
                                                    <>
                                                        <div onClick={() => handleEditProduct(order)} className="edit-button me-2">
                                                            <MdEditSquare />
                                                        </div>
                                                    </>
                                                ) : (<>

                                                </>)}

                                                {/* 
                        <div onClick={() => handleEditProduct(order)} className="edit-button">
                          <MdEditSquare />
                        </div> */}




                                                <div onClick={() => handleDeleteProduct(order.OrderID)} className="delete-button me-2">
                                                    <MdDelete />
                                                </div>


                                                <div onClick={() => handleViewProduct(order)} className="view-button me-2">
                                                    <FaEye />
                                                </div>
                                                {/* <div onClick={() => handlePrintProduct(order)} className="print-button me-2">
                                                    <IoPrint />
                                                </div> */}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className='text-center'>No orders available</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Print Bill</Modal.Title>
                </Modal.Header>
                <Modal.Body className='d-flex justify-content-center'>
                    {orderData && orderData.OrderPaymentMethod === 'Card' ? (
                        <Col md={12} className='d-flex justify-content-center'>
                            <PrintOrderedBill orderData={orderData} />
                        </Col>
                    ) : (
                        <Col md={12} className='d-flex justify-content-center'>
                            <PrintBill orderData={orderData} />
                        </Col>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>



            <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <div
                            id="kitchen_bill"

                        >
                            <p><strong>Order ID:</strong> {selectedOrder.OrderID}</p>
                            <p><strong>Order Bill No:</strong> {selectedOrder.OrderBillNo}</p>
                            <p><strong>Order Date:</strong> {selectedOrder.OrderDate}</p>


                            <Table bordered hover>
                                <thead>
                                    <tr >
                                        <th >#</th>
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
                            </Table>
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
                {[...Array(pagination.total_pages)].map((_, index) => (
                    <button
                        key={index + 1}
                        className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-secondary'} mx-1`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="btn btn-outline-secondary"
                    disabled={currentPage === pagination.total_pages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div >
    );
};

export default AllOrderList;
