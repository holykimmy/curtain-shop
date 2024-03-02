import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import arrow from "../img/icon/arrow.png";
import about from "../img/about.jpeg";
import Slideshow from "./Slideshow";
import Footer from "../Footer";
import Showing from "./Showing";
import { BsPinFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
// import jwtDecode from "jwt-decode";

function HomePage() {
  const slides = [
    "https://i.ibb.co/ncrXc2V/1.png",
    "https://i.ibb.co/B3s7v4h/2.png",
    "https://i.ibb.co/ncrXc2V/1.png",
    "https://i.ibb.co/B3s7v4h/2.png",
    "https://i.ibb.co/XXR8kzF/3.png",
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = React.useState("");

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    console.log("authToken", authToken);

    if (authToken) {
      // Set up axios default headers
      axios.defaults.headers.common["authtoken"] = authToken;

      const decodedToken = jwtDecode(authToken); // Decode the token

      if (decodedToken && decodedToken.user) {
        const { f_name, l_name } = decodedToken.user;
        setUserName(`${f_name} ${l_name}`);
        setIsLoggedIn(true);
      } else {
        setUserData(decodedToken.user);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  console.log("login", isLoggedIn);

  const handleLogout = () => {
    Swal.fire({
      title: `คุณต้องการออกจากระบบใช่หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        // ยืนยันออกจากระบบ
        localStorage.removeItem("token");
        setUserName("");

        // ใช้ useNavigate เพื่อนำผู้ใช้กลับไปยังหน้าหลัก
        navigate("/"); // ลิงก์ไปยังหน้าหลัก
        window.location.reload();
      }
    });
  };
  console.log("login home", isLoggedIn);
  console.log("username home: ", userName);

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        userName={userName}
      ></Navbar>

      <div class="test flixed">
        <div class="jarern text-[280%] sm:text-[330%] md:text-[370%] lg:text-[450%] text-b-font bg-brown-bg font-[500px] p-[4%] md:p-[2%] text-center">
          {" "}
          เจริญกิจผ้าม่าน{" "}
        </div>
      </div>

      <div className="max-w-full h-[400px] mb-[100px]">
        <Slideshow></Slideshow>
      </div>
      {/* <p className="m-5 text-xl">{userName}</p> */}
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
