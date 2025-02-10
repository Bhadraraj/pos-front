import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true'; // Check if user is authenticated
  });

  const [userID, setUserID] = useState(() => {
    return localStorage.getItem('userID') || null; // Retrieve userID from localStorage
  });

  // Handle user login
  const login = (userData) => {
    setIsAuthenticated(true);
    setUserID(userData.UserID);  // Store the UserID globally

    localStorage.setItem('auth', 'true');
    localStorage.setItem('userID', userData.UserID);  // Store userID in localStorage
  };

  // Handle user logout
  const logout = () => {
    setIsAuthenticated(false);
    setUserID(null); // Clear userID on logout

    localStorage.removeItem('auth');
    localStorage.removeItem('userID');  // Remove userID from localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userID, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
