
import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import '../../styles/printBill.css';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import ApplyCoupon from './ApplyCoupon';
import { BASE_URL } from '../utils/config'

const PrintOrderedBill = ({ products, orderData }) => {
  const [couponCode, setCouponCode] = useState('');
  const [billType, setBillType] = useState('estimation');
  const [billPayment, setBillPayment] = useState('Cash');
  const billNumber = orderData?.OrderRefNo || 'N/A';
  // const billType = orderData?.OrderBillType || 'N/A';
  const [discount, setDiscount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [billData, SetBillData] = useState(null);
  const orderId = orderData?.OrderID || null;

  const handleSetDiscount = (value) => {
    console.log('Discount set called with value:', value);
    setDiscount(value);
  };

  const handleSetCouponCode = (code) => {
    console.log('Coupon code set:', code);
    setCouponCode(code);
  };
  const handlePaymentStatusChange = async (event, orderId) => {
    try {
      const newStatus = event.target.value; // Extract selected value

      const response = await axios.post(
        `${BASE_URL}/api/updatePaymentStatus`, // Ensure correct API path
        {
          orderid: orderId,
          status: newStatus,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        alert("Payment status updated successfully");
      } else {
        alert("Error updating payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("An error occurred. Please try again.");
    }
  };
  const handleBillTypeUpdate = async (event, orderId) => {
    const newBillType = event.target.value;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/updateBill`,
        {
          orderid: orderId,
          billtype: newBillType,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200) {
        setBillType(newBillType);
      } else {
        alert('Failed to update bill type. Please try again.');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      alert('An error occurred while updating the bill type. Please try again.');
    }
  };

  const handlePaymentTypeChange = (event) => {
    setBillPayment(event.target.value);
  };
  const handleDownload = (e) => {
    e.preventDefault();
    const element = document.getElementById('bill-content');
    const contentHeight = element.scrollHeight;
    const options = {
      margin: [0, 0, 0, 0],
      filename: 'bill.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 3,
        letterRendering: true,
        logging: false,
        useCORS: true,
      },
      jsPDF: {
        unit: 'mm',
        format: [80, contentHeight / 3],
        orientation: 'portrait',
        compress: true,
      },
    };

    html2pdf().from(element).set(options).save();
  };


  const calculateOverallTotalWithoutDiscount = (orderData) => {
    if (orderData) {
      const overallTotalWithoutGst = parseFloat(orderData.OrderOverallTotalWithoutGst || 0);
      console.log('Order Overall Total Without GST:', overallTotalWithoutGst);
      return overallTotalWithoutGst;
    } else {
      console.log('No order data found');
      return 0;
    }
  };



  const overallTotalForCoupon = calculateOverallTotalWithoutDiscount(orderData);
  console.log('Grand Total:', overallTotalForCoupon);
  console.log('Overall Total without Discount:', overallTotalForCoupon);


  const discountValue = parseFloat(billType === 'estimation' ? discount : 0);
  console.log(discountValue)

  // const originalTotal = parseFloat(orderData?.OrderOverallTotal || 0);
  const originalTotal = parseFloat(billType === 'estimation' ? overallTotalForCoupon : orderData?.OrderOverallTotal);
  const grandTotal = Math.max(0, originalTotal - discountValue);

  console.log('Discount Value:', discountValue);
  console.log('Original Total:', originalTotal);
  console.log('Calculated Grand Total:', grandTotal);

  const handleSubmit = async (e) => {
    e.preventDefault();


    const billContent = {
      billNumber: orderData?.OrderRefNo || 'N/A',
      orderId: orderData?.OrderID || null,
      date: getCurrentDate(),
      time: getCurrentDateTime(),
      items: orderData?.orderitems?.map(item => ({
        OrderItemID: item.OrderItemID,
        OrderItemOrderID: item.OrderItemOrderID,
        OrderItemProductID: item.OrderItemProductID,
        OrderItemPrice: String(item.OrderItemPrice),
        OrderItemQty: item.OrderItemQty,
        OrderItemSubtotal: item.OrderItemSubtotal,
        OrderItemsNotes: item.OrderItemsNotes,
        OrderItemTotalPrice: String(item.OrderItemTotalPrice),
        OrderItemStatus: item.OrderItemStatus,
        OrderItemCreatedOn: item.OrderItemCreatedOn,
        OrderItemCreatedBy: item.OrderItemCreatedBy,
        // OrderItemgst: String(item.OrderItemgst),
        OrderItemgst: billType === 'estimation' ? 0 : String(item.OrderItemgst),
        OrderItemtotalPriceWithGST: String(item.OrderItemtotalPriceWithGST),
        OrderItemProdParcelPrice: item.OrderItemProdParcelPrice,
        ProdName: item.ProdName
      })) || [],
      discount: billType === 'estimation' ? String(discountValue) : 0,
      gst: billType === 'estimation' ? 0 : orderData?.OrderGst,
      // gst: String(orderData?.OrderGst || 0),
      grandTotal: String(grandTotal),
      paymentType: billPayment || 'N/A',
      billType: billType || 'Final',
      mobileNumber: orderData?.OrderCustMobileNo || 'N/A',
      cardNumber: orderData?.OrderCardNumber || 'N/A',
      paymentstatus: 'Paid',
    };

    SetBillData(billContent);
    console.log('Bill data set:', JSON.stringify(billContent, null, 2));

    try {
      const response = await axios.post(`${BASE_URL}/api/savebill`, billContent, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Bill details saved successfully!');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error saving bill:', error.response?.data || error.message);
      alert(`Failed to save bill details. Error: ${error.response?.data?.message || error.message}`);
    }
  };



  const handlePrint = (e) => {
    e.preventDefault();
    const printContents = document.getElementById('bill-content').innerHTML;
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



  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  const renderProductRows = () => {
    if (orderData?.orderitems && orderData.orderitems.length > 0) {
      return orderData.orderitems.map((product, index) => (
        <tr key={index} className=''>
          <td className="text-start m-0 p-0 ms-2" colSpan={2} >{product.ProdName}</td>
          <td className="text-center m-0 p-0" >{product.OrderItemPrice}</td>
          <td className="text-center m-0 p-0" >{product.OrderItemQty}</td>
          {orderData?.OrderBillType == 'gst' && (
            <td className="text-end m-0 p-0" >{product.OrderItemgst}%</td>
          )}
          {orderData?.OrderBillType == 'estimation' && (
            <td className="text-end m-0 p-0 pe-2" >{product.OrderItemSubtotal}</td>
          )}
          {orderData?.OrderBillType == 'gst' && (
            <td className="text-end m-0 p-0 pe-2" >{product.OrderItemtotalPriceWithGST}</td>
          )}
        </tr>
      ));
    } else {
      return (
        <tr style={{ borderBottom: '0.5px solid rgb(179, 179, 179)' }}>
          <td colSpan="5">No items found</td>
        </tr>
      );
    }
  };


  return (
    <div>

      {/* <div>
        <h4>Returned Values:</h4>
        <p>Discount: {billType === 'estimation' ? discount : 0}</p>
      </div> */}
      {/* <div className="row">
        {billData && (
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
            <h5>Saved Bill Data:</h5>
            <pre>{JSON.stringify(billData, null, 2)}</pre>
          </div>
        )}
      </div> */}

      <div
        id="bill-content"
        style={{
          width: '85mm',
          padding: '3mm',
          margin: 0,
          boxSizing: 'border-box',
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          // fontSize: '20px',
          // backgroundColor: '#909787',
          margin: 0,
        }}
      >




        <div className='mb-2'>  <h3 className="text-center mb-0 ">MG FOOD COURT</h3>
        <p className="text-center shop-details">  {/* Shop Details */}
            29/6, New No:137, Beach Road Jn, <br />
            Opposite Exhibition Ground, <br />
            Nagercoil<br />
            Phone: 6379517048<br />
            {/* GSTIN: 27AABCU9603R1ZN */}

          </p>
          <div className="row mb-0">
            <div className="col-12 ">
              <p className='mb-0'><strong>Bill No:</strong> {billNumber}</p>
            </div>
            <div className="col-6">
              <p className='mb-0'>
                {getCurrentDate()}</p>
            </div>
            <div className="col-6 text-end">
              <p className='mb-0'>

                {getCurrentDateTime()}</p>
            </div></div>
        </div>
        <table
          className="table"
          style={{
            width: '100%',
            fontSize: '10px',
            fontWeight: '600',
            marginBottom: 0,
            tableLayout: 'fixed',
          }}
        >
          <thead className='m-0 p-0'>
            <tr className='m-0 p-0'>
              <th className="text-start m-0 p-0" colSpan={2}>  Name </th>
              <th className="text-center m-0 p-0"> Price </th>
              <th className="text-center m-0 p-0">  Qty  </th>
              {orderData?.OrderBillType == 'estimation' && (

                <th className="text-end m-0 p-0">  Total </th>
              )}
              {orderData?.OrderBillType == 'gst' && (
                <th className="text-end m-0 p-0"> Gst </th>
              )}
              {orderData?.OrderBillType == 'gst' && (
                <th className="text-end m-0 p-0">  Total   </th>
              )}
            </tr>
            {orderData?.OrderBillType == 'gst' && (
              <tr className='text-center m-0 p-0'><td colSpan={6} className='m-0 p-0'><div className="lineDiv p-0 m-0" style={{ border: '1px dashed black', height: '0.3px', width: '100%' }}></div></td></tr>
            )}
            {orderData?.OrderBillType == 'estimation' && (
              <tr className='text-center m-0 p-0'><td colSpan={5} className='m-0 p-0'><div className="lineDiv p-0 m-0" style={{ border: '1px dashed black', height: '0.3px', width: '100%' }}></div></td></tr>
            )}
            {/* <tr className='text-center p-0'><td colSpan={5} className='p-0'><div className="lineDiv p-0 m-0" style={{ border: '1px dashed red', height: '0.3px', width: '100%' }}></div></td></tr> */}
          </thead>
          <tbody>
            {renderProductRows()}
            {orderData?.OrderBillType == 'gst' && (
              <tr className='text-center m-0 p-0'><td colSpan={6} className='m-0 p-0'><div className="lineDiv p-0 m-0" style={{ border: '1px dashed black', height: '0.3px', width: '100%' }}></div></td></tr>
            )}
            {orderData?.OrderBillType == 'estimation' && (
              <tr className='text-center m-0 p-0'><td colSpan={5} className='m-0 p-0'><div className="lineDiv p-0 m-0" style={{ border: '1px dashed black', height: '0.3px', width: '100%' }}></div></td></tr>
            )}

          </tbody>
        </table>
        <div className="row d-flex justify-content-end">
          <div className="col-8">
            <table className="table bordered" style={{

              fontSize: '13px',
              fontWeight: '700',

            }} >
              {
                billType == 'estimation' ? (
                  <tbody className='mb-0 pb-0  '>
                    <tr className='p-0 m-0'>
                      <th className='m-0 p-0'>Discount:</th>
                      <td className='text-end  m-0 p-0 pe-2'>₹{discount || 0}</td>
                    </tr>
                    <tr className='p-0 m-0'>
                      <th className='p-0 m-0'>Total:</th>
                      <td className='text-end p-0 m-0 pe-2'>₹{orderData?.OrderOverallTotalWithoutGst - discount}</td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {orderData?.OrderGst && orderData?.OrderGst !== 0 && (
                      <tr className='p-0 m-0'>
                        <th className='m-0 p-0'>CGST:</th>
                        <td className='text-end  p-0 m-0 pe-2'>₹{orderData?.OrderGst / 2}  </td>
                      </tr>
                    )}
                    {orderData?.OrderGst && orderData?.OrderGst !== 0 && (
                      <tr className='p-0 m-0'>
                        <th className='m-0 p-0'>SGST:</th>
                        <td className='text-end   p-0 m-0 pe-2'>₹{orderData?.OrderGst / 2} </td>
                      </tr>
                    )}
                    {orderData?.OrderGst && orderData?.OrderGst !== 0 && (
                      <tr className='p-0 m-0'>
                        <th className='m-0 p-0'>Total:</th>
                        <td className='text-end   p-0 m-0 pe-2'>₹{orderData?.OrderOverallTotal}</td>
                      </tr>
                    )}
                  </tbody>
                )}
            </table>
          </div>
        </div>
        <p className="text-center mt-2" style={{ fontSize: '13px', marginBottom: '0px' }}>
          Savor the flavor! Thanks for visiting...!
        </p>
      </div>
      <Row>


        <Col md={12} className='mb-3'>
          <Form.Group controlId="billPayment">
            <Form.Control
              as="select"
              name="paymentMethod"
              onChange={handlePaymentTypeChange}
              value={billPayment}
              className="custom-select" placeholder='Select Payment '
            >
              <option disabled> Select Payment </option>
              <option value="Cash"> Cash</option>
              <option value="UPI">UPI</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={6} className='mb-3'>
          <Form.Group controlId="billType">
            <Form.Control
              as="select"
              name="billType"
              onChange={(e) => handleBillTypeUpdate(e, orderId)}
              value={billType}
              className="custom-select"
              placeholder="Select Bill Type"
            >
              <option value="estimation">Estimation Bill</option>
              <option value="gst">GST Bill</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={6} className='mb-3'>
          <Form.Group controlId="billPayment">
            <Form.Control
              as="select"
              name="billPayment"
              onChange={(e) => handlePaymentStatusChange(e, orderId)}
              // value={order.OrderPaymentStatus}
              className="custom-select"
              placeholder="Select Paid"
            >
              <option value="NotPaid" className="text-danger">Not Paid</option>
              <option value="Paid" className="text-success">Paid</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      {/* <Col md={12} className='mb-3'>
        <Form.Group controlId="billPayment">
          <Form.Control
            as="select"
            name="billPayment"
            onChange={(e) => handlePaymentStatusChange(orderId, e)} // Fix the argument order
            value={order.OrderPaymentStatus} // Ensure the selected value is displayed
            className="custom-select"
            placeholder="Select Paid"
          >
            <option value="NotPaid" className="text-danger">Not Paid</option>
            <option value="Paid" className="text-success">Paid</option>
          </Form.Control>
        </Form.Group>
      </Col>; */}


      {billType === 'estimation' && (
        <Col md={12} >
          <ApplyCoupon
            setDiscount={handleSetDiscount}
            setCouponCodeInOrder={setCouponCode}
            overallTotal={overallTotalForCoupon}
            couponCodeProp={couponCode}
            refreshKey={refreshKey}
          />
        </Col>
      )}

      <div className="row">
        {/* <div className="col-md-6 mb-2">
          <button className="btn btn-secondary w-100 " onClick={handleSubmit}> Submit</button>
        </div> */}
        {/* <div className="col-md-6  mb-2">
          <button className="btn btn-secondary w-100 " onClick={handleDownload}>Download Invoice </button>
        </div> */}
        {/* <div className="col-12  mb-2">
          <button className="btn btn-primary w-100 " onClick={handlePrint}>Print Bill</button>
        </div> */}
        <div className="col-12 mb-2">
          <button className="btn btn-primary w-100" onClick={(e) => { handleSubmit(e); handlePrint(e); }}>
            Save and Print
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrintOrderedBill;
