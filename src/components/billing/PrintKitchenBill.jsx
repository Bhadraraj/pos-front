import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import '../../styles/printBill.css';
import axios from 'axios';
import useBackButton from "../hooks/useBackButton";
import { BASE_URL } from '../utils/config';
import { Form, Button, Container, InputGroup, Row, Col } from "react-bootstrap";
const PrintKitchenView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state?.orderData;
    const printRef = useRef(null);
    const goBack = useBackButton();
    const [billData, setBillData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // const location = useLocation();
    const kitchenOrdersAutoID = location.state?.KitchenOrdersAutoID;


    if (!kitchenOrdersAutoID) {
        console.error("KitchenOrdersAutoID is undefined in print component");
        navigate('/kitchen-list'); // Redirect if ID is missing
    }

    useEffect(() => {
        if (!orderData) {
            console.error("No order data received. Redirecting...");
            navigate('/kitchen-list');
            return;
        }

        const fetchBillData = async () => {
            setLoading(true);
            try {
                const response = await axios.post(`${BASE_URL}/api/kitchenorderitemsview?autoId=${kitchenOrdersAutoID}`);
                if (response.data.status === "success" && response.data.kitchenorderinfo.length > 0) {
                    setBillData(response.data.kitchenorderinfo);
                } else {
                    setError("Failed to fetch bill data.");
                }
            } catch (error) {
                console.error("Error fetching bill data:", error);
                setError("An error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchBillData();
    }, [orderData, navigate]);

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


    const renderProductRows = () => {
        if (billData) {
            return billData.map((product, index) => (
                <tr key={product.KitchenListID}>
                    <td className="text-start ms-2">{index + 1}</td>
                    <td className="text-start ms-2" colSpan={2}>{product.KitchenListProductName}</td>
                    <td className="text-center">{product.KitchenListQty}</td>
                </tr>
            ));
        }
        return null;
    };

    if (loading) {
        return <div>Loading bill data...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <Row>
                <Col md={6}>
                    {/* <h3>All Order Status </h3> */}
                </Col>
                <Col md={6} className="d-flex justify-content-end align-items-center">
                    <button className="btn btn-sm btn-dark" onClick={goBack}>
                        {" "}
                        Back
                    </button>
                </Col>
            </Row>

            <div className='mt-2 row d-flex justify-content-center'>
                <div id="bill-content" ref={printRef} style={{ width: '80mm', padding: '3mm', margin: 0, boxSizing: 'border-box', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
                    <table className="table table-bordered border border-dark" style={{ width: '100%', fontSize: '14px', marginBottom: 0, tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th className="text-center" colSpan={4}><h4>Token No: {billData[0]?.KitchenListTokenNo}</h4></th>
                            </tr>
                            <tr>
                                <th className="text-center" colSpan={4}>{billData[0]?.KitchenListDineType}</th>
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
                    <button className="btn btn-primary" onClick={handlePrint}>Print</button>
                </div>
            </div></>
    );
};

export default PrintKitchenView;
