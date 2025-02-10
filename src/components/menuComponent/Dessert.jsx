import React, { useState, useEffect, useMemo } from 'react';
import { FaStar } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateCartQuantity } from '../redux/actions/actions';

import { MdOutlineCurrencyRupee, MdAdd } from "react-icons/md";
import { TiMinus } from "react-icons/ti";

import '../../styles/cart.css';

const Desserts = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cart)
  const handleAddToCart = (dish) => {
    dispatch(addToCart(dish));
  };

  const handleQuantityChange = (productId, quantity) => {
    dispatch(updateCartQuantity(productId, quantity));
  };

  const desserts = [
    {
      id: 1,
      name: 'Gulab Jamun',
      image: 'https://aartimadan.com/wp-content/uploads/2020/11/milk-powder-gulab-jamuns.jpg',  // Free image link for Gulab Jamun
      price: 90,
      description: 'Sweet and soft milk-based dumplings soaked in sugar syrup.',
      rating: 4.9
    },
    {
      id: 2,
      name: 'Rasmalai',
      image: 'https://www.kashmironlinestore.com/cdn/shop/articles/Untitled_design_54.jpg?v=1692702218',  // Free image link for Rasmalai
      price: 100,
      description: 'Delicate, spongy cheese balls soaked in a sweet, flavored milk syrup.',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Kheer',
      image: 'https://www.munatycooking.com/wp-content/uploads/2020/04/Kheer-feature-image-500x500.jpg',  // Free image link for Kheer
      price: 70,
      description: 'A creamy rice pudding cooked with milk, sugar, and flavored with cardamom and saffron.',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Jalebi',
      image: 'https://www.cookwithnabeela.com/wp-content/uploads/2024/02/1Jalebi.webp',  // Free image link for Jalebi
      price: 80,
      description: 'Crispy, bright orange spirals soaked in sugar syrup, a perfect sweet indulgence.',
      rating: 4.6
    },
    {
      id: 5,
      name: 'Kulfi',
      image: 'https://www.blendwithspices.com/wp-content/uploads/2021/06/khoya-kulfi-recipe-500x500.jpg',  // Free image link for Kulfi
      price: 50,
      description: 'Traditional Indian ice cream, rich and dense, flavored with cardamom and pistachios.',
      rating: 4.9
    },
    {
      id: 6,
      name: 'Chocolate Brownie',
      image: 'https://recipesblob.oetker.in/assets/0e7149831748458c9502e361e889f726/964x526/brownie-with-vanilla-ice-cream.jpg',  // Free image link for Chocolate Brownie
      price: 120,
      description: 'A rich, fudgy chocolate dessert topped with a scoop of vanilla ice cream.',
      rating: 4.8
    },
    {
      id: 7,
      name: 'Carrot Halwa',
      image: 'https://indianvegrecipe.com/wp-content/uploads/2020/01/carrot-halwa-recipe.jpg',  // Free image link for Carrot Halwa
      price: 90,
      description: 'Grated carrots cooked in ghee, milk, and sugar, topped with nuts and raisins.',
      rating: 4.7
    },
    {
      id: 8,
      name: 'Mango Mousse',
      image: 'https://thebigmansworld.com/wp-content/uploads/2023/07/mango-mousse-recipe.jpg',  // Free image link for Mango Mousse
      price: 110,
      description: 'A light and creamy dessert made with ripe mangoes and whipped cream.',
      rating: 4.8
    },
    {
      id: 9,

      name: 'Chum Chum',
      image: 'https://vaya.in/recipes/wp-content/uploads/2018/03/Chum-chum.jpg',  // Free image link for Chum Chum
      price: 80,
      description: 'Soft and spongy milk-based sweet, soaked in sugar syrup and garnished with coconut.',
      rating: 4.7
    },

    {
      id: 10,
      name: 'Soan Papdi',
      image: 'https://www.indianrecipeinfo.com/wp-content/uploads/2010/12/Soan-Papdi.jpg',  // Free image link for Soan Papdi
      price: 100,
      description: 'A flaky, sweet Indian dessert made from gram flour and sugar, with a unique texture.',
      rating: 4.6
    },
    {
      id: 11,
      name: 'Sooji Halwa',
      image: 'https://www.funfoodfrolic.com/wp-content/uploads/2020/10/Suji-Halwa-Thumbnail.jpg',  // Free image link for Sooji Halwa
      price: 70,
      description: 'A sweet dish made from semolina, cooked with ghee, sugar, and flavored with cardamom and nuts.',
      rating: 4.5
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
    return desserts.filter(dish =>
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [desserts, searchTerm]);

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
        <h2 className='mb-0'>DESSERT DELIGHTS</h2>
        <p className='secBtmCnt m-0 mb-2'>Sweeten your day with every bite.</p>
        <div className="search-bar mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Find your favorite dessert..."
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
          <p className="text-center">No desserts found. Please try a different search.</p>
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
    </section>
  );
};

export default Desserts;
