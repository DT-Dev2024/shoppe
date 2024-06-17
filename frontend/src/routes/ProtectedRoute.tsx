import React from "react";
import { Outlet } from "react-router-dom";
// import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute: React.FC = () => {
  return <Outlet />;
  // const accessToken = Cookies.get('accessToken')
  // return accessToken ? <Outlet /> : <Navigate to={'/login'} />
};

export default ProtectedRoute;
