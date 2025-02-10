
import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import '../../styles/printBill.css';
import axios from 'axios';
import { BASE_URL } from '../utils/config'
import { useLocation } from "react-router-dom";


const PrintKitchenView = () => {
    // const PrintKitchenView = ({ products, orderData }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const orderData = JSON.parse(decodeURIComponent(searchParams.get("data") || "{}"));
    //   const printRef = useRef(null);
    console.log("STATEMENT", JSON.stringify(orderData, null, 2));


    const printRef = useRef(null);
    const [billData, SetBillData] = useState({});

    const billType = orderData?.OrderBillType || 'N/A';
    const parcelRegular = orderData?.OrderParcelRegular || 'N/A';
    const OrderTokenNo = orderData?.OrderTokenNo || 'N/A';
    console.log(parcelRegular)

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
                printWindow.document.close();
                printWindow.print();

            } else {
                alert("Please allow pop-ups for printing.");
            }
        } else {
            console.error("printRef.current is null. Make sure the ref is attached to the element.");
            alert("Error: Could not find the print content.");
        }
    };

    useEffect(() => {
        console.log("billData updated:", billData);
    }, [billData]);


    const renderProductRows = () => {
        if (orderData?.orderitems && orderData.orderitems.length > 0) {
            return orderData.orderitems.map((product, index) => (
                <tr key={index} className=''>

                    <td className="text-start m-0 p-0 ms-2"  >{index + 1}</td>
                    <td className="text-start m-0 p-0 ms-2" colSpan={2}  >{product.ProdName}</td>
                    <td className="text-center m-0 p-0" >{product.OrderItemQty}</td>
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


                <table
                    className="table table-bordered border border-dark"
                    style={{
                        width: '100%',
                        fontSize: '14px',
                        marginBottom: 0,
                        tableLayout: 'fixed',
                        borderCollapse: 'collapse',
                    }}
                >

                    <thead>
                        <tr>
                            <th className="text-center" colSpan={4}>
                                <h4>Token No: {OrderTokenNo}</h4>
                            </th>
                        </tr>
                        <tr>
                            <th className="text-center" colSpan={4}>
                                {parcelRegular}
                            </th>
                        </tr>
                        <tr>
                            <th className="text-start">#</th>
                            <th className="text-start" colSpan={2}>Name</th>
                            <th className="text-center">Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderProductRows()}
                    </tbody>
                </table>

            </div>
            <div className="col-12 mt-4 d-flex justify-content-center">
                <button className="btn btn-primary " onClick={(e) => { handlePrint(e); }}>
                    Print
                </button>
            </div>

        </div>
    );
};

export default PrintKitchenView;
