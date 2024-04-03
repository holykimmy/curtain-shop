import React, { useEffect, useState } from "react";
import Navbaradmin from "./Navbaradmin";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import blackout from "../img/products/blackout.jpeg";
import { FaTrashAlt } from "react-icons/fa";
import productAPI from "../../services/productAPI";
import Swal from "sweetalert2";
import axios from "axios";
import SwitchButton from "./switchbutton";
import SwitchBtnConfirm from "./switchbtnconfirm";
import SwitchBtnSend from "./switchbtnsend";
import customerAPI from "../../services/customerAPI";
import orderAPI from "../../services/orderAPI";

import { jwtDecode } from "jwt-decode";
import { BsPinFill } from "react-icons/bs";

function PostOrder() {
  const { idOrder } = useParams();
  console.log("idOrder", idOrder);
  const [velvetProducts, setVelvetProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userName, setUserName] = React.useState("");
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [idUser, setIdUser] = React.useState("");

  const navigate = useNavigate();
  const [currentOrder, setCurrentOrder] = useState([]);
  const [cancelReasonAd, setCancelReasonAd] = useState("");
  useEffect(() => {
    const fetchData = () => {
      customerAPI
        .getOrderByIdOrder(idOrder)
        .then((orderData) => {
          setCurrentOrder(orderData);
        })
        .catch((err) => {
          console.error("error", err);
        });
    };
    fetchData();

    // Return a cleanup function to clear the interval
    return () => clearInterval();
  }, [idOrder]);

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
          
          Swal.fire("Unauthorized", "You are not authorized to access this page", "error");
          window.location.href = "/login"; // Change '/login' to your actual login page route
          // Showing unauthorized message:
        } else {
          setUserData(decodedToken.user);
        }
      }
    } else {
      // If no token found, redirect to login page or show unauthorized message
      // Redirecting to login page:
      window.location.href = "/login"; // Change '/login' to your actual login page route
      // Showing unauthorized message:
      Swal.fire(
        "Unauthorized",
        "You are not authorized to access this page",
        "error"
      );
    }
  }, []);

  //see address
  const [address, setAddress] = useState([]);
  console.log(idUser);

  useEffect(() => {
    const fetchData = () => {
      customerAPI
        .getCustomerAddressById(idUser)
        .then((addressData) => {
          setAddress(addressData);
        })
        .catch((err) => {
          console.error("error", err);
        });
    };
    fetchData();

    // Return a cleanup function to clear the interval
    return () => clearInterval();
  }, [idUser]);
  console.log("dkjhafkdsj");
  console.log(address);

  const handleVerifyOrder = async (idOrder) => {
    // แสดงข้อความยืนยันจากผู้ใช้ก่อนที่จะทำการยกเลิกคำสั่งซื้อ
    const confirmation = await Swal.fire({
      title: "ยืนยันการชำระเงิน",
      text: "ลูกค้าชำระเงินสำเร็จแล้วใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ยกเลิก"
    });

    // หากผู้ใช้กดปุ่มยืนยัน
    if (confirmation.isConfirmed) {
      try {
        const response = await orderAPI.updateOrderVerifyPayment(idOrder, true);
        console.log(response); // แสดงข้อความที่ได้รับจากการอัปเดตสถานะคำสั่งซื้อ
        await Swal.fire({
          title: "ยืนยันการชำระเงิน",
          text: "คำสั่งซื้อได้รับการยืนยันแล้ว",
          icon: "success"
        });
        // window.location.reload();
      } catch (error) {
        console.error("Error cancelling order:", error);
        // ทำการจัดการข้อผิดพลาดตามที่ต้องการ
      }
    }
  };

  const handleSendOrder = async (idOrder, cancelReasonAd) => {
    if (!cancelReasonAd.trim()) {
      Swal.fire({
        text: "กรุณาระบุเหตุผลที่ต้องการยกเลิก",
        icon: "warning"
      });
      return;
    }

    const confirmation = await Swal.fire({
      title: "ยกเลิกคำสั่งซื้อ",
      text: `คุณแน่ใจหรือไม่ที่ต้องการยกเลิกด้วยเหตุผล ${cancelReasonAd}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก"
    });


    if (confirmation.isConfirmed) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API}/customer/order/enable/${idOrder}`,
          { enable: false, cancelReasonAd }
        );

        if (response.status === 200) {
          Swal.fire({
            title: "ยกเลิกสำเร็จ",
            text: "คำสั่งซื้อถูกยกเลิกสำเร็จแล้ว",
            icon: "success"
          });
          navigate(`/order-detail-ad/${idOrder}`, {});
        } else {
          Swal.fire({
            title: "ยกเลิกไม่สำเร็จ",
            text: "เกิดข้อผิดพลาดบางประการ",
            icon: "error"
          });
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
      }
    }
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


  return (
    <>
      {" "}
      <div className="h-screen w-full bg-gradient-to-r from-5% from-white via-50% via-brown-bg to-90% to-white">
        <Navbaradmin />

        <div class="titlea  py-1 shadow-md">
          <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
          <h5 className=" inline-block text-md md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
            การจัดส่งสินค้า
          </h5>
        </div>

        {currentOrder.map((order) => (
          <div key={order._id}>
            <div className="py-14 px-4 md:px-100 2xl:px-100 2xl:container 2xl:mx-auto">
              <div className="flex justify-start item-start space-y-2 flex-col ">
                <h1 className="text-base sm:text-base md:text-md lg:text-lg xl:text-lg font-semibold leading-7 lg:leading-9  text-gray-800">
                  หมายเลขออเดอร์ที่ต้องการจัดส่ง : {order._id}
                </h1>
                <p className="text-xs sm:text-xs md:text-base lg:text-md xl:text-md font-medium leading-6 text-gray-600">
                  วันที่สั่งซื้อ : {order.createdAt}{" "}
                </p>
              </div>
              <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                  <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                    <p className="text-sm sm:text-sm md:text-base lg:text-lg xl:text-lg  font-semibold leading-6 xl:leading-5 text-gray-800">
                      สินค้าที่สั่งตัด
                    </p>
                    {order.products.map((item) => (
                      <div
                        key={item._id}
                        className="mt-4 md:mt-6 flex  flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full "
                      >
                        <div className="pb-4 md:pb-8 w-full md:w-60">
                          <img
                            className="w-[150px] h-[200px]"
                            src={item.product.image}
                            alt="product"
                          />
                        </div>
                        <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
                          <div className="w-full flex flex-col justify-start items-start space-y-8">
                            <h3 className="text-base sm:text-base md:text-md lg:text-lg xl:text-lg  font-semibold leading-6 text-gray-800">
                              {item.product.name}
                            </h3>
                            <div className="flex justify-start items-start flex-col space-y-2">
                              <p className="text-sm leading-none text-gray-800">
                                <span className="text-gray-600">
                                  ประเภท : {item.product.p_type}
                                </span>
                              </p>
                              <p className="text-sm leading-none text-gray-800">
                                <span className="text-gray-600">
                                  ยี่ห้อ : {item.product.brand}
                                </span>
                              </p>
                              <p className="text-sm leading-none text-gray-800">
                                <span className="text-gray-600">
                                  ขนาด : {item.width} x {item.height}ซม.
                                </span>
                              </p>

                              <p className="text-sm leading-none text-gray-800">
                                <span className="text-gray-600">
                                  รหัสสี : {item.product.color}
                                </span>
                              </p>
                              <p className="text-sm leading-none text-gray-800">
                                <span className="text-gray-600">
                                  ความกว้างหน้าผ้า : {item.product.p_width} ซม.
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between space-x-8 items-start w-full">
                            <div className="flex-col">
                              {" "}
                              <p className="text-xs sm:text-xs md:text-sm xl:text-sm  leading-6">
                                ผ้าม่านที่สั่งตัด : {item.type}
                              </p>{" "}
                              <p className="text-base sm:text-sm md:text-sm   leading-6">
                                จำนวน : {item.count} ชุด
                              </p>
                            </div>

                            <p className="text-xs sm:text-xs md:text-sm xl:text-sm font-semibold leading-6 text-gray-800">
                              ราคา {numberWithCommas(item.product.price * item.count)} บาท
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="justify-start w-full bg-gray-50 items-start space-y-4 md:space-y-6 xl:space-y-8">
                    <p className="text-base pl-8 pt-4 sm:text-base md:text-md lg:text-lg xl:text-lg  leading-6 xl:leading-5 text-gray-800">
                      รูปหน้าหน้าต่าง
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-center bg-gray-50 pb-4 items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                      {order.windowimg.length > 0 ? (
                        order.windowimg.map((url, index) => (
                          <img
                            key={index}
                            className="w-[150px] md:w-[200px] m-4 filter drop-shadow-xl"
                            src={`${process.env.REACT_APP_AWS}${url}`}
                            alt="product"
                          />
                        ))
                      ) : (
                        <p className="text-red-500 text-base">ไม่ได้แนบรูปภาพ</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                    <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                      <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                        <div className="flex justify-between  w-full">
                          <p className="text-base leading-4 text-gray-800">
                            รายการสั่งซื้อ
                          </p>
                          <p className="text-base leading-4 text-gray-600">
                            {order.totalPrice - order.deliveryIs} บาท
                          </p>
                        </div>

                        <div className="flex justify-between items-center w-full">
                          <p className="text-base leading-4 text-gray-800">
                            ค่าขนส่ง
                          </p>
                          <p className="text-base leading-4 text-gray-600">
                            {order.deliveryIs} บาท
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <p className="text-base font-semibold leading-4 text-gray-800">
                          ราคารวม
                        </p>
                        <p className="text-base font-semibold leading-4 text-gray-600">
                          {numberWithCommas(order.totalPrice)} บาท
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                      <h3 className="text-base font-semibold leading-5 text-gray-800">
                        กรุณาระบุเลขพัสดุ หรือ แจ้งการติดตั้งสำเร็จแล้ว
                      </h3>
                      <input
                        class="appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="p_name"
                        type="text"
                        value={cancelReasonAd}
                        onChange={(e) => setCancelReasonAd(e.target.value)}
                        placeholder="ex. สินค้าหมด "
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col ">
                  <h3 className="text-base sm:text-base md:text-md font-semibold leading-5 text-gray-800">
                    ข้อมูลลูกค้า
                  </h3>
                  <div className="flex  flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0 ">
                    <div className="flex flex-col justify-start items-start flex-shrink-0">
                      <div className="flex justify-center  w-full  md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                        <div className=" flex justify-start items-start flex-col space-y-2">
                          <p className="text-sm sm:text-xs md:text-md leading-4 text-left text-gray-800">
                            ชื่อ - นามสกุล : {order.orderBy.f_name}{" "}
                            {order.orderBy.l_name}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                            stroke="#1F2937"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3 7L12 13L21 7"
                            stroke="#1F2937"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="cursor-pointer text-sm leading-5 text-gray-800">
                          E-mail : {order.orderBy.email}
                        </p>
                      </div>
                      <div className="flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          class="bi bi-phone"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                          <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                        </svg>
                        <p className="cursor-pointer text-sm leading-5 text-gray-800">
                          เบอร์โทรศัพท์ : {order.orderBy.tell}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between xl:h-full  items-stretch w-full flex-col mt-6 md:mt-0">
                      <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row  items-center md:items-start ">
                        <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-4 xl:mt-8">
                          <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">
                            ที่อยู่ที่ต้องการจัดส่ง
                          </p>

                          {order.sendAddress && (
                            <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                              {order.sendAddress.name}{" "}
                              {order.sendAddress.houseNo}{" "}
                              {order.sendAddress.sub_district}{" "}
                              {order.sendAddress.district}{" "}
                              {order.sendAddress.province}{" "}
                              {order.sendAddress.postcode}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                        <button
                          className="bg-green-400 mt-3 mx-2 py-2 px-auto w-[200px] rounded-full shadow-xl hover:bg-green-600 text-center md:mt-3 md:mb-3 md:inline-blocktext-sm sm:text-xs md:text-xs lg:text-base xl:text-base  text-white"
                          onClick={() =>
                            handleSendOrder(order._id, cancelReasonAd)
                          }
                        >
                          จัดส่งสินค้าแล้ว
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default PostOrder;
