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
import TestingComponent from './TestingComponent';
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
import OrderStatusListing from './components/billing/OrderStatusListing'
import Cashier from './components/billing/Cashier'
import PrintOrderedBill from './components/billing/PrintOrderedBill'

import TableBooking from './components/booking/TableBooking';
import EstimationBill from './components/billing/EstimationBill'
import PrintBill from './components/billing/PrintBill'
import SearchBill from './components/billing/SearchBill'
import PrintBillCard from './components/billing/PrintBillCard'
import KitchenView from './components/billing/KitchenView'
import InvoiceListing from './components/billing/InvoiceListing'
import PaymentsList from './components/billing/PaymentList'

import OrderedList from './components/billing/OrderedList'
import UpdateOrder from './components/billing/UpdateOrder'
// import AddProductListing from './components/billing/AddProductListing'
import AddProductListing from './components/billing/AddProductListing'
import PrintKitchenBill from './components/billing/PrintKitchenBill'
import ResturantOrderForm from './components/billing/ResturantOrderForm'
// import PrintBill from './components/billing/PrintBill'


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
                    <Route path="/payment-list-user" element={<ProtectedRoute><PaymentsList /></ProtectedRoute>} />
                    <Route path="/update-order" element={<ProtectedRoute><UpdateOrder /></ProtectedRoute>} />
                    <Route path="/ordered-list" element={<ProtectedRoute><OrderedList /></ProtectedRoute>} />
                    <Route path="/demoCartLogic" element={<ProtectedRoute><HotDishesDem /></ProtectedRoute>} />
                    <Route path="/cashier" element={<ProtectedRoute><Cashier /></ProtectedRoute>} />
                    <Route path="/add-billing" element={<ProtectedRoute><AddBilling /></ProtectedRoute>} />
                    <Route path="/kitchen-view" element={<ProtectedRoute><KitchenView /></ProtectedRoute>} />
                    <Route path="/add-menus" element={<ProtectedRoute><AddProductListing /></ProtectedRoute>} />
                    <Route path="/print-bill" element={<ProtectedRoute><PrintBill /></ProtectedRoute>} />
                    <Route path="/testing" element={<ProtectedRoute><TestingComponent /></ProtectedRoute>} />
                    <Route path="/estimation" element={<ProtectedRoute><EstimationBill /></ProtectedRoute>} />
                    <Route path="/demoCartLogic2" element={<ProtectedRoute><DessertDem /></ProtectedRoute>} />
                    <Route path="/order-status" element={<ProtectedRoute><OrderStatusListing /></ProtectedRoute>} />
                    <Route path="/table-booking" element={<ProtectedRoute><TableBooking /></ProtectedRoute>} />
                    <Route path="/resturant-form" element={<ProtectedRoute><ResturantOrderForm /></ProtectedRoute>} />
                    <Route path="/print-billCard" element={<ProtectedRoute><PrintBillCard /></ProtectedRoute>} />
                    <Route path="/demo" element={<ProtectedRoute><Billing /></ProtectedRoute>} />

                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />

                    <Route path="/search-bill" element={<ProtectedRoute><SearchBill /></ProtectedRoute>} />
                    <Route path="/print-kitchen-bill" element={<ProtectedRoute><PrintKitchenBill /></ProtectedRoute>} />
                    <Route path="/cartDem" element={<ProtectedRoute><CartMain /></ProtectedRoute>} />
                    <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
                    <Route path="/invoice-list" element={<ProtectedRoute><InvoiceListing /></ProtectedRoute>} />
                    {/* <Route path="/" element={<ProtectedRoute><CustomerList /></ProtectedRoute>} /> */}

                    <Route path="/notification" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
                    <Route path="/print_CardBill" element={<ProtectedRoute><PrintOrderedBill /></ProtectedRoute>} />
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