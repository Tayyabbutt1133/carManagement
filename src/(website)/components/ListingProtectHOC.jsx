import React from "react";
import { Navigate } from "react-router-dom";

const ListingProtectHOC = (WrappedComponent) => {
  
  
  const ProtectedComponent = (props) => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      // Redirect to sign-in page if token not found
      return <Navigate to="/signin" replace />;
    }

    return <WrappedComponent {...props} />;
  };

  

  return ProtectedComponent;
};

export default ListingProtectHOC;
