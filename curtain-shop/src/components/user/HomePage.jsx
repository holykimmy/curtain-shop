import React from "react";
import Navbar from "../Navbar";
import arrow from "../img/icon/arrow.png";
import about from "../img/about.jpeg";
import Slideshow from "./Slideshow";
import Footer from "../Footer";
import Showing from "./Showing";
import { BsPinFill } from "react-icons/bs";
import { Link } from "react-router-dom";
function HomePage() {
  const slides = [
    "https://i.ibb.co/ncrXc2V/1.png",
    "https://i.ibb.co/B3s7v4h/2.png",
    "https://i.ibb.co/ncrXc2V/1.png",
    "https://i.ibb.co/B3s7v4h/2.png",
    "https://i.ibb.co/XXR8kzF/3.png",
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <>
      <Navbar></Navbar>

      <div class="test flixed">
        <div class="jarern text-[280%] sm:text-[330%] md:text-[370%] lg:text-[450%] text-b-font bg-brown-bg font-[500px] p-[4%] md:p-[2%] text-center">
          {" "}
          เจริญกิจผ้าม่าน{" "}
        </div>
      </div>

      <div className="max-w-full h-[400px] mb-[100px]">
        <Slideshow></Slideshow>
      </div>
      <Link to="/custom-product">
        <div class="create font-[500px] text-2xl md:text-3xl xl:text-4xl text-b-font text-center  p-[30px]">
          {" "}
          ออกแบบผ้าม่านของคุณ{" "}
        </div>
      </Link>
      <div class="arrow flex mb-[30px] items-center justify-evenly">
        <img src={arrow} alt="arrow" width="75%" />
      </div>
      <div className=" bg-brown-blog">
        <div class=" py-4">
          <div class="titlea bg-white/60 py-1 shadow-md">
            <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
            <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
              เกี่ยวกับเรา
            </h5>
          </div>
        </div>
        <div class="about flex shadow-md">
          <div class="sideabout  flex-[50%]">
            <img class="shadow-2xl" src={about} alt="about" width="75%" />
          </div>
          <div class="sideabout flex-[50%] text-xl md:text-2xl xl:text-3xl text-b-font  py-[30px] md:py-[50px]">
            <p class="text-center ">
              ร้านค้าเจริญกิจผ้าม่าน
              ร้านของเราเป็นร้านสำหรับการสั่งตัดผ้าม่านโดยเฉพาะ
            </p>
            <p class="py-[30px] md:py-[40px]">
              รับการตัดผ้าม่านแบบครบวงจรทุกรูปแบบ ไม่ว่าจะเป็น รับตัดผ้าม่าน
              มู่ลี่ วอลเปเปอร์{" "}
            </p>
            <p>
              รับการตัดผ้าม่านแบบครบวงจรทุกรูปแบบ ไม่ว่าจะเป็น รับตัดผ้าม่าน
              มู่ลี่ วอลเปเปอร์{" "}
            </p>
          </div>
        </div>
      </div>

      <div class="create font-[500px] text-xl md:text-3xl xl:text-4xl text-b-font text-center py-[30px] md:py-[50px]  ">
        <p>นอกการติดตั้งผ้าม่านแล้ว ทางร้านเรายังมีมู่ลี่ </p>
        <p>และวอลเปเปอร์ติดผนังห้องอีกด้วย</p>
      </div>
      <Showing></Showing>

      <Footer></Footer>
    </>
  );
}
export default HomePage;
