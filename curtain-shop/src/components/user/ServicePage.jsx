import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import serimg1 from "../img/serimg1.jpeg";
import serimg2 from "../img/serimg2.jpeg";
import serimg3 from "../img/serimg3.JPG";
import Footer from "../Footer";
import about from "../img/about.jpeg";
import Slideshow from "./Slideshow";
import Showing from "./Showing";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
function ServicePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = React.useState("");
  const [idUser, setIdUser] = React.useState("");
  useEffect(() => {
    const authToken = localStorage.getItem("token");

    if (authToken) {
      // Set up axios default headers
      axios.defaults.headers.common["authtoken"] = authToken;

      const decodedToken = jwtDecode(authToken); // Decode the token

      if (decodedToken && decodedToken.user) {
        const { f_name, l_name } = decodedToken.user;
        const id = decodedToken.id;
        setIdUser(`${id}`);
        setUserName(`${f_name} ${l_name}`);
        setIsLoggedIn(true);
      } else {
        setUserData(decodedToken.user);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

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
      }
    });
  };

  return (
    <>
      {" "}
      <div className="h-screen w-full bg-gradient-to-r from-5% from-white via-50% via-brown-bg to-90% to-white">
        <Navbar
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          userName={userName}
        ></Navbar>

        <div class="titlea  py-1 shadow-md">
          <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
          <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
            บริการของเรา
          </h5>
        </div>

        <div className="flex justify-center items-center ">
          <p class="p-5 text-b-font text-lg">บริการลงพื้นที่หน้างาน</p>
        </div>
        <div className=" bg-brown-blog">
          <div class="about flex shadow-md">
            <div class="sideabout flex-[25%]">
              <img class="shadow-2xl" src={serimg3} alt="about" width="100%" />
            </div>
            <div class="sideabout flex-[65%] text-xl md:text-2xl xl:text-2xl text-b-font p-20 justify-center">
              <h1 class="mt-0 mx-auto text-center">
                ร้านของเรามีบริการลงพื้นที่ถึงหน้างานของลูกค้า ไม่ว่าจะเป็นการให้คำปรึกษา
               </h1>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center ">
          <p class="p-5 text-b-font text-lg">บริการติดตั้งผ้าม่าน</p>
        </div>
        <div className=" bg-brown-blog">
          <div class="about flex shadow-md">
            <div class="sideabout flex-[65%] text-xl md:text-2xl xl:text-2xl text-b-font p-20 justify-center">
              <h1 class="mt-0 mx-auto text-center">jiktuyi</h1>
            </div>
            <div class="sideabout flex-[25%]">
              <img class="shadow-2xl" src={serimg2} alt="about" width="100%" />
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center ">
          <p class="p-5 text-b-font text-lg">บริการติดตั้งวอลเปเปอร์</p>
        </div>
        <div className=" bg-brown-blog">
          <div class="about flex shadow-md">
            <div class="sideabout flex-[25%]">
              <img class="shadow-2xl" src={serimg1} alt="about" width="100%" />
            </div>
            <div class="sideabout flex-[65%] text-xl md:text-2xl xl:text-2xl text-b-font p-20 justify-center">
              <h1 class="mt-0 mx-auto text-center">jiktuyi</h1>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </>
  );
}
export default ServicePage;
