import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    FormGroup,
    Label,
    Input,
    Button,
    FormFeedback
} from 'reactstrap';
// import { get } from './utils/api';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
// import { BASE_URL } from '../utils/config'
// import { BASE_URL } from './utils/config';
const AddBilling = () => {
    const navigate = useNavigate();
    const [billingData, setBillingData] = useState({
        customerName: '',
        paymentMethod: 'Cash',
        applyTax: true,
        totalDiscount: 0, 
    });
    const [products, setProducts] = useState([]);
    const [applyTax, setApplyTax] = useState(true);
 
    const [paymentMethods] = useState([
        'Credit Card',
        'Debit Card',
        'Cash',
        'Bank Transfer',
    ]);
    const [rows, setRows] = useState([
        { productId: '', pieces: 1, price: 0, totalDiscount: 0 },
    ]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});


    const calculateProductTotal = (row) => {
        const { price, pieces } = row;
        return price * pieces;
    };


    const calculateGrandTotal = () => {
        const total = rows.reduce((acc, row) => acc + calculateProductTotal(row), 0);
        console.log(total)
        const totalDiscountAmount = (total * billingData.totalDiscount) / 100;
        const totalAfterDiscount = total - totalDiscountAmount;
        const tax = parseFloat(calculateTotalTax());
        return (totalAfterDiscount + tax).toFixed(2);
    };

    const calculateTotalDiscount = () => {
        const discountAmount = rows.reduce((acc, row) => {
            const totalPrice = row.price * row.pieces;
            const rowDiscountAmount = (totalPrice * row.totalDiscount) / 100;


            console.log(`Row Data: Price = ${row.price}, Pieces = ${row.pieces}, Total Discount = ${row.totalDiscount}`);
            console.log(`Total Price = ${totalPrice}, Row Discount Amount = ${rowDiscountAmount}`);

            return acc + rowDiscountAmount;
        }, 0).toFixed(2);
 
        console.log("Total Discount Amount:", discountAmount);

        return discountAmount;
    };

    const calculateTotalTax = () => {
        if (!applyTax) return 0;
        const totalTax = rows.reduce(
            (acc, row) => acc + (calculateProductTotal(row) * 0.035),
            0
        );
        return totalTax.toFixed(2);
    };
    const dummyProducts = [
        { productId: 'P001', productName: 'Smartphone', price: 500, pieces: 10 },
        { productId: 'P002', productName: 'Laptop', price: 1000, pieces: 5 },
        { productId: 'P003', productName: 'Headphones', price: 150, pieces: 20 },
        { productId: 'P004', productName: 'Smartwatch', price: 250, pieces: 15 },
        { productId: 'P005', productName: 'Tablet', price: 400, pieces: 8 },
      ];
      
      useEffect(() => {
        setProducts(dummyProducts); // Setting dummy products initially
      }, []);
    // useEffect(() => {
    //     fetchProducts();
    // }, []);

    // const fetchProducts = async () => {
    //     try {
    //         const response = await get(`${BASE_URL}/product/all`);
    //         setProducts(response.data);
    //     } catch (error) {
    //         console.error('Error fetching products:', error);
    //         toast.error('Failed to fetch products.');
    //     }
    // };

    const validateFields = () => {
        const newErrors = {};
        if (!billingData.customerName.trim()) newErrors.customerName = 'Customer Name is required';
        if (!billingData.paymentMethod) newErrors.paymentMethod = 'Payment Method is required';

        rows.forEach((row, index) => {
            if (!row.productId) newErrors[`productId_${index}`] = 'Select a product';
            if (row.pieces <= 0) newErrors[`pieces_${index}`] = 'Pieces must be greater than 0';
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedRows = [...rows];

        if (name === 'productId') {
            const selectedProduct = products.find((product) => product.productId === value);
            if (selectedProduct) {
                updatedRows[index] = {
                    ...updatedRows[index],
                    productId: value,
                    productName: selectedProduct.productName,
                    price: Number(selectedProduct.price),
                };
            }
        } else {
            updatedRows[index][name] = name === 'pieces' || name === 'totalDiscount' ? Math.max(Number(value), 0) : value;

            if (name === 'pieces') {
                const selectedProduct = products.find((product) => product.productId === updatedRows[index].productId);
                if (selectedProduct && value > selectedProduct.pieces) {
                    toast.error('Requested quantity exceeds available stock.');
                    updatedRows[index].pieces = selectedProduct.pieces;
                }
            }
        }

        setRows(updatedRows);
    };

    const handleAddRow = () => setRows([...rows, { productId: '', pieces: 1, price: 0, totalDiscount: 0 }]);
    const handleRemoveRow = (index) => {
        if (rows.length > 1) setRows(rows.filter((_, i) => i !== index));
    };
    const grandTotal = calculateGrandTotal();
    const totalTax = calculateTotalTax();
    return (
        <div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <h5>Add Billing</h5>
                </div>
                <div className="col-md-6 text-end">
                    <Link to="/search-billing">
                        <Button color="primary">Search Bill</Button>
                    </Link>
                </div>
            </div>
            {/* <form onSubmit={handleSubmit}> */}
            <form >
                <ToastContainer />
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label>Customer Name</Label>
                            <Input
                                name="customerName"
                                value={billingData.customerName}
                                onChange={(e) =>
                                    setBillingData({
                                        ...billingData,
                                        [e.target.name]: e.target.value,
                                    })
                                }
                                invalid={!!errors.customerName}
                            />
                            <FormFeedback>{errors.customerName}</FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label>Payment Method</Label>
                            <Input
                                type="select"
                                name="paymentMethod"
                                value={billingData.paymentMethod}
                                onChange={(e) =>
                                    setBillingData({
                                        ...billingData,
                                        [e.target.name]: e.target.value,
                                    })
                                }
                                invalid={!!errors.paymentMethod}
                            >
                                <option value="">Select Payment Method</option>
                                {paymentMethods.map((method, idx) => (
                                    <option key={idx} value={method}>
                                        {method}
                                    </option>
                                ))}
                            </Input>
                            <FormFeedback>{errors.paymentMethod}</FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                {rows.map((row, index) => {
                    const discountPercentage = row.price && row.totalDiscount
                        ? ((row.totalDiscount / 100) * row.price).toFixed(2)
                        : 0;

                    const finalPrice = row.price - discountPercentage;

                    return (
                        <Row key={index}>
                            <Col md={3}>
                                <FormGroup  >
                                    <Label>Product</Label>
                                    <Input
                                        type="select"
                                        name="productId"
                                        value={row.productId}
                                        onChange={(e) => handleChange(e, index)}
                                        invalid={!!errors[`productId_${index}`]}
                                    >
                                        <option value="">Select Product</option>
                                        {products.map((product) => (
                                            <option key={product.productId} value={product.productId}>
                                                {product.productName} ({product.pieces})
                                            </option>
                                        ))}
                                    </Input>
                                    <FormFeedback>{errors[`productId_${index}`]}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={2}>
                                <FormGroup>
                                    <Label>Pieces</Label>
                                    <Input
                                        type="number"
                                        name="pieces"
                                        // value={billingData.totalDiscount || ''}

                                        value={row.pieces || ''}
                                        onChange={(e) => handleChange(e, index)}
                                        invalid={!!errors[`pieces_${index}`]}
                                    />
                                    <FormFeedback>{errors[`pieces_${index}`]}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={2}>
                                <FormGroup>
                                    <Label>Price</Label>
                                    <Input type="text" value={row.price} disabled />
                                </FormGroup>
                            </Col>

                            <Col md={2}>
                                <FormGroup>
                                    <Label>Total</Label>
                                    <Input
                                        type="text"
                                        value={calculateProductTotal(row)}  // Calculate total price without discount for this row
                                        disabled
                                    />
                                </FormGroup>
                            </Col>

                            <Col md={1} className="d-flex align-items-center">
                                <Button
                                    color="danger"
                                    onClick={() => handleRemoveRow(index)}
                                    disabled={rows.length === 1}
                                >
                                    Remove
                                </Button>
                            </Col>

                        </Row>
                    );
                })}

                <Row className="mb-3 mt-2">
                    <Col md={2}>
                        <Button color="primary" onClick={handleAddRow}>
                            Add Product
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label>Discount ( % )</Label>
                            <Input
                                type="number"
                                name="totalDiscount"
                                value={billingData.totalDiscount || ''} // Ensuring it displays an empty string when there's no value
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    // Update state only if it's a valid number, else keep it zero
                                    setBillingData({
                                        ...billingData,
                                        totalDiscount: isNaN(value) ? 0 : Math.max(0, value), // Ensuring non-negative numbers
                                    });
                                }}
                            />
                        </FormGroup>

                    </Col>
                </Row>


                <Row className='d-flex justify-content-end mb-2'>



                    <div>

                        <p className='text-end'><b>Discount : </b>  {(rows.reduce((acc, row) => acc + calculateProductTotal(row), 0) * billingData.totalDiscount) / 100}</p>
                        <p className='text-end'><b>Total Tax : </b> {totalTax}</p>
                        <p className='text-end'><b>Grand Total : </b> {grandTotal}</p>

                        <FormGroup check className=' d-flex justify-content-end'>
                            <Input
                                type="checkbox"
                                checked={applyTax}
                                onChange={(e) => setApplyTax(e.target.checked)}
                            />
                            <Label check className='ms-2'>Apply GST (18%)</Label>
                        </FormGroup>
                    </div>

                </Row>


                <Row>
                    <Col md={12} className="text-end">
                        <Button color="success" type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Col>
                </Row>
            </form>
        </div>
    );
};

export default AddBilling;
