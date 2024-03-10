import React, { useState, useEffect }  from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import { Link , useNavigate} from "react-router-dom";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import blackout from "../img/products/blackout.jpeg";
import Footer from "../Footer";
import ProductDetail from "./ProductDetail";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";

function ContactPage() {

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
        console.log("addresssjhf", decodedToken.user.addres);
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
      cancelButtonText: "ไม่ใช่",
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
      <Navbar></Navbar>

      <div class="titlea bg-brown-bg py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
          ผ้าม่านกันแสง ( Blackout )
        </h5>
      </div>

      <div className="flex flex-wrap justify-center mt-2 mb-2 md:mt-10 md:mb-10 ">
        {/* part */}
        <div class=" p-2 md:p-4 max-w-[180px] md:max-w-sm   ">
          {/* card--1 */}
          <Link to="/product-detail">
            <div class="flex rounded-lg shadow-3xl hover:shadow-2xl h-[280px] md:h-full flex-col  md:pb-5 bg-white ">
              <div class="relative ">
                <Link to="/product-detail">
                  <img
                    class="w-full rounded-t-lg "
                    src={blackout}
                    alt="blackout"
                  />
                  <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>
                </Link>

                <div class="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                  Black Out
                </div>
              </div>

              <div class="px-6 py-4 pl-5">
                <p class="font-semibold text-brown-600 text-base md:text-lg inline-block hover:text-browntop transition duration-500 ease-in-out">
                  คุณสมบัติ
                </p>
                <p class="text-brown-500 text-xs md:text-sm">
                  ผ้าแบล็คเอ้าท์ (Black out) สามารถป้องกันแสงได้ 100%
                  และป้องกันรังสี UV
                </p>
              </div>

              <Link
                to="/product-detail"
                class="pl-5 mt-3 text-brown-500 text-sm md:base hover:text-browntop inline-flex items-center"
              >
                อ่านพิ่มเติม
                <HiOutlineArrowSmRight />
              </Link>
            </div>
          </Link>
        </div>

        {/* part */}
        <div class=" p-2 md:p-4 max-w-[180px] md:max-w-sm   ">
          {/* card--1 */}
          <Link to="/product-detail">
            <div class="flex rounded-lg shadow-3xl hover:shadow-2xl h-[280px] md:h-full flex-col  md:pb-5 bg-white ">
              <div class="relative ">
                <Link to="/product-detail">
                  <img
                    class="w-full rounded-t-lg "
                    src={blackout}
                    alt="blackout"
                  />
                  <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>
                </Link>

                <div class="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                  Black Out
                </div>
              </div>

              <div class="px-6 py-4 pl-5">
                <p class="font-semibold text-brown-600 text-base md:text-lg inline-block hover:text-browntop transition duration-500 ease-in-out">
                  คุณสมบัติ
                </p>
                <p class="text-brown-500 text-xs md:text-sm">
                  ผ้าแบล็คเอ้าท์ (Black out) สามารถป้องกันแสงได้ 100%
                  และป้องกันรังสี UV
                </p>
              </div>

              <Link
                to="/product-detail"
                class="pl-5 mt-3 text-brown-500 text-sm md:base hover:text-browntop inline-flex items-center"
              >
                อ่านพิ่มเติม
                <HiOutlineArrowSmRight />
              </Link>
            </div>
          </Link>
        </div>

        {/* part */}
        <div class=" p-2 md:p-4 max-w-[180px] md:max-w-sm   ">
          {/* card--1 */}
          <Link to="/product-detail">
            <div class="flex rounded-lg shadow-3xl hover:shadow-2xl h-[280px] md:h-full flex-col  md:pb-5 bg-white ">
              <div class="relative ">
                <Link to="/product-detail">
                  <img
                    class="w-full rounded-t-lg "
                    src={blackout}
                    alt="blackout"
                  />
                  <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>
                </Link>

                <div class="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                  Black Out
                </div>
              </div>

              <div class="px-6 py-4 pl-5">
                <p class="font-semibold text-brown-600 text-base md:text-lg inline-block hover:text-browntop transition duration-500 ease-in-out">
                  คุณสมบัติ
                </p>
                <p class="text-brown-500 text-xs md:text-sm">
                  ผ้าแบล็คเอ้าท์ (Black out) สามารถป้องกันแสงได้ 100%
                  และป้องกันรังสี UV
                </p>
              </div>

              <Link
                to="/product-detail"
                class="pl-5 mt-3 text-brown-500 text-sm md:base hover:text-browntop inline-flex items-center"
              >
                อ่านพิ่มเติม
                <HiOutlineArrowSmRight />
              </Link>
            </div>
          </Link>
        </div>

        {/* part */}
        <div class=" p-2 md:p-4 max-w-[180px] md:max-w-sm   ">
          {/* card--1 */}
          <Link to="/product-detail">
            <div class="flex rounded-lg shadow-3xl hover:shadow-2xl h-[280px] md:h-full flex-col  md:pb-5 bg-white ">
              <div class="relative ">
                <Link to="/product-detail">
                  <img
                    class="w-full rounded-t-lg "
                    src={blackout}
                    alt="blackout"
                  />
                  <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>
                </Link>

                <div class="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                  Black Out
                </div>
              </div>

              <div class="px-6 py-4 pl-5">
                <p class="font-semibold text-brown-600 text-base md:text-lg inline-block hover:text-browntop transition duration-500 ease-in-out">
                  คุณสมบัติ
                </p>
                <p class="text-brown-500 text-xs md:text-sm">
                  ผ้าแบล็คเอ้าท์ (Black out) สามารถป้องกันแสงได้ 100%
                  และป้องกันรังสี UV
                </p>
              </div>

              <Link
                to="/product-detail"
                class="pl-5 mt-3 text-brown-500 text-sm md:base hover:text-browntop inline-flex items-center"
              >
                อ่านพิ่มเติม
                <HiOutlineArrowSmRight />
              </Link>
            </div>
          </Link>
        </div>
      </div>

      {/* card product flex*/}
      <div className="flex flex-wrap justify-center mt-2 mb-2 md:mt-10 md:mb-10 ">
        {/* part */}
        <div class=" p-2 md:p-4 max-w-[180px] md:max-w-sm   ">
          {/* card--1 */}
          <Link to="/product-detail">
            <div class="flex rounded-lg shadow-3xl hover:shadow-2xl h-[280px] md:h-full flex-col  md:pb-5 bg-white ">
              <div class="relative ">
                <Link to="/product-detail">
                  <img
                    class="w-full rounded-t-lg "
                    src={blackout}
                    alt="blackout"
                  />
                  <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>
                </Link>

                <div class="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                  Black Out
                </div>
              </div>

              <div class="px-6 py-4 pl-5">
                <p class="font-semibold text-brown-600 text-base md:text-lg inline-block hover:text-browntop transition duration-500 ease-in-out">
                  คุณสมบัติ
                </p>
                <p class="text-brown-500 text-xs md:text-sm">
                  ผ้าแบล็คเอ้าท์ (Black out) สามารถป้องกันแสงได้ 100%
                  และป้องกันรังสี UV
                </p>
              </div>

              <Link
                to="/product-detail"
                class="pl-5 mt-3 text-brown-500 text-sm md:base hover:text-browntop inline-flex items-center"
              >
                อ่านพิ่มเติม
                <HiOutlineArrowSmRight />
              </Link>
            </div>
          </Link>
        </div>

        {/* part */}
        <div class=" p-2 md:p-4 max-w-[180px] md:max-w-sm   ">
          {/* card--1 */}
          <Link to="/product-detail">
            <div class="flex rounded-lg shadow-3xl hover:shadow-2xl h-[280px] md:h-full flex-col  md:pb-5 bg-white ">
              <div class="relative ">
                <Link to="/product-detail">
                  <img
                    class="w-full rounded-t-lg "
                    src={blackout}
                    alt="blackout"
                  />
                  <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>
                </Link>

                <div class="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                  Black Out
                </div>
              </div>

              <div class="px-6 py-4 pl-5">
                <p class="font-semibold text-brown-600 text-base md:text-lg inline-block hover:text-browntop transition duration-500 ease-in-out">
                  คุณสมบัติ
                </p>
                <p class="text-brown-500 text-xs md:text-sm">
                  ผ้าแบล็คเอ้าท์ (Black out) สามารถป้องกันแสงได้ 100%
                  และป้องกันรังสี UV
                </p>
              </div>

              <Link
                to="/product-detail"
                class="pl-5 mt-3 text-brown-500 text-sm md:base hover:text-browntop inline-flex items-center"
              >
                อ่านพิ่มเติม
                <HiOutlineArrowSmRight />
              </Link>
            </div>
          </Link>
        </div>

        {/* part */}
        <div class=" p-2 md:p-4 max-w-[180px] md:max-w-sm   ">
          {/* card--1 */}
          <Link to="/product-detail">
            <div class="flex rounded-lg shadow-3xl hover:shadow-2xl h-[280px] md:h-full flex-col  md:pb-5 bg-white ">
              <div class="relative ">
                <Link to="/product-detail">
                  <img
                    class="w-full rounded-t-lg "
                    src={blackout}
                    alt="blackout"
                  />
                  <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>
                </Link>

                <div class="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                  Black Out
                </div>
              </div>

              <div class="px-6 py-4 pl-5">
                <p class="font-semibold text-brown-600 text-base md:text-lg inline-block hover:text-browntop transition duration-500 ease-in-out">
                  คุณสมบัติ
                </p>
                <p class="text-brown-500 text-xs md:text-sm">
                  ผ้าแบล็คเอ้าท์ (Black out) สามารถป้องกันแสงได้ 100%
                  และป้องกันรังสี UV
                </p>
              </div>

              <Link
                to="/product-detail"
                class="pl-5 mt-3 text-brown-500 text-sm md:base hover:text-browntop inline-flex items-center"
              >
                อ่านพิ่มเติม
                <HiOutlineArrowSmRight />
              </Link>
            </div>
          </Link>
        </div>

        {/* part */}
        <div class=" p-2 md:p-4 max-w-[180px] md:max-w-sm   ">
          {/* card--1 */}
          <Link to="/product-detail">
            <div class="flex rounded-lg shadow-3xl hover:shadow-2xl h-[280px] md:h-full flex-col  md:pb-5 bg-white ">
              <div class="relative ">
                <Link to="/product-detail">
                  <img
                    class="w-full rounded-t-lg "
                    src={blackout}
                    alt="blackout"
                  />
                  <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>
                </Link>

                <div class="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                  Black Out
                </div>
              </div>

              <div class="px-6 py-4 pl-5">
                <p class="font-semibold text-brown-600 text-base md:text-lg inline-block hover:text-browntop transition duration-500 ease-in-out">
                  คุณสมบัติ
                </p>
                <p class="text-brown-500 text-xs md:text-sm">
                  ผ้าแบล็คเอ้าท์ (Black out) สามารถป้องกันแสงได้ 100%
                  และป้องกันรังสี UV
                </p>
              </div>

              <Link
                to="/product-detail"
                class="pl-5 mt-3 text-brown-500 text-sm md:base hover:text-browntop inline-flex items-center"
              >
                อ่านพิ่มเติม
                <HiOutlineArrowSmRight />
              </Link>
            </div>
          </Link>
        </div>
      </div>

      <Footer></Footer>
    </>
  );
}
export default ContactPage;
