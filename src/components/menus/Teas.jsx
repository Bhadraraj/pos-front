


import React, { useState, useEffect, useMemo } from 'react';
import { FaStar } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateCartQuantity } from '../redux/actions/actions';


import { MdOutlineCurrencyRupee, MdAdd } from "react-icons/md";
import { TiMinus } from "react-icons/ti";


import '../../styles/cart.css';

const Teas = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.cart)
    const handleAddToCart = (dish) => {
        dispatch(addToCart(dish));
    };

    const handleQuantityChange = (productId, quantity) => {
        dispatch(updateCartQuantity(productId, quantity));
    };


    const teas = [
        {
            id: 42,
            name: 'Green Tea',
            image: 'https://5.imimg.com/data5/SELLER/Default/2024/5/417635939/OE/TL/CB/15806610/jasmine-green-tea.jpg',  // Free image link for Green Tea
            price: 150,
            description: 'A refreshing and healthy tea, rich in antioxidants and known for its numerous health benefits.',
            rating: 4.9
        },
        {
            id: 43,
            name: 'Black Tea',
            image: 'https://images.ctfassets.net/e8bhhtr91vp3/4v9X0NPdU6zsq1UwHXfYpV/01f6e8e5099ed9a7a9d7bf336d76b1fd/image.png?w=1600&q=60',  // Free image link for Black Tea
            price: 100,
            description: 'Strong and bold, this tea is fully oxidized and offers a rich, robust flavor.',
            rating: 4.8
        },
        {
            id: 44,
            name: 'Herbal Tea',
            image: 'https://static.toiimg.com/photo/69385334.cms',  // Free image link for Herbal Tea
            price: 130,
            description: 'A caffeine-free blend of herbs, flowers, and fruits, providing a calming and soothing effect.',
            rating: 4.7
        },
        {
            id: 45,
            name: 'Oolong Tea',
            image: 'https://cdn.shopify.com/s/files/1/1146/8126/files/drink-oolong-tea_high_1.jpg?v=1591071201',  // Free image link for Oolong Tea
            price: 170,
            description: 'Partially oxidized, offering a unique blend of green and black tea flavors.',
            rating: 4.6
        },
        {
            id: 46,
            name: 'White Tea',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQUBqFDCYnhF2LulMgH76MYqZtS0Bx7u26cg&s',  // Free image link for White Tea
            price: 200,
            description: 'Delicate and minimally processed, this tea offers a light and subtle flavor.',
            rating: 4.9
        },
        {
            id: 47,
            name: 'Chai Tea',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8LMM6j0uSjpwGASdoFVtMLW_iojIyFp6ZfQ&s',  // Free image link for Chai Tea
            price: 120,
            description: 'A spiced tea blend made with black tea, milk, and a mixture of aromatic spices and herbs.',
            rating: 4.8
        },
        {
            id: 48,
            name: 'Matcha Tea',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqNPHX9e3MONH8JGd_i44gt3eZekhjFDAfuw&s',  // Free image link for Matcha Tea
            price: 220,
            description: 'A powdered green tea known for its vibrant color and earthy flavor, rich in nutrients.',
            rating: 4.9
        },
        {
            id: 49,
            name: 'Peppermint Tea',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9RoRyvxR84x_sxLbg1f_JzZNTypZFs94r5A&s',  // Free image link for Peppermint Tea
            price: 110,
            description: 'A refreshing and cool tea made from peppermint leaves, known for its digestive benefits.',
            rating: 4.7
        },
        {
            id: 50,
            name: 'Chamomile Tea',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBjbdVDeXvxcY33UklQikOmct4wu0SRdam3A&s',  // Free image link for Chamomile Tea
            price: 140,
            description: 'A calming tea made from chamomile flowers, known for its soothing properties.',
            rating: 4.8
        },
        {
            id: 51,
            name: 'Rooibos Tea',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTloJT2oGDDc3tX6IXBzrJyJh23bcaUqjEPQA&s',  // Free image link for Rooibos Tea
            price: 160,
            description: 'A naturally caffeine-free tea from South Africa, known for its rich, sweet flavor.',
            rating: 4.6
        }
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [expanded, setExpanded] = useState({});

    const toggleReadMore = (id) => {
        setExpanded((prevState) => ({ ...prevState, [id]: !prevState[id] }));
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const filteredDishes = useMemo(() => {
        return teas.filter(dish =>
            dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dish.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [teas, searchTerm]);

    const { currentDishes, totalPages } = useMemo(() => {
        const total = Math.ceil(filteredDishes.length / itemsPerPage);
        const indexOfLastDish = currentPage * itemsPerPage;
        const indexOfFirstDish = indexOfLastDish - itemsPerPage;
        const currentDishes = filteredDishes.slice(indexOfFirstDish, indexOfLastDish);

        return { currentDishes, totalPages: total };
    }, [filteredDishes, currentPage, itemsPerPage]);

    const handleSearch = () => {
        setCurrentPage(1);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                handleSearch();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [searchTerm]);

    return (
        <section className="menuSection">
            <div className="row g-4">
                <h2 className='mb-0'>SAVORY SENSATIONS</h2>
                <p className='secBtmCnt m-0 mb-2'>Ignite your senses with every bite.</p>
                <div className="search-bar mb-3">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Find your favorite dish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="input-group-text" onClick={handleSearch}>
                            <FiSearch />
                        </span>
                    </div>
                </div>

                {currentDishes.length > 0 ? (
                    currentDishes.map(dish => {
                        const existingItem = cartItems.find(item => item.id === dish.id);
                        return (
                            <div key={dish.id} className="col-xl-3 col-lg-4 col-sm-6 d-flex justify-content-center align-items-center">
                                <div className="menuCardOuter">
                                    <div className="menuCard">
                                        <div className="foodCatgoryImg">
                                            <img src={dish.image} alt={dish.name} className="img-fluid" />
                                        </div>
                                        <div className="row py-2">
                                            <div className="col-8">
                                                <p className="menuItemName mb-0">{dish.name}</p>
                                            </div>
                                            <div className="col-4 ps-0 d-flex justify-content-end align-items-center">
                                                <p className="menuItemPrice mb-0"><MdOutlineCurrencyRupee />{dish.price}.00</p>
                                            </div>
                                        </div>
                                        <p className="menuItemContent">
                                            {expanded[dish.id] ? dish.description : `${dish.description.slice(0, 30)}...`}
                                            <span className="readMoreLess" onClick={() => toggleReadMore(dish.id)}>
                                                {expanded[dish.id] ? 'Read less' : 'Read more'}
                                            </span>
                                        </p>
                                        <div className="row d-flex mb-1 justify-content-start align-items-center">
                                            <div className="col-6">
                                                <p className="d-flex mb-0 justify-content-start align-items-center rating-container">
                                                    <span className="menuItemRatings"><FaStar /></span>
                                                    <span className="rating-value">{dish.rating}</span>
                                                </p>
                                            </div>
                                            {existingItem ? (
                                                <div className="col-6">
                                                    <div className="addRemoBtn">
                                                        <button className="cartaddBtn" onClick={() => handleQuantityChange(dish.id, existingItem.quantity + 1)}> <MdAdd /> </button>
                                                        <span className="cartItemAmount mx-1  text-center"> {existingItem.quantity}</span>
                                                        <button className="cartRemoveBtn" onClick={() => handleQuantityChange(dish.id, existingItem.quantity - 1)}>
                                                            <TiMinus />
                                                        </button>
                                                    </div>
                                                </div>

                                            ) : (
                                                <div className="col-6 d-flex">
                                                    <button className="addMenuItems w-100" onClick={() => handleAddToCart(dish)}>Add</button>

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        );
                    })
                ) : (
                    <p className="text-center">No dishes found. Please try a different search.</p>
                )}

                <div className="pagination justify-content-end mt-3">
                    <button
                        className="btn btn-outline-secondary"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        Previous
                    </button>
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
            </div>
        </section >
    );
};

export default Teas;
