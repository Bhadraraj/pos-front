import { combineReducers } from 'redux';
import cartReducer from './cartReducer'; // Your cart reducer

const rootReducer = combineReducers({
  cart: cartReducer,
  // other reducers if any
});

export default rootReducer;
