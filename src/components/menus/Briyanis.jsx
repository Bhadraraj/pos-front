


import React, { useState, useEffect, useMemo } from 'react';
import { FaStar } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateCartQuantity } from '../redux/actions/actions';


import { MdOutlineCurrencyRupee, MdAdd } from "react-icons/md";
import { TiMinus } from "react-icons/ti";


import '../../styles/cart.css';

const Briyanis = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.cart)
    const handleAddToCart = (dish) => {
        dispatch(addToCart(dish));
    };

    const handleQuantityChange = (productId, quantity) => {
        dispatch(updateCartQuantity(productId, quantity));
    };


    const briyani = [
        {
            id: 34,
            name: 'Chicken Biryani',
            image: 'https://yeyfood.com/wp-content/uploads/2024/08/WEB1indian_chicken_biryani._served_on_a_white_plate._s_77c8f1ca-f01e-4a4d-9f2c-61bce785c1d7_3-720x720.jpg',  // Free image link for Chicken Biryani
            price: 250,
            description: 'Aromatic basmati rice cooked with tender chicken, spices, and herbs.',
            rating: 4.9
        },
        {
            id: 35,
            name: 'Mutton Biryani',
            image: 'https://www.cubesnjuliennes.com/wp-content/uploads/2021/03/Best-Mutton-Biryani-Recipe.jpg',  // Free image link for Mutton Biryani
            price: 300,
            description: 'Flavorful biryani made with succulent mutton pieces and fragrant rice.',
            rating: 4.8
        },
        {
            id: 36,
            name: 'Vegetable Biryani',
            image: 'https://www.madhuseverydayindian.com/wp-content/uploads/2022/11/easy-vegetable-biryani.jpg',  // Free image link for Vegetable Biryani
            price: 200,
            description: 'A mix of fresh vegetables cooked with rice and spices for a delicious vegetarian option.',
            rating: 4.7
        },
        {
            id: 37,
            name: 'Egg Biryani',
            image: 'https://spicecravings.com/wp-content/uploads/2020/10/Egg-Biryani-Featured-1.jpg',  // Free image link for Egg Biryani
            price: 180,
            description: 'Spiced rice cooked with boiled eggs and a blend of aromatic spices.',
            rating: 4.6
        },
        {
            id: 38,
            name: 'Paneer Biryani',
            image: 'https://ministryofcurry.com/wp-content/uploads/2023/10/paneer-biryani_-9.jpg',  // Free image link for Paneer Biryani
            price: 220,
            description: 'A vegetarian delight made with paneer cubes and rice infused with spices.',
            rating: 4.9
        },
        {
            id: 39,
            name: 'Fish Biryani',
            image: 'https://i.pinimg.com/736x/3d/5f/04/3d5f0438eccd828296307ab954a52128.jpg',  // Free image link for Fish Biryani
            price: 270,
            description: 'Fresh fish cooked with rice and a medley of spices for a flavorful meal.',
            rating: 4.8
        },
        {
            id: 40,
            name: 'Prawn Biryani',
            image: 'https://www.cubesnjuliennes.com/wp-content/uploads/2020/12/Prawn-Biryani-Recipe.jpg',  // Free image link for Prawn Biryani
            price: 290,
            description: 'Juicy prawns cooked with rice and spices for a rich, aromatic dish.',
            rating: 4.7
        },
        {
            id: 41,
            name: 'Hyderabadi Biryani',
            image: 'https://www.licious.in/blog/wp-content/uploads/2020/12/Hyderabadi-chicken-Biryani.jpg',  // Free image link for Hyderabadi Biryani
            price: 320,
            description: 'A classic biryani from Hyderabad, known for its rich flavors and unique cooking style.',
            rating: 4.9
        },

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
        return briyani.filter(dish =>
            dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dish.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [briyani, searchTerm]);

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
                <h2 className='mb-0'>BIRYANI BLISS</h2>
                <p className='secBtmCnt m-0 mb-2'>Experience the rich, aromatic flavors  </p>

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

export default Briyanis;
