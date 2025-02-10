import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from '../actions/actions';

const initialState = {
  cart: [], // Cart will store all added items
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const existingItem = state.cart.find(item => item.id === action.payload.id);

      if (existingItem) {
        // If item exists, update its quantity
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 } // Increase the quantity
              : item
          ),
        };
      } else {
        // Add new item to cart with quantity 1
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }],
        };
      }
    }

    case REMOVE_FROM_CART: {
      return {
        ...state,
        cart: state.cart.reduce((updatedCart, item) => {
          if (item.id === action.payload) {
            // If the item is the one being removed
            if (item.quantity > 1) {
              // Decrease quantity if more than 1
              updatedCart.push({ ...item, quantity: item.quantity - 1 });
            }
            // If quantity is 1, we don't add it to updatedCart (effectively removing it)
          } else {
            // If it's a different item, just add it to updatedCart
            updatedCart.push(item);
          }
          return updatedCart;
        }, []),
      };
    }

    case UPDATE_CART_QUANTITY: {
      const { productId, quantity } = action.payload;

      return {
        ...state,
        cart: state.cart.reduce((updatedCart, item) => {
          if (item.id === productId) {
            if (quantity > 0) {
              // Update the item's quantity if greater than 0
              updatedCart.push({ ...item, quantity });
            }
            // If quantity is 0 or less, we do not add it (removing the item)
          } else {
            // If it's a different item, just add it to updatedCart
            updatedCart.push(item);
          }
          return updatedCart;
        }, []),
      };
    }

    default:
      return state;
  }
};

export default cartReducer;
