import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsPinFill } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
import Footer from "../Footer";
import ConfirmedOrder from "./about-order/confirmed";
import WaitForPayment from "./about-order/waitforpayment";
import PrepareOrder from "./about-order/prepareorder";
import RecieveOrder from "./about-order/receiveorder";
import CompleteOrder from "./about-order/completeorder";
import CancelOrder from "./about-order/cancelled";
import orderAPI from "../../services/orderAPI";
import { RiNotification3Fill } from "react-icons/ri";
import customerAPI from "../../services/customerAPI";

function AboutOrderPage() {
  //login

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = React.useState("");
  const [idUser, setIdUser] = React.useState("");

  const [orderConfirmed, setOrderConfirmed] = useState([]);
  const [orderWaitPayment, setOrderWaitPayment] = useState([]);
  const [orderPrepare, setOrderPrepare] = useState([]);
  const [orderRecive, setOrderRecive] = useState([]);
  const [orderComplete, setOrderComplete] = useState([]);
  const [orderCancelled, setOrderCancelled] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    if (isLoading) {
      Swal.fire({
        customClass: {
          popup: "bg-transparent"
        },
        backdrop: "rgba(255, 255, 255, 0.7)",
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false, // ห้ามคลิกภายนอกสไปน์
        allowEscapeKey: false // ห้ามใช้ปุ่ม Esc ในการปิดสไปน์
      });
    } else {
      Swal.close();
    }
  }, [isLoading]);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const allUnConfirmed = await customerAPI.getOrderById(idUser);
        const confirmedOrders = allUnConfirmed.filter((order) => order.confirmed === false );
        setOrderConfirmed(confirmedOrders);
        const waitPaymentData = await customerAPI.getOrderByIdWaitPayment(idUser);
        setOrderWaitPayment(waitPaymentData);
        const prepareData = await customerAPI.getOrderByIdPrepare(idUser);
        setOrderPrepare(prepareData);
        const sendData = await customerAPI.getOrderByIdSend(idUser);
        setOrderRecive(sendData);
        const completeData = await customerAPI.getOrderByIdComplete(idUser);
        setOrderComplete(completeData);
        const allOrderData = await customerAPI.getOrderById(idUser);
        const cancelOrders = allOrderData.filter((order) => order.enable === false || order.cancelled === true);
        setOrderCancelled(cancelOrders);
        
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      } 
      setIsLoading(false);
    };
    
    fetchData();
  }, [idUser]);
  
  console.log(orderRecive);
  console.table(orderCancelled)

  const [user, setUser] = React.useState({
    username: "",
    f_name: "",
    l_name: "",
    email: "",
    tell: "",
    address: ""
  });

  const { selectedButton } = useParams();

  const renderContent = () => {
    switch (selectedButton) {
      case "confirmed":
        return <ConfirmedOrder idUser={idUser} />;
      case "waitPayment":
        return <WaitForPayment idUser={idUser} />;
      case "prepareDelivery":
        return <PrepareOrder idUser={idUser} />;
      case "receiveorder":
        return <RecieveOrder idUser={idUser} />;
      case "completed":
        return <CompleteOrder idUser={idUser} />;
      case "cancelled":
        return <CancelOrder idUser={idUser} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("token");

    if (authToken) {
      // Set up axios default headers
      axios.defaults.headers.common["authtoken"] = authToken;

      const decodedToken = jwtDecode(authToken); // Decode the token
      console.log(decodedToken);

      if (decodedToken && decodedToken.user) {
        const { f_name, l_name } = decodedToken.user;

        const id = decodedToken.id;
        setUserName(`${f_name} ${l_name}`);
        setIdUser(`${id}`);
        setUser({
          username: decodedToken.user.username,
          f_name: f_name,
          l_name: l_name,
          email: decodedToken.user.email,
          tell: decodedToken.user.tell,
          address: decodedToken.user.address
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

  const [address, setAddress] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const addressData = await customerAPI.getCustomerAddressById(idUser);
        setAddress(addressData);
      } catch (err) {
        console.error("erro", err);
      }
    };

    fetchData();
  }, [idUser]);

  //login
  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        userName={userName}
        idUser={idUser}
      ></Navbar>{" "}
      <div class="titlea bg-brown-bg  h-full py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
          การซื้อของฉัน
        </h5>
      </div>
      <div className="flex justify-center flex-nowrap overflow-x-auto">

      <button
          className={`bg-gray-100 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "confirmed" ? "bg-gray-300" : ""
          }`}
          onClick={() => navigate("/about-order/confirmed")}
        >
          คำสั่งซื้อ
          {orderConfirmed.length > 0 ? (
            <div className="relative ml-2 inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderConfirmed.length > 99 ? "99+" : orderConfirmed.length}
              </span>
            </div>
          ) : null}
        </button>

        <button
          className={`bg-gray-100 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "waitPayment" ? "bg-gray-300" : ""
          }`}
          onClick={() => navigate("/about-order/waitPayment")}
        >
          รอการชำระ
          {orderWaitPayment.length > 0 ? (
            <div className="relative ml-2 inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderWaitPayment.length > 99 ? "99+" : orderWaitPayment.length}
              </span>
            </div>
          ) : null}
        </button>
        <button
          className={`bg-gray-100 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "prepareDelivery" ? "bg-gray-400" : ""
          }`}
          onClick={() => navigate("/about-order/prepareDelivery")}
        >
          กำลังดำเนินการ
          {orderPrepare.length > 0 ? (
            <div className="relative ml-2 inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderPrepare.length > 99 ? "99+" : orderPrepare.length}
              </span>
            </div>
          ) : null}
        </button>
        <button
          className={`bg-gray-100 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "receiveorder" ? "bg-gray-400" : ""
          }`}
          onClick={() => navigate("/about-order/receiveorder")}
        >
          ที่ต้องได้รับ
          {orderRecive.length > 0 ? (
            <div className="relative ml-2 inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderRecive.length > 99 ? "99+" : orderRecive.length}
              </span>
            </div>
          ) : null}
        </button>
        <button
          className={`bg-gray-100 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "completed" ? "bg-gray-400" : ""
          }`}
          onClick={() => navigate("/about-order/completed")}
        >
          สำเร็จ
          {orderComplete.length > 0 ? (
            <div className="relative ml-2 inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderComplete.length > 99 ? "99+" : orderComplete.length}
              </span>
            </div>
          ) : null}
        </button>
        <button
          className={`bg-gray-100 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "cancelled" ? "bg-gray-400" : ""
          }`}
          onClick={() => navigate("/about-order/cancelled")}
        >
          ยกเลิกแล้ว
          {orderCancelled.length > 0 ? (
            <div className="relative ml-2 inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderCancelled.length > 99 ? "99+" : orderCancelled.length}
              </span>
            </div>
          ) : null}
        </button>
        
      </div>
      <div className="">{renderContent()}</div>
    </>
  );
}
export default AboutOrderPage;
