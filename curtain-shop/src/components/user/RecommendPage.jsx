import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import r1 from "../img/r1.jpg";
import r2 from "../img/r2.jpg";
import r3 from "../img/r3.jpg";
import r4 from "../img/r4.jpg";
import r5 from "../img/r5.jpg";
import r6 from "../img/r6.jpg";
import r7 from "../img/r7.jpg";
import r8 from "../img/r8.JPG";
import r9 from "../img/r9.JPG";
import r10 from "../img/r10.JPG";
import r11 from "../img/r11.JPG";
import r12 from "../img/r12.jpg";
import r13 from "../img/r13.jpeg";
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
      cancelButtonText: "ไม่ใช่"
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
      <div className="h-screen w-full bg-white ">
        <Navbar
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          userName={userName}
        ></Navbar>
        <div class="titlea  py-1 shadow-md">
          <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
          <h5 className=" inline-block text-base md:text-lg xl:text-xl text-b-font  pl-4 p-2 my-1">
            ห้องของคุณเหมาะกับผ้าม่านแบบไหน
          </h5>
        </div>

        <div className="flex justify-center items-center ">
          <p className="p-5 text-b-font text-base md:text-lg">
            ทิศทางแสงและผ้าม่าน
          </p>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row bg-gradient-to-r from-brown-blog shadow-md items-center">
          <img
            className="flex shadow-2xl w-[200px] md:w-[400px] h-auto m-2"
            src={r1}
            alt="about"
          />
          <p className="flex p-2 text-left text-sm md:text-base xl:text-lg text-b-font mx-auto ">
            จุดประสงค์หลักของผ้าม่านคือเพื่อป้องกันแสงส่วนเกิน
            วิธีเลือกผ้าม่านให้เหมาะสมก็ควรดูว่าทิศทางของ
            แสงมาจากทางไหนมากที่สุด เช่น หากห้องอยู่ในทิศใต้หรือทิศตะวันตก
            ความร้อนจากแสงแดดจะส่องถึงห้องในช่วงบ่าย
            ซึ่งจะได้รับความร้อนจากแสงจะแรงกว่า
            ตัวเลือกของผ้าม่านจึงจะแตกต่างจากห้องที่อยู่ทางทิศตะวันออก อาทิ
            ผ้าม่านกันแสง ที่มีคุณสมบัติกัน UV ได้
            และยังช่วยเพิ่มความเป็นส่วนตัวขณะอยู่ในบ้านได้อีกด้วย
            ซึ่งผ้าม่านกันแสงก็มีการให้ระดับการป้องกันแสงต่างกัน
            สามารถเลือกได้ตามความเหมาะสมและความชอบส่วนตัว
          </p>
        </div>

        <div className="flex justify-center items-center ">
          <p className="p-5 text-b-font text-base md:text-lg">
            ผ้าม่านแต่ละประเภท{" "}
          </p>
        </div>

        <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row  shadow-md items-center bg-gradient-to-l from-brown-blog ">
          <p className="p-2 text-left text-sm md:text-base  text-b-font mx-auto ">
            <span className="text-base md:text-lg">
              1. ม่านจีบ : คราสสิค ร่วมสมัย มีความสวยหรู <br />
            </span>
            ผ้าม่านจีบเป็นรูปแบบผ้าม่านที่ได้รับความนิยม
            โดยมีเอกลักษณ์ที่หัวผ้าม่านด้านบนมีการจับจีบเรียงกันให้ได้ความสวยงาม
            ผ้าม่านจีบแสดงออกถึงความประณีต บรรจง
            ช่วยทำให้บรรยากาศภายในห้องดูหรูหราคลาสสิค สง่างาม ภูมิฐาน
            เป็นม่านรูปแบบมาตรฐานที่ทุกบ้านนิยมเลือกใช้กันมาตั้งแต่อดีตจนถึงปัจจุบัน
            เพราะม่านรูปแบบนี้สามารถเข้ากันได้กับห้องทั่ว ๆ ไปได้แทบจะทุกสไตล์
            ลักษณะของม่านจีบ จะมีการจับจีบที่ผ้าม่านด้านบน เป็นจีบ 3 จีบ
            ทำให้ผ้าม่านมีลอนสวยงาม และสามารถติดผ้าได้ 2
            ชั้นคือม่านโปร่งและม่านทึบ
            หากบานหน้าต่างหรือประตูยิ่งเป็นบานใหญ่และสูง
            แล้วเลือกติดม่านจีบจะยิ่งทำให้ห้องนั้นดูสวยหรู อลังการ
            หรือหากต้องการให้ห้องนั้นมีอารมณ์ร่วมสมัย เรียบหรู และดูเรียบร้อย
            ให้ทำรางม่านซ่อนบนฝ้าเพดานได้
          </p>
          <img
            className="flex shadow-2xl w-[200px] md:w-[400px] h-auto m-2"
            src={r2}
            alt="about"
          />
        </div>

        <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row   shadow-md items-center">
          <img
            className="flex shadow-2xl w-[200px] md:w-[400px] h-auto m-2"
            src={r3}
            alt="about"
          />
          <p className="p-2 text-left text-sm md:text-base  text-b-font mx-auto ">
            <span className="text-base md:text-lg">
              2. ผ้าม่านตาไก่ : โดดเด่น ดีไซน์สวย ไม่ตกยุค
              <br />
            </span>
            เป็นรูปแบบผ้าม่านอีกแบบนึงที่กำลังได้รับความนิยมในปัจจุบันมากเหมือนกัน
            โดยผ้าม่านด้านบนใส่ห่วงตาไก่ และร้อยเข้ากับรางโชว์
            ทำให้ผ้าม่านตาไก่มีความพริ้วไหวเป็นอิสระ
            เป็นเอกลักษณ์ของม่านตาไก่ที่ให้อารมณ์ดูเรียบง่าย สวยงาม ทันสมัย
            เข้ากับทุกสไตล์การตกแต่ง
            สร้างความลงตัวให้ห้องดูดีขึ้นได้อย่างไม่น่าเชื่อ และ
            มีรางให้เลือกหลายสไตล์ สำหรับคนที่เน้นความทันสมัย ไม่ตกเทรนด์
            ออกแบบบ้านสไตล์โมเดิร์น แนะนำให้เลือกติดม่านตาไก่
            ลักษณะของม่านรูปแบบนี้ จะโชว์รางม่านชัดเจน โดยสามารถเลือกแบบรางม่าน
            และหัวรางให้เข้ากับสไตล์ของห้องได้
            ส่วนผ้าม่านที่ได้จากการสอดผ่านห่วงตาไก่ จะได้ลอนที่ดูพริ้วไหว สวยงาม
            เพิ่มมิติให้ห้องดูมีเสน่ห์มากขึ้น
          </p>
        </div>

        <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row  shadow-md items-center bg-gradient-to-l from-brown-blog">
          <p className="p-2 text-left text-sm md:text-base  text-b-font mx-auto ">
            <span className="text-base md:text-lg">
              3. ผ้าม่านลอน : เรียบง่าย ดูดี ไม่หรูจนเกินไป
              <br />
            </span>
            ลักษณะผ้าม่านที่เป็นลอนโค้ง ช่วยปรับอารมณ์ให้ห้องดูดี หรูหรา
            เข้ากับการตกแต่งได้ทุกสไตล์ ลักษณะของม่านลอน ผสมผสานระหว่างม่านตาไก่
            และม่านจีบเข้าไว้ด้วยกัน โดยลักษณะของผ้าจะเป็นลอนพับไปมา
            คล้ายม่านตาไก่ แต่ไม่มีการเจาะห่วงที่ด้านบนผ้าม่าน
            จะถูกล็อคผ้าม่านให้เป็นลอนคล้ายม่านจีบแทน
            ม่านรูปแบบนี้เหมาะกับการตกแต่งบ้านสไตล์มินิมอล
            การจัดบ้านแบบเรียบง่าย สบาย ๆ แต่ยังคงเรียบหรูและดูดี ไม่เบื่อง่าย
            เนื่องจากบริเวณหัวผ้าม่านจะไม่มีการจับจีบ
            และปล่อยหัวผ้าม่านให้เป็นลอนโค้งอิสระไปจนสุดปลายผ้า
            จึงดูเป็นระเบียบเรียบร้อย สบายตา และทำให้รู้สึกผ่อนคลาย
          </p>
          <img
            className="flex shadow-2xl w-[200px] md:w-[400px] h-auto m-2"
            src={r4}
            alt="about"
          />
        </div>

        <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row  shadow-md items-center">
          <img
            className="flex shadow-2xl w-[200px] md:w-[400px] h-auto m-2"
            src={r5}
            alt="about"
          />
          <p className="p-2 text-left text-sm md:text-base  text-b-font mx-auto ">
            <span className="text-base md:text-lg">
              4. ผ้าม่านพับ : รูปแบบทันสมัย เรียบหรู <br />{" "}
            </span>
            ลักษณะการใช้งานโดยใช้เชือกดึงในการเปิด-ปิดผ้าม่าน
            เมื่อต้องการเปิดผ้าม่าน เป็นม่านที่ใช้รางสำหรับม่านพับโดยเฉพาะ
            เป็นรูปแบบผ้าม่านที่ดูเรียบๆ ทำให้ห้องดูกว้างขึ้น
            ผ้าม่านพับเหมาะใช้กับห้องที่มีขนาดไม่ใหญ่มาก หรือพื้นที่จำกัด
            ม่านรูปแบบนี้ เหมาะกับหน้าต่างบานแคบ
            หรือหน้าต่างบานเล็กที่ติดกันหลายบาน เพราะจะได้เลือกบานเปิดม่านได้
            ไม่ต้องเปิดทั้งหมด ม่านพับจะคล้ายกับม่านม้วน คือ
            เมื่อต้องการเปิดม่าน ให้ดึงรอกให้ผ้าม่านเก็บขึ้นไปด้านบน
            ม่านพับผ้าจะพับขึ้นไปเป็นชั้น ๆ เรียงซ้อนกันขึ้นไป
            ทำให้ไม่เสียพื้นที่ และช่วยเปิดทัศนะวิสัยในการมองเห็น
            ม่านพับจะออกแนวทางโมเดิร์นแบบเรียบหรู
          </p>
        </div>

        <div className="flex flex-col md:flex-row lg:flex-row xl:flex-rowshadow-md items-center bg-gradient-to-l from-brown-blog">
          <p className="p-2 text-left text-sm md:text-base  text-b-font mx-auto ">
            <span className="text-base md:text-lg">
              5. ผ้าม่านลอน : ผ้าม่านหรู อลังการ ผ้าม่านหลุยส์ <br />{" "}
            </span>
            เป็นผ้าม่านที่มีดีไซน์หรูหรา คลาสิค สวยงาม ดูอลังการ
            โดยมีเอกลักษณ์ที่ ลูกหลุยส์เป็นม่านทรงโค้งหรือหยดน้ำอยู่ด้านบนและ
            มีหางหลุยส์เป็นชายผ้าที่เรียงซ้อนกันเป็นชั้นๆ ซ้าย-ขวาอย่างลงตัว
            ให้ความรู้สึกที่หรูหรา สวยงามอย่างมีระดับ
            เป็นผ้าม่านหรูที่เหมาะมากเลยทีเดียว
            เหมาะสมกับสไตล์การตกแต่งที่หรูหรา มีระดับ
            แสดงถึงรสนิยมการตกแต่งของเจ้าของได้อย่างชัดเจน
            <br />
            <span>
              จุดเด่นสำคัญของผ้าม่านหลุยส์อยู่ที่ 4 องค์ประกอบสำคัญ คือ
              ‘ลูกหลุยส์’ หรือ บริเวณม่านทรงโค้ง รูปทรงหยดน้ำ
              ที่ถูกจับจีบอย่างละเมียดละไมอยู่ด้านบน และ ‘หางหลุยส์’ หรือ
              ชายผ้าที่เรียงซ้อนกันเป็นชั้น ๆ
              ที่บริเวณซ้าย-ขวาของลูกหลุยส์อย่างลงตัว
              ที่บริเวณปลายของผ้าม่านหลุยส์ส่วนใหญ่ยังอาจประดับด้วย ‘ชายครุย’
              (อุปกรณ์ประดับที่ชายระบาย) และหากมีหลากลูกหลุยส์ซ้อนกัน
              บางครั้งยังอาจมีการจับจีบที่บริเวณตรงกลางรวมกันเรียกว่า ‘ไทด์’
            </span>{" "}
          </p>
          <img
            className="flex shadow-2xl w-[200px] md:w-[400px] h-auto m-2"
            src={r6}
            alt="about"
          />
        </div>

        <div class="titlea  py-1 shadow-2xl mt-5 ">
          <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
          <h5 className=" inline-block text-base md:text-lg xl:text-xl text-b-font  pl-4 p-2 my-1">
            เลือกรางให้เหมาะกับผ้าม่าน
          </h5>
        </div>

        <div className="flex justify-center items-center ">
          <p class="p-5 md:text-xl text-b-font text-lg mt-5">
            รางของผ้าม่านแต่ละประเภท
          </p>
        </div>
        <div className=" flex flex-col md:flex-row lg:flex-row xl:flex-row bg-gradient-to-l from-brown-blog shadow-md items-center m-5">
          <div class="flex flex-col md:flex-row lg:flex-row shadow-md items-center">
            <div class="flex-row md:flex-col ">
              <img
                className="shadow-2xl w-[200px] md:w-[400px] h-auto m-2 inline-block"
                src={r7}
                alt="about"
              />
              <img
                className=" shadow-2xl w-[200px] md:w-[400px] h-auto m-2 inline-block"
                src={r11}
                alt="about"
              />
            </div>
            <div class=" flex flex-col ml-5 p-2 text-left text-sm md:text-base  text-b-font mx-auto ">
              <h1 class=" mt-0 mx-auto text-center ">
                1. รางผ้าม่านระบบลูกล้อ : นิยมใช้กับม่านจีบหรือม่านลอน
              </h1>
              <br />{" "}
              <h1 class=" mt-0 mx-auto  ">
                เป็นระบบติดตั้งผ้าม่านที่เมื่อปิดม่านแล้ว
                มีลักษณะเป็นระบบล้ออยู่ในราง ใช้ด้ามจูงผ้าม่านเพื่อเปิด-ปิด
                ตัวม่านจะปิดรางม่านทั้งหมดไม่สามารถมองเห็นได้
                เป็นรางที่ใช้งานสะดวก แม้เปิดปิดบ่อย ๆ ก็ไม่เป็นปัญหา
                เมื่อลากม่านปิดแล้วจะมองไม่เห็นตัวรางเลย
                ใช้ติดตั้งได้ทั้งประตูและหน้าต่างที่มีการเปิดปิดใช้งานบ่อยๆ
                ต้องการความคล่องตัว หรือ
                หน้างานที่เตรียมหลุมฝ้าไว้สำหรับติดตั้งผ้าม่าน
                เป็นรางที่ไม่เน้นความสวยงามของรางผ้าม่านมากนัก
              </h1>
              <br />{" "}
              <h1 class=" mt-0 mx-auto  ">
                1.1 รางตัวซี : เป็นรางม่านที่ใช้กับม่านจีบเพียงอย่างเดียว
                เหมาะสำหรับผู้ที่มีงบประมาณจำกัด เพราะตัวรางมีราคาถูก
                แต่วัสดุค่อนข้างบาง อาจเปิด-ปิดได้ไม่สะดวกมากนัก
              </h1>
              <br />{" "}
              <h1 class=" mt-0 mx-auto text-left ">
                1.2 รางตัวยูหรือรางไมโคร :
                เหมาะสำหรับติดตั้งม่านโดยไม่ต้องโชว์ตัวราง
                นิยมใช้คู่กับกล่องม่านเพื่อบังตัวรางเอาไว้
                มักเป็นขาจับอลูมิเนียม คู่กับห่วงแบบพลาสติกมีลูกล้อ
                มีให้เลือกหลายเกรดตามงบประมาณที่ต้องการ
              </h1>
              <br />{" "}
              <h1 class=" mt-0 mx-auto text-left ">
                1.3 รางตัวเอ็ม : รางม่านนิยมใช้มากที่สุด
                ให้ความคล่องต้วในการใช้งาน รูดง่าย ลื่นไหลดีกว่า เบาแรง
                ทั้งแบบใช้เชือกดึง และมือรูด รวมทั้งแบบใช้คู่กับด้ามจูงม่านได้
                มีให้เลือกหลายรุ่นตามการใช้งาน แบบเก็บข้างและแยกกลาง
              </h1>
            </div>
          </div>
        </div>

        <div className=" flex flex-col md:flex-row lg:flex-row xl:flex-row bg-gradient-to-l from-brown-blog shadow-md items-center m-5">
          <div class="flex flex-col md:flex-row lg:flex-row shadow-md items-center">
            <div class="flex-row md:flex-col ">
              <img
                className="shadow-2xl w-[200px] md:w-[400px] h-auto m-2 inline-block"
                src={r8}
                alt="about"
              />
              <img
                className="shadow-2xl w-[200px] md:w-[400px] h-auto m-2 inline-block"
                src={r9}
                alt="about"
              />
            </div>
            <div class=" flex flex-col ml-5 p-2 text-left text-sm md:text-base  text-b-font mx-auto ">
              <h1 class=" mt-0 mx-auto text-center ">
                2. รางม่านแบบรางโชว์ : นิยมใช้กับม่านตาไก่
              </h1>
              <br />{" "}
              <h1 class=" mt-0 mx-auto text-center ">
                รางม่านแบบรางโชว์
                เป็นรางผ้าม่านที่เมื่อติดตั้งออกมาแล้วจะได้ออกมาตามชื่อ
                โดยจะโชว์ตัวรางอยู่ตลอดเวลา ไม่ว่าจะเปิดหรือปิดผ้าม่าน
                ก็ยังคงเห็นรางม่านชัดเจนสวยงาม
                สามารถเลือกวัสดุให้เข้ากับการตกแต่งได้หลากหลายแบบ
              </h1>
              <br />{" "}
              <h1 class=" mt-0 mx-auto text-left ">
                2.1 เหล็ก :
                รางม่านเหล็กมักมาคู่กับห่วงม่านและขาจับเหล็กเช่นเดียวกัน
                นิยมใช้สีดำ สีเงิน สีทอง สีบรอนซ์ ซึ่งทำขึ้นโดยการพ่นสี
                เหมาะสำหรับบ้านสไตล์ลอฟท์ ย้อนยุค หรือแบบร่วมสมัย
              </h1>
              <br />{" "}
              <h1 class=" mt-0 mx-auto text-left ">
                2.2 ไม้ :
                รางม่านไม้เป็นรางที่เหมาะกับบ้านสไตล์คลาสสิกหรือรีสอร์ท
                เพราะให้ความรู้สึกเป็นธรรมชาติ มีโทนสีให้เลือกหลากหลาย
                แต่มีจุดอ่อนที่หากใช้กับหน้าต่างบานใหญ่มาก ๆ ไม้อาจโก่งตัว
                ทำให้เปิด-ปิดได้ไม่สะดวกนัก
              </h1>
              <br />{" "}
              <h1 class=" mt-0 mx-auto text-left ">
                2.3 อลูมิเนียม : เป็นรางโชว์อีกประเภทหนึ่งที่มีความแข็งแรงทนทาน
                นิยมทำสีให้เป็นลายไม้ และใช้คู่กับห่วงพลาสติก
                หาซื้อง่ายและมีราคาไม่แพง
                แต่มีจุดอ่อนที่เปิด-ปิดได้ไม่สะดวกเท่ารางระบบลูกล้อ
              </h1>
              <br />{" "}
              <h1 class=" mt-0 mx-auto text-left ">
                2.4 สแตนเลส : เป็นรางม่านที่ทำจากสแตนเลส
                โดยใช้คู่กับห่วงและขาจับเหล็ก มีจุดเด่นที่ความแข็งแรง
                ไม่เป็นสนิม ไม่ต้องกังวลเรื่องความชื้น
              </h1>
            </div>
          </div>
        </div>

        <div className=" flex flex-col md:flex-row lg:flex-row xl:flex-row bg-gradient-to-l from-brown-blog shadow-md items-center m-5">
          <div class="flex flex-col md:flex-row lg:flex-row shadow-md items-center">
            <div class="flex-row md:flex-col ">
              <img
                className="shadow-2xl w-[200px] md:w-[400px] h-auto m-2 inline-block"
                src={r10}
                alt="about"
              />
            </div>
            <div class=" flex flex-col ml-5 p-2 text-left text-sm md:text-base  text-b-font mx-auto ">
              <h1 class=" mt-0 mx-auto ">
                3. รางผ้าม่านแบบพับ : ใช้กับม่านพับโดยเฉพาะ
              </h1>
              <br />{" "}
              <h1 class=" mt-0 mx-auto  ">
                รางม่านแบบพับ
                เป็นการติดตั้งผ้าม่านที่มีลักษณะต่างจากรางประเภทอื่น
                โดยวิธีการเปิด-ปิดม่านประเภทนี้ จะเป็นการดึงตัวม่านขึ้นลง
                แทนที่การเปิดออกด้านข้าง นิยมใช้อลูมิเนียมผลิตเป็นตัวราง
                และอุปกรณ์ส่วนอื่น ๆ มักทำจากพลาสติก
                ใช้กับการตกแต่งบ้านได้หลายแบบขึ้นอยู่กับประเภทผ้าม่านที่เลือกใช้
              </h1>
            </div>
          </div>
        </div>

        <div className=" flex flex-col md:flex-row lg:flex-row xl:flex-row bg-gradient-to-l from-brown-blog shadow-md items-center m-5">
          <div class="flex flex-col md:flex-row lg:flex-row shadow-md items-center">
            <div class="flex-row md:flex-col ">
              <img
                className="shadow-2xl w-[200px] md:w-[400px] h-auto m-2 inline-block"
                src={r12}
                alt="about"
              />
              <img
                className="shadow-2xl w-[200px] md:w-[400px] h-auto m-2 inline-block"
                src={r13}
                alt="about"
              />
            </div>
            <div class=" flex flex-col ml-5 p-2 text-left text-sm md:text-base  text-b-font mx-auto ">
              <h1 class=" mt-0 mx-auto text-center ">
                4. รางม่านลอน : รางเฉพาะของม่านลอน
              </h1>
              <br />
              <h1 class=" mt-0 mx-auto  ">
                ม่านลอนสามารถใช้รางที่เป็นรางระบบลูกล้อได้แต่รางของม่านลอนสามารถนั้น
                ก็มีลักษณะเฉพาะที่เป็นนิยมใช้กันเป็นอย่างมากเช่นกัน โดยแบ่งเป็น
              </h1>
              <br />
              <h1 class=" mt-0 mx-auto  ">
                4.1 ม่านลอนโซ่ไข่ปลา : มีลักษณะการทิ้งตัวของชายผ้าที่เป็นระเบียบ
                ทำให้ลอนมีทรงชัด มีระยะลอนที่เป็นระยะตายตัว
                เพราะล็อคระยะด้วยโซ่ไข่ปลาด้วยการนำโซ่ไปเกี่ยวไว้ที่ลูกล้อ
                โดยจะเย็บม่านลอนแล้วใช้ตะขอเกี่ยวตัวผ้าม่านเข้ากับลูกล้ออีกทีหนึ่ง
                เป็นตะขอแบบเดียวกับม่านจีบ
                สามารถปรับขนาดให้เข้ากับพื้นที่ที่ต้องการติดได้
                โดยหากต้องการลอนที่มีความลึกมากขึ้นก็สามารถปรับแต่งได้ตามต้องการ
                เหมาะมากสำหรับพื้นที่ที่มีการบิ้วอิน หรือพื้นที่ที่มีข้อจำกัด
                เพราะสามารถปรับแต่งขนาด ความลึก-ความกว้าง
                ของผ้าม่านให้เข้ากับพื้นที่ดังกล่าวได้ หากอุปกรณ์ชำรุดเสียหาย
                สามารถเข้าไปแก้ไขที่หน้างานได้เลย
                แต่เวลาติดตั้งเสร็จจะมองเห็นอุปกรณ์ที่เป็นโซ่ไข่ปลา
              </h1>
              <br />
              <h1 class=" mt-0 mx-auto  ">
                4.2 ม่านลอนรางเทป : มีลักษณะคล้ายม่านลอนโซ่ไข่ปลา
                แตกต่างกันตรงที่ม่านลอนรางเทปจะใช้เทปผ้าเป็นตัวล็อคระยะแทนโซ่ไข่ปลา
                ตัวเทปซึ่งเป็นผ้าจะถูกผลิตมาพร้อมกับตัวราง
                โดยเทปตัวนี้จะยึดเข้ากับลูกล้อที่อยู่ในรางอีกที
                ซึ่งเป็นหมุดที่เทปเข้าไปเกี่ยวกับลูกล้อ
                โดยใช้เย็บเติดกับผ้าม่านบริเวณด้านหลัง
                แต่การปรับขนาดให้เข้ากับพื้นที่ที่ต้องการติดนั้นค่อนข้างยาก และ
                หากเทปลอนเกิดการชำรุด จะต้องถอดผ้าม่านออกมาเพื่อเย็บใหม่
                ไม่สามารถแก้ไขได้ที่หน้างาน ทำให้เสียเวลา และค่าใช้จ่ายเพิ่มขึ้น
              </h1>
            </div>
          </div>
        </div>

        <Footer></Footer>
      </div>
    </>
  );
}
export default ServicePage;
