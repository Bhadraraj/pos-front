import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';
import '../../styles/badge.css'
import { MdEditSquare, MdDelete } from 'react-icons/md';
import { FaEye } from "react-icons/fa";
import useBackButton from '../hooks/useBackButton';
import { BASE_URL } from '../utils/config'
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
  const handleEditProduct = () => {
    console.log("Edit")
  }
  const handleDeleteProduct = () => {
    console.log("Delete")
  }
  const handleViewProduct = () => {
    console.log("View")
  }
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'badge badge-warning'; // Yellow badge for Pending
      case 'Processing':
        return 'badge badge-primary'; // Blue badge for Processing
      case 'Completed':
        return 'badge badge-success'; // Green badge for Completed
      default:
        return 'badge badge-secondary'; // Default badge color
    }
  };


  const handleStatusChange = async (e, itemId, itemIndex) => {
    const newStatus = e.target.value;

    console.log(`Updating Order ID: ${itemId} to Status: ${newStatus}`);

    try {

      const response = await axios.post(`${BASE_URL}/api/updateorderstatus`, {
        orderid: itemId,
        status: newStatus,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });


      console.log('Response from server:', response.data);

      setOrderData((prevOrderData) => {
        const updatedOrderItems = [...prevOrderData.orderitems];
        updatedOrderItems[itemIndex].OrderItemStatus = newStatus;

        return {
          ...prevOrderData,
          orderitems: updatedOrderItems,
        };
      });

    } catch (error) {
      alert("Can't ")
      console.log('Error occurred:', error);
      if (error.response) {
        console.log('Response error data:', error.response.data);
        alert(error.response.data.message);
      } else {
        alert('An error occurred');
      }
    }
  };







  return (
    <div>

      <Row className='mb-3'>
        <Col md={6}>
          <h3>Order Details</h3>
        </Col>
        <Col md={6} className='d-flex justify-content-end a'>
          <button className='btn btn-sm btn-dark' onClick={goBack}> Back</button></Col>
      </Row>
      <Row className='mb-3'>
        <Col className="col-6">
          <Form.Group controlId="billIdInput">
            <Form.Control
              type="text"
              placeholder="Enter Bill ID"
              value={billId}
              onChange={(e) => setBillId(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col className="col-6">
          <Button variant="primary" onClick={handleSearch} disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </Button>
        </Col>
      </Row>

      {orderData && (
        <Table bordered hover>
          <thead style={{ textAlign: 'center' }}>
            <tr>

              <th>Bill No</th>
              <th>Table No</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orderData.orderitems.map((item) => (
              <tr key={item.OrderItemID}>

                <td>{orderData.OrderRefNo}</td>
                <td>{orderData.OrderTableNo}</td>
                <td>{orderData.OrderOverallTotal}</td>
                <td>
                  <span className={getStatusBadgeColor(item.OrderItemStatus)}>
                    {item.OrderItemStatus}
                  </span>
                </td>
                <td>{item.ProdName}</td>
                <td>{item.OrderItemPrice}</td>
                <td>{item.OrderItemQty}</td>
                <td>{item.OrderItemSubtotal}</td>
                <td>
                  <select
                    value={item.OrderItemStatus}
                    onChange={(e) => handleStatusChange(e, orderData.OrderID, orderData.orderitems.indexOf(item))}
                    style={{ width: '100px', textAlign: 'center' }}
                    disabled={item.OrderItemStatus === 'Completed'}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>
                  <span onClick={() => handleEditProduct()} className="edit-button me-3">
                    <MdEditSquare />
                  </span>
                  <span onClick={() => handleDeleteProduct()} className="delete-button">
                    <MdDelete />
                  </span>
                  <span onClick={() => handleViewProduct()} className="view-button">
                    <FaEye />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

    </div>
  );
};

export default SearchBill;
