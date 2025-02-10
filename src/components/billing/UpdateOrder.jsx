import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/config';
import { useAuth } from '../Auth/AuthContext';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useBackButton from '../hooks/useBackButton';


const UpdateOrder = () => {
  const { userID } = useAuth();
  const location = useLocation();
  const goBack = useBackButton()
  const navigate = useNavigate();
  const { billNo, orderId } = location.state || {};
  const [orders, setOrders] = useState([]);
  const [errors, setErrors] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [totalGst, setTotalGst] = useState(0);
  const [overallTotal, setOverallTotal] = useState(0);
  const [productResults, setProductResults] = useState([]);
  const [productListVisible, setProductListVisible] = useState([]);

  const [orderOverallTotal, setOrderOverallTotal] = useState(0);
  const [orderOverallTotalWithoutGst, setOrderOverallTotalWithoutGst] = useState(0);
  const [orderProductTotal, setOrderProductTotal] = useState(0);


  console.log(typeof (orderProductTotal))
  const fetchOrders = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/allorderlist`, { billno: billNo });
      console.log("API Response:", response.data); // Check the full response

      if (response.data.status === 'success') {
        const fetchedOrders = response.data.orders; // Correctly access orders

        if (fetchedOrders && fetchedOrders.length > 0) {
          setOrders(fetchedOrders);
          setOrderItems(fetchedOrders[0].items || []); // Set order items

          // Set order totals
          setOrderOverallTotal(parseFloat(fetchedOrders[0].OrderOverallTotal));
          setOrderOverallTotalWithoutGst(parseFloat(fetchedOrders[0].OrderOverallTotalWithoutGst));
          setOrderProductTotal(parseFloat(fetchedOrders[0].OrderProductTotal));
        } else {
          console.log("No orders found for this bill number.");
          setOrders([]);
          setOrderItems([]);
        }
      } else {
        console.error("API Error:", response.data.message);
        setOrders([]);
        setOrderItems([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setOrderItems([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  const handleProductSearch = async (e, index) => {
    const { value } = e.target;
    const updatedProducts = [...formData.products];
    updatedProducts[index].searchTerm = value;
    setFormData({ ...formData, products: updatedProducts });

    if (value.trim().length > 0) {
      try {
        const response = await axios.post(`${BASE_URL}/api/products`, { search: value, userid: userID });
        if (response.data && response.data.result && Array.isArray(response.data.result.products)) {
          setProductResults(response.data.result.products);
        }
        setProductListVisible(prev => {
          const newVisibility = [...prev];
          newVisibility[index] = true;
          return newVisibility;
        });
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    } else {
      setProductResults([]);
      setProductListVisible(prev => {
        const newVisibility = [...prev];
        newVisibility[index] = false;
        return newVisibility;
      });
    }
  };
  const [formData, setFormData] = useState({
    userId: '',
    products: [{ productid: '', quantity: 0, gst: 0, price: 0, totalPrice: 0, ProdParcelPrice: 0 }],
    mobileNumber: '',
    cardNumber: '',
    paymentMethod: '',
    orderId: orderId,
  });

  const calculateProductTotalWithoutGst = (product) => {
    const price = parseFloat(product.price) || 0;
    const quantity = parseInt(product.quantity) || 0;
    const productTotal = price * quantity;

    return productTotal;
  };

  const calculateOverallTotalWithoutGst = () => {
    const productTotals = formData.products.map((product) => calculateProductTotalWithoutGst(product));
    const overallTotal = productTotals.reduce((sum, total) => sum + total, 0);
    const result = overallTotal;
    return isNaN(result) ? 0 : result;
  };

  const calculateOverallTotal = () => {
    const productTotals = formData.products.map((product) => calculateProductTotal(product));
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
  const calculateTotalGST = () => {
    const totalGST = formData.products.reduce((sum, product) => {
      const price = parseFloat(product.price) || 0;
      const quantity = parseInt(product.quantity) || 0;
      const gst = parseFloat(product.gst) || 0;
      const productTotal = price * quantity;
      const productGst = (productTotal * gst) / 100;
      return sum + productGst;
    }, 0.00);
    return totalGST;
  };
  const handleSubmit = async () => {
    // Calculate new totals based on the form data
    const newOverallTotal = calculateOverallTotal();
    const newOverallTotalWithoutGst = calculateOverallTotalWithoutGst();
    const newProductTotal = calculateOverallTotal();

    // Add new totals to existing totals
    const updatedOverallTotal = orderOverallTotal + newOverallTotal;
    const updatedOverallTotalWithoutGst = orderOverallTotalWithoutGst + newOverallTotalWithoutGst;
    const updatedProductTotal = orderProductTotal + newProductTotal;

    // Convert the totals to numbers using parseFloat to ensure no string values are sent
    const updatedOverallTotalNumeric = parseFloat(updatedOverallTotal);
    const updatedOverallTotalWithoutGstNumeric = parseFloat(updatedOverallTotalWithoutGst);
    const updatedProductTotalNumeric = parseFloat(updatedProductTotal);

    // Prepare order data for submission
    const orderData = {
      userId: userID,
      products: formData.products.map((product) => ({
        productid: product.productid.toString(),
        quantity: product.quantity,
        price: product.price,
        gst: product.gst,
        totalPrice: product.totalPrice,
        totalPriceWithGST: product.totalPriceWithGST || 0,
      })),
      mobileNumber: formData.mobileNumber,
      OverallTotal: updatedOverallTotalNumeric,
      gst: calculateTotalGST(),
      sgst: calculateTotalGST() / 2 || 0,
      cgst: calculateTotalGST() / 2 || 0,
      OverallTotalWithoutGst: updatedOverallTotalWithoutGstNumeric,
      OverallTotalWithGst: updatedOverallTotalNumeric,
      ProductTotal: updatedProductTotalNumeric,
      orderId: formData.orderId,
    };

    try {
      const response = await axios.post(`${BASE_URL}/api/updateorder`, orderData);
      console.log('Order updated successfully:', response.data);
      alert(response.data.message);
      navigate('/add-menus');
    } catch (error) {
      alert(error.message);
    }
  };


  const handleProductSelect = (product, index) => {
    const updatedProducts = [...formData.products];
    const selectedPrice = formData.parcelRegular === "Parcel" ? product.ProdParcelPrice : product.ProdPrice;

    updatedProducts[index] = {
      ...updatedProducts[index],
      productid: product.ProductID,
      price: selectedPrice,
      ProdParcelPrice: product.ProdParcelPrice,
      gst: product.taxtinfo.TaxIGSTValue,
      searchTerm: product.ProdName
    };

    updatedProducts[index].totalPrice = updatedProducts[index].quantity * updatedProducts[index].price;

    setFormData({ ...formData, products: updatedProducts });
    setProductListVisible(prev => {
      const newVisibility = [...prev];
      newVisibility[index] = false;
      return newVisibility;
    });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...formData.products];
    const updatedValue = name === "quantity" ? Math.max(0, parseFloat(value)) : parseFloat(value);
    updatedProducts[index] = { ...updatedProducts[index], [name]: updatedValue || 0 };
    if (name === "quantity" || name === "price") {
      const quantity = updatedProducts[index].quantity || 0;
      const price = updatedProducts[index].price || 0;
      updatedProducts[index].totalPrice = quantity * price;

      const gst = updatedProducts[index].gst || 0;
      const gstAmount = (updatedProducts[index].totalPrice * gst) / 100;
      updatedProducts[index].totalPriceWidGST = updatedProducts[index].totalPrice + gstAmount;
    }

    setFormData({ ...formData, products: updatedProducts });
  };

  const addProduct = () => {
    setFormData(prevData => ({
      ...prevData,
      products: [...prevData.products, { productid: '', quantity: 0, price: 0, totalPrice: 0, ProdParcelPrice: 0, searchTerm: '' }]
    }));
    setProductListVisible([...productListVisible, false]);
  };

  const removeProduct = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    const updatedVisibility = productListVisible.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
    setProductListVisible(updatedVisibility);
  };

  return (
    <div>

      <Row className='mb-3'>

        <Col md={6}>
          <h3>Update Menus </h3>
          <p>Order Overall Total: {orderOverallTotal}</p>
          <p>Order Overall Total Without GST: {orderOverallTotalWithoutGst}</p>
          <p>Order Product Total: {orderProductTotal}</p>
        </Col>
        <Col md={6} className='d-flex justify-content-end align-items-center'>
          <button className='btn btn-sm btn-dark' onClick={goBack}> Back</button></Col>
      </Row>


      {orders.map((order, index) => (
        <div key={order.OrderID}>
          <div className="row">
            <div className="col-md-6">
              <p><b>Bill No:</b> {order.OrderRefNo}</p></div>
            <div className="col-md-6 text-end">
              <p><b>Date:</b> {order.OrderDate}</p></div>
          </div>

          <div>
            <Table bordered hover className='mt-3'>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {orderItems && orderItems.length > 0 ? (
                  orderItems.map((item, itemIndex) => (
                    <tr key={item.OrderItemID}> {/* Use OrderItemID as key */}
                      <td>{item.ProdName}</td>
                      <td>{item.OrderItemQty}</td>
                      <td>{item.OrderItemPrice}</td>
                      <td>{item.OrderItemSubtotal}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No items found for this order.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      ))}

      {formData.products.map((product, index) => (
        <Row key={index} className="mb-3">
          <Col md={4}>
            <Form.Group controlId={`productid-${index}`}>
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="searchTerm"
                value={product.searchTerm || ''}
                onChange={(e) => handleProductSearch(e, index)}
                isInvalid={errors[`productid-${index}`]}
              />
              {productListVisible[index] && productResults.length > 0 && (
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', marginTop: '5px' }}>
                  {productResults.map((productResult) => (
                    <div
                      key={productResult.ProductID}
                      style={{ padding: '8px', cursor: 'pointer' }}
                      onClick={() => handleProductSelect(productResult, index)}
                    >
                      <p>{productResult.ProdName} ({productResult.ProdCode})</p>
                      <img src={`${BASE_URL}${productResult.ProdImage}`} alt={productResult.ProdName} style={{ height: '50px', borderRadius: '10px', width: '50px' }} />
                    </div>
                  ))}
                </div>
              )}
              <Form.Control.Feedback type="invalid">
                {errors[`productid-${index}`]}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId={`quantity-${index}`}>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="text"
                name="quantity"
                value={product.quantity || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    handleProductChange(index, { target: { name: 'quantity', value } });
                  }
                }}
                isInvalid={errors[`quantity-${index}`]}
              />
              <Form.Control.Feedback type="invalid">
                {errors[`quantity-${index}`]}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col xl={3} md={4}>
            <Form.Group controlId={`price-${index}`}>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={product.price || ''}
                onChange={(e) => handleProductChange(index, e)}
                isInvalid={errors[`price-${index}`]} readOnly
              />
              <Form.Control.Feedback type="invalid">
                {errors[`price-${index}`]}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId={`totalPrice-${index}`}>
              <Form.Label>Total Price</Form.Label>
              <Form.Control
                type="number"
                name="totalPrice"
                value={product.totalPrice || ''}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col className='d-flex justify-content-end align-items-center'>
            <Button variant="danger" onClick={() => removeProduct(index)}>
              Remove
            </Button>
          </Col>
        </Row>
      ))}

      <div className="row">

        <div className="col-sm-6">
          <Button variant="success" onClick={handleSubmit}>Submit Order</Button>
        </div>

        <div className="col-sm-6 d-flex justify-content-end align-items-center">


          <Button onClick={addProduct}>Add Product</Button>

        </div>
      </div>
    </div>
  );
};

export default UpdateOrder;
