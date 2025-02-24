
import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import '../../styles/printBill.css';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import ApplyCoupon from './ApplyCoupon';
import { BASE_URL } from '../utils/config'
import { useLocation } from "react-router-dom";
import useBackButton from "../hooks/useBackButton";

const PrintOrderedBill = () => {
  // const PrintOrderedBill = ({ products, orderData }) => {
  const goBack = useBackButton();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderData = JSON.parse(decodeURIComponent(searchParams.get("data") || "{}"));
  // const printRef = useRef(null);
  console.log("STATEMENT", JSON.stringify(orderData, null, 2));
  // const [paymentStatus, setPaymentStatus] = useState(orderData?.OrderPaymentType || 'Cash'); // Initialize with order data

  const [couponCode, setCouponCode] = useState('');
  const [billType, setBillType] = useState('estimation');
  const [billPayment, setBillPayment] = useState('Cash');
  const [billno, setBillNo] = useState(null);
  const billNumber = orderData?.OrderRefNo || 'N/A';
  // const billType = orderData?.OrderBillType || 'N/A';
  const [discount, setDiscount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [billData, SetBillData] = useState(null);
  const orderId = orderData?.OrderID || null;
  const OrderRefNo = orderData?.OrderRefNo || null;
  const printRef = useRef(null);
  const [errors, setErrors] = useState({});
  const handleSetDiscount = (value) => {
    console.log('Discount set called with value:', value);
    setDiscount(value);
  };

  console.log('ORDER ID ' + orderId)


  const handleSetCouponCode = (code) => {
    console.log('Coupon code set:', code);
    setCouponCode(code);
  };

  useEffect(() => {
    if (billno !== "N/A") {
      console.log("Bill Number is updated:", billno);
    }
  }, [billno]); // Runs when `billno` changes
  const validateForm = () => {
    let newErrors = {};

    if (!billPayment) {
      newErrors.billPayment = "Payment Method is required";
    }

    if (!billType) {
      newErrors.billType = "Bill Type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handlePaymentStatusChange = async (event, orderId) => {
    try {
      const newStatus = event.target.value;

      const response = await axios.post(
        `${BASE_URL}/api/updatePaymentStatus`,
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

  console.log(orderId)
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
          },
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
  // const handlePaymentTypeChange = (event) => {
  //   setPaymentStatus(event.target.value);
  // };
  const [paymentStatus, setPaymentStatus] = useState(orderData?.OrderPaymentType || 'Cash'); // Initialize with order data

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
  // const handlePaymentTypeChange = (e) => {
  //   setBillPayment(e.target.value);
  //   console.log("Payment Method  " + e.target.value)
  // };


  const overallTotalForCoupon = calculateOverallTotalWithoutDiscount(orderData);
  console.log('Grand Total:', overallTotalForCoupon);
  console.log('Overall Total without Discount:', overallTotalForCoupon);


  const discountValue = parseFloat(billType === 'estimation' ? discount : 0);
  console.log(discountValue)

  const originalTotal = parseFloat(billType === 'estimation' ? overallTotalForCoupon : orderData?.OrderOverallTotal);
  const grandTotal = Math.max(0, originalTotal - discountValue);

  console.log('Discount Value:', discountValue);
  console.log('Original Total:', originalTotal);
  console.log('Calculated Grand Total:', grandTotal);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      return; // Don't submit if the form is invalid
    }
    const billContent = {
      billNumber: orderData?.OrderRefNo || 'N/A',
      orderId: orderData?.OrderID || null,
      userId: orderData?.OrderCreatedBy || null,
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
        OrderItemgst: billType === 'estimation' ? 0 : String(item.OrderItemgst),
        OrderItemtotalPriceWithGST: String(item.OrderItemtotalPriceWithGST),
        OrderItemProdParcelPrice: item.OrderItemProdParcelPrice,
        ProdName: item.ProdName
      })) || [],
      discount: billType === 'estimation' ? String(discountValue) : 0,
      gst: billType === 'estimation' ? 0 : orderData?.OrderGst,
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

      const invoiceRefNo = response.data.invoicerefno;
      console.log("Invoice Number:", invoiceRefNo);

      if (invoiceRefNo) {
        setBillNo(invoiceRefNo); // Set bill number immediately
        console.log("Bill Number set to:", invoiceRefNo);
      } else {
        console.warn("Invoice reference number not found in the response.");
        setBillNo("N/A");
      }

      alert('Bill details saved successfully!');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error saving bill:', error.response?.data || error.message);
      alert(`Failed to save bill details. Error: ${error.response?.data?.message || error.message}`);
    }
  };


  const handlePrint = (e) => {
    e.preventDefault();

    if (printRef.current) { // Check if printRef.current is valid
      const printContents = printRef.current.innerHTML; // Content from the div

      const printWindow = window.open('', '_blank'); // Open in a new tab

      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
                <html>
                <head>
                    <title>Print Bill</title>
                    <style>
                         @media print {
                body { margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 11px; }
                #bill-content { width: 80mm; box-sizing: border-box; } /* Or width: 100% */
                table { width: 100%; border-collapse: collapse; table-layout: fixed;}
                th, td { padding: 4px 5px; text-align: left; }
                th { font-weight: bold; }
                .text-end { text-align: right; }
                .text-center { text-align: center; }
                .footer-text { margin-top: 10px; }
                .header-text { font-size: 1.2em; font-weight: bold; margin-bottom: 8px; }
                .shop-title { font-size: 1.4em; font-weight: bold; margin-bottom: 0px; }
                .shop-details {font-size: 1.2em; margin-bottom: 10px; white-space: pre-wrap;}
                .small-text { font-size: 1.0em; }
                .bill-info { margin-bottom: 8px;}
                /* Add any other necessary print styles */
            }
                    </style>
                </head>
                <body>
                    <div id="bill-content">${printContents}</div> </body>
                </html>
            `);
        printWindow.document.close(); // Important: Close the document
        printWindow.print();
        //printWindow.close(); //Optional close the print window after print
      } else {
        alert("Please allow pop-ups for printing.");
      }
    } else {
      console.error("printRef.current is null. Make sure the ref is attached to the element.");
      alert("Error: Could not find the print content."); // Inform the user
    }
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
          {billType == 'gst' && (
            <td className="text-end m-0 p-0" >{product.OrderItemgst}%</td>
          )}
          {billType == 'estimation' && (
            <td className="text-end m-0 p-0 pe-2" >{product.OrderItemSubtotal}</td>
          )}
          {billType == 'gst' && (
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
        <h3>API Response:</h3>
        <pre>{billData ? JSON.stringify(billData, null, 2) : 'Loading...'}</pre>
      </div> */}
      <Row className="mb-3">
        <Col md={6}>
          <h3>Save Bill </h3>
        </Col>
        <Col md={6} className="d-flex justify-content-end align-items-center">
          <button className="btn btn-sm btn-dark" onClick={goBack}>
            {" "}
            Back
          </button>
        </Col>
      </Row>
      <div className="row d-flex justify-content-center">
        <div className="col-md-4  d-flex justify-content-center">
          <div>
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <div
                  id="bill-content"
                  ref={printRef}
                  style={{
                    width: '85mm',
                    padding: '3mm',
                    margin: 0,
                    boxSizing: 'border-box',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    margin: 0,
                  }}
                >


                  {billType == 'gst' && (
                    <div className='shopName'>    <h4 className='shopTitle text-center shop-title'><b>MG FOOD COURT</b></h4> {/* Shop Title */}
                      <p className="text-center shop-details">  {/* Shop Details */}
                        29/6, New No:137, Beach Road Jn, <br />
                        Opposite Exhibition Ground, <br />
                        Nagercoil<br />
                        Phone: 6379517048<br />
                        {/* GSTIN: 27AABCU9603R1ZN */}

                      </p>


                    </div>
                  )}
                  {billType == 'estimation' && (
                    <div className='shopName'>    <h3 className='shopTitle text-center shop-title'><b>MG FOOD COURT</b></h3> {/* Shop Title */}
                      <p className="text-center shop-details">  {/* Shop Details */}
                        29/6, New No:137, Beach Road Jn, <br />
                        Opposite Exhibition Ground, <br />
                        Nagercoil<br />
                        Phone: 6379517048<br />
                        {/* GSTIN: 27AABCU9603R1ZN */}

                      </p>
                    </div>
                  )}



                  <div className='mb-2'>

                    <div className="row mb-0">
                      <div className="col-12 ">

                        {orderData?.OrderPaymentStatus !== 'Paid' && (

                          <p className='mb-0'><strong>Bill No:</strong> {billno}</p>

                        )}

                        {orderData?.OrderPaymentStatus === 'Paid' && (
                          <p className='mb-0'><strong>Bill No:</strong>{OrderRefNo} </p>

                        )}
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
                        {/* {billType == 'estimation' && (

                          <th className="text-end m-0 p-0">  Total </th>
                        )} */}
                        {billType == 'gst' && (
                          <th className="text-end m-0 p-0"> Gst </th>
                        )}
                        {/* {orderData?.OrderBillType == 'gst' && ( */}
                        <th className="text-end m-0 p-0">  Total   </th>
                        {/* )} */}
                      </tr>
                      {billType == 'gst' && (
                        <tr className='text-center m-0 p-0'><td colSpan={6} className='m-0 p-0'><div className="lineDiv p-0 m-0" style={{ border: '1px dashed black', height: '0.3px', width: '100%' }}></div></td></tr>
                      )}
                      {billType == 'estimation' && (
                        <tr className='text-center m-0 p-0'><td colSpan={5} className='m-0 p-0'><div className="lineDiv p-0 m-0" style={{ border: '1px dashed black', height: '0.3px', width: '100%' }}></div></td></tr>
                      )}
                    </thead>
                    <tbody>
                      {renderProductRows()}
                      {billType == 'gst' && (
                        <tr className='text-center m-0 p-0'><td colSpan={6} className='m-0 p-0'><div className="lineDiv p-0 m-0" style={{ border: '1px dashed black', height: '0.3px', width: '100%' }}></div></td></tr>
                      )}
                      {billType == 'estimation' && (
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
                          billType === 'estimation' ? (
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
                              {/* {orderData?.OrderGst && orderData?.OrderGst !== 0 && ( */}

                              <tr className='p-0 m-0'>
                                <th className='m-0 p-0'>CGST:</th>
                                <td className='text-end  p-0 m-0 pe-2'>₹{orderData?.OrderGst / 2}  </td>
                              </tr>
                              {/* )} */}
                              {/* {orderData?.OrderGst && orderData?.OrderGst !== 0 && ( */}
                              <tr className='p-0 m-0'>
                                <th className='m-0 p-0'>SGST:</th>
                                <td className='text-end   p-0 m-0 pe-2'>₹{orderData?.OrderGst / 2} </td>
                              </tr>
                              {/* )} */}
                              {/* {orderData?.OrderGst && orderData?.OrderGst !== 0 && ( */}
                              <tr className='p-0 m-0'>
                                <th className='m-0 p-0'>Total:</th>
                                <td className='text-end   p-0 m-0 pe-2'>₹{orderData?.OrderOverallTotal}</td>
                              </tr>
                              {/* )} */}
                            </tbody>
                          )}
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <Row>
              {billno === null || billno === "N/A" ? ( 
                <> 
                  {/* {orderData?.OrderPaymentStatus !== 'Paid' && (
                    <Col md={6} className='mb-3'>
                      <Form.Group controlId="billPayment">
                        <Form.Control
                          as="select"
                          name="billPayment"
                          onChange={(e) => handlePaymentStatusChange(e, orderId)}
                          disabled={billno} // Disable if billNo is present
                          className="custom-select"
                          placeholder="Select Paid"
                        >
                          <option disabled selected> Payment Status </option>
                          <option value="NotPaid" className="text-danger">Not Paid</option>
                          <option value="Paid" className="text-success">Paid</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  )} */}

                  {/* {orderData?.OrderPaymentStatus !== 'Paid' && (
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="billPaymentType">
                        <Form.Control
                          as="select"
                          name="billPaymentType" 
                          onChange={handlePaymentTypeChange}
                          value={billPayment}
                          disabled={billno} 
                          isInvalid={!!errors.billPaymentType}  
                        >
                          <option value="" disabled>Select Payment</option>
                          <option value="Cash">Cash</option>
                          <option value="UPI">UPI</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.billPaymentType}  
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  )} */}

                  {orderData?.OrderPaymentStatus !== 'Paid' && (
                    <Col md={12} className="mb-3">
                      <Form.Group controlId="billType">
                        <Form.Control
                          as="select"
                          name="billType"
                          onChange={(e) => handleBillTypeUpdate(e, orderId)}
                          value={billType}
                          disabled={billno} // Disable if billNo is present
                          isInvalid={!!errors.billType}
                        >
                          <option disabled selected>Select Bill Type</option>
                          <option value="estimation">Estimation Bill</option>
                          <option value="gst">GST Bill</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.billType}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                  )}
                  {orderData?.OrderPaymentStatus !== 'Paid' && billType === 'estimation' && (
                    <Col md={12}>
                      <ApplyCoupon
                        setDiscount={handleSetDiscount}
                        setCouponCodeInOrder={setCouponCode}
                        overallTotal={overallTotalForCoupon}
                        couponCodeProp={couponCode}
                        refreshKey={refreshKey} disabled={billno}
                      />
                    </Col>
                  )}

                </>
              ) : null} {/* Render nothing if billNo is not null or "N/A" */}




              {orderData?.OrderPaymentStatus === 'NotPaid' && (
                <div className="col-12 mb-2">
                  <button className="btn btn-primary w-100" onClick={(e) => handleSubmit(e)} disabled={billno}>
                    Save
                  </button>
                </div>
              )}
              {orderData?.OrderRefNo && (
                <div className="col-12 mb-2">
                  <button className="btn btn-primary w-100" onClick={(e) => handlePrint(e)}>
                    Print
                  </button>
                </div>
              )}

              {orderData?.OrderPaymentStatus === 'Paid' || billno && (
                <div className="col-12 mb-2">
                  <button className="btn btn-primary w-100" onClick={(e) => handlePrint(e)}>
                    Print
                  </button>
                </div>
              )}

            </Row>

          </div>
        </div>
      </div>
    </div >

  );
};

export default PrintOrderedBill;
