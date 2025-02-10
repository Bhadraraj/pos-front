import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem('auth');
    const storedLoginTime = localStorage.getItem('loginTime');

    if (storedAuth && storedLoginTime) {
      const timeElapsed = Date.now() - parseInt(storedLoginTime, 10);
      if (timeElapsed < 3600000) {
        return true;
      }
    }
    return false;
  });

  const [authTimer, setAuthTimer] = useState(null);

  const login = () => {
    setIsAuthenticated(true);
    const currentTime = Date.now();
    localStorage.setItem('auth', 'true');
    localStorage.setItem('loginTime', currentTime.toString());  // Make sure the time is stored as a string

    const timer = setTimeout(() => {
      logout();
    }, 3600000);  // 1 hour session timeout
    setAuthTimer(timer);
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (authTimer) clearTimeout(authTimer);
    localStorage.removeItem('auth');
    localStorage.removeItem('loginTime');
  };

  useEffect(() => {
    if (isAuthenticated) {
      const storedLoginTime = localStorage.getItem('loginTime');
      if (storedLoginTime) {
        const timeElapsed = Date.now() - parseInt(storedLoginTime, 10);
        const remainingTime = 3600000 - timeElapsed; // Time left in the session
        const timer = setTimeout(() => {
          logout();
        }, remainingTime);
        setAuthTimer(timer);
      }
    }

    // Cleanup on unmount or before starting a new session timer
    return () => {
      if (authTimer) clearTimeout(authTimer);
    };
  }, [isAuthenticated]); // Only depend on isAuthenticated

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
