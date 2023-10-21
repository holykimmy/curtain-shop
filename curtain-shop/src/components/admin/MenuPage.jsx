import React from "react";
import Navbaradmin from "./Navbaradmin";
import { BiSolidStore, BiRefresh, BiUserCircle } from "react-icons/bi";
import { BsPlusLg } from "react-icons/bs";
import { RiScissorsCutFill } from "react-icons/ri";
import { LuReceipt } from "react-icons/lu";
import { Link } from "react-router-dom";
function MenuPage() {
  return (
    <>
      <Navbaradmin></Navbaradmin>
      <div class="flex-col w-full justify-center items-center p-auto  pt-2 md:pt-2">
        <Link to="/receipt">
          <button class="flex bg-sky-300 my-5 mx-auto p-1 pl-2 items-center shadow-md hover:shadow-xl h-[85px] md:h-[100px] w-[90%] md:w-[65%] rounded-[72px] justify-center">
            <div className="flex-[15%] rounded-[72px] border-4 border-sky-300 border-r-white">
              <BiSolidStore className=" inline-block shadow-lg p-2 w-auto h-[70px] bg-blue-gray-400 rounded-full  text-white "></BiSolidStore>
            </div>
            <h5 className="flex-[85%] inline-block text-center text-2xl pr-4  text-neutral-600 font-bold ">
              สินค้าที่มีอยู่
            </h5>
          </button>
        </Link>

        <Link to="/menu">
          <button class="flex bg-green-400 my-5 mx-auto p-1 pl-2 items-center shadow-md hover:shadow-xl h-[85px] md:h-[100px] w-[90%] md:w-[65%] rounded-[72px] justify-center">
            <div className="flex-[15%] rounded-[72px] border-4 border-green-400 border-r-white">
              <BiRefresh className=" inline-block shadow-lg p-2 w-auto h-[70px] bg-white/40 rounded-full  text-white "></BiRefresh>
            </div>
            <h5 className="flex-[85%] inline-block text-center text-2xl pr-4 text-neutral-600 font-bold ">
              อัปเดตข้อมูล
            </h5>
          </button>
        </Link>

        <Link to="/add-product">
          <button class="flex bg-green-200 my-5 mx-auto p-1 pl-2 items-center shadow-md hover:shadow-xl h-[85px] md:h-[100px] w-[90%] md:w-[65%] rounded-[72px] justify-center">
            <div className="flex-[15%] rounded-[72px] border-4 border-green-200 border-r-white">
              <BsPlusLg className=" inline-block shadow-lg p-2 w-auto h-[70px] bg-green-400 rounded-full  text-white "></BsPlusLg>
            </div>
            <h5 className="flex-[85%] inline-block text-center text-2xl pr-4  text-neutral-600 font-bold ">
              เพิ่มข้อมูล
            </h5>
          </button>
        </Link>

        <Link to="/menu">
          <button class="flex bg-orange-200 my-5 mx-auto p-1 pl-2 items-center shadow-md hover:shadow-xl h-[85px] md:h-[100px] w-[90%] md:w-[65%] rounded-[72px] justify-center">
            <div className="flex-[15%] rounded-[72px] border-4 border-orange-200 border-r-white">
              <RiScissorsCutFill className=" inline-block shadow-lg p-2 w-auto h-[70px] bg-orange-400 rounded-full  text-white "></RiScissorsCutFill>
            </div>
            <h5 className="flex-[85%] inline-block text-center text-2xl pr-4  text-neutral-600 font-bold ">
              ข้อมูลการสั่งตัด
            </h5>
          </button>
        </Link>

        <Link to="/menu">
          <button class="flex bg-yellow-200 my-5 mx-auto p-1 pl-2 items-center shadow-md hover:shadow-xl h-[85px] md:h-[100px] w-[90%] md:w-[65%] rounded-[72px] justify-center">
            <div className="flex-[15%] rounded-[72px] border-4 border-yellow-200 border-r-white">
              <BiUserCircle className=" inline-block shadow-lg p-1 w-auto h-[70px] bg-white rounded-full  text-blue-gray-400 "></BiUserCircle>
            </div>
            <h5 className="flex-[85%] inline-block text-center text-2xl pr-4  text-neutral-600 font-bold ">
              ข้อมูลลูกค้า
            </h5>
          </button>
        </Link>

        <Link to="/receipt">
          <button class="flex bg-gray-200 my-5 mx-auto p-1 pl-2 items-center shadow-md hover:shadow-xl h-[85px] md:h-[100px] w-[90%] md:w-[65%] rounded-[72px] justify-center">
            <div className="flex-[15%] rounded-[72px] border-4 border-gray-200 border-r-white">
              <LuReceipt className=" inline-block shadow-lg p-2 w-auto h-[70px] bg-green-100 rounded-full  text-gray-500 "></LuReceipt>
            </div>
            <h5 className="flex-[85%] inline-block text-center text-2xl pr-4  text-neutral-600 font-bold ">
              ใบเสร็จ
            </h5>
          </button>
        </Link>
      </div>
    </>
  );
}
export default MenuPage;
