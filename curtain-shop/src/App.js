import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "./components/user/HomePage";
import Autocomplete from "react-google-autocomplete";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import MenuPage from "./components/admin/MenuPage";

import "./App.css";
// import LoginPage from "./components/LoginPage";
function App() {
  return (
    <>
      {/* <script src="https://cdn.tailwindcss.com"></script>
      <script
        type="module"
        src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
      ></script>
      <script
        nomodule
        src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
      ></script>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;300&display=swap"
        rel="stylesheet"
      />
    */}
      <HomePage />
    </>
  );
}

export default App;
