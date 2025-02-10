import React, { useState, useEffect } from 'react';
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { GrFormAdd } from "react-icons/gr";
import { FiSearch } from "react-icons/fi";

const ColdDishes = () => {
  const coldDishes = [
    { id: 1, name: 'Greek Salad', image: 'https://www.tamingtwins.com/wp-content/uploads/2024/07/greek-salad-9.jpg', price: 120, description: 'A refreshing salad made with cucumbers, tomatoes, onions, olives, and feta cheese.', rating: 4.7 },
    { id: 2, name: 'Caprese Salad', image: 'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2019/07/Caprese-Salad-main-1.jpg', price: 130, description: 'A simple Italian salad with fresh mozzarella, tomatoes, and basil drizzled with olive oil.', rating: 4.6 },
    { id: 3, name: 'Cold Soba Noodles', image: 'https://cookingformysoul.com/wp-content/uploads/2022/08/feat2-soba-salad.jpg', price: 150, description: 'Chilled buckwheat noodles served with a savory dipping sauce and fresh vegetables.', rating: 4.5 },
    { id: 4, name: 'Gazpacho', image: 'https://www.funfoodfrolic.com/wp-content/uploads/2023/03/Gazpacho-Blog.jpg', price: 110, description: 'A cold Spanish soup made with tomatoes, cucumbers, and peppers, perfect for summer.', rating: 4.6 },
    { id: 5, name: 'Ceviche', image: 'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2023/04/How-To-Make-Ceviche-4-600x399.jpg', price: 180, description: 'Fresh seafood marinated in lime juice with onions, cilantro, and chili peppers.', rating: 4.8 },
    { id: 6, name: 'Pasta Salad', image: 'https://iwashyoudry.com/wp-content/uploads/2016/02/Pasta-Salad-Web-7.jpg', price: 140, description: 'A hearty salad made with pasta, fresh vegetables, and a tangy vinaigrette.', rating: 4.5 },
    { id: 7, name: 'Avocado Toast', image: 'https://californiaavocado.com/wp-content/uploads/2020/07/California-Avocado-Toast-Three-Ways-768x532.jpeg', price: 100, description: 'Toasted bread topped with mashed avocado, olive oil, and seasonings.', rating: 4.7 },
    { id: 8, name: 'Cold Cucumber Soup', image: 'https://www.foodandwine.com/thmb/GWpIhm_82oEDMGenF6rDyN62Qa4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/FAW-cold-cucumber-soup-yogurt-and-dill-hero-02-19e5f8e4943f478f813c26a977e40a14.jpg', price: 90, description: 'A cool and creamy cucumber soup with yogurt, dill, and garlic.', rating: 4.3 },


    { id: 9, name: 'Greek Salad', image: 'https://www.tamingtwins.com/wp-content/uploads/2024/07/greek-salad-9.jpg', price: 120, description: 'A refreshing salad made with cucumbers, tomatoes, onions, olives, and feta cheese.', rating: 4.7 },
    { id: 10, name: 'Caprese Salad', image: 'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2019/07/Caprese-Salad-main-1.jpg', price: 130, description: 'A simple Italian salad with fresh mozzarella, tomatoes, and basil drizzled with olive oil.', rating: 4.6 },
    { id: 11, name: 'Cold Soba Noodles', image: 'https://cookingformysoul.com/wp-content/uploads/2022/08/feat2-soba-salad.jpg', price: 150, description: 'Chilled buckwheat noodles served with a savory dipping sauce and fresh vegetables.', rating: 4.5 },
    { id: 12, name: 'Gazpacho', image: 'https://www.funfoodfrolic.com/wp-content/uploads/2023/03/Gazpacho-Blog.jpg', price: 110, description: 'A cold Spanish soup made with tomatoes, cucumbers, and peppers, perfect for summer.', rating: 4.6 },



  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDishes, setFilteredDishes] = useState(coldDishes);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of items per page

  const handleSearch = () => {
    const filtered = coldDishes.filter(dish =>
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredDishes(filtered.length > 0 ? filtered : []); // If no dishes match, set to empty array
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);

  // Get current dishes to display
  const indexOfLastDish = currentPage * itemsPerPage;
  const indexOfFirstDish = indexOfLastDish - itemsPerPage;
  const currentDishes = filteredDishes.slice(indexOfFirstDish, indexOfLastDish);


  const [expanded, setExpanded] = useState({});

  const toggleReadMore = (id) => {
    setExpanded((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };





  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  
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
    <>
      <section className="menuSection">
        <div className="row g-4">
          <h2 className='mb-0'>CHILLED INDULGENCE</h2>
          <p className='secBtmCnt m-0 mb-2'>Cool, crisp, and refreshing.</p>

          <div className="search-bar mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Find your favorite dish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-describedby="basic-addon2"
              />
              <span className="input-group-text" onClick={handleSearch}>
                <FiSearch />
              </span>
            </div>
          </div>

          {currentDishes.length > 0 ? (
            currentDishes.map((dish) => (
              <div key={dish.id} className="col-xl-3 col-lg-4 col-sm-6 d-flex justify-content-center align-items-center">
                <div className="menuCardOuter">
                  <div className="menuCard">
                    <div className="foodCatgoryImg">
                      <div className="row">
                        <div className="col-12">
                          <img src={dish.image} alt={dish.name} className="img-fluid" />
                        </div>
                      </div>
                    </div>

                    <div className="row py-2">
                      <div className="col-8 d-flex justify-content-start align-items-center">
                        <p className="menuItemName mb-0 ">{dish.name}</p>
                      </div>
                      <div className="col-4 ps-0 d-flex justify-content-end align-items-center">
                        <p className="menuItemPrice mb-0"><MdOutlineCurrencyRupee />{dish.price}.00</p>
                      </div>
                    </div>

                    <p className="menuItemContent">
                      {expanded[dish.id] ? dish.description : `${dish.description.slice(0, 30)}...`}
                      <span
                        className="readMoreLess"
                        onClick={() => toggleReadMore(dish.id)}
                      >
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
                        <button className="addMenuItems d-flex justify-content-end align-items-center">
                          <GrFormAdd /> ADD
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No DISHES FOUND</p> // Show this when no dishes match
          )}

          {/* Pagination Controls */}
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
      </section>
    </>
  );
};

export default ColdDishes;
