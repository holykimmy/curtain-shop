import React from "react";
import Navbaradmin from "./Navbaradmin";
import { BiSolidStore, BiRefresh, BiUserCircle } from "react-icons/bi";
import { BsPlusLg } from "react-icons/bs";
import { RiScissorsCutFill } from "react-icons/ri";
import { LuReceipt } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

function MenuPage() {
  const navigate = useNavigate();
  const [suc, setSuc] = useState();

  const [userData, setUserData] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [userName, setUserName] = React.useState("");

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    console.log("authToken", authToken);

    if (authToken) {
      // Set up axios default headers
      axios.defaults.headers.common["authtoken"] = authToken;

      const decodedToken = jwtDecode(authToken); // Decode the token

      if (decodedToken && decodedToken.user) {
        const { f_name, l_name } = decodedToken.user;
        setUserName(`${f_name} ${l_name}`);
      }
      if (decodedToken && decodedToken.user) {
        // Check if user is admin
        if (decodedToken.user.role !== "admin") {
          // If user is not admin, redirect to login page or show unauthorized message
          // Redirecting to login page:
          window.location.href = "/login"; // Change '/login' to your actual login page route
          // Showing unauthorized message:
          Swal.fire("Unauthorized", "You are not authorized to access this page", "error");
        } else {
          setUserData(decodedToken.user);
        }
      }
    } else {
      // If no token found, redirect to login page or show unauthorized message
      // Redirecting to login page:
      window.location.href = "/login"; // Change '/login' to your actual login page route
      // Showing unauthorized message:
      Swal.fire("Unauthorized", "You are not authorized to access this page", "error");
    }
  }, []);


 

  


  return (
    <>
      <Navbaradmin></Navbaradmin>
      <div class="flex-col w-full h-screen items-center justify-center p-auto  pt-2 pb-2  md:pt-2">
        <div class="justify-center tems-centershadow-lg">
          <Link to="/products-ad">
            <button class="flex bg-sky-300 my-5 mx-auto p-1 pl-2 items-center shadow-md hover:shadow-xl h-[85px] md:h-[100px] w-[90%] md:w-[65%] rounded-[72px] justify-center">
              <div className="flex-[15%] rounded-[72px] border-4 border-sky-300 border-r-white">
                <BiSolidStore className=" inline-block shadow-lg p-2 w-auto h-[70px] bg-blue-gray-400 rounded-full  text-white "></BiSolidStore>
              </div>
              <h5 className="flex-[85%] inline-block text-center text-xl pr-4  text-neutral-600 font-bold ">
                สินค้าที่มีอยู่ในคลังและอัปเดตสินค้า
              </h5>
            </button>
          </Link>
          
          <Link to="/add-product">
            <button class="flex bg-green-200 my-5 mx-auto p-1 pl-2 items-center shadow-md hover:shadow-xl h-[85px] md:h-[100px] w-[90%] md:w-[65%] rounded-[72px] justify-center">
              <div className="flex-[15%] rounded-[72px] border-4 border-green-200 border-r-white">
                <BsPlusLg className=" inline-block shadow-lg p-2 w-auto h-[70px] bg-green-400 rounded-full  text-white "></BsPlusLg>
              </div>
              <h5 className="flex-[85%] inline-block text-center text-xl pr-4  text-neutral-600 font-bold ">
                เพิ่มข้อมูล
              </h5>
            </button>
          </Link>

          <Link to="/orders">
            <button class="flex bg-orange-200 my-5 mx-auto p-1 pl-2 items-center shadow-md hover:shadow-xl h-[85px] md:h-[100px] w-[90%] md:w-[65%] rounded-[72px] justify-center">
              <div className="flex-[15%] rounded-[72px] border-4 border-orange-200 border-r-white">
                <RiScissorsCutFill className=" inline-block shadow-lg p-2 w-auto h-[70px] bg-orange-400 rounded-full  text-white "></RiScissorsCutFill>
              </div>
              <h5 className="flex-[85%] inline-block text-center text-xl pr-4  text-neutral-600 font-bold ">
                ข้อมูลการสั่งตัด
              </h5>
            </button>
          </Link>

          <Link to="/customers">
            <button class="flex bg-yellow-200 my-5 mx-auto p-1 pl-2 items-center shadow-md hover:shadow-xl h-[85px] md:h-[100px] w-[90%] md:w-[65%] rounded-[72px] justify-center">
              <div className="flex-[15%] rounded-[72px] border-4 border-yellow-200 border-r-white">
                <BiUserCircle className=" inline-block shadow-lg p-1 w-auto h-[70px] bg-white rounded-full  text-blue-gray-400 "></BiUserCircle>
              </div>
              <h5 className="flex-[85%] inline-block text-center text-xl pr-4  text-neutral-600 font-bold ">
                ข้อมูลลูกค้า
              </h5>
            </button>
          </Link>

          <Link to="/receipt">
            <button class="flex bg-gray-200 my-5 mx-auto p-1 pl-2 items-center shadow-md hover:shadow-xl h-[85px] md:h-[100px] w-[90%] md:w-[65%] rounded-[72px] justify-center">
              <div className="flex-[15%] rounded-[72px] border-4 border-gray-200 border-r-white">
                <LuReceipt className=" inline-block shadow-lg p-2 w-auto h-[70px] bg-green-100 rounded-full  text-gray-500 "></LuReceipt>
              </div>
              <h5 className="flex-[85%] inline-block text-center text-xl pr-4  text-neutral-600 font-bold ">
                ใบเสร็จ
              </h5>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
export default MenuPage;
