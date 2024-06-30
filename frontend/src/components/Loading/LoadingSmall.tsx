import React from "react";
import "./Loading.css";
const LoadingSmall = () => {
  return (
    <div className="fixed inset-0 z-20 flex h-screen items-center justify-center space-x-2 bg-black bg-opacity-40">
      <span className="sr-only">Loading...</span>
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingSmall;
