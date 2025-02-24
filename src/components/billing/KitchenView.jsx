import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// import { Table, Container, Row, Col, Form, Pagination } from 'react-bootstrap';
import { FaEye } from "react-icons/fa";
import { BASE_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";
import useBackButton from "../hooks/useBackButton";
import { Table, Form, Col, InputGroup, Row, Pagination, Modal, Button } from "react-bootstrap";
const KitchenListView = () => {
  const [kitchenData, setKitchenData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const goBack = useBackButton();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [statusOptions, setStatusOptions] = useState(['Pending', 'Preparing', 'Completed']);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [allKitchenData, setAllKitchenData] = useState([]); // Store ALL data
  // const [filteredData, setFilteredData] = useState([]);
  // const [loading, setLoading] = useState(true);


  const navigate = useNavigate();
  
  const handleViewProduct = async (orderID) => {
    if (!orderID) {
      console.error("KitchenOrdersOrderID is undefined");
      alert("Invalid Order ID");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/kitchenlistview?search=${orderID}`);

      if (response.data.status === "success" && response.data.kitchenview.length > 0) {
        const orderData = response.data.kitchenview[0];
        if (orderData) {
          const autoID = orderData.KitchenOrdersAutoID;
          if (autoID) {
            console.log("Order ID:", autoID);
            navigate('/print-kitchen-bill', {
              state: { KitchenOrdersAutoID: autoID, orderData },
            });
          } else {
            console.error("KitchenOrdersAutoID not found in response");
            alert("Order ID not found.");
          }
        } else {
          console.error("Order data not found.");
          alert("Order data not found.");
        }
      } else {
        console.error("Order details not found:", response.data);
        alert("Order details not found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An error occurred while fetching the data.");
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    const fetchKitchenData = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/api/kitchenlistview`); // No search term initially
            if (response.data.status === "success" && response.data.kitchenview) {
                setAllKitchenData(response.data.kitchenview); // Set ALL data
                setFilteredData(response.data.kitchenview);

          const initialStatuses = {};
          response.data.kitchenview.forEach(item => {
            initialStatuses[item.KitchenOrdersAutoID] = item.KitchenOrdersStatus;
          });
          setSelectedStatuses(initialStatuses);

        } else {
          console.error("Invalid API response:", response.data);
          setAllKitchenData([]);
          setFilteredData([]);
      }
  } catch (err) {
      console.error("Error fetching data:", err);
      setAllKitchenData([]);
      setFilteredData([]);
  } finally {
      setLoading(false);
  }
};

fetchKitchenData(); // Fetch data ONCE on mount
}, []); 

const handleSearchChange = (e) => {
  const searchValue = e.target.value.toLowerCase();
  setSearchTerm(searchValue); // Keep searchTerm in state for the input

  const filtered = allKitchenData.filter(item => { // Filter against ALL data
      const tokenNo = String(item.KitchenOrdersTokenNo || "").toLowerCase();
      return tokenNo.includes(searchValue);
  });
  setFilteredData(filtered);
  setCurrentPage(1);
};

const handleStatusChange = async (kitchenOrdersAutoID, newStatus) => {
  // Optimistic update (update UI immediately)
  setAllKitchenData(prevData =>
      prevData.map(item =>
          item.KitchenOrdersAutoID === kitchenOrdersAutoID
              ? { ...item, KitchenOrdersStatus: newStatus }
              : item
      )
  );
  setFilteredData(prevData =>
      prevData.map(item =>
          item.KitchenOrdersAutoID === kitchenOrdersAutoID
              ? { ...item, KitchenOrdersStatus: newStatus }
              : item
      )
  );
  setSelectedStatuses(prevStatuses => ({
      ...prevStatuses,
      [kitchenOrdersAutoID]: newStatus,
  }));


  try {
    const response = await axios.post(`${BASE_URL}/api/updateKitchenStatusByToken`, {
        token_no: kitchenOrdersAutoID,
        status: newStatus,
    });


 if (response.data.status === "success") {
                console.log("Status updated successfully:", response.data.message);
            } else {
        console.error("Error updating status:", response.data.message);
        alert(response.data.message || "Error updating status. Please try again.");
      }
    } catch (error) {
      console.error("Network error updating status:", error);
      alert("A network error occurred while updating status.");
    }
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div>

      <Row>
        <Col md={6}>
          <h3>Kitchen View </h3>
        </Col>
        <Col md={6} className="d-flex justify-content-end align-items-center">
          <button className="btn btn-sm btn-dark" onClick={goBack}>
            {" "}
            Back
          </button>
        </Col>
      </Row>



      <Row className="mb-2">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by Token No"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Kitchen Order Number</th>
                <th>Token No</th>
                <th>Order Table Number</th>
                <th>Status</th>
                <th>Update Status</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr><td colSpan="7" className="text-center">No data found</td></tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.KitchenOrdersAutoID}>
                    <td>{item.KitchenOrdersAutoID}</td>
                    <td>{item.KitchenOrdersTokenNo}</td>
                    <td>{item.KitchenOrdersTableNo || "-"}</td>

                    <td>
                      <span className={`badge ${getBadgeClass(item.KitchenOrdersStatus)}`}>
                        {item.KitchenOrdersStatus}
                      </span>
                    </td>
                    <td>
                      <Form.Select
                        value={selectedStatuses[item.KitchenOrdersAutoID]}
                        onChange={e => {
                          console.log("Changing status for ID:", item.KitchenOrdersAutoID, "to:", e.target.value);
                          handleStatusChange(item.KitchenOrdersAutoID, e.target.value);
                        }}
                        disabled={item.KitchenOrdersStatus === "Completed"}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>{item.KitchenOrdersTime}</td>
                    <td>
                      <FaEye
                        onClick={() => handleViewProduct(item.KitchenOrdersTokenNo)}
                        style={{ cursor: 'pointer' }}
                      />

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
        <div className="d-flex justify-content-end mt-3">
          <button
            className="btn btn-outline-secondary"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          {[...Array(Math.ceil(filteredData.length / itemsPerPage))].map((_, index) => (
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
            disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </Row>
    </div>
  );
};

export default KitchenListView;