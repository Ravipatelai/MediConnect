// src/components/ProtectedRoute.jsx
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const navigate = useNavigate();
//   const location = useLocation();

  useEffect(() => {
    if (!name || !role) {
      toast.error("Please login to access this page");
      navigate("/login", { replace: true });
    } else if (allowedRoles && !allowedRoles.includes(role)) {
      toast.error("You do not have permission to access this page");
      setTimeout(() => {
         navigate(-1); // Go back to the previous page
      },1000)
     
    }
  }, [name, role, allowedRoles, navigate]);

  if (!name || !role || (allowedRoles && !allowedRoles.includes(role))) {
    return null; // Don’t render children while redirecting
  }

  return children;
};

export default ProtectedRoute;
