
import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, InputGroup, Row, Col } from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { MdEditSquare, MdDelete } from "react-icons/md";
import Scanner from "../../qrscan/Scanner";
import '../../styles/printBill.css';
import PrintBillOrder from "./PrintBillOrder";
import { Select, Space } from "antd";
import ApplyCoupon from "./ApplyCoupon";

const OrderForm = () => {
  const { userID } = useAuth();
  const printRef = useRef(null);
  const [orderPlaced, setOrderPlaced] = useState(false); // New state for order status

  // const [result, setResult] = useState("No result");
  const [debouncedCardNumber, setDebouncedCardNumber] = useState(""); // For debouncing


  const [orderDataDisplay, setOrderDataDisplay] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [tokenNo, setTokenNo] = useState(null);
  const [billNo, setBillNo] = useState(null);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [orderJson, setOrderJson] = useState(null);
  const [printBillDataresponseJson, setResponseJson] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [orderData, setOrderData] = useState(null);
  const [tables, setTables] = useState([]);
  const [productResults, setProductResults] = useState([]);
  const [productListVisible, setProductListVisible] = useState([]);
  const [errors, setErrors] = useState({});
  const [billType, setBillType] = useState('gst');
  // const [cardValidityMessage, setCardValidityMessage] = useState(null); // New state for card validity message
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
          setTables(response.data.result.tables); // Correctly setting the table data
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the table data!", error);
      });
  }, []);

  const tableOptions = tables.map((table) => ({
    value: table.TableID, // Map TableID as the value
    label: table.TableNumber, // Map TableNumber as the label
  }));
  // console.log("Table Options:", tableOptions);


  const [formData, setFormData] = useState({
    userId: "",
    products: [
      {
        productid: "",
        quantity: 0,
        price: 0,
        gst: 0,
        totalPrice: 0,
        totalPriceWithGST: 0, // Add this line!
        searchTerm: "",
        ProdParcelPrice: 0, // Add this line!
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
  const handleBillTypeChange = (event) => {
    const selectedValue = event.target.value;
    console.log("Selected Value:", selectedValue); // Debugging
    setBillType(selectedValue);
  };
  const handlepaymentMode = (event) => {

    const selectedValue = event.target.value;
    console.log("Selected Payment Mode :", selectedValue); // Debugging
    setPaymentMode(selectedValue);
  };
  useEffect(() => {
    console.log("Updated billType:", billType);
  }, [billType]);

  useEffect(() => {
    if (tokenNo && printRef.current) {
      handlePrintToken();
    }
  }, [tokenNo]);

  // This function is called by the Scanner component to set the result (card number)
  const setResult = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      cardNumber: data, // Set the card number to the scanned QR code
    }));
    setCheckButtonClicked(false);
    checkCardValidity(data);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.cardNumber !== debouncedCardNumber) return; // Check if input changed
      checkCardValidity(debouncedCardNumber); // Use debounced value
    }, 1000);

    return () => clearTimeout(timer);
  }, [debouncedCardNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (Array.isArray(e)) {
      console.log("Selected Tables:", e);
      setFormData((prevData) => ({
        ...prevData,
        OrderTableNo: e,
      }));
    } else {
      // const { name, value } = e.target;
      if (name === "parcelRegular") {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    if (name === "cardNumber") {
      setCardValidityMessage(null);
      setErrors(prevErrors => ({ ...prevErrors, cardNumber: '' }));
      setDebouncedCardNumber(value);  // Update debounced value!
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.cardNumber !== debouncedCardNumber) return; // Check if the input has changed
      checkCardValidity(debouncedCardNumber); // Call API with debounced value
    }, 500); // Debounce time (500ms)

    return () => clearTimeout(timer); // Clear timer if input changes
  }, [debouncedCardNumber]);

  const handleCheckButtonClick = () => {
    setCheckButtonClicked(true); // Set button as clicked
    checkCardValidity(formData.cardNumber);
  };

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
    if (!isValid) {
      return;
    }
    const orderTableNoString = Array.isArray(formData.OrderTableNo)
      ? formData.OrderTableNo.join(",")
      : "";
    const OverallTotal =
      billType === "gst"
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
        totalPriceWithGST: product.totalPriceWithGST, // Now this will have the correct value
        ProdParcelPrice: product.ProdParcelPrice,
      })),
      paymentMethod: formData.paymentMethod,
      mobileNumber: formData.mobileNumber,
      couponCode: couponCode,
      discount: discount,
      OverallTotal: OverallTotal,
      OverallTotalWithoutGst: calculateOverallTotalWithoutGst(),
      OverallTotalWithGst: calculateOverallTotal(),
      ProductTotal: calculateOverallTotal(),
      cardNumber: formData.cardNumber,
      OrderTableNo: orderTableNoString,
      payment_status:
        formData.paymentMethod == "Card" ? "NotPaid" : formData.payment_status,
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
    setRefreshKey((prevKey) => prevKey + 1);
    setOrderJson(orderData);
    console.log("Order Data ", orderData); // Use template literal for logging

    try {
      const response = await axios.post(`${BASE_URL}/api/placeorder`, orderData);
      console.log("Full response:", response.data);

      if (response.data && response.data.status === "success") {
        setOrderPlaced(true);
        setRefreshKey((prevKey) => prevKey + 1);

        const billNo = response.data.result?.order_id || "Unknown Order ID"; // Prioritize billrefno, fallback to billno
        // const billNo = response.data.result?.billrefno || response.data.result?.billno || "Unknown Bill ID"; // Prioritize billrefno, fallback to billno
        const sequentialNumber = response.data.result?.sequential_number || "Unknown Sequential Number";
        setTokenNo(response.data.result?.sequential_number || 'N/A');
        const paymentMethod = response.data.result?.paymentMethod; // Get payment method
        setBillNo(billNo);
        let alertMessage = `Order placed successfully! \n Token Number: ${sequentialNumber}`;
        // let alertMessage = `Order placed successfully! Bill No: ${billNo}\n Token Number: ${sequentialNumber}`;
        if (paymentMethod !== "Card") { // Simplified conditional for non-cash
          fetchOrderData(billNo);
          alertMessage = `Order placed successfully! Bill No: ${billNo}\n Token Number: ${sequentialNumber}`;
        }
        alert(alertMessage)
        // handlePrintToken(sequentialNumber);

        setDiscount(0);
        setCouponCode("");
        setFormData({
          userId: "",
          products: [
            { productid: "", quantity: 0, price: 0, gst: 0, totalPrice: 0, searchTerm: "" },
          ],
          paymentMethod: "Cash", // Default payment method
          mobileNumber: "",
          cardNumber: "",
          OrderTableNo: [],
          payment_status: "Paid",
          gst: 0,
          parcelRegular: "Dine-in",
          gstPercentage: null,
        });

      } else if (response.data && response.data.message) { // Check if message is available
        alert(response.data.message);
      } else {
        alert("Order placement failed. Please try again.");
      }


    } catch (error) {
      console.error("Error submitting order:", error);
      alert("An error occurred while submitting the order. Please try again.");
    }
  };

  const currentDateTime = new Date();
  const formattedDateTime = `${currentDateTime.toLocaleDateString()} - ${currentDateTime.toLocaleTimeString()}`;


  const handlePrintToken = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;

      const printWindow = window.open('', '_blank');

      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
                <html>
                <head>
                    <title>Print Bill</title>
                    <style>
                        @media print {
                            body {
                                margin: 0;
                                padding: 0;
                                text-align: center;
                                font-family: Arial, sans-serif;
                                font-size: 12px;
                            }
                            #bill-content {  
                                width: 80mm;
                                box-sizing: border-box;
                            }
                         
                        }
                    </style>
                </head>
                <body>
                    <div id="bill-content">${printContents}</div>  
                </body>
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
        formData.cardNumber = '' // Clear input field if the card is invalid
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
      <div>
        <h3>API Response:</h3>
        <pre>{printBillDataresponseJson ? JSON.stringify(printBillDataresponseJson, null, 2) : 'Loading...'}</pre>
      </div>
      <div>
        <h3>API Response:</h3>
        <pre>{orderJson ? JSON.stringify(orderJson, null, 2) : 'Loading...'}</pre>
      </div>
      {/* <div>
        <h3>Order Data:</h3>
        <pre>{JSON.stringify(orderDataDisplay, null, 2)}</pre>
      </div> */}

      <div className="mb-3 row" key={refreshKey}>
        <div className="col-md-6">
          <h2>Order Form</h2>
        </div>
        <div className="col-lg-6 d-flex justify-content-end">
          {/* <Link to='/search-bill'>  <button className=' btn-sm btn btn-secondary me-3'> Search Bill </button></Link> */}
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
        </div>
      </div>

      <Form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
        <Row>
          <Col md={6} lg={3}>
            <Form.Group controlId="paymentMethod">
              <Form.Label>Payment Method</Form.Label>
              <Form.Control
                as="select"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="custom-select"
              >   <option value="" disabled>
                  Select Payment Method
                </option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
              </Form.Control>
            </Form.Group>
          </Col>
          {formData.paymentMethod === "Card" && (
            // {result}
            // <Scanner setResult={setResult} />

            <Col md={6} lg={3}>

              {/* <Form.Group controlId="cardNumber">
                <Form.Label>Card Number</Form.Label>
                <InputGroup className="mb-3">

                  <Form.Control
                    type="text"
                    name="cardNumber"
                    id="cardNumberIp"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    isInvalid={!!errors.cardNumber} style={{ border: 'none !important', outline: 'none', }}
                  />
                  <InputGroup.Text id="basic-addon2" className="  btn btn-primary">
                    <Scanner setResult={setResult} />
                  </InputGroup.Text>


                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.cardNumber}
                </Form.Control.Feedback>
              </Form.Group> */}
              <Form.Group controlId="cardNumber" className="mb-3">
                <Form.Label>Card Number</Form.Label>
                <InputGroup >
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    id="cardNumberIp"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    isInvalid={!!errors.cardNumber}
                    style={{ border: 'none !important', outline: 'none' }}
                  />
                  <InputGroup.Text id="basic-addon2" className="btn btn-primary">
                    <Scanner setResult={setResult} />
                  </InputGroup.Text>
                  {/* <Button color="primary" onClick={handleCheckButtonClick} className='ms-2'>Check</Button> Check Button */}
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.cardNumber}
                </Form.Control.Feedback>
                {cardValidityMessage && (
                  <span className={errors.cardNumber ? "text-danger" : "text-success"}>
                    {cardValidityMessage}
                  </span>
                )}
              </Form.Group>
            </Col>
          )}
          {formData.paymentMethod === "Card" && (
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

          {/* {formData.paymentMethod === 'Card' && ( */}
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

          {/* )} */}
          {formData.paymentMethod === "Card" && (
            <Col md={6} lg={3}>
              <Form.Group controlId="tableSelect">
                <Form.Label>Select Tables</Form.Label>
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    value={formData.TableID}
                    onChange={handleChange}
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
        {/* <Row>
          <Col>
            <hr />{" "}
          </Col>
        </Row> */}
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
                                  <b>({productResult.ProdCode})</b>
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

                {/* {billType === "gst" && formData.paymentMethod === "Cash" ? (
                  <Col md={2} sm={6}>
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
                ) : (
                  <></>
                )}

                {billType === "gst" && formData.paymentMethod === "Cash" ? (
                  <Col md={2} className="mb-2">
                    <Form.Group controlId={`totalPriceWidGST-${index}`}>
                      <Form.Label>Total (GST)</Form.Label>
                      <Form.Control
                        type="text"
                        name="totalPriceWidGST"
                        value={product.totalPriceWidGST }
                        disabled
                      />
                    </Form.Group>
                  </Col>
                ) : (
                  <></>
                )} */}
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
              {/* <div className="row">
                <div className="col-12">
                  <hr style={{ border: "0.5px solid #c8c8c8" }} />
                </div>
              </div> */}
            </>
          ))
        }

        <Row>
          <Col className="text-end px-0">
            <Button
              variant="primary"
              onClick={addProduct}
              // className="mt-3"
              size="sm"
            >
              Add Product
            </Button>
          </Col>
        </Row>

        <Row className="my-3">
          {formData.paymentMethod === "Cash" && (
            <Col md={4} className="mb-3">
              <Form.Group controlId="billType">
                <Form.Control
                  as="select"
                  name="billType"
                  onChange={handleBillTypeChange}
                  value={billType} // Bind the value to the state
                  className="custom-select"
                  placeholder="Select Bill Type"
                >
                  <option value="" disabled>
                    Select Bill Type
                  </option>
                  <option value="estimation">Estimation Bill</option>
                  <option value="gst">GST Bill</option>
                </Form.Control>
              </Form.Group>
            </Col>
          )}
          {formData.paymentMethod === "Cash" && (
            <Col md={4} className="mb-3">
              <Form.Group controlId="paymentMode">
                <Form.Control
                  as="select"
                  name="paymentMode"
                  onChange={handlepaymentMode}
                  value={paymentMode}
                  className="custom-select"
                  placeholder="Select Payment Mode"
                >
                  <option value="" disabled selected>
                    Select Payment Mode
                  </option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                </Form.Control>
              </Form.Group>
            </Col>
          )}
          {billType == "estimation" && formData.paymentMethod === "Cash" && (
            <Col md={3}>
              <ApplyCoupon
                setDiscount={setDiscount}
                setCouponCodeInOrder={setCouponCode}
                overallTotal={overallTotalForCoupon}
                couponCodeProp={couponCode}
                refreshKey={refreshKey}
              />
            </Col>
          )}

        </Row>
        {
          billType === "estimation" && formData.paymentMethod === "Cash" ? (
            <Row className="  d-flex justify-content-end">
              <Col md={6}>
                <table className="table table-borderless text-end">
                  <tbody>
                    <tr>
                      <td className="py-2">
                        <b>Discount </b>
                      </td>
                      <td className="py-2">{discount}</td>
                    </tr>
                    <tr>
                      <td className="py-2">
                        <b>Total : </b>
                      </td>
                      <td className="py-2">
                        ₹
                        {calculateOverallTotalWithoutGst() === 0
                          ? "0.00"
                          : calculateOverallTotalWithoutGst().toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          ) : formData.paymentMethod === "Cash" ? (
            <Row className="mt-3 d-flex justify-content-end">
              <Col md={6}>
                <table className="table table-borderless text-end">
                  <tbody>
                    <tr>
                      <td className="py-2">
                        <b>SGST : </b>
                      </td>
                      <td className="py-2">
                        ₹
                        {calculateTotalGST() === 0
                          ? "0.00"
                          : (calculateTotalGST() / 2).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">
                        <b>CGST : </b>
                      </td>
                      <td className="py-2">
                        ₹
                        {calculateTotalGST() === 0
                          ? "0.00"
                          : (calculateTotalGST() / 2).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">
                        <b>Grand Total :</b>
                      </td>
                      <td className="py-2">
                        ₹{calculateOverallTotal().toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          ) : null
        }

        <Row className="d-flex align-items-end">
          <Col md={5} className="d-flex align-items-end justify-content-start">
            <Button
              variant="success"
              type="submit" disabled={orderPlaced}
              className="mt-3"
              style={{ width: "50%" }}
            >
              {orderPlaced ? "Order Placed" : "Submit Order"}
            </Button>




          </Col>
        </Row>

        {/* <div
          id="bill-content"
          ref={printRef}

        >

          <div id="bill-content" ref={printRef}>
            <p>  <b> MG FOOD COURT </b> <br />  {formattedDateTime} <br />
              <b>   Token No</b>  <br />
              <h2 >{tokenNo}</h2>
            </p>
          </div>
        </div> */}

        <div className="row">
          <div className="col-12 d-flex justify-content-center mb-4">

            <div>
              {/* <div ref={printRef}>  
                <div id="bill-content" className='text-center'> 
                  <p > <b style={{ marginBottom: '10px' }}>MG FOOD COURT</b> <br /> {formattedDateTime} <br />
                    <b>Token No</b> <br />
                    <h2>{tokenNo}</h2>
                  </p>
                </div>
              </div> */}
              <div className='mt-5'>
                <div ref={printRef}>
                  {tokenNo && (
                    <div id="bill-content" className="text-center">
                      <p>
                        <b style={{ marginBottom: '10px' }}>MG FOOD COURT</b> <br />
                        {formattedDateTime} <br />
                        <b>Token No</b> <br />
                        <h2>{tokenNo}</h2>
                      </p>
                    </div>
                  )}
                </div>
              </div>


              {formData.paymentMethod === "Cash" && orderData && (
                <PrintBillOrder orderData={orderData} />
              )}</div>
          </div>
        </div>



      </Form >
    </>
  );
};

export default OrderForm;
