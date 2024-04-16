import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
// import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//user
import { ThemeProvider } from "@material-tailwind/react";
import LoginPage from "./components/LoginPage";
import ForgotPage from "./components/ForgotPage";
import ResetPage from "./components/ResetPage";

import HomePage from "./components/user/HomePage";
import RegisterPage from "./components/RegisterPage";
import ContactPage from "./components/user/ContactPage";
import ServicePage from "./components/user/ServicePage";
import ProductsPage from "./components/user/ProductsPage";
import AccountPage from "./components/user/AccountPage";
import AddressPage from "./components/user/AddressPage";
import EditAddressPage from "./components/user/EditAddressPage";

import AccountEditPage  from "./components/user/AccountEditPage";


import ProductDetail from "./components/user/ProductDetail";
// import CategoryPage from "./components/user/CategoryPage";
import CartPage from "./components/user/CartPage";
import CheckOrder from "./components/user/CheckOrderPage";
import Recommend from "./components/user/RecommendPage";
import Gauging from "./components/user/GaugingPage";
import CustomPage from "./components/user/CustomPage";
import FabricType from "./components/user/TypeCurtainsPage";
import Achievement from "./components/user/AchievementPage";
import Payment from "./components/user/PaymentPage";
import OrderDetailPage from "./components/user/OrderDetailPage";

// import CheckOutPage from "./components/user/CheckOutPage";
import AboutOrderPage from "./components/user/AboutOrderPage";

//product
import Polyester from "./components/user/product/Polyester";
import Velvet from "./components/user/product/Velvet";
import Cotton from "./components/user/product/Cotton";
import Linen from "./components/user/product/Linen";
import Mixed from "./components/user/product/Mixed";
import Blackout from "./components/user/product/Blackout";
import Wave from "./components/user/product/Wave";
import Satin from "./components/user/product/Satin";
import Equipment from "./components/user/product/Equipment";

//admin
import DashboardPage from "./components/admin/DashboardPage";
import ReceiptPage from "./components/admin/ReceiptPage";
import QuotationPage from "./components/admin/QuotationPage";
import HistoryQuotationPage from "./components/admin/historyQuotation";
import HistoryInvoicePage from "./components/admin/historyInvoice";
import UpdateQuotationPage from "./components/admin/updateQuotation";
import UpdateInvoicePage from "./components/admin/updateInvoice";
import ReceptDetailQuotation from "./components/admin/receptDetailQuotation";
import ReceptDetailInvoice from "./components/admin/receptDetailInvoice";



import InvoicePage from "./components/admin/InvoicePage";
import AddProductPage from "./components/admin/AddProductPage";
import AddBrandPage from "./components/admin/AddBrandPage";
import AddTypePage from "./components/admin/AddTypePage";
import TypePage from "./components/admin/TypePage";
import UpdateTypePage from "./components/admin/updateTypePage";
import UpdateTypeBgPage from "./components/admin/updateTypeBgPage";



import CategoryProduct from "./components/admin/AddCategoryAndType";
import Customers from "./components/admin/Customers";
import Orders from "./components/admin/Orders";
import OrderDetail from "./components/admin/OrderDetail";
import CancelOrder from "./components/admin/cancelOrder";
import PostOrder from "./components/admin/postcodeOrder";



import Products from "./components/admin/Products";
import UpdateProduct from "./components/admin/UpdateProduct";

// import { store } from "./app/store";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./components/reducers/indexReducer";
import { composeWithDevTools } from "@redux-devtools/extension";
import { useDispatch, useSelector } from "react-redux";

// import { StrictMode } from "react";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPage /> },
  { path: "/reset-password/:idUser", element: <ResetPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/service", element: <ServicePage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/products", element: <ProductsPage /> },
  { path: "/account", element: <AccountPage /> },
  { path: "/edit-profile", element: <AccountEditPage /> },
  { path: "/address", element: <AddressPage /> },
  { path: "/edit-address/:id", element: <EditAddressPage /> },

  { path: "/product-detail/:productId", element: <ProductDetail /> },
  // { path: "/category", element: <CategoryPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/check-order/:idOrder", element: <CheckOrder /> },
  { path: "/recommended-curtain", element: <Recommend /> },
  { path: "/gauging-curtain", element: <Gauging /> },
  { path: "/custom-product", element: <CustomPage /> },
  { path: "/Fabric-Type", element: <FabricType /> },
  { path: "/Achievements", element: <Achievement /> },
  { path: "/about-order/:selectedButton", element: <AboutOrderPage /> },
  { path: "/payment/:idOrder", element: <Payment /> },
  { path: "/order-detail/:idOrder", element: <OrderDetailPage /> },


  { path: "/custom-product/:productId", element: <CustomPage /> },
  //product
  { path: "/product/polyester", element: <Polyester /> },
  { path: "/product/velvet", element: <Velvet /> },
  { path: "/product/satin", element: <Satin /> },
  { path: "/product/cotton", element: <Cotton /> },
  { path: "/product/linen", element: <Linen /> },
  { path: "/product/blackout", element: <Blackout /> },
  { path: "/product/mixed", element: <Mixed /> },
  { path: "/product/wave", element: <Wave /> },
  { path: "/product/equipment", element: <Equipment /> },

  //admin
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/receipt", element: <ReceiptPage /> },
  { path: "/quotation", element: <QuotationPage /> },
  { path: "/invoice", element: <InvoicePage /> },
  { path: "/quotation/all", element: <HistoryQuotationPage /> },
  { path: "/invoice/all", element: <HistoryInvoicePage /> },
  { path: "/quotation-detail/:id", element: <ReceptDetailQuotation />},
  { path: "/invoice-detail/:id", element: <ReceptDetailInvoice />},
  { path: "/quotation-update/:id", element: <UpdateQuotationPage />},
  { path: "/invoice-update/:id", element: <UpdateInvoicePage />},
  { path: "/update-type/:id", element: <UpdateTypePage /> },
  { path: "/update-typebg/:id", element: <UpdateTypeBgPage /> },




  { path: "/add-product", element: <AddProductPage /> },
  { path: "/add-brand", element: <AddBrandPage /> },
  { path: "/add-type", element: <AddTypePage /> },
  { path: "/type", element: <TypePage /> },


  { path: "/add-category", element: <CategoryProduct /> },
  { path: "/customers", element: <Customers /> },
  { path: "/orders/:selectedButton", element: <Orders /> },
  { path: "/order-detail-ad/:idOrder", element: <OrderDetail /> },
  { path: "/order-cancel/:idOrder", element: <CancelOrder /> },
  { path: "/order-post/:idOrder", element: <PostOrder /> },

  { path: "/products-ad", element: <Products /> },
  { path: "/update-product/:productId", element: <UpdateProduct /> },
]);

const store = createStore(rootReducer, composeWithDevTools());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();