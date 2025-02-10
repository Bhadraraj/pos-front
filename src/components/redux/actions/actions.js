// Action types
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_CART_QUANTITY = 'UPDATE_CART_QUANTITY';

// Action to add a product to the cart
export const addToCart = (product) => {
  return (dispatch, getState) => {
    const cartItems = getState().cart.cart; // Accessing the cart state
    const existingProduct = cartItems.find(item => item.id === product.id); // Check if the product already exists in the cart

    if (existingProduct) {
      // If the product exists, update its quantity
      dispatch(updateCartQuantity(product.id, existingProduct.quantity + 1));
    } else {
      // If the product does not exist, add it with an initial quantity of 1
      dispatch({
        type: ADD_TO_CART,
        payload: { ...product, quantity: 1 },
      });
    }
  };
};

// Action to remove a product from the cart
export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});

// Action to update the quantity of a product in the cart
export const updateCartQuantity = (productId, quantity) => {
  return (dispatch, getState) => {
    const cartItems = getState().cart.cart; // Accessing the cart state
    const existingProduct = cartItems.find(item => item.id === productId); // Check if the product exists

    if (existingProduct) {
      if (quantity > 0) {
        // If quantity is greater than 0, update the quantity
        dispatch({
          type: UPDATE_CART_QUANTITY,
          payload: { productId, quantity },
        });
      } else {
        // If quantity is 0 or less, remove the product from the cart
        dispatch(removeFromCart(productId));
      }
    }
  };
};
