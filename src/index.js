import React from 'react';
import ReactDOM from 'react-dom/client';

// import './components/redux/store/store';
import './styles/forms.css';
import './index.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; // Correctly import BrowserRouter
import { Provider } from 'react-redux'; // Import Provider from react-redux
import store from './components/redux/store/store.js';; // Import the store

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrap the App component with the Provider and pass the store */}
      <BrowserRouter>  {/* Wrap the App component with BrowserRouter */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();