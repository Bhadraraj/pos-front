import React, { useState, useEffect } from 'react';
import { Button, FormGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormFeedback } from 'reactstrap';
import { MdEditSquare, MdDelete } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RefreshButton from '../utils/RefreshButton'
import { get, post, put, del } from '../utils/api';
const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [productData, setProductData] = useState({
        productId: '',
        categoryId: '',
        subcategoryId: '',
        productName: '',
        description: '',
        price: '',
        weight: '',
        pieces: '',
        totalPrice: ''
    });
    const [errors, setErrors] = useState({});
    const [modalOpen, setModalOpen] = useState(false);

    const productsPerPage = 5;

    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    const fetchProducts = async () => {
        try {
            const response = await get('/product/all');
            setProducts(response.data);
            setTotalPages(Math.ceil(response.data.length / productsPerPage));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleEditProduct = (product) => {
        setProductData({
            productId: product.productId,
            categoryId: product.categoryId || '',
            subcategoryId: product.subcategoryId || '',
            productName: product.productName,
            description: product.description,
            price: product.price || 0,
            weight: product.weight || 0,
            pieces: product.pieces || 0,
            totalPrice: product.totalPrice || 0,
        });
        setModalOpen(true);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value.trim() === "" ? "" : isNaN(value) ? value : parseFloat(value),
        });
    };

    const handleUpdateProduct = async () => {
        const { productName, description, price, weight, pieces } = productData;
        const numberRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;

        const errors = {};

        if (!productName) errors.productName = 'Product Name is required';
        if (!description) errors.description = 'Description is required';
        if (!price || !numberRegex.test(price)) errors.price = 'Price must be a valid number (integer or float)';
        if (!weight || !numberRegex.test(weight)) errors.weight = 'Weight must be a valid number (integer or float)';
        if (pieces === "" || !numberRegex.test(pieces)) errors.pieces = 'Pieces must be a valid number (integer or float)';

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        // Function to calculate the total price
        const calculateTotalPrice = () => {
            const { price, pieces } = productData;
            const totalPrice = parseFloat(price) * parseInt(pieces || 0);
            return isNaN(totalPrice) ? 0 : totalPrice.toFixed(2);
        };

        // Get the current date and format it as 'day-month-year'
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;

        try {
            const updatedProduct = {
                productId: productData.productId,
                categoryId: productData.categoryId,
                subcategoryId: productData.subcategoryId,
                productName: productData.productName,
                description: productData.description,
                price: productData.price,
                weight: productData.weight,
                pieces: productData.pieces,
                totalPrice: calculateTotalPrice(), // Using the calculated total price
                date: formattedDate // Include the formatted date
            };

            const response = await put(`/product/update`, updatedProduct);

            if (response.status === 200) {
                toast.success('Product updated successfully!');

                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.productId === productData.productId ? { ...product, ...productData } : product
                    )
                );

                setModalOpen(false);
                setErrors({});
            } else {
                toast.error('Failed to update product.');
            }
        } catch (error) {
            toast.error('Error updating product');
            console.error('Error updating product:', error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await del(`/product/${productId}`);
            toast.success('Product deleted successfully!');

            setProducts((prevProducts) =>
                prevProducts.filter((product) => product.productId !== productId)
            );
        } catch (error) {
            toast.error('Error deleting product');
            console.error('Error deleting product:', error);
        }
    };

    const currentProducts = products.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    return (
        // <div className="card">
        //     <div className="card-header">
        //         <h5 className="text-center mb-0">Product List</h5>
        //     </div>
        <>
            <div className="row mb-3">
                <div className="col-md-6"><h5 className="text-start mb-0">Product List</h5></div>
                <div className="col-md-6 text-end"> <RefreshButton /></div>
            </div>
            <div className="table-responsive">
                <table className="table mb-0">
                    <thead>
                        <tr>
                            {/* <th>Product Id</th> */}
                            <th>Product Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Weight</th>
                            <th>Avaliable Pieces</th>
                            <th>Total Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product, index) => (
                                <tr key={index}>
                                    {/* <td>{product.productId}</td> */}
                                    <td>{product.productName}</td>
                                    <td>{product.description}</td>
                                    <td>{product.price || 0}</td>
                                    <td>{product.weight || 0}</td>
                                    <td>{product.pieces || 0}</td>
                                    <td>{product.totalPrice || 0}</td>
                                    <td>
                                        <span onClick={() => handleEditProduct(product)} className="edit-button me-3">
                                            <MdEditSquare />
                                        </span>
                                        <span onClick={() => handleDeleteProduct(product.productId)} className="delete-button">
                                            <MdDelete />
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>

                {totalPages >= 1 && (
                    <nav className="d-flex justify-content-end m-2">
                        <ul className="pagination">
                            <li className="page-item me-1">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                            </li>
                            {[...Array(totalPages)].map((_, index) => (
                                <li
                                    key={index}
                                    className={`me-1 page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                >
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li className="page-item  ">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}

                <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
                    <ModalHeader toggle={() => setModalOpen(false)}>Edit Product</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="productName">Product Name</Label>
                            <Input
                                name="productName"
                                value={productData.productName}
                                onChange={handleChange}
                                invalid={!!errors.productName}
                            />
                            {errors.productName && <FormFeedback>{errors.productName}</FormFeedback>}
                        </FormGroup>
                        <FormGroup>
                            <Label for="price">Price</Label>
                            <Input
                                type="number"
                                name="price"
                                value={productData.price}
                                onChange={handleChange}
                                invalid={!!errors.price}
                            />
                            {errors.price && <FormFeedback>{errors.price}</FormFeedback>}
                        </FormGroup>
                        <FormGroup>
                            <Label for="weight">Weight</Label>
                            <Input
                                type="number"
                                name="weight"
                                value={productData.weight}
                                onChange={handleChange}
                                invalid={!!errors.weight}
                            />
                            {errors.weight && <FormFeedback>{errors.weight}</FormFeedback>}
                        </FormGroup>
                        <FormGroup>
                            <Label for="pieces">Pieces</Label>
                            <Input
                                type="number"
                                name="pieces"
                                value={productData.pieces}
                                onChange={handleChange}
                                invalid={!!errors.pieces}
                            />
                            {errors.pieces && <FormFeedback>{errors.pieces}</FormFeedback>}
                        </FormGroup>

                        <FormGroup>
                            <Label for="totalPrice">Total Price</Label>
                            <Input
                                type="number"
                                name="totalPrice"
                                value={productData.totalPrice}
                                onChange={handleChange}
                                invalid={!!errors.totalPrice} disabled
                            />
                            {errors.totalPrice && <FormFeedback>{errors.totalPrice}</FormFeedback>}
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleUpdateProduct}>
                            Update Product
                        </Button>
                        <Button color="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>

                <ToastContainer />


            </div >
        </>
    );
};

export default ProductList;
