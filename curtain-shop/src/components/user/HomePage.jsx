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

function HomePage() {
  // const slides = [
  //   "https://i.ibb.co/ncrXc2V/1.png",
  //   "https://i.ibb.co/B3s7v4h/2.png",
  //   "https://i.ibb.co/ncrXc2V/1.png",
  //   "https://i.ibb.co/B3s7v4h/2.png",
  //   "https://i.ibb.co/XXR8kzF/3.png",
  // ];

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
    address: "",
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
        console.log("address", decodedToken.address);
        setUser({
          f_name: f_name,
          l_name: l_name,
          email: decodedToken.user.email,
          tell: decodedToken.user.tell,
          address: decodedToken.user.address,
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
    setUserName(""); // Clear 

    
    navigate("/"); // Redirect
  };

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

        navigate("/");
        window.location.reload(); //refresh
      }
    });
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        userName={userName}
        idUser={idUser}
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
      <Link to="/custom-product/65d595d39bec946346551c76">
        <div class="text-xl md:text-2xl xl:text-2xl text-b-font text-center  p-[30px]">
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
            <h5 className=" inline-block text-base md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
              เกี่ยวกับร้านของเรา
            </h5>
          </div>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row items-center shadow-md">
          <div className="flex-[50%]">
            <img className=" flex shadow-2xl w-[200px] md:w-[400px]" src={about} alt="about" />
          </div>
          <div className="flex-[75%] text-sm md:text-base xl:text-base text-b-font md:py-[100px] ">
            <p className="py-5  text-left p-2 ">
              ร้านค้าเจริญกิจผ้าม่าน
              ร้านของเราเป็นหน้าร้านสำหรับการสั่งตัดผ้าม่านตามออเดอร์โดยเฉพาะ
              เปิดให้บริการเกี่ยวกับด้านผ้าม่านมานาน มีความรู้ ความเชี่ยวชาญ
              ด้านผ้าม่านโดยตรงด้วยประสบการณ์การสั่งตัดผ่านหน้าร้านที่ยาวนานมากว่า
              10 ปี
              เป็นร้านผ้าม่านครบวงจรทุกขั้นตอนของการให้บริการเกี่ยวกับผ้าม่าน
              ไม่ว่าจะเป็นการแนะนำประเภทผ้า การวางแผนออกแบบผ้าม่าน การตัดเย็บ
              การติดผ้าม่าน มู่ลี่ วอลเปเปอร์ติดผนัง ฯลฯ
              ให้เหมาะสมกับบ้านและสถานที่
              แนะนำการบำรุงรักษาและซักผ้าม่านอย่างถูกต้องเน้นการออกแบบที่โดดเด่นและเลือกการใช้วัสดุที่มีคุณภาพดี
              เพื่อให้ได้ผลงานที่ทันสมัย สวยงาม และสอดคล้องกับความต้องการ
              รวมไปถึงไลฟ์สไตล์ของลูกค้า
            </p>
            <p className="py-5  text-left p-2">
              ร้านเจริญกิจผ้าม่าน
              ไม่เพียงแค่ให้บริการด้านการออกแบบที่สวยงามและตัดเย็บผ้าม่านที่มีคุณภาพสูงเท่านั้น
              แต่ร้านเรายังเน้นเรื่องการใส่ใจในทุกๆ รายละเอียดก่อนการติดตั้ง
              เช่น การทำความสะอาดผ้าม่านทุกผืนด้วยเครื่องรีดผ้าม่านไอน้ำ
              ซึ่งจะช่วยฆ่าเชื้อและกำจัดไรฝุ่น
              และมั่นใจได้ว่าผ้าม่านที่ได้รับบริการจากร้านของเรา
              จะปลอดภัยไม่ก่อให้เกิดภูมิแพ้
              เพื่อให้ลูกค้าได้ใช้งานผ้าม่านจากทางร้านเราได้อย่างยาวนาน
              เพื่อให้ลูกค้าร้านเราได้รับประสบการณ์การใช้งานที่ดีที่สุด
              ประทับใจมากที่สุด และนึกถึงเราเป็นตัวเลือกแรกในการสั่งตัดผ้าม่าน
            </p>
          </div>
        </div>
      </div>

      <div class=" text-sm md:text-base xl:text-xl text-b-font text-center py-[30px] md:py-[50px]  ">
        <p>นอกการติดตั้งผ้าม่านแล้ว ทางร้านเรายังมีมู่ลี่ </p>
        <p>และวอลเปเปอร์ติดผนังห้องอีกด้วย</p>
      </div>
      <Showing></Showing>

      <Footer></Footer>
    </>
  );
}
export default HomePage;
