// src/components/redux/store/store.js

import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Correctly using named import
import rootReducer from '../reducers/reducers'; // Import your root reducer

const store = createStore(
  rootReducer,
  applyMiddleware(thunk) // Apply redux-thunk middleware
);

export default store;
