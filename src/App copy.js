import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MenuPage from './components/MenuPage';
import NavBarTop from './components/NavBarTop';
import NavBarLeft from './components/NavBarLeft';
import Login from './components/Login';
import Demo from './components/Demo';
import OrderForm from './components/billing/OrderForm';
import CreateTokenForm from './components/billing/CreateTokenForm';

import Notification from './components/Notification';
import CustomerList from './components/CustomerList';
import Billing from './components/Billing';
import Report from './components/Report';
import CartMain from './components/CartMain';
import PageNotFound from './components/PageNotFound';
import Cart from './components/menuComponent/Cart'
import HotDishesDem from './components/menuComponent/HotDishes';
import DessertDem from './components/menuComponent/Dessert';
import { AuthProvider, useAuth } from './components/Auth/AuthContext';
import Dashboard from './components/dashboard/Dashboard'
import AddBilling from './components/billing/AddBilling'
import SearchBilling from './components/billing/SearchBilling'
import TableBooking from './components/booking/TableBooking';
import EstimationBill from './components/billing/EstimationBill'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  const location = useLocation();
  const shouldShowNav = location.pathname !== '/login';

  return (
    <AuthProvider>
      <div >
        {shouldShowNav && (
          <>
            <NavBarTop />

            <div className="dashBoardMain">
              <div className="leftNavMain">
                <NavBarLeft />
              </div>
              <div
                className="dashboardRight"
                style={{ padding: '100px 50px 50px 120px' }}
              >

                <div className='container-fluid'>

                  <Routes>
                    <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
           
                    <Route path="/order-form" element={<ProtectedRoute><OrderForm /></ProtectedRoute>} />
                    <Route path="/demo" element={<ProtectedRoute><Demo /></ProtectedRoute>} />
                    <Route path="/demoCartLogic" element={<ProtectedRoute><HotDishesDem /></ProtectedRoute>} />
                    <Route path="/add-billing" element={<ProtectedRoute><AddBilling /></ProtectedRoute>} />
                    <Route path="/estimation" element={<ProtectedRoute><EstimationBill /></ProtectedRoute>} />
                    <Route path="/demoCartLogic2" element={<ProtectedRoute><DessertDem /></ProtectedRoute>} />
                    <Route path="/table-booking" element={<ProtectedRoute><TableBooking /></ProtectedRoute>} />
                    <Route path="/create-token" element={<ProtectedRoute><CreateTokenForm /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/search-billing" element={<ProtectedRoute><SearchBilling /></ProtectedRoute>} />
                    <Route path="/cartDem" element={<ProtectedRoute><CartMain /></ProtectedRoute>} />
                    <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
                    <Route path="/" element={<ProtectedRoute><CustomerList /></ProtectedRoute>} />

                    <Route path="/notification" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>

                </div>
              </div>
            </div>

          </>
        )}
      </div>

      <Routes>
        <Route path="/login" element={<Login />} /> {/* Make sure the login page is here */}
      </Routes>

    </AuthProvider >
  );
};

export default App;