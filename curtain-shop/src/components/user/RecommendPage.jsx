import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import r1 from "../img/r1.jpg";
import r2 from "../img/r2.jpg";
import r3 from "../img/r3.jpg";
import r4 from "../img/r4.jpg";
import r5 from "../img/r5.jpg";
import Footer from "../Footer";
import arrow from "../img/icon/arrow.png";
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
          <h5 className=" inline-block text-lg md:text-xl xl:text-3xl text-b-font  pl-4 p-2 my-1">
            ห้องของคุณเหมาะกับผ้าม่านแบบไหน
          </h5>
        </div>

        <div className="flex justify-center items-center ">
          <p class="p-5 xl:text-4xl text-b-font text-lg">ทิศทางแสงและผ้าม่าน</p>
        </div>
        <div className=" bg-brown-blog">
          <div class="about flex shadow-md">
            <div class="sideabout flex-[35%]">
              <img class="shadow-2xl" src={r1} alt="about" width="100%" />
            </div>
            <div class="sideabout flex-[65%] text-xl md:text-3xl xl:text-3xl text-b-font p-20 justify-center">
              <p>
                <h1 class=" mt-0 mx-auto text-center ">
                  จุดประสงค์หลักของผ้าม่านคือเพื่อป้องกันแสงส่วนเกิน
                  วิธีเลือกผ้าม่านให้เหมาะสมก็ควรดูว่าทิศทางของ
                  แสงมาจากทางไหนมากที่สุด เช่น หากห้องอยู่ในทิศใต้หรือทิศตะวันตก
                  ความร้อนจากแสงแดดจะส่องถึงห้องในช่วงบ่าย
                  ซึ่งจะได้รับความร้อนจากแสงจะแรงกว่า
                  ตัวเลือกของผ้าม่านจึงจะแตกต่างจากห้องที่อยู่ทางทิศตะวันออก
                  อาทิ ผ้าม่านกันแสง ที่มีคุณสมบัติกัน UV ได้
                  และยังช่วยเพิ่มความเป็นส่วนตัวขณะอยู่ในบ้านได้อีกด้วย
                  ซึ่งผ้าม่านกันแสงก็มีการให้ระดับการป้องกันแสงต่างกัน
                  สามารถเลือกได้ตามความเหมาะสมและความชอบส่วนตัว
                </h1>
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center ">
          <p class="p-5 xl:text-4xl text-b-font text-lg">ผ้าม่านแต่ละประเภท </p>
        </div>
        <div className=" bg-brown-blog">
          <div class="about flex shadow-md">
            <div class="sideabout flex-[65%] text-xl md:text-2xl xl:text-3xl text-b-font p-20 justify-center">
              <h1 class="mt-0 mx-auto text-center">
                1. ม่านจีบ : คราสสิค ร่วมสมัย มีความสวยหรู
                ผ้าม่านจีบเป็นรูปแบบผ้าม่านที่ได้รับความนิยม
                โดยมีเอกลักษณ์ที่หัวผ้าม่านด้านบนมีการจับจีบเรียงกันให้ได้ความสวยงาม
                ผ้าม่านจีบแสดงออกถึงความประณีต บรรจง
                ช่วยทำให้บรรยากาศภายในห้องดูหรูหราคลาสสิค สง่างาม ภูมิฐาน
                เป็นม่านรูปแบบมาตรฐานที่ทุกบ้านนิยมเลือกใช้กันมาตั้งแต่อดีตจนถึงปัจจุบัน
                เพราะม่านรูปแบบนี้สามารถเข้ากันได้กับห้องทั่ว ๆ
                ไปได้แทบจะทุกสไตล์ ลักษณะของม่านจีบ
                จะมีการจับจีบที่ผ้าม่านด้านบน เป็นจีบ 3 จีบ
                ทำให้ผ้าม่านมีลอนสวยงาม และสามารถติดผ้าได้ 2
                ชั้นคือม่านโปร่งและม่านทึบ
                หากบานหน้าต่างหรือประตูยิ่งเป็นบานใหญ่และสูง
                แล้วเลือกติดม่านจีบจะยิ่งทำให้ห้องนั้นดูสวยหรู อลังการ
                หรือหากต้องการให้ห้องนั้นมีอารมณ์ร่วมสมัย เรียบหรู
                และดูเรียบร้อย ให้ทำรางม่านซ่อนบนฝ้าเพดานได้
              </h1>
            </div>
            <div class="sideabout flex-[35%]">
              <img class="shadow-2xl" src={r2} alt="about" width="100%" />
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center ">
          <p class="p-5 xl:text-2xl text-b-font text-lg"></p>
        </div>
        <div className=" bg-brown-blog">
          <div class="about flex shadow-md">
            <div class="sideabout flex-[35%]">
              <img class="shadow-2xl" src={r3} alt="about" width="100%" />
            </div>
            <div class="sideabout flex-[65%] text-xl md:text-3xl xl:text-3xl text-b-font p-40 justify-center">
              <h1 class=" mt-0 mx-auto text-center ">
                2. ผ้าม่านตาไก่ : โดดเด่น ดีไซน์สวย ไม่ตกยุค
                เป็นรูปแบบผ้าม่านอีกแบบนึงที่กำลังได้รับความนิยมในปัจจุบันมากเหมือนกัน
                โดยผ้าม่านด้านบนใส่ห่วงตาไก่ และร้อยเข้ากับรางโชว์
                ทำให้ผ้าม่านตาไก่มีความพริ้วไหวเป็นอิสระ
                เป็นเอกลักษณ์ของม่านตาไก่ที่ให้อารมณ์ดูเรียบง่าย สวยงาม ทันสมัย
                เข้ากับทุกสไตล์การตกแต่ง
                สร้างความลงตัวให้ห้องดูดีขึ้นได้อย่างไม่น่าเชื่อ และ
                มีรางให้เลือกหลายสไตล์ สำหรับคนที่เน้นความทันสมัย ไม่ตกเทรนด์
                ออกแบบบ้านสไตล์โมเดิร์น แนะนำให้เลือกติดม่านตาไก่
                ลักษณะของม่านรูปแบบนี้ จะโชว์รางม่านชัดเจน
                โดยสามารถเลือกแบบรางม่าน และหัวรางให้เข้ากับสไตล์ของห้องได้
                ส่วนผ้าม่านที่ได้จากการสอดผ่านห่วงตาไก่ จะได้ลอนที่ดูพริ้วไหว
                สวยงาม เพิ่มมิติให้ห้องดูมีเสน่ห์มากขึ้น
              </h1>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center ">
          <p class="p-5 xl:text-4xl text-b-font text-lg"></p>
        </div>
        <div className=" bg-brown-blog">
          <div class="about flex shadow-md">
            <div class="sideabout flex-[65%] text-xl md:text-2xl xl:text-3xl text-b-font p-20 justify-center">
              <h1 class="mt-0 mx-auto text-center">
                3. ผ้าม่านลอน : เรียบง่าย ดูดี ไม่หรูจนเกินไป
                ลักษณะผ้าม่านที่เป็นลอนโค้ง ช่วยปรับอารมณ์ให้ห้องดูดี หรูหรา
                เข้ากับการตกแต่งได้ทุกสไตล์ ลักษณะของม่านลอน
                ผสมผสานระหว่างม่านตาไก่ และม่านจีบเข้าไว้ด้วยกัน
                โดยลักษณะของผ้าจะเป็นลอนพับไปมา คล้ายม่านตาไก่
                แต่ไม่มีการเจาะห่วงที่ด้านบนผ้าม่าน
                จะถูกล็อคผ้าม่านให้เป็นลอนคล้ายม่านจีบแทน
                ม่านรูปแบบนี้เหมาะกับการตกแต่งบ้านสไตล์มินิมอล
                การจัดบ้านแบบเรียบง่าย สบาย ๆ แต่ยังคงเรียบหรูและดูดี
                ไม่เบื่อง่าย เนื่องจากบริเวณหัวผ้าม่านจะไม่มีการจับจีบ
                และปล่อยหัวผ้าม่านให้เป็นลอนโค้งอิสระไปจนสุดปลายผ้า
                จึงดูเป็นระเบียบเรียบร้อย สบายตา และทำให้รู้สึกผ่อนคลาย
              </h1>
            </div>
            <div class="sideabout flex-[35%]">
              <img class="shadow-2xl" src={r4} alt="about" width="100%" />
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center ">
          <p class="p-5 xl:text-2xl text-b-font text-lg"></p>
        </div>
        <div className=" bg-brown-blog">
          <div class="about flex shadow-md">
            <div class="sideabout flex-[35%]">
              <img class="shadow-2xl" src={r5} alt="about" width="100%" />
            </div>
            <div class="sideabout flex-[65%] text-xl md:text-3xl xl:text-3xl text-b-font p-40 justify-center">
              <h1 class=" mt-0 mx-auto text-center ">
                4. ผ้าม่านพับ : รูปแบบทันสมัย เรียบหรู
                ลักษณะการใช้งานโดยใช้เชือกดึงในการเปิด-ปิดผ้าม่าน
                เมื่อต้องการเปิดผ้าม่าน เป็นม่านที่ใช้รางสำหรับม่านพับโดยเฉพาะ
                เป็นรูปแบบผ้าม่านที่ดูเรียบๆ ทำให้ห้องดูกว้างขึ้น
                ผ้าม่านพับเหมาะใช้กับห้องที่มีขนาดไม่ใหญ่มาก หรือพื้นที่จำกัด
                ม่านรูปแบบนี้ เหมาะกับหน้าต่างบานแคบ
                หรือหน้าต่างบานเล็กที่ติดกันหลายบาน
                เพราะจะได้เลือกบานเปิดม่านได้ ไม่ต้องเปิดทั้งหมด
                ม่านพับจะคล้ายกับม่านม้วน คือ เมื่อต้องการเปิดม่าน
                ให้ดึงรอกให้ผ้าม่านเก็บขึ้นไปด้านบน
                ม่านพับผ้าจะพับขึ้นไปเป็นชั้น ๆ เรียงซ้อนกันขึ้นไป
                ทำให้ไม่เสียพื้นที่ และช่วยเปิดทัศนะวิสัยในการมองเห็น
                ม่านพับจะออกแนวทางโมเดิร์นแบบเรียบหรู
              </h1>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center ">
          <p class="p-5 xl:text-2xl text-b-font text-lg"></p>
        </div>
        <Footer></Footer>
      </div>
    </>
  );
}
export default ServicePage;
