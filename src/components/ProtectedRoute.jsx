import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUser, isAllowedRole, removeUser } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  const user = getUser();
  const location = useLocation();

  if (!user || !isAllowedRole(user.role)) {
    // Boshqa roldagi akkaunt saqlanib qolgan bo'lsa — tozalaymiz.
    if (user) removeUser();
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
