import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import PurchaseDate from "./PurchaceDate";
import { Col, Row } from "react-bootstrap";
import axios from "axios";

const BASE_URL = "https://devpos.ideauxbill.in/api/stockproductssearch";

const StockInForm = ({ setPendingActions }) => {
  const [formData, setFormData] = useState({
    supplierName: "",
    companyName: "",
    purchaseNumber: "",
    gstIn: "",
    mobileNumber: "",
    purchaseInvoiceNumber: "",
    email: "",
    address: "",
    purchaseDate: "",
    productDetails: [
      {
        productName: "",
        purchaseRate: "",
        quantity: "",
        unit: "pieces",
      },
    ],
  });

  const [isSupplier, setIsSupplier] = useState(true);

  // Automatically set today's date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, purchaseDate: today }));
  }, []);

  useEffect(() => {}, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add a new row for product details

  const AddRow = () => {
    setFormData((prev) => ({
      ...prev,
      productDetails: [
        ...(prev.productDetails || []), // Ensures it's always an array
        {
          productName: "",
          purchaseRate: 0,
          quantity: 0,
          unit: "pieces",
        },
      ],
    }));
  };

  // ✅ Delete a product row
  const DeleteRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      productDetails: prev.productDetails.filter((_, i) => i !== index),
    }));
  };

  // ✅ Handle product input change dynamically
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...formData.productDetails];
    updatedProducts[index][name] = value;
    setFormData((prev) => ({ ...prev, productDetails: updatedProducts }));
  };

  const handleAddPendingAction = () => {
    if (
      (isSupplier ? formData.supplierName : formData.companyName) &&
      formData.purchaseNumber &&
      formData.gstIn &&
      formData.mobileNumber &&
      formData.purchaseInvoiceNumber &&
      formData.email &&
      formData.address &&
    //   formData.purchaseDate &&
      formData.productDetails.length > 0
    ) {
      setPendingActions((prev) => [
        ...prev,
        {
          id: new Date().getTime(),
          ...formData,
        },
      ]);

      // Reset form
      setFormData({
        supplierName: "",
        companyName: "",
        purchaseNumber: "",
        gstIn: "",
        mobileNumber: "",
        purchaseInvoiceNumber: "",
        email: "",
        address: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        productDetails: [],
      });
    } else {
      alert("Please fill all mandatory fields!");
    }
  };

  return (
    <div className="   mt-4">
      <h1 className="text-center">Stock In Form</h1>

      {/* Toggle Button */}
      <div className="d-flex justify-content-center mb-3">
        <button
          className={`btn ${isSupplier ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setIsSupplier(true)}
        >
          Supplier
        </button>
        <button
          className={`btn ${
            !isSupplier ? "btn-primary" : "btn-secondary"
          } ms-2`}
          onClick={() => setIsSupplier(false)}
        >
          Company
        </button>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">
            {isSupplier ? "Supplier Name" : "Company Name"}
          </label>
          <input
            type="text"
            name={isSupplier ? "supplierName" : "companyName"}
            placeholder={
              isSupplier ? "Enter Supplier Name" : "Enter Company Name"
            }
            value={isSupplier ? formData.supplierName : formData.companyName}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Purchase Number</label>
          <input
            type="text"
            name="purchaseNumber"
            placeholder="Enter Purchase Number"
            value={formData.purchaseNumber}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
              setFormData((prev) => ({ ...prev, purchaseNumber: onlyNumbers }));
            }}
            className="form-control"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">GST IN</label>
          <input
            type="number"
            name="gstIn"
            placeholder="Enter GST (%)"
            value={formData.gstIn}
            onChange={(e) => {
              let value = e.target.value;
              if (value > 100) value = 100; // Limit max to 100
              if (value < 0) value = 0; // Limit min to 0
              setFormData((prev) => ({ ...prev, gstIn: value }));
            }}
            min="0"
            max="100"
            step="0.01" // Allows decimal values like 5.5%
            className="form-control"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            placeholder="Enter Mobile Number"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Purchase Invoice Number</label>
          <input
            type="text"
            name="purchaseInvoiceNumber"
            placeholder="Enter Purchase Invoice Number"
            value={formData.purchaseInvoiceNumber}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Email ID</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email ID"
            value={formData.email}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            placeholder="Enter Address"
            value={formData.address}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
{/* 
        <div className="col-md-6 mb-3">
          <PurchaseDate currentDate={formData.purchaseDate} />
        </div> */}
      </div>

      {/* Product Details Section */}
      <h2 className="text-center mt-4 ">Product Details</h2>

      {formData.productDetails.map((product, index) => (
        <div className="row d-flex" key={index}>
          <div className="col-md-2 mb-3">
            <label className="form-label">Product {index + 1}</label>
            <input
              type="text"
              name="productName"
              placeholder="Enter Product Name"
              value={product.productName}
              onChange={(e) => handleProductChange(index, e)}
              className="form-control"
            />
          </div>

          <div className="col-md-2 mb-3">
            <label className="form-label">Purchase Rate</label>
            <input
              type="number"
              name="purchaseRate"
              placeholder="Enter Purchase Rate"
              value={product.purchaseRate}
              onChange={(e) => handleProductChange(index, e)}
              className="form-control"
            />
          </div>

          <div className="col-md-2 mb-2">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              name="quantity"
              placeholder="Enter Quantity"
              value={product.quantity}
              onChange={(e) => handleProductChange(index, e)}
              className="form-control"
            />
          </div>

          <div className="col-md-2 mb-2 ">
            <label className="form-label">Unit</label>
            <select
              name="unit"
              value={product.unit}
              onChange={(e) => handleProductChange(index, e)}
              className="form-select"
            >
              <option value="pieces">Pieces</option>
              <option value="kg">Kg</option>
              <option value="litre">Litre</option>
            </select>
          </div>

          <div className="col-md-3 mb-3 d-flex align-items-end  ">
            <button
              className="btn btn-danger btn-sm"
              onClick={() => DeleteRow(index)}
            >
              ❌ Delete
            </button>
          </div>
        </div>
      ))}

      <Row>
        <Col>
          <button className="btn btn-primary" onClick={AddRow}>
            ➕ Add Product
          </button>
        </Col>
      </Row>

      <div className="text-center mt-4">
        <Row className="text-center">
          <Col>
            <button
              onClick={() => {
                alert("Stock In has been added!");
                handleAddPendingAction();
              }}
              className="btn btn-success"
            >
              ✅ Add Stock In
            </button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StockInForm;