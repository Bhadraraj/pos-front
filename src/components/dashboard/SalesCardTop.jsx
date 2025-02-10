import React, { useState, useEffect } from 'react';
import { MdCurrencyRupee, MdTrendingUp } from 'react-icons/md';
import { BiSolidCartAlt, BiError } from 'react-icons/bi';
import { GiCakeSlice } from 'react-icons/gi';
import WelcomeMessage from './WelcomeMessage'
import { gsap } from 'gsap';
import CountUp from 'react-countup';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { BASE_URL } from '../utils/config'
import axios from "axios";
import { Link } from 'react-router-dom'

const SalesCardTop = () => {
    const [totalSales, setTotalSales] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [mostSellingProduct, setMostSellingProduct] = useState('');
    const [leastSellingProduct, setLeastSellingProduct] = useState('');
    const [productSelection, setProductSelection] = useState('Tea Shop Restaurant');


    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");



    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null); // Reset error state

        try {
            const formData = new FormData();
            formData.append("start_date", startDate || new Date().toISOString().split("T")[0]);
            formData.append("end_date", endDate || new Date().toISOString().split("T")[0]);

            console.log("Sending Data:", Object.fromEntries(formData));

            const response = await axios.post(`${BASE_URL}/api/dashboard`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Response Data:", response.data);
            setDashboardData(response.data.dashboarddata);
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Error fetching data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        gsap.fromTo(
            '.welcome-text',
            { opacity: 0, y: -50 },
            { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }
        );
    }, []);


    const handleFilter = () => {
        if (onFilter) { // Call the parent's filter function if provided
            onFilter(startDate, endDate);
        } else {
            fetchDashboardData(); // Or your local fetch function
        }
    };


    const dummyData = {
        teaShopRestaurant: [
            { productName: 'Green Tea', salesCount: 150 },
            { productName: 'Black Tea', salesCount: 100 },
            { productName: 'Chai Latte', salesCount: 80 },
        ],
        teaShop: [
            { productName: 'Masala Tea', salesCount: 200 },
            { productName: 'Lemon Tea', salesCount: 180 },
            { productName: 'Ginger Tea', salesCount: 120 },
        ]
    };

    useEffect(() => {
        fetchTotalSales();
        fetchTotalOrders();
        fetchMostSellingProducts();
        fetchLeastSellingProduct()
    }, [productSelection]);

    const fetchTotalSales = () => {
        setTotalSales(productSelection === 'Tea Shop Restaurant' ? 50000 : 45000);
    };

    const fetchTotalOrders = () => {

        setTotalOrders(productSelection === 'Tea Shop Restaurant' ? 400 : 350);
    };

    const fetchMostSellingProducts = () => {

        if (productSelection === 'Tea Shop Restaurant') {
            setMostSellingProduct(dummyData.teaShopRestaurant[0]);
        } else if (productSelection === 'Tea Shop') {
            setMostSellingProduct(dummyData.teaShop[0]);
        }
    };

    const fetchLeastSellingProduct = () => {

        if (productSelection === 'Tea Shop Restaurant') {
            setLeastSellingProduct(dummyData.teaShopRestaurant[dummyData.teaShopRestaurant.length - 1]);
        } else if (productSelection === 'Tea Shop') {
            setLeastSellingProduct(dummyData.teaShop[dummyData.teaShop.length - 1]);
        }
    };

    const handleProductChange = (event) => {
        setProductSelection(event.target.value);
    };

    const renderValue = (value, fallback = 'No data') => {
        return value && value !== 0 ? value : fallback;
    };

    return (
        <>
            {dashboardData && (
                <div className="salesCardMain row g-3 my-3">
                    <div className="row d-flex justify-content-start">
                        <div className="col-md-4 d-flex justify-content-start align-items-center">
                            <WelcomeMessage />
                        </div>
                        {/* <div className="col-md-3">
                            <div className="totalAmount py-3">
                                <select
                                    value={productSelection}
                                    onChange={handleProductChange}
                                    className="form-select custom-select"
                                >
                                    <option value="Tea Shop Restaurant">Restaurant</option>
                                    <option value="Tea Shop">Tea Shop</option> 
                                </select>
                            </div>
                        </div> */}
                        {/* <div className="col-md-8 ">
                            <div className="row d-flex justify-content-end">
                                <div className="col-md-3">
                                    <FormGroup className="mb-2 me-sm-2 mb-sm-0">  
                                        <Label for="startDate" className="me-2">Start Date:</Label>
                                        <Input
                                            type="date"
                                            name="startDate"
                                            id="startDate"
                                            placeholder='Start Date'
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-md-3">
                                    <FormGroup className="mb-2 me-sm-2 mb-sm-0">
                                        <Label for="endDate" className="me-2">End Date:</Label>
                                        <Input
                                            type="date"
                                            name="endDate"
                                            id="endDate"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-md-3 d-flex align-items-end">
                                    <Button color="primary" onClick={handleFilter}>
                                        Filter
                                    </Button>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    <div className="col-lg-3 col-md-6">
                        {/* <Link to='/order-status'> */}
                        <div className="saleCard orange">
                            <div className="salesIcon">
                                <MdCurrencyRupee />
                            </div>
                            <div className="totalAmount py-3">
                                <CountUp start={0} end={dashboardData.OrderTotalAmount} duration={2.5} separator="," prefix="₹ " />
                            </div>
                            <p className="totolSaleText mb-0">Order Total Amount</p>
                        </div>
                        {/* </Link> */}
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="saleCard yellow">
                            <div className="salesIcon">
                                <BiSolidCartAlt />
                            </div>
                            <div className="totalAmount py-3">
                                <CountUp start={0} end={dashboardData.orderCount} duration={2.5} separator="," />
                            </div>
                            <p className="totolSaleText mb-0">Total Orders</p>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">

                        <div className="saleCard danger">
                            <div className="salesIcon ">
                                <GiCakeSlice />
                            </div>
                            <div className="totalAmount py-3">

                                <CountUp start={0} end={dashboardData.PendingorderCount} duration={2.5} separator="," />

                            </div>
                            <p className="totolSaleText mb-0">Pending </p>
                        </div>
                    </div>
                    {/* <div className="col-lg-3 col-md-6">

                        <div className="saleCard purple">
                            <div className="salesIcon ">
                                <GiCakeSlice />
                            </div>
                            <div className="totalAmount py-3">
                                <CountUp start={0} end={dashboardData.PreparingorderCount} duration={2.5} separator="," />
                            </div>
                            <p className="totolSaleText mb-0">Preparing</p>
                        </div>
                    </div> */}
                    <div className="col-lg-3 col-md-6">
                        <div className="saleCard green">
                            <div className="salesIcon">
                                <GiCakeSlice />
                            </div>
                            <div className="totalAmount py-3">
                                <CountUp start={0} end={dashboardData.CompletedorderCount} duration={2.5} separator="," />
                            </div>
                            <p className="totolSaleText mb-0">Completed </p>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
};

export default SalesCardTop;
