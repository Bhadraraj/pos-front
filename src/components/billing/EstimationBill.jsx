import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../utils/config'
import { Link } from 'react-router-dom';
const EstimationBill = () => {
    const [formData, setFormData] = useState({
        products: [{ productid: '', quantity: 0, price: 0, totalPrice: 0, searchTerm: '' }],
    });

    const [productResults, setProductResults] = useState([]);
    const [productListVisible, setProductListVisible] = useState([]);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleProductSearch = async (e, index) => {
        const { value } = e.target;
        const updatedProducts = [...formData.products];
        updatedProducts[index].searchTerm = value;
        setFormData((prevData) => ({
            ...prevData,
            products: updatedProducts
        }));

        if (value.trim().length > 0) {
            try {
                const response = await axios.post(`${BASE_URL}/api/allproductsearch`, { search: value });
                if (response.data && response.data.result && Array.isArray(response.data.result.products)) {
                    setProductResults(response.data.result.products);
                }
                setProductListVisible((prev) => {
                    const newVisibility = [...prev];
                    newVisibility[index] = true;
                    return newVisibility;
                });
            } catch (error) {
                console.error('Error fetching product data:', error);
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


    // const generatePDF = () => {
    //     const doc = new jsPDF();
    //     doc.text('Estimation Bill', 14, 16);
    //     doc.autoTable({
    //         head: [['Product Name', 'Quantity', 'Price', 'Total Price']],
    //         body: formData.products.map(product => [
    //             product.searchTerm,
    //             product.quantity,
    //             product.price,
    //             product.totalPrice.toFixed(2)
    //         ]),
    //         startY: 20,
    //     });
    //     doc.text(`Grand Total: ₹${calculateOverallTotal().toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    //     doc.save('Estimation_Bill.pdf');
    // };



    const handleProductSelect = (product, index) => {
        const updatedProducts = [...formData.products];
        updatedProducts[index] = {
            ...updatedProducts[index],
            productid: product.ProductID,
            price: product.ProdPrice,
            gst: product.ProdGst,
            searchTerm: product.ProdName
        };
        updatedProducts[index].totalPrice = updatedProducts[index].quantity * updatedProducts[index].price; // Calculate totalPrice
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
        updatedProducts[index] = { ...updatedProducts[index], [name]: value };
        if (name === "quantity" || name === "price") {
            updatedProducts[index].totalPrice = updatedProducts[index].quantity * updatedProducts[index].price;
        }
        const gstAmount = (updatedProducts[index].totalPrice * updatedProducts[index].gst) / 100;
        updatedProducts[index].totalPriceWidGST = updatedProducts[index].totalPrice + gstAmount;

        setFormData({ ...formData, products: updatedProducts });
    };


    const addProduct = () => {
        setFormData((prevData) => ({
            ...prevData,
            products: [...prevData.products, { productid: '', quantity: 0, price: 0, totalPrice: 0, searchTerm: '' }]
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
        if (formData.products.some(product => !product.productid)) newErrors.productid = "Product is required";
        if (formData.products.some(product => product.quantity <= 0)) newErrors.quantity = "Quantity must be greater than 0";
        if (formData.products.some(product => product.price <= 0)) newErrors.price = "Price must be greater than 0";
        if (formData.gst < 0) newErrors.gst = "GST cannot be negative";
        if (formData.gstPercentage < 0) newErrors.gstPercentage = "GST Percentage cannot be negative";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const calculateProductTotal = (product) => {
        const price = parseFloat(product.price) || 0;
        const quantity = parseInt(product.quantity) || 0;
        const productTotal = price * quantity;
        return productTotal; // Exclude GST from the total
    };

    const calculateOverallTotal = () => {
        const productTotals = formData.products.map((product) => calculateProductTotal(product));
        const overallTotal = productTotals.reduce((sum, total) => sum + total, 0);
        return overallTotal;
    };



   
    



    return (
        < >
            <div className="row">
                <div className="col-6">     <h2>Estimation Bill</h2></div>
                <div className="col-6 text-end"><Link to='/order-form'> <button className='btn btn-secondary'>Place Order </button></Link></div>
            </div>

            {/* <Form onSubmit={handleSubmit}> */}
            <Form>




                {formData.products.map((product, index) => (

                    <Row key={index} >
                        <Col md={4}>
                            <Form.Group controlId={`productid-${index}`}>
                                <Form.Label>Product Name </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="searchTerm"
                                    value={product.searchTerm || ""}
                                    onChange={(e) => handleProductSearch(e, index)}
                                    isInvalid={errors.productid}
                                    required
                                />
                                {productListVisible[index] && productResults.length > 0 && (
                                    <div style={{ maxHeight: '200px', overflowY: 'auto', overflowX: 'hidden', border: '1px solid #ccc', marginTop: '5px' }}>
                                        {productResults.map((productResult) => (
                                            <div
                                                key={productResult.ProductID}
                                                style={{ padding: '8px', cursor: 'pointer' }}
                                                onClick={() => handleProductSelect(productResult, index)}
                                            >
                                                <div className="row px-3 d-flex justify-content-between">
                                                    <div className="col-8 d-flex align-items-center">
                                                        <p className='mb-0'> {productResult.ProdName} <b>({productResult.ProdCode})</b></p>
                                                    </div>
                                                    <div className='col-4'>
                                                        <img src={`${BASE_URL}${productResult.ProdImage}`} alt={productResult.ProdName} style={{ height: '50px', borderRadius: '10px', width: '50px' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <Form.Control.Feedback type="invalid">
                                    {errors.productid}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col xl={1} md={2}>
                            <Form.Group controlId={`quantity-${index}`}>
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="quantity"
                                    value={product.quantity}
                                    onChange={(e) => handleProductChange(index, e)}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col xl={1} md={3}>
                            <Form.Group controlId={`price-${index}`}>
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={product.price}
                                    onChange={(e) => handleProductChange(index, e)}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={2} className="mb-2">
                            <Form.Group controlId={`totalPrice-${index}`}>
                                <Form.Label>Total Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="totalPrice"
                                    value={product.totalPrice || 0}
                                    disabled
                                />
                            </Form.Group>
                        </Col>


                        <Col md={1} className='d-flex justify-content-end align-items-end pb-2'>
                            <Button variant="danger" onClick={() => removeProduct(index)}>
                                -
                            </Button>
                        </Col>
                        <div className="row">
                            <div className="col-12">   <hr style={{ border: "0.5px solid #c8c8c8" }} /></div>
                        </div>
                    </Row>

                ))}

                <div className="row">
                    <div className="col-12 d-flex justify-content-between">
                        <div>
                            <Button variant="primary" onClick={addProduct} className='mt-3'>
                                Add Product
                            </Button>

                            <Button variant="primary" type="submit" className='mt-3 ms-4'>
                                Generate Bill
                            </Button></div>
                    </div>
                </div>


                <div className="row d-flex justify-content-end" >


                    <div className="col-md-3">
                        <table className="table table-borderless mt-3 text-end">
                            <tbody>

                                <tr>
                                    <td className='py-2'><b>Grand Total :</b></td>
                                    <td className='py-2'>₹{calculateOverallTotal().toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>


            </Form>
        </>
    );
};

export default EstimationBill;
