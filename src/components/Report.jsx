import React, { useState } from 'react';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem } from '@mui/material';

import { DatePicker, Space } from 'antd';

import { MdOutlineCurrencyRupee, MdAdd, MdNotificationsActive } from 'react-icons/md';
import moment from 'moment';
import '../styles/report.css'
const Reports = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportType, setReportType] = useState('Daily Sales');
    const onStartDateChange = (date, dateString) => {
        setStartDate(dateString);
    };

    const onEndDateChange = (date, dateString) => {
        setEndDate(dateString);
    };
    const dailySalesReports = [
        { date: '2024-09-01', totalSales: 200, totalAmount: 5000 },
        { date: '2024-09-02', totalSales: 150, totalAmount: 3500 },
        { date: '2024-09-03', totalSales: 180, totalAmount: 4000 },
        { date: '2024-09-04', totalSales: 220, totalAmount: 5500 },
        { date: '2024-09-05', totalSales: 160, totalAmount: 3800 },
        { date: '2024-09-06', totalSales: 190, totalAmount: 4700 },
        { date: '2024-09-07', totalSales: 170, totalAmount: 4300 },
        { date: '2024-09-08', totalSales: 200, totalAmount: 5100 },
        { date: '2024-09-09', totalSales: 210, totalAmount: 5300 },
        { date: '2024-09-10', totalSales: 220, totalAmount: 5600 },
    ];

    const itemSalesReports = [
        { itemName: 'Pizza', quantitySold: 100, totalAmount: 2000 },
        { itemName: 'Burger', quantitySold: 80, totalAmount: 1600 },
        { itemName: 'Pasta', quantitySold: 90, totalAmount: 1800 },
        { itemName: 'Salad', quantitySold: 70, totalAmount: 1400 },
        { itemName: 'Fries', quantitySold: 120, totalAmount: 2400 },
        { itemName: 'Soda', quantitySold: 150, totalAmount: 3000 },
        { itemName: 'Ice Cream', quantitySold: 60, totalAmount: 1200 },
        { itemName: 'Sandwich', quantitySold: 85, totalAmount: 1700 },
        { itemName: 'Soup', quantitySold: 75, totalAmount: 1500 },
        { itemName: 'Coffee', quantitySold: 110, totalAmount: 2200 },
    ];

    const paymentMethodReports = [
        { paymentMethod: 'Cash', totalTransactions: 120, totalAmount: 3000 },
        { paymentMethod: 'Credit Card', totalTransactions: 80, totalAmount: 2000 },
        { paymentMethod: 'Debit Card', totalTransactions: 90, totalAmount: 2500 },
        { paymentMethod: 'Mobile Payment', totalTransactions: 70, totalAmount: 1800 },
        { paymentMethod: 'Online Banking', totalTransactions: 60, totalAmount: 1500 },
        { paymentMethod: 'PayPal', totalTransactions: 110, totalAmount: 2900 },
        { paymentMethod: 'Gift Card', totalTransactions: 50, totalAmount: 1300 },
        { paymentMethod: 'Voucher', totalTransactions: 40, totalAmount: 1000 },
        { paymentMethod: 'Cheque', totalTransactions: 30, totalAmount: 800 },
        { paymentMethod: 'Cryptocurrency', totalTransactions: 20, totalAmount: 500 },
    ];

    const staffPerformanceReports = [
        { staffName: 'Alice', ordersHandled: 50, totalAmount: 1200 },
        { staffName: 'Bob', ordersHandled: 40, totalAmount: 1000 },
        { staffName: 'Charlie', ordersHandled: 45, totalAmount: 1100 },
        { staffName: 'David', ordersHandled: 55, totalAmount: 1300 },
        { staffName: 'Eve', ordersHandled: 35, totalAmount: 900 },
        { staffName: 'Frank', ordersHandled: 60, totalAmount: 1400 },
        { staffName: 'Grace', ordersHandled: 30, totalAmount: 800 },
        { staffName: 'Hank', ordersHandled: 65, totalAmount: 1500 },
        { staffName: 'Ivy', ordersHandled: 70, totalAmount: 1600 },
        { staffName: 'Jack', ordersHandled: 75, totalAmount: 1700 },
    ];

    const filterReportsByDate = (reports) => {
        if (!startDate || !endDate) return reports;

        const start = new Date(startDate);
        const end = new Date(endDate);

        return reports.filter(report => {
            const reportDate = new Date(report.date);
            return reportDate >= start && reportDate <= end;
        });
    };

    const renderReportTable = () => {
        let filteredReports = [];
        switch (reportType) {
            case 'Daily Sales':
                filteredReports = filterReportsByDate(dailySalesReports);
                return (
                    <TableBody>
                        {filteredReports.map((report, index) => (
                            <TableRow key={index}>
                                <TableCell>{report.date}</TableCell>
                                <TableCell>{report.totalSales}</TableCell>
                                <TableCell> <MdOutlineCurrencyRupee />{report.totalAmount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                );

            case 'Item Sales':
                filteredReports = itemSalesReports;
                return (
                    <TableBody>
                        {filteredReports.map((report, index) => (
                            <TableRow key={index}>
                                <TableCell>{report.itemName}</TableCell>
                                <TableCell>{report.quantitySold}</TableCell>
                                <TableCell> <MdOutlineCurrencyRupee />{report.totalAmount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                );

            case 'Payment':
                filteredReports = paymentMethodReports;
                return (
                    <TableBody>
                        {filteredReports.map((report, index) => (
                            <TableRow key={index}>
                                <TableCell>{report.paymentMethod}</TableCell>
                                <TableCell>{report.totalTransactions}</TableCell>
                                <TableCell> <MdOutlineCurrencyRupee />{report.totalAmount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                );

            case 'Staff Performance':
                filteredReports = staffPerformanceReports;
                return (
                    <TableBody>
                        {filteredReports.map((report, index) => (
                            <TableRow key={index}>
                                <TableCell>{report.staffName}</TableCell>
                                <TableCell>{report.ordersHandled}</TableCell>
                                <TableCell> <MdOutlineCurrencyRupee />{report.totalAmount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                );

            default:
                return null;
        }
    };

    return (
        <section className='reportSec'>
            <h2>Reports</h2>
            {/* <div style={{ marginBottom: '20px' }}> */}

            <div className="row">
                <div className="col-md-4 mt-3">
                    <Select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="w-100"
                        sx={{
                            marginRight: '20px',
                            minWidth: '200px',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'red', // Change border color to red
                                },
                                '&:hover fieldset': {
                                    borderColor: 'red', // Change border color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'red', // Change border color when focused
                                },
                            },
                        }}
                    >
                        <MenuItem value="Daily Sales">Daily Sales</MenuItem>
                        <MenuItem value="Item Sales">Item Sales</MenuItem>
                        <MenuItem value="Payment">Payment</MenuItem>
                        <MenuItem value="Staff Performance">Staff Performance</MenuItem>
                    </Select>
                </div>

                <div className="col-md-4 mt-3">
                    <DatePicker
                        label="Start Date"
                        value={startDate ? moment(startDate) : null}
                        onChange={onStartDateChange}
                        placeholder="Select Start Date"
                        className="w-100"
                    />
                </div>

                <div className="col-md-4 mt-3">
                    <DatePicker
                        label="End Date"
                        value={endDate ? moment(endDate) : null}
                        onChange={onEndDateChange}
                        placeholder="Select End Date"
                        className="w-100"
                    />
                </div>
            </div>

            {/* </Space>/ */}

            {/* </div> */}
            <Table>
                <TableHead>
                    <TableRow>
                        {reportType === 'Daily Sales' && (
                            <>
                                <TableCell>Date</TableCell>
                                <TableCell>Total Sales</TableCell>
                                <TableCell>Total Amount</TableCell>
                            </>
                        )}
                        {reportType === 'Item Sales' && (
                            <>
                                <TableCell>Item Name</TableCell>
                                <TableCell>Quantity Sold</TableCell>
                                <TableCell>Total Amount</TableCell>
                            </>
                        )}
                        {reportType === 'Payment' && (
                            <>
                                <TableCell>Payment Method</TableCell>
                                <TableCell>Total Transactions</TableCell>
                                <TableCell>Total Amount</TableCell>
                            </>
                        )}
                        {reportType === 'Staff Performance' && (
                            <>
                                <TableCell>Staff Name</TableCell>
                                <TableCell>Orders Handled</TableCell>
                                <TableCell>Total Amount</TableCell>
                            </>
                        )}
                    </TableRow>
                </TableHead>
                {renderReportTable()}
            </Table>
        </section>
    );
};

export default Reports;
