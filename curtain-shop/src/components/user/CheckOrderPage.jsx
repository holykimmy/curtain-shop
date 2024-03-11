import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { jwtDecode } from "jwt-decode";
import blackout from "../img/products/blackout.jpeg";
import Footer from "../Footer";
import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import customerAPI from "../../services/customerAPI";
import ProductDetail from "./ProductDetail";
import r6 from "../img/r6.jpg";

function CheckOrdeerPage() {
  const dispatch = useDispatch();

  //calculator
  const { cart } = useSelector((state) => ({ ...state }));

  const getTotal = () => {
    return cart.reduce((currenValue, nextValue) => {
      // const deliverly = 200;
      return currenValue + nextValue.count * nextValue.price;
    }, 0); // const start
  };

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

      console.log("log1", isLoggedIn);

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

  console.log("outside logh", isLoggedIn);
  if (!isLoggedIn) {
    console.log("hellotest tset ");
    navigate("/");
  }

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

  //login check
  const [address, setAddress] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("token");
        console.log("token: ", authToken);
        if (authToken) {
          // Set up axios default headers
          axios.defaults.headers.common["authtoken"] = authToken;

          const decodedToken = jwtDecode(authToken); // Decode the token

          if (decodedToken && decodedToken.user) {
            const { username } = decodedToken.user;
            const addressData = await customerAPI.getAddress(username); // ส่งชื่อผู้ใช้ไปยังฟังก์ชัน getAddress()
            setAddress(addressData);
          }
        }
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล", err);
      }
    };

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    fetchData();
    return () => clearInterval(interval);
  }, []);

  console.log(address);

  const handleAddressSelect = (selectedIndex) => {
    const selectedAddress = address[selectedIndex];
    console.log("Selected Address:", selectedAddress);
    // ทำสิ่งที่ต้องการเมื่อเลือกที่อยู่
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

        <div class="titlea bg-brown-bg py-1 shadow-md">
          <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
          <h5 className=" inline-block text-lg md:text-xl xl:text-3xl text-b-font  pl-4 p-2 my-1">
            ยืนยันคำสั่งซื้อ
          </h5>
        </div>
        <div class="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
          <div class="px-4 pt-8">
            <p class="text-2xl text-b-font">ข้อมูลคำสั่งซื้อ</p>
            <p class="text-gray-400">กรุณาตรวจสอบรายการสินค้าของคุณ</p>
            <div class="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
              {cart.map((item, index) => (
                <div
                  key={index}
                  class="flex flex-col shadow-xl  rounded-lg bg-white sm:flex-row"
                >
                  <img
                    class="m-5 h-50 w-40 rounded-md border object-cover object-center"
                    src={`${process.env.REACT_APP_API}/images/${item.image}`}
                    alt="product"
                  />
                  <div class="flex w-full flex-col px-4 py-4">
                    <span class="font-semibold">{item.name}</span>
                    {/* <span class="float-right text-gray-600">
                      ความกว้าง :{item.width}
                    </span>
                    <span class="float-right text-gray-600">
                      ความยาว :{item.height}
                    </span> */}
                    <span class="float-right text-gray-600">
                      รหัสสี : {item.color}
                    </span>
                    {/* <span class="float-right font-bold text-gray-600">
                      ผ้าม่านที่สั่งตัด : {item.type}
                    </span> */}
                    <div class="float-right text-gray-600 whitespace-pre-wrap">
                      รายละเอียดเพิ่มเติม :{item.detail}
                    </div>
                    <p class="text-md font-bold">
                      {" "}
                      การสั่งตัดผ้าม่าน : {item.type}  เซนติเมตร{" "}
                    </p>
                    <p class="text-md font-bold"> ราคา/หลา : {item.price} </p>
                    <p class="text-md font-bold">
                      {" "}
                      ขนาด : {item.width} x {item.height} เซนติเมตร{" "}
                    </p>
                    <p class="text-md font-bold">จำนวน : {item.count} หลา </p>
                    <p class="text-md font-bold">
                      รวม : {item.price * item.count} บาท{" "}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p class="mt-8 text-2xl text-b-font">เลือกการขนส่ง</p>
            <form class="mt-5 grid gap-6">
              <div class="relative">
                <input
                  class="peer hidden"
                  id="radio_1"
                  type="radio"
                  name="radio"
                  checked
                />
                <span class="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                <label
                  class="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                  for="radio_1"
                >
                  <img
                    class="w-14 object-contain"
                    src="/images/naorrAeygcJzX0SyNI4Y0.png"
                    alt=""
                  />
                  <div class="ml-5">
                    <span class="mt-2 font-semibold">
                      ทางร้านขนส่งพร้อมติดตั้ง
                    </span>
                    <p class="text-slate-500 text-sm leading-6">
                      ระยะเวลา: 7-14 วัน
                    </p>
                  </div>
                </label>
              </div>
              <div class="relative">
                <input
                  class="peer hidden"
                  id="radio_2"
                  type="radio"
                  name="radio"
                  checked
                />
                <span class="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                <label
                  class="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                  for="radio_2"
                >
                  <img
                    class="w-14 object-contain"
                    src="/images/oG8xsl3xsOkwkMsrLGKM4.png"
                    alt=""
                  />
                  <div class="ml-5">
                    <span class="mt-2 font-semibold">จัดส่งสินค้าทางขนส่ง</span>
                    <p class="text-slate-500 text-sm leading-6">
                      ระยะเวลา: 7-14 วัน
                    </p>
                  </div>
                </label>
              </div>
            </form>
          </div>
          <div class="bg-brown-blog mt-10  px-4 pt-8 lg:mt-0">
            <select
              className="mb-2 rounded-lg"
              onChange={(e) => handleAddressSelect(e.target.value)}
            >
              <option value="">โปรดเลือกที่อยู่ที่ต้องการจัดส่ง</option>
              {address.map((addressData, index) => (
                <option key={index} value={addressData._id}>
                  {addressData.houseNo} {addressData.sub_district}{" "}
                  {addressData.district} {addressData.province}{" "}
                  {addressData.postcode}
                </option>
              ))}
            </select>
            <p>
            <Link
              to="/address"
              className=" mt-2 mb-3 px-4 py-2 rounded-lg text-base  text-gray-900 hover:text-gray-600"
              // onClick={() => handleEditProduct(product._id, product.name)}
            >
              เพิ่มที่อยู่ใหม่ ->
            </Link></p>

            <p class="text-2xl font-medium">ข้อมูลการชำระเงิน</p>
            <p class=" text-gray-1000">รายละเอียดการชำระเงินของท่าน</p>

            <div class="">
              <div class="mt-6 border-t border-b py-2">
                <div class="flex-col items-center justify-between">
                  {cart.map((item, index) => (
                    <p
                      key={index}
                      className="ml-10 font-semibold text-lg text-gray-900 my-2"
                    >
                      {item.name} ขนาด {item.width} x {item.height} เซนติเมตร x{" "}
                      {item.count} = {item.price * item.count}
                    </p>
                  ))}

                  <p class="mt-4 text-lg font-medium text-gray-900">
                    {" "}
                    ราคารวม : {getTotal()} บาท{" "}
                  </p>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-lg font-medium text-gray-900">ค่าจัดส่ง</p>
                  <p class="font-semibold text-lg text-gray-900">200</p>
                </div>
              </div>
              <div class="mt-6 flex items-center justify-between">
                <p class="text-lg font-medium text-gray-900">ราคารวมทั้งหมด</p>
                <p class="text-lg font-semibold text-gray-900">
                  {getTotal() + 200} บาท
                </p>
              </div>
            </div>
            <Link to="/payment">
              <button class="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">
                ยืนยันคำสั่งซื้อ
              </button>
            </Link>
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
export default CheckOrdeerPage;
