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
  const [searchTerm, setSearchTerm] = useState("");
  const printRef = useRef(null);
  const goBack = useBackButton();
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [orderParcelRegular, setOrderParcelRegular] = useState("");
  const [orderBillStatus, setOrderBillStatus] = useState("");
  const [orderPayStatus, setOrderPayStatus] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);



  const ordersPerPage = 5; // Adjust based on your needs

  const handlePrintCash = async (order) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/ordersearch?billid=${order.OrderID}`
      );


      if (response.data.status === "success") {
        const orderData = response.data.orders;
        // Navigate to print-bill with orderData
        window.location.href = `/print-bill?data=${encodeURIComponent(
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

    //   if (response.data.status === "success") {
    //     setOrderData(response.data.orders);
    //     setShowModal(true);
    //   } else {
    //     alert(response.data.message);
    //   }
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    //   alert("An error occurred while fetching the data.");
    // } finally {
    //   setLoading(false);
    // }
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

  // const fetchOrders = async () => {
  //   try {
  //     const formData = new FormData();
  //     const response = await axios.post(`${BASE_URL}/api/allorderlist`, formData);

  //     console.log("API Response:", response.data); // Debugging output

  //     if (response.data.status === "success" && Array.isArray(response.data.orders)) {
  //       setOrders(response.data.orders); // Directly set orders since it's already an array
  //       setFilteredOrders(response.data.orders);
  //     } else {
  //       console.log("No orders found in API response");
  //       setFilteredOrders([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching orders:", error);
  //     setFilteredOrders([]);
  //   }
  // };
  const fetchOrders = async (
    page = 1,
    status = "",
    payStatus = "",
    orderBillStatus = "",
    parcelType = ""
  ) => {
    try {
      const formData = new FormData();

      // ✅ Apply filtering logic
      if (status && status !== "All") {
        formData.append("orderstatus", status);
      }
      if (payStatus && payStatus !== "All") {
        formData.append("paystatus", payStatus);
      }
      if (orderBillStatus && orderBillStatus !== "All") {
        formData.append("orderBillStatus", orderBillStatus);
        console.log("Order Bill Status:", orderBillStatus); // Debugging log
      }
      if (parcelType && parcelType !== "All") {
        formData.append("parcelType", parcelType);
      }
      formData.append("page", page);

      // ✅ API Request
      const response = await axios.post(`${BASE_URL}/api/allorderlist`, formData);
      console.log("API Response:", response.data); // Debugging output

      // ✅ Handle Response
      if (response.data.status === "success" && Array.isArray(response.data.orders)) {
        setOrders(response.data.orders); // Directly set orders
        setFilteredOrders(response.data.orders);
      } else {
        console.log("No orders found in API response");
        setFilteredOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setFilteredOrders([]);
    }
  };

  // Ensure filteredOrders is an array before using slice()
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = Array.isArray(filteredOrders)
    ? filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
    : [];

  console.log("Filtered Orders:", filteredOrders);
  console.log("Current Orders (Paginated):", currentOrders);




  // const handleViewProduct = (order) => {
  //   setSelectedOrder(order);
  //   setShowViewModal(true);
  // };


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


  const filterStatus = async (e) => {
    const status = e.target.value;
    setOrderStatus(status);
    setCurrentPage(1);
    setOrderPayStatus("");
    setOrderBillStatus("");
    await fetchOrders(1, status);
  };

  const filterBillStatus = async (e) => {
    const status = e.target.value;
    setOrderBillStatus(status);
    setCurrentPage(1);
    setOrderStatus("");
    setOrderPayStatus("");

    if (status === "All") {
      await fetchOrders(1); // Fetch all orders without filtering
    } else {
      await fetchOrders(1, "", "", status); // Fetch filtered orders by bill type
    }
  };

  const filterParcelRegular = async (e) => {
    const parcelType = e.target.value;
    setOrderParcelRegular(parcelType);
    setCurrentPage(1);
    setOrderStatus("");
    setOrderPayStatus("");
    setOrderBillStatus("");

    if (parcelType === "All") {
      await fetchOrders(1); // Fetch all orders without filtering
    } else {
      await fetchOrders(1, "", "", "", parcelType); // Fetch orders filtered by parcel type
    }
  };

  const filterPayStatus = async (e) => {
    const status = e.target.value;
    setOrderPayStatus(status);
    setCurrentPage(1);
    setOrderStatus("");
    if (status === "All") {
      await fetchOrders(1); // Fetch all orders without filtering
    } else {
      await fetchOrders(1, "", status); // Fetch filtered orders
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  // const handlePageChange = async (page) => {
  //   if (page < 1 || page > pagination.total_pages) return;
  //   setCurrentPage(page);

  //   if (orderStatus) {
  //     await fetchOrders(page, orderStatus);
  //   } else if (orderPayStatus) {
  //     await fetchOrders(page, "", orderPayStatus);
  //   } else if (orderBillStatus) {
  //     await fetchOrders(page, "", "", orderBillStatus);
  //   } else {
  //     await fetchOrders(page); // Fetch all orders if no filters are applied
  //   }
  // };

  const handleEditProduct = (order) => {
    navigate("/update-order", {
      state: { billNo: order.OrderBillNo, orderId: order.OrderID },
    });

    // navigate('/update-order', { state: { billNo: order.OrderBillNo } }); // Use navigate with state
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

  // Function to directly send the scanned data as searchTerm
  // Function to handle the scanned QR result and update the searchTerm
  const setResult = async (data) => {
    setSearchTerm(data); // Set the scanned result as input value
    await handleSearchChange(data); // Send scanned result as searchTerm to API
  };

  const handleSearchChange = async (searchTerm) => {
    const formattedSearchTerm = searchTerm.toLowerCase().trim();
    const formData = new FormData();
    formData.append("billno", formattedSearchTerm); // Assuming 'billno' is the search field

    try {
      const response = await axios.post(
        `${BASE_URL}/api/allorderlist`,
        formData
      );
      if (response.data.status === "success") {
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
        orderid: orderID,
      });

      alert(response.data.message);
      setFilteredOrders((prevOrders) =>
        prevOrders.filter((order) => order.OrderID !== orderID)
      );
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.OrderID !== orderID)
      );
      const totalPages = Math.ceil(filteredOrders.length / pagination.per_page);
      const newPage = currentPage > totalPages ? totalPages : currentPage;
      setPagination((prevPagination) => ({
        ...prevPagination,
        total_pages: totalPages,
      }));
      await fetchOrders(newPage, orderStatus);
    } catch (error) {
      console.error(
        "Error deleting order:",
        error.response ? error.response.data : error.message
      );
    }
  };
  // const [loading, setLoading] = useState(false);
  // const handlePrintProduct = async (order) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(
  //       `${BASE_URL}/api/ordersearch?billid=${order.OrderID}`
  //     );
  //     if (response.data.status === "success") {
  //       const orderData = response.data.orders;
  //       // Navigate to print-bill with orderData
  //       window.location.href = `/print-bill?data=${encodeURIComponent(
  //         JSON.stringify(orderData)
  //       )}`;
  //     } else {
  //       alert(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     alert("An error occurred while fetching the data.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePrintProduct = async (order) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/ordersearch?billid=${order.OrderID}`
      );
      if (response.data.status === "success") {
        setOrderData(response.data.orders);
        setShowModal(true);
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
  const handleStatusChange = async (e, orderId, index) => {
    const newStatus = e.target.value;
    try {
      const response = await axios.post(
        `${BASE_URL}/api/updateorderstatus`,
        {
          orderid: orderId,
          status: newStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setFilteredOrders((prevOrders) => {
        const updatedOrders = [...prevOrders];
        updatedOrders[index].OrderStatus = newStatus;
        return updatedOrders;
      });
    } catch (error) {
      console.error("Error occurred:", error);
      alert("An error occurred");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <Row className="mb-3">
        <Col md={6}>
          <h3>All Order Status </h3>
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
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  handleSearchChange(value);
                }}
              />
              <InputGroup.Text id="basic-addon2" className="  btn btn-primary">
                <Scanner setResult={setResult} />
              </InputGroup.Text>
            </InputGroup>

          </Form.Group>

        </Col>

        <Col lg={2} className="mb-2">
          <Form.Group controlId="orderStatusFilter">
            <Form.Label>Paid / Not Paid </Form.Label>
            <Form.Control
              as="select"
              value={orderPayStatus}
              onChange={filterPayStatus}
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="NotPaid">Not Paid</option>
            </Form.Control>
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
        <Col lg={2} className="mb-2">
          <Form.Group controlId="orderParcelRegularFilter">
            <Form.Label>Takeout / Dine-in</Form.Label>
            <Form.Control
              as="select"
              value={orderParcelRegular}
              onChange={filterParcelRegular}
            >
              <option value="">Select Parcel Type</option>
              <option value="All">All</option>
              <option value="Takeout">Takeout</option>
              <option value="Dine-in">Dine-in</option>
            </Form.Control>
          </Form.Group>
        </Col>

        <Col lg={2} className="mb-2">
          <Form.Group controlId="orderBillStatusFilter">
            <Form.Label> Bill Type</Form.Label>
            <Form.Control
              as="select"
              value={orderBillStatus}
              onChange={filterBillStatus}
            >
              <option value="">Select Bill Type</option>
              <option value="All">All</option>
              <option value="estimation">Estimation</option>
              <option value="gst">GST</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <div className="table-responsive">
        <Table bordered hover responsive className="overAllOrderListing">
          <thead>
            <tr>

              <th className="text-nowrap">Order Bill No</th>
              <th className="text-nowrap">Table No</th>
              <th className="text-nowrap">Payment Status</th>
              <th className="text-nowrap">Order Date</th>
              <th className="text-nowrap">Card Number</th>
              <th className="text-nowrap">Bill Type</th>
              <th className="text-nowrap">Dine-in / Takeout</th>
              <th className="text-nowrap">Mobile Number</th>
              <th className="text-nowrap">Payment Method</th>
              <th>Status</th>
              <th className="text-nowrap">Update Status</th>
              <th className="text-nowrap">Total Amount</th>

              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order, index) => (
                <tr key={order.OrderID}>
                  <td className="text-nowrap">{order.OrderRefNo}</td>
                  <td>{order.OrderTableNo}</td>
                  <td>{order.OrderPaymentStatus}</td>
                  <td className="text-nowrap">{order.OrderDate}</td>
                  <td>{order.OrderCardNumber}</td>
                  <td>{order.OrderBillType}</td>
                  <td>{order.OrderParcelRegular}</td>
                  <td>{order.OrderCustMobileNo}</td>
                  <td>{order.OrderPaymentMethod}</td>
                  <td>
                    <span
                      className={`badge ${getBadgeClass(order.OrderStatus)}`}
                    >
                      {order.OrderStatus}
                    </span>
                  </td>
                  <td>
                    <select
                      as="select"
                      className="custom-select"
                      style={{ width: "100px", fontSize: "12px" }}
                      disabled={order.OrderStatus === "Completed"}
                      value={order.OrderStatus}
                      onChange={(e) =>
                        handleStatusChange(e, order.OrderID, index)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>{order.OrderOverallTotalWithoutGst}</td>

                  <td>
                    <div className="row  ">
                      <div className="col-12 d-flex justify-content-evenly align-items-center">
                        {order.OrderPaymentMethod == "Card" ? (
                          <>
                            <div
                              onClick={() => handleEditProduct(order)}
                              className="edit-button"
                            >
                              <MdEditSquare />
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                        <div
                          onClick={() => handleDeleteProduct(order.OrderID)}
                          className="delete-button me-2"
                        >
                          <MdDelete />
                        </div>

                        <div
                          onClick={() => handleViewProduct(order)}
                          className="view-button me-2"
                        >
                          <FaEye />
                        </div>
                        {order.OrderPaymentMethod == "Cash" ? (
                          <div onClick={() => handlePrintCash(order)} className="print-button me-2">
                            <IoPrint />
                          </div>
                        ) : (<> </>)}
                        {order.OrderPaymentMethod == "Card" ? (
                          <div onClick={() => handlePrintCard(order)} className="print-button me-2">
                            <IoPrint />
                          </div>
                        ) : (<> </>)}


                        {/* <div
                          onClick={() => handlePrintProduct(order)}
                          className="print-button me-2"
                        >
                          <IoPrint />
                        </div> */}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10 " className="text-center">
                  No orders available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Print Bill</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          {orderData && orderData.OrderPaymentMethod === "Card" ? (
            <Col md={12} className="d-flex justify-content-center">
              <PrintOrderedBill orderData={orderData} />
            </Col>
          ) : (
            <Col md={12} className="d-flex justify-content-center">
              <PrintBill orderData={orderData} />
            </Col>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}

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
