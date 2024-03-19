import React from "react";
import Navbaradmin from "./Navbaradmin";
import { LuReceipt, LuFileClock } from "react-icons/lu";
import { FaHistory } from "react-icons/fa";

import { Link } from "react-router-dom";

function ReceiptPage() {
  return (
    <>
      <Navbaradmin></Navbaradmin>
      <div class="flex-col w-full justify-center items-center p-auto  pt-2 md:pt-2">
        <div class="titlea bg-white/60 py-1 shadow-md">
          <LuReceipt className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></LuReceipt>
          <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
            ใบเสร็จ
          </h5>
        </div>
        <Link to="/quotation">
          <button class="flex bg-gray-200 my-5 mx-auto p-1 pl-2 items-center shadow-md hover:shadow-xl h-[85px] md:h-[100px] w-[90%] md:w-[65%] rounded-[72px] justify-center">
            <div className="flex-[15%] rounded-[72px] border-4 border-gray-200 border-r-white">
              <LuReceipt className=" inline-block shadow-lg p-2 w-auto h-[70px] bg-green-100 rounded-full  text-gray-500 "></LuReceipt>
            </div>
            <h5 className="flex-[85%] inline-block text-center text-2xl pr-4  text-neutral-600 font-bold ">
              สร้างใบเสนอราคา
            </h5>
          </button>
        </Link>
        <Link to="/invoice">
          <button class="flex bg-red-300 my-5 mx-auto p-1 pl-2 items-center shadow-md hover:shadow-xl h-[85px] md:h-[100px] w-[90%] md:w-[65%] rounded-[72px] justify-center">
            <div className="flex-[15%] rounded-[72px] border-4 border-red-300 border-r-white">
              <LuReceipt className=" inline-block shadow-lg p-2 w-auto h-[70px] bg-yellow-100 rounded-full  text-gray-500 "></LuReceipt>
            </div>
            <h5 className="flex-[85%] inline-block text-center text-2xl pr-4  text-neutral-600 font-bold ">
              สร้างใบแจ้งหนี้
            </h5>
          </button>
        </Link>
      </div>
      <div class="shadow-md w-full h-10"></div>
      <div class="titlea bg-white/60 py-1 shadow-md">
        <FaHistory className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></FaHistory>
        <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
          ประวัติการสร้างใบเสร็จ
        </h5>
      </div>
      <Link to="/quotation/all">
        <button class="flex bg-green-400 my-5 mx-auto p-1 pl-2 items-center shadow-md hover:shadow-xl h-[85px] md:h-[100px] w-[90%] md:w-[65%] rounded-[72px] justify-center">
          <div className="flex-[15%] rounded-[72px] border-4 border-green-400 border-r-white">
            <FaHistory className=" inline-block shadow-lg p-2 w-auto h-[70px] bg-white/70 rounded-full  text-gray-500 "></FaHistory>
          </div>
          <h5 className="flex-[85%] inline-block text-center text-2xl pr-4  text-neutral-600 font-bold ">
            ใบเสนอราคาที่สร้างแล้ว
          </h5>
        </button>
      </Link>
      <Link to="/invoice/all">
        <button class="flex bg-red-400 my-5 mx-auto p-1 pl-2 items-center shadow-md hover:shadow-xl h-[85px] md:h-[100px] w-[90%] md:w-[65%] rounded-[72px] justify-center">
          <div className="flex-[15%] rounded-[72px] border-4 border-red-400 border-r-white">
            <LuFileClock className=" inline-block shadow-lg p-2 w-auto h-[70px] bg-white/70 rounded-full  text-gray-500 "></LuFileClock>
          </div>
          <h5 className="flex-[85%] inline-block text-center text-2xl pr-4  text-neutral-600 font-bold ">
            ใบแจ้งหนี้ที่สร้างแล้ว
          </h5>
        </button>
      </Link>
    </>
  );
}
export default ReceiptPage;
