
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Button, Container, InputGroup, Row, Col } from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import '../../styles/printBill.css';
import { Select, Space } from "antd";

const OrderForm = () => {
  const { userID } = useAuth();
  const printRef = useRef(null);
  const [hasPrinted, setHasPrinted] = useState(false); // Add a flag
  // const [result, setResult] = useState("No result");
  const [debouncedCardNumber, setDebouncedCardNumber] = useState(""); // For debouncing
  const [formKey, setFormKey] = useState(0); // Key to force re-render of the form
  const [orderDataDisplay, setOrderDataDisplay] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [tokenNo, setTokenNo] = useState(null);
  const [billNo, setBillNo] = useState(null);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [orderJson, setOrderJson] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [orderData, setOrderData] = useState(null);
  const [tables, setTables] = useState([]);
  const [productResults, setProductResults] = useState([]);
  const [productListVisible, setProductListVisible] = useState([]);
  const [errors, setErrors] = useState({});
  const [billType, setBillType] = useState('gst');
  const [cardValidityMessage, setCardValidityMessage] = useState(null);
  const [checkButtonClicked, setCheckButtonClicked] = useState(false); // Track button click

  useEffect(() => {
    if (userID) {
    }
  }, [userID]);

  useEffect(() => {
    axios
      .post(`${BASE_URL}/api/tablelist`)
      .then((response) => {
        console.log("API Response:", response.data);
        if (
          response.data.status.toLowerCase() === "success" &&
          Array.isArray(response.data.result.tables)
        ) {
          setTables(response.data.result.tables);
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the table data!", error);
      });
  }, []);

  const tableOptions = tables.map((table) => ({
    value: table.TableID,
    label: table.TableNumber,
  }));

  const [formData, setFormData] = useState({
    userId: "",
    products: [
      {
        productid: "",
        quantity: 0,
        price: 0,
        gst: 0,
        totalPrice: 0,
        totalPriceWithGST: 0,
        searchTerm: "",
        ProdParcelPrice: 0,
      },
    ],
    paymentMethod: "",
    mobileNumber: "",
    cardNumber: "",
    OrderTableNo: [],
    payment_status: "Paid",
    gst: 0,
    parcelRegular: "Takeout",
    gstPercentage: null,
  });

  useEffect(() => {
    console.log("Updated billType:", billType);
  }, [billType]);


  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.cardNumber !== debouncedCardNumber) return; // Check if input changed
      checkCardValidity(debouncedCardNumber); // Use debounced value
    }, 1000);

    return () => clearTimeout(timer);
  }, [debouncedCardNumber]);

  const handleChange = (e, selectedValues) => {
    const { name, value } = e.target;
    if (Array.isArray(e)) {
    
      setFormData((prevData) => ({
        ...prevData,
        OrderTableNo: selectedValues,
      }));
    } else {
      
      if (name === "parcelRegular") {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }

      setFormData((prevData) => ({
        ...prevData,
        OrderTableNo: selectedValues, 
      }));


      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
 
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.cardNumber !== debouncedCardNumber) return;
      checkCardValidity(debouncedCardNumber);
    }, 500); // Debounce time (500ms)

    return () => clearTimeout(timer);
  }, [debouncedCardNumber]);

  const handleProductSearch = async (e, index) => {
    const { value } = e.target;
    const updatedProducts = [...formData.products];

    updatedProducts[index].searchTerm = value;
    setFormData((prevData) => ({
      ...prevData,
      products: updatedProducts,
    }));

    if (value.trim().length > 0) {
      try {
        const response = await axios.post(`${BASE_URL}/api/products`, {
          search: value,
          userid: userID,
        });

        if (
          response.data &&
          response.data.result &&
          Array.isArray(response.data.result.products)
        ) {
          setProductResults(response.data.result.products);
        }
        setProductListVisible((prev) => {
          const newVisibility = [...prev];
          newVisibility[index] = true;
          return newVisibility;
        });
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    } else {
      setProductResults([]);
      setProductListVisible((prev) => {
        const newVisibility = [...prev];
        newVisibility[index] = false;
        return newVisibility;
      });
    }
  };

  const handleProductSelect = (product, index) => {
    const updatedProducts = [...formData.products];
    const selectedPrice =
      formData.parcelRegular === "Takeout"
        ? product.ProdParcelPrice
        : product.ProdPrice;

    updatedProducts[index] = {
      ...updatedProducts[index],
      productid: product.ProductID,
      price: selectedPrice,
      ProdParcelPrice: product.ProdParcelPrice, 
      gst: product.taxtinfo.TaxIGSTValue,
      searchTerm: product.ProdName,
    };

    updatedProducts[index].totalPrice =
      updatedProducts[index].quantity * updatedProducts[index].price;
    const gst = updatedProducts[index].gst || 0;
    const gstAmount = (updatedProducts[index].totalPrice * gst) / 100;
    updatedProducts[index].totalPriceWithGST = updatedProducts[index].totalPrice + gstAmount; // Correct calculation and assignment
    setFormData({ ...formData, products: updatedProducts });
    setProductListVisible((prev) => {
      const newVisibility = [...prev];
      newVisibility[index] = false;
      return newVisibility;
    });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...formData.products];

    const updatedValue = name === "quantity" ? Math.max(0, parseFloat(value)) : parseFloat(value);
    updatedProducts[index] = {
      ...updatedProducts[index],
      [name]: updatedValue || 0,
    };

    if (name === "quantity" || name === "price") {
      const quantity = updatedProducts[index].quantity || 0;
      const price = updatedProducts[index].price || 0;

      updatedProducts[index].totalPrice = quantity * price;

      const gst = updatedProducts[index].gst || 0;
      const gstAmount = (updatedProducts[index].totalPrice * gst) / 100;
      updatedProducts[index].totalPriceWithGST = updatedProducts[index].totalPrice + gstAmount; // Correct calculation and assignment
    }

    setFormData({ ...formData, products: updatedProducts });
  };

  const handleTableChange = (selectedValues) => {
    console.log("Selected Tables:", selectedValues);
    setFormData((prevData) => ({
      ...prevData,
      OrderTableNo: selectedValues, // Store the selected table IDs
    }));
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
          totalPrice: 0,
          ProdParcelPrice: 0,
          searchTerm: "",
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

      if (product.gst < 0) {
        newErrors[`gst-${index}`] = "GST percentage cannot be negative";
      }
    });

    if (formData.paymentMethod === "Card") {
      if (!formData.cardNumber) {
        newErrors.cardNumber = "Card Number is required";
      }
    }

    if (formData.paymentMethod === "Card") { // Add this check
      if (!formData.mobileNumber) {
        newErrors.mobileNumber = "Mobile Number is required";
      } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
        newErrors.mobileNumber = "Mobile Number must be 10 digits";
      }
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateOverallTotal = () => {
    const productTotals = formData.products.map((product) =>
      calculateProductTotal(product)
    );
    const overallTotal = productTotals.reduce((sum, total) => sum + total, 0);
    return overallTotal;
  };

  const calculateProductTotal = (product) => {
    const price = parseFloat(product.price) || 0;
    const quantity = parseInt(product.quantity) || 0;
    const gst = parseFloat(product.gst) || 0;
    const productTotal = price * quantity;
    const productGst = (productTotal * gst) / 100;

    return productTotal + productGst;
  };

  const calculateProductTotalWithoutGst = (product) => {
    const price = parseFloat(product.price) || 0;
    const quantity = parseInt(product.quantity) || 0;
    const productTotal = price * quantity;

    return productTotal;
  };

  const calculateOverallTotalWithoutGst = () => {
    const productTotals = formData.products.map((product) =>
      calculateProductTotalWithoutGst(product)
    );
    const overallTotal = productTotals.reduce((sum, total) => sum + total, 0);
    const result = overallTotal - (discount || 0);
    return isNaN(result) ? 0 : result;
  };

  const calculateOverallTotalWithoutDiscount = () => {
    const productTotals = formData.products.map((product) =>
      calculateProductTotalWithoutGst(product)
    );
    const overallTotal = productTotals.reduce((sum, total) => sum + total, 0);

    return overallTotal;
  };
  const overallTotalForCoupon = calculateOverallTotalWithoutDiscount();

  const calculateTotalGST = () => {
    const totalGST = formData.products.reduce((sum, product) => {
      const price = parseFloat(product.price) || 0;
      const quantity = parseInt(product.quantity) || 0;
      const gst = parseFloat(product.gst) || 0;
      const productTotal = price * quantity;
      const productGst = (productTotal * gst) / 100;
      return sum + productGst;
    }, 0.0);
    return totalGST;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    // Reset token before each submit
    setTokenNo("");

    const orderTableNoString = Array.isArray(formData.OrderTableNo)
      ? formData.OrderTableNo.join(",")
      : "";

    const OverallTotal = billType === "gst"
      ? calculateOverallTotal()
      : calculateOverallTotalWithoutGst();

    const orderData = {
      userId: userID,
      products: formData.products.map((product) => ({
        productid: product.productid,
        quantity: product.quantity,
        price: product.price,
        totalPrice: product.totalPrice,
        gst: product.gst,
        totalPriceWithGST: product.totalPriceWithGST,
        ProdParcelPrice: product.ProdParcelPrice,
      })),
      paymentMethod: 'Restaurant',
      mobileNumber: formData.mobileNumber,
      couponCode: couponCode,
      discount: discount,
      OverallTotal: OverallTotal,
      OverallTotalWithoutGst: calculateOverallTotalWithoutGst(),
      OverallTotalWithGst: calculateOverallTotal(),
      ProductTotal: calculateOverallTotal(),
      cardNumber: formData.cardNumber,
      OrderTableNo: orderTableNoString,
      payment_status: "NotPaid",
      gst: calculateTotalGST() || 0,
      sgst: calculateTotalGST() / 2 || 0,
      cgst: calculateTotalGST() / 2 || 0,
      gstPercentage: formData.gstPercentage || null,
      billType: billType,
      paymentMode: paymentMode,
      tokenNo: tokenNo,
      parcelRegular: formData.parcelRegular,
    };

    setOrderDataDisplay(orderData);
    setRefreshKey(prevKey => prevKey + 1);
    setOrderJson(orderData);

    try {
      const response = await axios.post(`${BASE_URL}/api/placeorderrestaurant`, orderData);
      console.log("Full response:", response.data);

      if (response.data?.status === "success") {
        const { result } = response.data;

        const billNo = result?.order_id || "Unknown Order ID";
        const sequentialNumber = result?.sequential_number || "Unknown Sequential Number";
        const paymentMethod = 'Restaurant';
        setTokenNo(sequentialNumber);
        setBillNo(billNo);
        setHasPrinted(false)
        if (paymentMethod !== "Card") {
          fetchOrderData(billNo);
        }

        // Show success message
        alert(`Order placed successfully..!`);

        // Refresh the form
        setRefreshKey(prevKey => prevKey + 1);
        setFormKey(prevKey => prevKey + 1);
        setDiscount(0);
        setCouponCode("");
        checkCardValidity()
        setFormData({
          userId: "",
          products: [{ productid: "", quantity: 0, price: 0, gst: 0, totalPrice: 0, searchTerm: "" }],
          paymentMethod: "Restaurant",
          mobileNumber: "",
          cardNumber: "",
          OrderTableNo: [],
          payment_status: "Paid",
          gst: 0,
          parcelRegular: "Dine-in",
          gstPercentage: null,
        });

      } else {
        alert(response.data?.message || "Order placement failed. Please try again.");
      }

    } catch (error) {
      console.error("Error submitting order:", error);
      alert("An error occurred while submitting the order. Please try again.");
    }
  }

  const currentDateTime = new Date();
  const formattedDateTime = `${currentDateTime.toLocaleDateString()} - ${currentDateTime.toLocaleTimeString()}`;

  const checkCardValidity = async (cardNumber) => {
    setCardValidityMessage(null);
    setErrors(prevErrors => ({ ...prevErrors, cardNumber: '' }));

    if (!cardNumber || cardNumber.trim() === "") {
      return; // Don't call API if cardNumber is empty
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/cardvaliditycheck`,
        { cardname: cardNumber }, // Send as form data
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data.status === 'success') {
        setCardValidityMessage(response.data.message);
      } else {
        setCardValidityMessage(response.data.message);
        setErrors(prevErrors => ({ ...prevErrors, cardNumber: response.data.message }));
        formData.cardNumber = ''
      }
    } catch (error) {
      console.error("Error checking card validity:", error);

      let displayMessage = "An error occurred. Please try again.";
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        displayMessage = error.response.data.message || `Server Error: ${error.response.status}`;
      } else if (error.request) {
        console.error("Request:", error.request);
        displayMessage = "No response received from the server.";
      } else {
        console.error("Error message:", error.message);
        displayMessage = `Request setup error: ${error.message}`;
      }

      setCardValidityMessage(displayMessage);
      setErrors(prevErrors => ({ ...prevErrors, cardNumber: displayMessage }));
      formData.cardNumber = '' // Clear input field if an error occurs
    }
  };



  const fetchOrderData = async (billId) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/ordersearch?billid=${billId}`
      );
      if (response.data.status === "success") {
        setOrderData(response.data.orders);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
      alert("An error occurred while fetching the order data.");
    }
  };
  return (
    <>
      {/* <div>
        <h3>API Response:</h3>
        <pre>{tables ? JSON.stringify(tables, null, 2) : 'Loading...'}</pre>
      </div> */}


      <Form onSubmit={handleSubmit} onKeyPress={handleKeyPress} key={formKey}>
        {/* <div>
          <h3>API Response:</h3>
          <pre>{printBillDataresponseJson ? JSON.stringify(printBillDataresponseJson, null, 2) : 'Loading...'}</pre>
        </div> */}
        {/* <div>
          <h3>API Response:</h3>
          <pre>{orderJson ? JSON.stringify(orderJson, null, 2) : 'Loading...'}</pre>
        </div> */}
        {/* <div>
        <h3>Order Data:</h3>
        <pre>{JSON.stringify(orderDataDisplay, null, 2)}</pre>
      </div> */}

        <div className="mb-3 row"  >
          <div className="col-md-6">
            <h2>Restaurant Order Form</h2>
          </div>
          {/* <div className="col-lg-6 d-flex justify-content-end">
            <Link to="/order-status">
              {" "}
              <button className=" btn-sm btn btn-secondary me-3">

                Orders
              </button>
            </Link>
            <Link to="/add-menus">
              <button className=" btn-sm btn btn-secondary me-3">
                Menu
              </button>
            </Link>
            <Link to="/payment-list-user">

              <button className=" btn-sm btn btn-secondary me-3">
                Payment List
              </button>
            </Link>
            <Link to="/kitchen-view">

              <button className=" btn-sm btn btn-secondary me-3">
                Kitchen
              </button>
            </Link>
          </div> */}
        </div>
        <Row>

          <Col md={6} lg={3}>
            <Form.Group controlId="parcelRegular">
              <Form.Label>Dine-in / Takeout</Form.Label>
              <Form.Control
                as="select"
                name="parcelRegular"
                value={formData.parcelRegular}
                onChange={handleChange}
                className="custom-select" isInvalid={errors.parcelRegular}>
                <option value="" disabled> Select</option>
                <option value="Dine-in">Dine-in</option>
                <option value="Takeout">Takeout</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.parcelRegular}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {(formData?.parcelRegular?.trim().toLowerCase() === "dine-in") && (
            <Col md={6} lg={3}>
              <Form.Group controlId="mobileNumber">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber || ""}
                  onChange={handleChange}
                  isInvalid={!!errors.mobileNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mobileNumber}
                </Form.Control.Feedback>


              </Form.Group>
            </Col>
          )}
          {(formData?.parcelRegular?.trim().toLowerCase() === "dine-in") && (

            <Col md={6} lg={3}>
              <Form.Group controlId="tableSelect">
                <Form.Label>Select Tables</Form.Label>
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    value={formData?.TableID}
                    onChange={handleTableChange}
                    options={tableOptions}
                  />
                </Space>
              </Form.Group>
            </Col>
          )}
        </Row >
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
                      isInvalid={errors[`productid-${index}`]}
                      className="custom-select"
                    />
                    {productListVisible[index] && productResults.length > 0 && (
                      <div
                        style={{
                          maxHeight: "200px",
                          overflowY: "auto",
                          overflowX: "hidden",
                          border: "1px solid #ccc",
                          marginTop: "5px",
                        }}
                      >
                        {productResults.map((productResult) => (
                          <div
                            key={productResult.ProductID}
                            style={{ padding: "8px", cursor: "pointer" }}
                            onClick={() =>
                              handleProductSelect(productResult, index)
                            }
                          >
                            <div className="row px-3 d-flex justify-content-between">
                              <div className="col-8">
                                <p className="mb-0">
                                  {" "}
                                  {productResult.ProdName}{" "}
                                  {/* <b>({productResult.ProdCode})</b> */}
                                  {/* <b> - {productResult.ProdBarCode} </b> */}
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
                  <Form.Group controlId={`totalPrice-${index}`}>
                    <Form.Label>Total Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="totalPrice"
                      value={product.totalPrice}
                      disabled
                      onChange={(e) => handleProductChange(index, e)}
                    />
                  </Form.Group>
                </Col>

                {billType === "gst" && formData.paymentMethod === "Cash" && (
                  // <Row className="mb-3"> {/* Ensure they are in the same row */}
                  <Col xl={1} md={3} sm={6}>
                    <Form.Group controlId={`gst-${index}`}>
                      <Form.Label>GST %</Form.Label>
                      <Form.Control
                        type="number"
                        name="gst"
                        value={product.gst}
                        onChange={(e) => handleProductChange(index, e)}
                        min="0"
                        isInvalid={errors[`gst-${index}`]}
                        disabled
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors[`gst-${index}`]}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                )}
                {billType === "gst" && formData.paymentMethod === "Cash" && product.productid && ( // Check productid
                  <Col md={2} className="mb-2">
                    <Form.Group controlId={`totalPriceWidGST-${index}`}>
                      <Form.Label>Total (GST)</Form.Label>
                      <Form.Control
                        type="text"
                        name="totalPriceWidGST"
                        value={product.totalPriceWithGST || 0} // Display 0 if not calculated yet
                        disabled
                      />
                    </Form.Group>
                  </Col>
                )}

                <Col
                  xl={1}
                  className="d-flex justify-content-end align-items-end p-2"
                >
                  <Button
                    variant="danger"
                    onClick={() => removeProduct(index)}
                    size="sm"
                  >
                    {/* <MdDelete /> */}
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


        <Row className="d-flex align-items-end">
          <Col md={5} className="d-flex align-items-end justify-content-start">
            <Button
              variant="success"
              type="submit"
              className="mt-3"
              style={{ width: "50%" }}
            >
              Submit Order
            </Button>
          </Col>
        </Row>

      </Form >

    </>
  );
};

export default OrderForm;
