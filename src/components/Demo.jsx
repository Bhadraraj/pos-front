// Dessert.js
import React, { useState, useEffect } from 'react';
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { GrFormAdd, GrFormSubtract } from "react-icons/gr";
import { FiSearch } from "react-icons/fi";
import Cart from './CartMain';
import { Link } from 'react-router-dom'

const Dessert = () => {
  const desserts = [
    {
      id: 1,
      name: 'Gulab Jamun',
      image: 'https://aartimadan.com/wp-content/uploads/2020/11/milk-powder-gulab-jamuns.jpg',
      price: 90,
      description: 'Sweet and soft milk-based dumplings soaked in sugar syrup.',
      rating: 4.9
    },
    {
      id: 2,
      name: 'Rasmalai',
      image: 'https://www.kashmironlinestore.com/cdn/shop/articles/Untitled_design_54.jpg?v=1692702218',
      price: 100,
      description: 'Delicate, spongy cheese balls soaked in a sweet, flavored milk syrup.',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Kheer',
      image: 'https://www.munatycooking.com/wp-content/uploads/2020/04/Kheer-feature-image-500x500.jpg',
      price: 70,
      description: 'A creamy rice pudding cooked with milk, sugar, and flavored with cardamom and saffron.',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Jalebi',
      image: 'https://www.cookwithnabeela.com/wp-content/uploads/2024/02/1Jalebi.webp',
      price: 80,
      description: 'Crispy, bright orange spirals soaked in sugar syrup, a perfect sweet indulgence.',
      rating: 4.6
    },
    {
      id: 5,
      name: 'Kulfi',
      image: 'https://www.blendwithspices.com/wp-content/uploads/2021/06/khoya-kulfi-recipe-500x500.jpg',
      price: 50,
      description: 'Traditional Indian ice cream, rich and dense, flavored with cardamom and pistachios.',
      rating: 4.9
    },
  ];

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDishes, setFilteredDishes] = useState(desserts);
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState({});
  const [discount, setDiscount] = useState(0);

  const itemsPerPage = 8;

  const toggleReadMore = (id) => {
    setExpanded((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleSearch = () => {
    const filtered = desserts.filter(dish =>
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredDishes(filtered.length > 0 ? filtered : []);
    setCurrentPage(1);
  };

  const handleAddToCart = (dish) => {
    const existsInCart = cart.find(item => item.id === dish.id);
    if (existsInCart) {
      const updatedCart = cart.map(item =>
        item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...dish, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (dish) => {
    const updatedCart = cart.map(item =>
      item.id === dish.id ? { ...item, quantity: item.quantity - 1 } : item
    ).filter(item => item.quantity > 0);
    setCart(updatedCart);
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const gst = subtotal * 0.16;
    let discountAmount = 0;

    if (discount.toString().includes('%')) {
      const percent = parseFloat(discount.replace('%', ''));
      discountAmount = subtotal * (percent / 100);
    } else {
      discountAmount = parseFloat(discount);
    }

    const totalAmount = subtotal + gst - (discountAmount || 0);
    return { subtotal, gst, totalAmount };
  };

  const { subtotal, gst, totalAmount } = calculateTotal();

  // Pagination
  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);
  const indexOfLastDish = currentPage * itemsPerPage;
  const indexOfFirstDish = indexOfLastDish - itemsPerPage;
  const currentDishes = filteredDishes.slice(indexOfFirstDish, indexOfLastDish);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchTerm]);

  return (
    <div>
      <section className="menuSection">
        <div className="row g-4">
          <h2 className='mb-0'>SWEET ESCAPE</h2>
          <p className='secBtmCnt m-0 mb-2'>Delight in every decadent bite.</p>

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

          {/* Product Listing */}
          {currentDishes.length > 0 ? (
            currentDishes.map((dish) => (
              <div key={dish.id} className="col-xl-3 col-lg-4 col-sm-6 d-flex justify-content-center align-items-center">
                <div className="menuCardOuter">
                  <div className="menuCard">
                    <div className="foodCatgoryImg">
                      <img src={dish.image} alt={dish.name} className="img-fluid" />
                    </div>
                    <div className="row py-2">
                      <div className="col-8">
                        <h5>{dish.name}</h5>
                        <p className="mb-0"><MdOutlineCurrencyRupee />{dish.price}.00</p>
                      </div>
                      <div className="col-4 text-end">
                        <span>{Array.from({ length: Math.round(dish.rating) }).map((_, i) => (
                          <FaStar key={i} className="text-warning" />
                        ))}</span>
                      </div>
                    </div>
                    <p className={`menuDescription ${expanded[dish.id] ? 'expanded' : ''}`}>
                      {dish.description}
                    </p>
                    <button onClick={() => toggleReadMore(dish.id)}>
                      {expanded[dish.id] ? 'Read Less' : 'Read More'}
                    </button>
                    <button className="btn btn-primary" onClick={() => handleAddToCart(dish)}>
                      <GrFormAdd /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No desserts found.</p>
          )}
        </div>
      </section>

      {/* Cart Section */}

      <h1> <Link to='/cart'>Go to cart </Link></h1>
      <Cart
        cart={cart}
        handleAddToCart={handleAddToCart}
        handleRemoveFromCart={handleRemoveFromCart}
        subtotal={subtotal}
        gst={gst}
        discount={discount}
        setDiscount={setDiscount}
      />
    </div>
  );
};

export default Dessert;




// NEED TO IMPROVE 
// 1, Dont show thw cart component in DEssert Component  itself, while clicking GO TO CART text it will redirect to the cart page to See the added product ,