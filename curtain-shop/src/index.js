import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
//user
import { ThemeProvider } from "@material-tailwind/react";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/user/HomePage";
import RegisterPage from "./components/RegisterPage";
// import ContactPage from "./components/user/ContactPage";
import ServicePage from "./components/user/ServicePage";
import ProductsPage from "./components/user/ProductsPage";
import AccountPage from "./components/user/AccountPage";
import AddressPage from "./components/user/AddressPage";
import ProductDetail from "./components/user/ProductDetail";
import CategoryPage from "./components/user/CategoryPage";
//product
import Polyester from "./components/user/product/Polyester";

//admin
import DashboardPage from "./components/admin/DashboardPage";
import ReceiptPage from "./components/admin/ReceiptPage";
import QuotationPage from "./components/admin/QuotationPage";
import InvoicePage from "./components/admin/InvoicePage";
import AddProductPage from "./components/admin/AddProductPage";
import AddBrandPage from "./components/admin/AddBrandPage";
import CategoryProduct from "./components/admin/AddCategoryAndType";
import Customers from "./components/admin/Customers";
import Orders from "./components/admin/Orders";
import Products from "./components/admin/Products";
import UpdateProduct from "./components/admin/UpdateProduct";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/service", element: <ServicePage /> },
  { path: "/products", element: <ProductsPage /> },
  { path: "/account", element: <AccountPage /> },
  { path: "/address", element: <AddressPage /> },
  { path: "/product-detail", element: <ProductDetail /> },
  { path: "/category", element: <CategoryPage /> },
  //product
  {path : "product/polyester", element: <Polyester/>},
  //admin
  { path: "/dashboard", element: <DashboardPage/>},
  { path: "/receipt", element: <ReceiptPage/>},
  { path: "/quotation", element: <QuotationPage/>},
  { path: "/invoice", element:<InvoicePage/> },
  { path: "/add-product", element: <AddProductPage/>},
  { path: "/add-brand", element: <AddBrandPage/>},
  { path: "/add-category", element:<CategoryProduct/>},
  { path: "/customers", element: <Customers/> },
  { path: "/orders", element: <Orders/>},
  { path: "/products-ad", element: <Products/>},
  { path: "/update-product/:productId", element:<UpdateProduct/>},

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
