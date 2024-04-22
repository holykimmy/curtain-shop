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

  const [user, setUser] = React.useState({
    f_name: "",
    l_name: "",
    email: "",
    tell: "",
    address: ""
  });
  useEffect(() => {
    const authToken = localStorage.getItem("token");

    if (authToken) {
      // Set up axios default headers
      axios.defaults.headers.common["authtoken"] = authToken;

      const decodedToken = jwtDecode(authToken); // Decode the token

      if (decodedToken && decodedToken.user) {
        const { f_name, l_name } = decodedToken.user;

        const id = decodedToken.id;
        setUserName(`${f_name} ${l_name}`);
        setIdUser(`${id}`);
        console.log("addresssjhf", decodedToken.user.addres);
        setUser({
          f_name: f_name,
          l_name: l_name,
          email: decodedToken.user.email,
          tell: decodedToken.user.tell,
          address: decodedToken.user.address
        });

        setIsLoggedIn(true);
      } else {
        setUserData(decodedToken.user);
      }

      if (
        decodedToken &&
        decodedToken.exp &&
        decodedToken.exp * 1000 < Date.now()
      ) {
        // Token expired, logout user
        handleLogoutAuto();
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogoutAuto = () => {
    // Logout user
    localStorage.removeItem("token");
    setUserName(""); // Clear user name or any other relevant state

    // Redirect to login page or perform any other action
    navigate("/"); // Redirect to login page
  };

  const handleLogout = () => {
    Swal.fire({
      title: `คุณต้องการออกจากระบบใช่หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่"
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
          <h5 className=" inline-block text-base md:text-lg xl:text-xl text-b-font  pl-4 p-2 my-1">
            บริการของเรา
          </h5>
        </div>

        <div className="flex justify-center items-center ">
          <p className="p-5 text-b-font text-base md:text-lg">
            บริการลงพื้นที่หน้างาน
          </p>
        </div>
        <div className="flex bg-brown-blog shadow-md">
          <img
            className="flex shadow-2xl w-[200px] md:w-[400px] h-auto"
            src={serimg3}
            alt="about"
          />

          <h1 className="flex text-sm md:text-base xl:text-lg text-b-font items-center mx-auto text-center p-2 md:p-10">
          ร้านค้าของเรามีบริการลงพื้นที่วัดขนาดหน้าต่างถึงบ้านของคุณและสามารถให้คำปรึกษาเกี่ยวกับผ้าม่านและประเภทผ้าม่านที่เหมาะกับพื้นที่ในบ้านคุณได้ หากมั่นใจว่าคุณต้องการสั่งตัดสินค้ากับทางเรา บริการลงพื้นที่วัดหน้าต่างหน้างานจะให้บริการแค่เฉพาะที่อยู่ที่อยู่ใน *** กรุงเทพมหานคร *** เท่านั้น โดยค่าบริการการวัดขึ้นอยู่กับระยะทางที่อยู่ของคุณ          
          </h1>
        </div>

        <div className="flex justify-center items-center ">
          <p className="p-5 text-b-font text-base md:text-lg">
            บริการติดตั้งผ้าม่าน
          </p>
        </div>
        <div className="flex bg-brown-blog shadow-md">
          <h1 className="flex text-sm md:text-base xl:text-lg text-b-font items-center mx-auto text-center p-2 md:p-10">
          ร้านมีบริการติดตั้งผ้าม่านที่สั่งตัดถึงบ้านของคุณ โดยใช้ช่างที่มืออาชีพ มีประสบการณ์อย่างยาวนานในการติดตั้ง ทางเราดูแลอุปกรณ์ที่ลูกค้าทำการสั่งอย่างดีเยี่ยมก่อนติดตั้ง รับรองว่าสินค้าที่คุณจะได้รับจากเราจะมีมาตรฐานที่ดีทั้งด้านสินค้าและการติดตั้งอย่างแน่นอน
          </h1>
          <img
            className="flex shadow-2xl w-[200px] md:w-[400px] h-auto"
            src={serimg2}
            alt="about"
          />
        </div>
        <div className="flex justify-center items-center ">
          <p className="p-5 text-b-font text-base md:text-lg">
            บริการติดตั้งวอลเปเปอร์
          </p>
        </div>
        <div className="flex bg-brown-blog shadow-md">
          <img
            className="flex shadow-2xl w-[200px] md:w-[400px] h-auto"
            src={serimg1}
            alt="about"
          />

          <h1 className="flex text-sm md:text-base xl:text-lg text-b-font items-center mx-auto text-center p-2 md:p-10">
          ทางร้านของเราถึงจะเป็นร้านสั่งตัดผ้าม่าน แต่ร้านของเรายังครอบคลุมไปถึงการติดตั้งวอลเปเปอร์ได้เช่นกัน โดยทางเรารับบริการติดตั้งวอลเปเปอร์ที่คุณมีแล้วอยู่แล้วหรือจะส่งวอลเปเปอร์ที่คุณอยากได้มาให้เรา เราสามารถหาสินค้าที่วอลเปเปอร์ที่คุณต้องการเพื่อทำการติดตั้งให้คุณได้เช่นกัน
          </h1>
        </div>
        <Footer></Footer>
      </div>
    </>
  );
}
export default ServicePage;
