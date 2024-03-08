import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import img1 from "../img/contact.jpeg";
import { HiPhone } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
function ContactPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = React.useState("");
  const [idUser, setIdUser] = React.useState("");


  useEffect(() => {
    const authToken = localStorage.getItem("token");
    console.log("authToken", authToken);

    if (authToken) {
      // Set up axios default headers
      axios.defaults.headers.common["authtoken"] = authToken;

      const decodedToken = jwtDecode(authToken); // Decode the token

      if (decodedToken && decodedToken.user) {
        const { f_name, l_name } = decodedToken.user;
        const id = decodedToken.id ; 
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
      <div className="h-screen w-full ">
        <Navbar
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          userName={userName}
        ></Navbar>

        {/* bg-gradient-to-r from-10% from-white via-50% via-brown-bg to-90% to-white */}

        <div class="titlea py-1 shadow-md">
          <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
          <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
            ติดต่อเรา
          </h5>
        </div>
        <div className="flex justify-center items-center ">
          <img
            className="shadow-lg object-cover h-[400px] md:h-[500px] w-full  md:bg-center md:m-auto"
            src={img1}
            alt="img"
          />
        </div>
        <p class="text-2xl text-b-font mt-5 ml-5 font-bold ">
          ร้านเจริญกิจผ้าม่าน
        </p>
        <p class="text-md text-b-font  ml-5 font-bold ">
          2/562 ม.18 ซ ธนะศรี 1 ต.คูคต อ.ลำลูกกา จ. ปทุมธานี 12130
        </p>
        <p class="text-md text-b-font  ml-5 font-bold ">
          หน้าร้านเปิด : 09.00 - 18.00
        </p>
        <p class="text-md text-b-font  ml-5 font-bold  items-center">
          <span class="inline-block mr-2">
            {" "}
            <HiPhone></HiPhone>
          </span>
          0879700514
        </p>
      </div>
    </>
  );
}
export default ContactPage;
