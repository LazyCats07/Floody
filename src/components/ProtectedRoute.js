import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from "./firebase-config";  // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth";  // Import Firebase auth state change listener

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);  // State to store authentication status

  // Use Firebase's onAuthStateChanged to check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);  // User is authenticated
      } else {
        setIsAuthenticated(false);  // User is not authenticated
      }
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Render loading state while Firebase is checking the user status
  if (isAuthenticated === null) {
    return <div>Loading...</div>;  // Optionally, show a loading spinner or skeleton component
  }

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }

  // If authenticated, render the protected route
  return children;
};

export default ProtectedRoute;
