import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import g1 from "../img/g1.jpg";
import g2 from "../img/g2.jpg";
import g3 from "../img/g3.jpg";
import g4 from "../img/g4.jpg";
import g5 from "../img/g5.jpg";
import g6 from "../img/g6.jpg";
import Footer from "../Footer";
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
      <div className="h-screen w-full">
        <Navbar
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          userName={userName}
        ></Navbar>

        <div class="titlea  py-1 shadow-md">
          <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
          <h5 className=" inline-block text-base md:text-lg xl:text-md text-b-font  pl-4 p-2 my-1">
            วิธีการวัดผ้าม่านแต่ละแบบ
          </h5>
        </div>

        <div className="bg-gradient-to-t from-brown-bg ">
        <div className="flex flex-col ">
          <div className="flex flex-col m-5 ">
              <h2 className="text-base md:text-lg xl:text-lg font-bold tracking-tight text-gray-700 ">
                : ม่านจีบ ม่านตาไก่ และม่านลอน
              </h2>
              <br />
              <p className="mt-4 text-sm md:text-base xl:text-base font-bold text-gray-700">
                1. เริ่มวัดจากความกว้างของหน้าต่างโดยวัดออกจากขอบวงกบมาประมาณ 10
                - 20 ซม. หรือน้อยกว่าตามความเหมาะสมของหน้าต่าง
              </p>
              <br />
              <p className="mt-4 text-sm md:text-base xl:text-base font-bold text-gray-700">
                2. ต่อมาวัดความสูงของหน้าต่างให้วัดออกจากขอบวงกบขึ้นไปประมาณ 10
                ซม. หากต้องการให้ผ้าม่านยาวถึงพื้นให้วัดลอยออกจากพื้นประมาณ 2
                ซม.
              </p>
              <br />{" "}
              <p className="mt-4 text-sm md:text-base xl:text-base font-bold text-gray-800">
                3. หากต้องการให้ผ้าม่านคลุมหน้าต่างได้พอดี
                ให้วัดออกจากขอบวงกบขึ้นไปประมาณ 10 ซม. และเลยจากขอบวงกบล่างลงมา
                15 - 20 ซม. หรือสั้นกว่าตามความเหมาะสม
              </p>
              <br />{" "}
              <p className="mt-4 text-sm md:text-base xl:text-base font-bold text-gray-800">
                4.
                หากมีหน้าต่างรางหรือรางที่มีเชือกดึงติดตั้งอยู่แล้วให้วัดความกว้างโดยวัดปลายรางจากอีกด้านนึงไปสู่อีกด้านนึง
                ( ตัวอย่าง A ) ส่วนความสูงวัดที่ข้างบนของราง ( ตัวอย่าง B )
                ลงมาถึงระดับความยาวที่ต้องการ
              </p>
              <br />{" "}
              <p className="mt-4 text-sm md:text-base xl:text-base font-bold text-gray-800">
                5.
                หางเป็นรางโชว์หรือรางระดับให้วัดความกว้างเริ่มจากส่วนท้ายของหัวประดับจากด้านนึงไปอีกด้านนึง
                ( ตัวอย่าง A ) และเริ่มวัดจากความสูงใต้ราง ( ตัวอย่าง B )
              </p>
            </div>
            <div className="flex flex-wrap justify-center">
              <img
                src={g1}
                alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
                className="rounded-lg w-[150px] md:w-[240px] xl:w-[280px] bg-gray-100 shadow-xl m-5"
              />
              <img
                src={g2}
                alt="Top down view of walnut card tray with embedded magnets and card groove."
                className="rounded-lg w-[150px] md:w-[240px] xl:w-[280px] bg-gray-100 shadow-xl m-5"
              />
              <img
                src={g3}
                alt="Side of walnut card tray with card groove and recessed card area."
                className="rounded-lg w-[150px] md:w-[240px] xl:w-[280px] bg-gray-100 shadow-xl m-5"
              />
              <img
                src={g4}
                alt="Walnut card tray filled with cards and card angled in dedicated groove."
                className="rounded-lg w-[150px] md:w-[240px] xl:w-[280px] bg-gray-100 shadow-xl m-5"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-t from-brown-bg ">
          <div className="flex flex-col ">
            <div className="flex flex-col m-5 md:w-[70%]">
              <h2 className="text-base md:text-lg xl:text-md font-bold  text-gray-700 ">
                : การวัดม่านพับ
              </h2>

              <p className="mt-4 text-sm md:text-base xl:text-base font-bold text-gray-700">
                1.วัดความกว้างให้เลยจากขอบวงกบซ้ายและขวาด้านละ 5 ซม.
                หากต้องการติดผ้าม่านผ้าในขอบวงกบหรือหน้าต่างให้ลดความกว้างลง 1
                ซม. เพื่อให้ติดตั้งได้ง่ายขึ้น ( เช่นวัดความกว้างจากขอบวงกบได้
                100 ซม. ให้ลดความกว้างเหลือ 99 ซม. )
              </p>
              <p className="mt-4 text-sm md:text-base xl:text-base font-bold text-gray-700">
                2.การวัดม่านพับ
                ต้องวัดจากความสูงโดยวัดให้เลยจากขอบวงกบขึ้นไปประมาณ 30 ซม.
                หรือน้อยกว่าได้ตามความเหมาะสมของพื้นที่หน้าต่างและวัดเลยวงกบล่างลงประมาณ
                15 - 20 ซม. เพื่อให้ม่านสามารถพับได้
              </p>
            </div>
            <div className="flex flex-row justify-center">
              <img
                src={g5}
                alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
                className="rounded-lg w-[160px] md:w-[240px] xl:w-[280px] bg-gray-100 shadow-xl m-5"
              />
              <img
                src={g6}
                alt="Top down view of walnut card tray with embedded magnets and card groove."
                className="rounded-lg w-[160px] md:w-[240px] xl:w-[280px] bg-gray-100 shadow-xl m-5"
              />
            </div>
          </div>
        </div>

        <Footer></Footer>
      </div>
    </>
  );
}
export default ServicePage;
