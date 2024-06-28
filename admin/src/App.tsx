import { Layout } from "antd";
import "antd/dist/antd.css";
import Sider from "antd/es/layout/Sider";
import "firebase/database";
import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./App.css";
import AppNavigator from "./navigator/AppNavigator";
import { HeaderComponent } from "./component/Header";
import MenuComponent from "./component/Menu";
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <React.Fragment>
      <AppNavigator />
      <Outlet />
      <ToastContainer/>
    </React.Fragment>
  );
}

export default App;
