import React, { useState, useEffect, useMemo } from 'react';
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { GrFormAdd } from "react-icons/gr";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart, updateCartQuantity } from '../redux/actions/actions';

const HotDishes = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart);


  const hotDishes = [
    {
      id: 1,
      name: 'Chicken Biryani',
      image: 'https://recipes.timesofindia.com/thumb/msid-54308405,width-1600,height-900/54308405.jpg',  // Free image link for Biryani
      price: 200,
      description: 'A delicious blend of fragrant basmati rice and tender chicken with rich spices.',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Paneer Tikka',
      image: 'https://sharethespice.com/wp-content/uploads/2024/02/Paneer-Tikka-Featured.jpg',  // Free image link for Paneer Tikka
      price: 150,
      description: 'Grilled paneer cubes marinated in yogurt and spices, perfect for a starter.',
      rating: 4.5
    },
    {
      id: 3,
      name: 'Mutton Rogan Josh',
      image: 'https://www.licious.in/blog/wp-content/uploads/2020/12/Mutton-Rogan-Josh.jpg',  // Free image link for Rogan Josh
      price: 250,
      description: 'A flavorful mutton curry with Kashmiri red chilies and aromatic spices.',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Butter Naan',
      image: 'https://www.pachakam.com/wp-content/uploads/2009/05/new-butter-naan.jpg',  // Free image link for Butter Naan
      price: 50,
      description: 'Soft and fluffy naan brushed with butter, a perfect companion for curries.',
      rating: 4.6
    },

    {
      id: 5,
      name: 'Tandoori Chicken',
      image: 'https://www.easycookingwithmolly.com/wp-content/uploads/2023/11/air-fryer-whole-tandoori-chicken-3.jpg  ',  // Free image link for Tandoori Chicken
      price: 220,
      description: 'Juicy and smoky chicken marinated in yogurt and spices, cooked in a tandoor.',
      rating: 4.8
    },

    {
      id: 6,
      name: 'Dal Makhani',
      image: 'https://www.funfoodfrolic.com/wp-content/uploads/2023/04/Dal-Makhani-Blog.jpg',  // Free image link for Dal Makhani
      price: 120,
      description: 'A rich and creamy lentil dish cooked with butter and aromatic Indian spices.',
      rating: 4.9
    },

    {
      id: 7,
      name: 'Chicken Tikka Masala',
      image: 'https://www.licious.in/blog/wp-content/uploads/2020/12/Chicken-Tikka-Masala-min-750x750.jpg',  // Free image link for Chicken Tikka Masala
      price: 180,
      description: 'Tender chicken pieces cooked in a rich, creamy tomato gravy with Indian spices.',
      rating: 4.7
    },
    {
      id: 8,
      name: 'Lamb Korma',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNSDBYeU5bNvBF1NdSDTMrKxL9k_Fox1bA0A&shttps://www.recipetineats.com/tachyon/2024/05/Lamb-korma_main.jpg',  // Free image link for Lamb Korma
      price: 250,
      description: 'A slow-cooked lamb dish in a creamy, mild curry sauce with aromatic spices.',
      rating: 4.8
    },
    {
      id: 9,
      name: 'Prawn Curry',
      image: 'https://nishkitchen.com/wp-content/uploads/2021/07/Indian-Prawn-Curry-1B.jpg',  // Free image link for Prawn Curry
      price: 230,
      description: 'Juicy prawns cooked in a coconut-based curry with spicy and tangy flavors.',
      rating: 4.6
    },
    {
      id: 10,
      name: 'Chicken Shawarma',
      image: 'https://ministryofcurry.com/wp-content/uploads/2021/05/chicken-shawarma-6.jpg',  // Free image link for Chicken Shawarma
      price: 150,
      description: 'Grilled marinated chicken served with pickles and garlic sauce in pita bread.',
      rating: 4.4
    },




  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [expanded, setExpanded] = useState({});

  const toggleReadMore = (id) => {
    setExpanded((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const handleAddToCart = (dish) => {
    dispatch(addToCart(dish));
  };

  const handleRemoveFromCart = (dishId) => {
    dispatch(removeFromCart(dishId));
  };

  const handleQuantityChange = (dishId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateCartQuantity(dishId, newQuantity));
    } else {
      dispatch(removeFromCart(dishId));
    }
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredDishes = useMemo(() => {
    return hotDishes.filter(dish =>
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [hotDishes, searchTerm]);

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
    <div>
      <p className="goToCart">


        <Link to="/cartDem">
          {/* Go to Cart ({Object.keys(cartItems).length} items) */}
          Go to Cart
        </Link>
      </p>
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
            currentDishes.map((dish) => {
              const isAdded = cartItems[dish.id];
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
                        <div className="col-6 d-flex justify-content-end align-items-center">
                          {isAdded ? (
                            <>
                              <button className="quantity-btn" onClick={() => handleQuantityChange(dish.id, isAdded.quantity - 1)}>
                                -
                              </button>
                              <span className="quantity-display mx-2">{isAdded.quantity}</span>
                              <button className="quantity-btn" onClick={() => handleQuantityChange(dish.id, isAdded.quantity + 1)}>
                                +
                              </button>
                              <button className="removeMenuItems ms-2" onClick={() => handleRemoveFromCart(dish.id)}>
                                Remove
                              </button>
                            </>
                          ) : (
                            <button className="addMenuItems" onClick={() => handleAddToCart(dish)}>
                              <GrFormAdd /> ADD
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center">No dishes found. Please try a different search.</p>
          )}
        </div>
      </section>
      <div className="pagination justify-content-end mt-3">
        <button
          className="btn btn-outline-secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </button>

        {/* Page number buttons */}
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
  );
};

export default HotDishes;
