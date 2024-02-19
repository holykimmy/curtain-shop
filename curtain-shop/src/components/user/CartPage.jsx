import React from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import blackout from "../img/products/blackout.jpeg";
import Footer from "../Footer";
import ProductDetail from "./ProductDetail";

const cartItems = [
  { product: 'Vans Sk8-Hi MTE Shoes', price: 89, quantity: 2 }
];

function ContactPage() {
  
  return (
    <>
      <Navbar />
      <div class="titlea bg-brown-bg py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
          ออกแบบผ้าม่านของคุณ
        </h5>
      </div>
      {/* Cart */}
      <div className="container">
        {/* <div className=" alert alert-info text-center mt-3">
          Your cart is empty
          <Link
            className="btn btn-success mx-5 px-5 py-3"
            to="/"
            style={{
              fontSize: "12px",
            }}
          >
            SHOPPING NOW
          </Link>
        </div> */}
        <div className=" alert alert-info text-center mt-3">
          Total Cart Products
          <Link className="text-success mx-2" to="/cart">
            (4)
          </Link>
        </div>
        {/* cartiterm */}
        <div className="cart-iterm row">
          <div className="remove-button d-flex justify-content-center align-items-center">
            <i className="fas fa-times"></i>
          </div>
          <div className="cart-image col-md-3">
            <img src="/images/2.png" alt="nike" />
          </div>
          <div className="cart-text col-md-5 d-flex align-items-center">
            <Link to="#">
              <h4>Nike Girls Shoe</h4>
            </Link>
          </div>
          <div className="cart-qty col-md-2 col-sm-5 mt-md-5 mt-3 mt-md-0 d-flex flex-column justify-content-center">
            <h6>QUANTITY</h6>
            <select>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
          <div className="cart-price mt-3 mt-md-0 col-md-2 align-items-sm-end align-items-start  d-flex flex-column justify-content-center col-sm-7">
            <h6>SUBTOTAL</h6>
            <h4>$456</h4>
          </div>
        </div>

        {/* End of cart iterms */}
        <div className="total">
          <span className="sub">total:</span>
          <span className="total-price">$567</span>
        </div>
        <hr />
        <div className="cart-buttons d-flex align-items-center row">
          <Link to="/products" className="col-md-6 ">
            <button>Continue To Shopping</button>
          </Link>
          <div className="col-md-6 d-flex justify-content-md-end mt-3 mt-md-0">
            <button>
              <Link to="/check-order" className="text-white">
                Checkout
              </Link>
            </button>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};
export default ContactPage;
