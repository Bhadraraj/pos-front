
import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import '../../styles/printBill.css';
import axios from 'axios';
import { BASE_URL } from '../utils/config'
import { useLocation } from "react-router-dom";


const PrintBillOrder = ({ products, orderData }) => {
  const printRef = useRef(null);
  const [billData, SetBillData] = useState({});
  const billNumber = orderData?.OrderRefNo || 'N/A';
  const billType = orderData?.OrderBillType || 'N/A';
  const [billPayment, setBillPayment] = useState('Cash');

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
  const handleSubmit = async (e) => {
    e.preventDefault();
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
        OrderItemgst: String(item.OrderItemgst),
        OrderItemtotalPriceWithGST: String(item.OrderItemtotalPriceWithGST),
        OrderItemProdParcelPrice: item.OrderItemProdParcelPrice,
        ProdName: item.ProdName
      })) || [],
      discount: String(orderData?.OrderDiscount || 0),

      gst: String(orderData?.OrderGst || 0),
      grandTotal: String(orderData?.OrderOverallTotal || 0),
      paymentType: billPayment || 'N/A',
      billType: billType || 'Final',
      mobileNumber: orderData?.OrderCustMobileNo || 'N/A',
      cardNumber: orderData?.OrderCardNumber || 'N/A',
      paymentstatus: billPayment || 'Pending',
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
      window.location.reload();
    } catch (error) {
      console.error('Error saving bill:', error.response?.data || error.message);
      alert(`Failed to save bill details. Error: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    console.log("billData updated:", billData);
  }, [billData]);

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    <div className='mt-2 row d-flex justify-content-center'>
      <div
        id="bill-content"
        ref={printRef}
        style={{
          width: '80mm',
          padding: '3mm',
          margin: 0,
          boxSizing: 'border-box',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
        }}
      >

        {orderData?.OrderBillType == 'gst' && (
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
        {orderData?.OrderBillType == 'estimation' && (
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
        <table
          className="table"
          style={{
            width: '100%',
            fontSize: '14px',
            // fontWeight: '500',
            marginBottom: 0,
            tableLayout: 'fixed',
          }}
        >
          <thead className='m-0 p-0'>

            <tr>
              <td colSpan={5}>
                Bill No: {billNumber}
              </td>
            </tr>

            {orderData?.OrderBillType == 'gst' && (
              <tr style={{ marginBottom: '10px' }}>
                <td colSpan={2} className='text-start'>
                  {getCurrentDate()}
                </td>
                <td colSpan={4} className='text-end'>
                  {getCurrentDateTime()}
                </td>
              </tr>
            )}
            {orderData?.OrderBillType == 'estimation' && (
              <tr>
                <td colSpan={2} className='text-start'>
                  {getCurrentDate()}
                </td>
                <td colSpan={3} className='text-end'>
                  {getCurrentDateTime()}
                </td>
              </tr>
            )}


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
                <th className="text-end m-0 p-0">  Total  </th>
              )}
            </tr>
            {orderData?.OrderBillType == 'gst' && (
              <tr className='text-center m-0 p-0'><td colSpan={6} className='m-0 p-0'>
                {/* <hr /> */}
                <div className="lineDiv p-0 m-0" style={{ border: '0.5px dashed black', height: '0.1px', padding: '0px', width: '100%' }}></div>
              </td></tr>
            )}
            {orderData?.OrderBillType == 'estimation' && (
              <tr className='text-center m-0 p-0'><td colSpan={5} className='m-0 p-0'>
                {/* <hr /> */}
                <div className="lineDiv p-0 m-0" style={{ border: '0.5px dashed black', height: '0.1px', padding: '0px', width: '100%' }}></div>
              </td></tr>
            )}

          </thead>
          <tbody >
            {renderProductRows()}
            {orderData?.OrderBillType == 'gst' && (
              <tr className='text-center m-0 p-0'><td colSpan={6} className='m-0 p-0'>
                {/* <hr /> */}
                <div className="lineDiv p-0 m-0" style={{ border: '0.5px dashed black', height: '0.1px', padding: '0px', width: '100%' }}></div>
              </td></tr>
            )}
            {orderData?.OrderBillType == 'estimation' && (
              <tr className='text-center m-0 p-0'><td colSpan={5} className='m-0 p-0'>
                {/* <hr /> */}
                <div className="lineDiv p-0 m-0" style={{ border: '0.5px dashed black', height: '0.1px', padding: '0px', width: '100%' }}></div>
              </td></tr>
            )}

            {orderData?.OrderBillType == 'estimation' && (
              <tr className='p-0 m-0'>
                <th className='m-0  p-0 text-end ' colSpan={4}>Discount:</th>
                <td className='text-end m-0 p-0 pe-2' colSpan={1}>₹{orderData?.OrderDiscount || 0}</td>
              </tr>
            )}
            {orderData?.OrderBillType == 'gst' && (
              <tr className='p-0 m-0'>
                <th className='m-0  p-0 text-end ' colSpan={5}>SGST:</th>
                <td className='text-end m-0 p-0 pe-2'>₹{orderData?.OrderSgst}</td>
              </tr>
            )}
            {orderData?.OrderBillType == 'gst' && (
              <tr className='p-0 m-0'>
                <th className='m-0  p-0 text-end ' colSpan={5}>CGST:</th>
                <td className='text-end m-0 p-0 pe-2'>₹{orderData?.OrderCgst}</td>
              </tr>
            )}
            {orderData?.OrderBillType == 'gst' && (
              <tr className='p-0 m-0'>
                <th className='m-0  p-0 text-end ' colSpan={5}>Total:</th>
                <td className='text-end m-0 p-0 pe-2' colSpan={1}>₹{orderData?.OrderOverallTotal}</td>
              </tr>
            )}
            {orderData?.OrderBillType == 'estimation' && (
              <tr className='p-0 m-0'>
                <th className='m-0  p-0 text-end ' colSpan={4}>Total:</th>
                <td className='text-end m-0 p-0 pe-2' colSpan={1}>₹{orderData?.OrderOverallTotal}</td>
              </tr>
            )}



          </tbody>
        </table>
      </div>
      <div className="col-12 mb-2 d-flex justify-content-center">
        <button className="btn btn-primary " onClick={(e) => { handlePrint(e); }}>
        {/* <button className="btn btn-primary " onClick={(e) => { handleSubmit(e); handlePrint(e); }}> */}
          Print
        </button>
      </div>

    </div>
  );
};

export default PrintBillOrder;
