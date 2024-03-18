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
import { jwtDecode } from "jwt-decode";
import { BsPinFill } from "react-icons/bs";

import ApproveOrder from "./about-order/approveorder";
import WaitForPayment from "./about-order/waitforpayment";
import CheckForPayment from "./about-order/checkforpayment";
import PrepareOrder from "./about-order/prepareorder";
import SendOrder from "./about-order/sendorder";
import SendOrdered from "./about-order/sendordered";
import CompleteOrder from "./about-order/completeorder";
import CancelOrder from "./about-order/cancelled";

function Orders() {
  const [velvetProducts, setVelvetProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userName, setUserName] = React.useState("");
  const [userData, setUserData] = useState(null);

  // const [selectedButton, setSelectedButton] = useState("");

  const { selectedButton } = useParams();
  const navigate = useNavigate();

  const renderContent = () => {
    switch (selectedButton) {
      case "approve":
        return <ApproveOrder />;
      case "waitPayment":
        return <WaitForPayment />;
      case "checkPayment":
        return <CheckForPayment />;
      case "prepareDelivery":
        return <PrepareOrder />;
      case "sendOrder":
        return <SendOrder />;
      case "sendOrdered":
        return <SendOrdered />;
      case "completed":
        return <CompleteOrder />;
      case "cancelled":
        return <CancelOrder />;
      default:
        return null;
    }
  };

  useEffect(() => {
    localStorage.setItem("selectedButton", selectedButton);
  }, [selectedButton]);

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
          window.location.href = "/login";
        } else {
          setUserData(decodedToken.user);
        }
      }
    } else {
      window.location.href = "/login";
      Swal.fire(
        "Unauthorized",
        "You are not authorized to access this page",
        "error"
      );
    }
  }, []);

  return (
    <>
      <Navbaradmin />
      <div class="flex justify-center shadow-lg p-3">
        <p className="text-base md:text-xl xl:text-2xl text-b-font ">
          ข้อมูลการสั่งตัดสินค้า
        </p>
      </div>

      <div className="flex justify-center flex-nowrap overflow-x-auto">
        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 ${
            selectedButton === "approve" ? "bg-gray-400" : ""
          }`}
          onClick={() => navigate("/orders/approve")}
        >
          ที่ต้องอนุมัติคำสั่งซื้อ
        </button>
        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 ${
            selectedButton === "waitPayment" ? "bg-gray-400" : ""
          }`}
          onClick={() => navigate("/orders/waitPayment")}
        >
          รอชำระเงิน
        </button>

        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-white  hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 ${
            selectedButton === "checkPayment" ? "bg-gray-400" : ""
          }`}
          onClick={() => navigate("/orders/checkPayment")}
        >
          ตรวจสอบการชำระเงิน
        </button>

        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-white  hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 ${
            selectedButton === "prepareDelivery" ? "bg-gray-400" : ""
          }`}
          onClick={() => navigate("/orders/prepareDelivery")}
        >
          ผ้าม่านที่กำลังดำเนินการ
        </button>
        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-white  hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 ${
            selectedButton === "sendOrder" ? "bg-gray-400" : ""
          }`}
          onClick={() => navigate("/orders/sendOrder")}
        >
          ที่ต้องจัดส่ง
        </button>
        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-white  hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 ${
            selectedButton === "sendOrdered" ? "bg-gray-400" : ""
          }`}
          onClick={() => navigate("/orders/sendOrdered")}
        >
          ที่จัดส่งแล้ว
        </button>
        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 ${
            selectedButton === "completed" ? "bg-gray-400" : ""
          }`}
          onClick={() => navigate("/orders/completed")}
        >
          สำเร็จ
        </button>
        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 ${
            selectedButton === "cancelled" ? "bg-gray-400" : ""
          }`}
          onClick={() => navigate("/orders/cancelled")}
        >
          ยกเลิกแล้ว
        </button>
      </div>

      <div className="">{renderContent("")}</div>
    </>
  );
}

export default Orders;
