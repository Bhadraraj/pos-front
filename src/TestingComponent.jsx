
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Button, Container, InputGroup, Row, Col } from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "./components/utils/config";

import { useAuth } from "./components/Auth/AuthContext";
import './styles/printBill.css';
const OrderForm = () => {
  const [formKey, setFormKey] = useState(0);
  const [productResults, setProductResults] = useState([]);
  const [productListVisible, setProductListVisible] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    userId: "",
    products: [
      {
        productid: "",
        quantity: 0,
        price: 0,
        unit: 0,
      },
    ],
  });

  const handleProductSearch = async (e, index) => {
    const { value } = e.target;
    const updatedProducts = [...formData.products];
    updatedProducts[index].searchTerm = value;

    setFormData((prevData) => ({
      ...prevData,
      products: updatedProducts,
    }));

    try {
      const response = await axios.post(`${BASE_URL}/api/stockproductssearch`, {
        search: value.trim().length > 0 ? value : "", // Send empty string to get all products
      });

      console.log("API Response:", response.data);

      if (response.data?.products?.length > 0) {
        setProductResults((prev) => {
          const newResults = Array.isArray(prev) ? [...prev] : [];
          newResults[index] = response.data.products;
          return newResults;
        });

        setProductListVisible((prev) => {
          const newVisibility = Array.isArray(prev) ? [...prev] : [];
          newVisibility[index] = true;
          return newVisibility;
        });
      } else {
        setProductResults((prev) => {
          const newResults = Array.isArray(prev) ? [...prev] : [];
          newResults[index] = [];
          return newResults;
        });

        setProductListVisible((prev) => {
          const newVisibility = Array.isArray(prev) ? [...prev] : [];
          newVisibility[index] = false;
          return newVisibility;
        });
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };



  const handleProductSelect = (product, index) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      productid: product.ProductID,
      price: product.ProdPrice,
      unit: product.ProdUnit,
      searchTerm: product.ProdName, // Show selected product name
    };

    setFormData((prevData) => ({
      ...prevData,
      products: updatedProducts,
    }));

    setProductListVisible((prev) => {
      const newVisibility = [...prev];
      newVisibility[index] = false;
      return newVisibility;
    });

    // Clear product search results after selection
    setProductResults((prev) => {
      const updatedResults = { ...prev };
      delete updatedResults[index];
      return updatedResults;
    });
  };


  const handleProductChange = (index, e) => {

  };
  const addProduct = () => {
    setFormData((prevData) => ({
      ...prevData,
      products: [
        ...prevData.products,
        {
          productid: "",
          quantity: 0,
          price: 0,
          unit: 0,

        },
      ],
    }));

    setProductListVisible([...productListVisible, false]);
  };
  const removeProduct = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    const updatedVisibility = productListVisible.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      products: updatedProducts,
    }));
    setProductListVisible(updatedVisibility);
  };

  const validateForm = () => {
    const newErrors = {};

    formData.products.forEach((product, index) => {
      if (!product.searchTerm) {
        newErrors[`productid-${index}`] = "Product is required";
      }
      if (product.quantity <= 0) {
        newErrors[`quantity-${index}`] = "Quantity must be greater than 0";
      }

    });



    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };





  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();



  };



  return (
    <>
      <Form onSubmit={handleSubmit} onKeyPress={handleKeyPress} key={formKey}>

        <Row className="my-3">
          <div className="col-md-6">
            <h5 className='mb-0'>Add Product </h5>
          </div>
        </Row>
        {
          formData.products.map((product, index) => (
            <>
              <Row key={index} className="mb-3">
                <Col md={3}>
                  <Form.Group controlId={`productid-${index}`}>
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="searchTerm"
                      value={product.searchTerm || ""}
                      onChange={(e) => handleProductSearch(e, index)}
                      onFocus={(e) => handleProductSearch(e, index)} // Fetch all products on focus
                      isInvalid={errors[`productid-${index}`]}
                      className="custom-select"
                    />

                    {productListVisible[index] && productResults[index] && productResults[index].length > 0 ? (
                      <div
                        style={{
                          maxHeight: "200px",
                          overflowY: "auto",
                          overflowX: "hidden",
                          border: "1px solid #ccc",
                          marginTop: "5px",
                          backgroundColor: "#fff",
                        }}
                      >
                        {productResults[index].map((productResult) => (
                          <div
                            key={productResult.ProductID}
                            style={{ padding: "8px", cursor: "pointer" }}
                            onClick={() => handleProductSelect(productResult, index)}
                          >
                            <div className="row px-3 d-flex justify-content-between">
                              <div className="col-8">
                                <p className="mb-0">
                                  {productResult.ProdName} <b>({productResult.ProdCode})</b>
                                </p>
                              </div>
                              <div className="col-4">
                                <img
                                  src={`${BASE_URL}${productResult.ProdImage}`}
                                  alt={productResult.ProdName}
                                  style={{
                                    height: "50px",
                                    borderRadius: "10px",
                                    width: "50px",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <></>
                    )}


                    <Form.Control.Feedback type="invalid">
                      {errors[`productid-${index}`]}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xl={1} md={3} sm={6}>
                  <Form.Group controlId={`quantity-${index}`}>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="text"
                      name="quantity"
                      value={product.quantity || ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (/^\d*$/.test(value)) {
                          handleProductChange(index, {
                            target: { name: "quantity", value },
                          });
                        }
                      }}
                      isInvalid={errors[`quantity-${index}`]}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors[`quantity-${index}`]}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col xl={2} md={4} sm={6}>
                  <Form.Group controlId={`price-${index}`}>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={product.price}
                      disabled
                      onChange={(e) => handleProductChange(index, e)}
                      isInvalid={errors[`price-${index}`]}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors[`price-${index}`]}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={2} sm={6}>
                  <Form.Group controlId={`unit-${index}`}>
                    <Form.Label>Unit</Form.Label>
                    <Form.Control
                      type="number"
                      name="unit"
                      value={product.unit}
                      disabled
                      onChange={(e) => handleProductChange(index, e)}
                    />
                  </Form.Group>
                </Col>
                <Col
                  xl={1}
                  className="d-flex justify-content-end align-items-end p-2" >
                  <Button
                    variant="danger"
                    onClick={() => removeProduct(index)}
                    size="sm"
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            </>
          ))
        }
        <Row>
          <Col className="text-end px-0">
            <Button
              variant="primary"
              onClick={addProduct}
              size="sm"
            >
              Add Product
            </Button>
          </Col>
        </Row>
      </Form >

    </>
  );
};

export default OrderForm;
