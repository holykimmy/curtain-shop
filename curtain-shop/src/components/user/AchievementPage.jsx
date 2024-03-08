import React from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import g1 from "../img/g1.jpg";
import g2 from "../img/g2.jpg";
import g3 from "../img/g3.jpg";
import g4 from "../img/g4.jpg";
import g5 from "../img/g5.jpg";
import g6 from "../img/g6.jpg";
import Footer from "../Footer";


function ServicePage() {
  return (
    <>
      {" "}
      <div className="h-screen w-full bg-gradient-to-r from-5% from-white via-50% via-brown-bg to-90% to-white">
        <Navbar></Navbar>

        <div class="titlea  py-1 shadow-md">
          <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
          <h5 className=" inline-block text-lg md:text-xl xl:text-4xl text-b-font  pl-4 p-2 my-1">
            ผลงานของร้าน
          </h5>
        </div>

        
        <Footer></Footer>
      </div>
      
    </>
  );
}
export default ServicePage;
