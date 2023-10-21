import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/user/HomePage";
import RegisterPage from "./components/RegisterPage";
import ContactPage from "./components/user/ContactPage";
import ServicePage from "./components/user/ServicePage";
import ProductsPage from "./components/user/ProductsPage";
import AccountPage from "./components/user/AccountPage";
import ProductDetail from "./components/user/ProductDetail";
import CategoryPage from "./components/user/CategoryPage";
//admin
import MenuPage from "./components/admin/MenuPage";
import ReceiptPage from "./components/admin/ReceiptPage";
import QuotationPage from "./components/admin/QuotationPage";
import InvoicePage from "./components/admin/InvoicePage";
import AddProductPage from "./components/admin/AddProductPage";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/service", element: <ServicePage /> },
  { path: "/products", element: <ProductsPage /> },
  { path: "/account", element: <AccountPage /> },
  { path: "/product-detail", element: <ProductDetail /> },
  { path: "/category", element: <CategoryPage /> },
  {path: "/menu", element: <MenuPage/>},
  {path: "/receipt", element: <ReceiptPage/>},
  {path: "/quotation", element: <QuotationPage/>},
  {path: "/invoice", element:<InvoicePage/> },
  {path: "/add-product", element: <AddProductPage/>}
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
