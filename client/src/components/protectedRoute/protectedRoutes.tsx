import { Navigate, Outlet } from "react-router-dom";
import useUser from "../../hooks/useUser.ts";
import React from "react";

export const ProtectedRoute = () => {
    const userContext = useUser();
  
    if (!userContext?.user) {
      return <Navigate to="/account/login" replace={true} />;
    }
  
    return <Outlet />;
  };