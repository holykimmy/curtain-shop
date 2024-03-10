import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const authUser = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    console.log("login",isLoggedIn);
    useEffect(() => {
      const authToken = localStorage.getItem("token");
      if (!authToken || !isLoggedIn) {
        navigate("/");
      }
    }, [isLoggedIn, navigate]);

    return isLoggedIn ? <WrappedComponent {...props} /> : null;
  };

  return AuthComponent;
};

export default authUser;
