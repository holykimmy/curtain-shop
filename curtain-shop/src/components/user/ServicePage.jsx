import React from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import serimg1 from "../img/serimg1.jpeg";
import serimg2 from "../img/serimg2.jpeg";
import Footer from "../Footer";
function ServicePage() {
  return (
    <>
      {" "}
      <div className="h-screen w-full bg-gradient-to-r from-5% from-white via-50% via-brown-bg to-90% to-white">
        <Navbar></Navbar>

        <div class="titlea  py-1 shadow-md">
          <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
          <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
            บริการของเรา
          </h5>
        </div>

        <div className="flex justify-center items-center ">
          <p class="p-5 text-b-font text-lg">บริการติดตั้งวอลเปเปอร์</p>
        </div>
        <div className=" bg-brown-blog">
          <div class="about flex shadow-md">
            <div class="sideabout flex-[35%]">
              <img class="shadow-2xl" src={serimg1} alt="about" width="100%" />
            </div>
            <div class="sideabout flex-[65%] text-xl md:text-2xl xl:text-3xl text-b-font p-10 justify-center">
              <h1 class="mt-0 mx-auto text-center">jiktuyi</h1>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center ">
          <p class="p-5 text-b-font text-lg">บริการติดตั้งผ้าม่าน</p>
        </div>
        <div className=" bg-brown-blog">
          <div class="about flex shadow-md">
            <div class="sideabout flex-[65%] text-xl md:text-2xl xl:text-3xl text-b-font p-10 justify-center">
              <h1 class="mt-0 mx-auto text-center">jiktuyi</h1>
            </div>
            <div class="sideabout flex-[35%]">
              <img class="shadow-2xl" src={serimg2} alt="about" width="100%" />
            </div>
          </div>
        </div>
        <Footer></Footer>
      </div>
      
    </>
  );
}
export default ServicePage;
