import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Menu } from 'antd';
import '../styles/customerList.css';

import TotalProductSale from './TotalProductSale'

import { MdOutlineCurrencyRupee, MdAdd, MdNotificationsActive } from 'react-icons/md';
const orders = [

  {
    customer: 'Reiner Braunn',
    menu: 'Salted Pasta with mushroom sauce',
    payment: '145',
    status: 'Preparing',
    avatarColor: '#722ed1',
  },
  {
    customer: 'Levi Ackerman',
    menu: 'Beef dumpling in hot and sour soup',
    payment: '105',
    status: 'Pending',
    avatarColor: '#ff000d',
  },
  {
    customer: 'Historia Reiss',
    menu: 'Hot spicy fried rice with omelet',
    payment: '45',
    status: 'Completed',
    avatarColor: '#36a300',
  },

  {
    customer: 'Reiner Braunn',
    menu: 'Salted Pasta with mushroom sauce',
    payment: '145',
    status: 'Preparing',
    avatarColor: '#722ed1',
  },
  {
    customer: 'Levi Ackerman',
    menu: 'Beef dumpling in hot and sour soup',
    payment: '105',
    status: 'Pending',
    avatarColor: '#ff000d',
  },
  {
    customer: 'Historia Reiss',
    menu: 'Hot spicy fried rice with omelet',
    payment: '45',
    status: 'Completed',
    avatarColor: '#36a300',
  },

  {
    customer: 'Reiner Braunn',
    menu: 'Salted Pasta with mushroom sauce',
    payment: '145',
    status: 'Preparing',
    avatarColor: '#722ed1',
  },
  {
    customer: 'Levi Ackerman',
    menu: 'Beef dumpling in hot and sour soup',
    payment: '105',
    status: 'Pending',
    avatarColor: '#ff000d',
  },
  {
    customer: 'Historia Reiss',
    menu: 'Hot spicy fried rice with omelet',
    payment: '45',
    status: 'Completed',
    avatarColor: '#36a300',
  }
];

const dropdownItems = (onFilter) => (
  <Menu>
    <Menu.Item key="0" onClick={() => onFilter('Preparing')}>Preparing</Menu.Item>
    <Menu.Item key="1" onClick={() => onFilter('Completed')}>Completed</Menu.Item>
    <Menu.Item key="2" onClick={() => onFilter('Pending')}>Pending</Menu.Item>
    <Menu.Item key="3" onClick={() => onFilter('All')}>All</Menu.Item>
  </Menu>
);

const CustomerList = () => {
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filter orders based on status
  const filteredOrders = filter === 'All'
    ? orders
    : orders.filter(order => order.status === filter);

  // Pagination logic
  const indexOfLastOrder = currentPage * rowsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Calculate total pages
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const handleChangeFilter = (status) => {
    setFilter(status);
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>

      <TotalProductSale />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Order Report</h2>
        <Dropdown overlay={dropdownItems(handleChangeFilter)} trigger={['click']}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Filter Order
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>


      <div className="table-responsive table-custom-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Customer</th>
              <th scope="col">Menu</th>
              <th scope="col">Total Payment</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order, index) => (
                <tr key={index}>
                  <th scope="row">
                    <div className="d-flex align-items-center">
                      <div
                        className="avatar me-3"
                        style={{ backgroundColor: order.avatarColor }}
                      >
                        {order.customer.charAt(0)}
                      </div>
                      {order.customer}
                    </div>
                  </th>
                  <td>{order.menu}</td>
                  <td><MdOutlineCurrencyRupee />{order.payment}</td>
                  <td className=''>
                    <div
                      className={`status-badge ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination justify-content-end">
        <button
          className="btn btn-outline-secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </button>

        {/* Page number buttons */}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-secondary'} mx-1`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="btn btn-outline-secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default CustomerList;



