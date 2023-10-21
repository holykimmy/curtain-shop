import React from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import img1 from "../img/contact.jpeg";
import { HiPhone } from "react-icons/hi";
function ContactPage() {
  return (
    <>
      <div className="h-screen w-full ">
        <Navbar></Navbar>
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
