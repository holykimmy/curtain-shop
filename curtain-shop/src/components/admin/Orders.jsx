import React, { useEffect, useState } from "react";
import Navbaradmin from "./Navbaradmin";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ApproveOrder from "./about-order/approveorder";
import WaitForPayment from "./about-order/waitforpayment";
import CheckForPayment from "./about-order/checkforpayment";
import PrepareOrder from "./about-order/prepareorder";
import SendOrder from "./about-order/sendorder";
import SendOrdered from "./about-order/sendordered";
import CompleteOrder from "./about-order/completeorder";
import CancelOrder from "./about-order/cancelled";
import orderAPI from "../../services/orderAPI";
import { RiNotification3Fill } from "react-icons/ri";

function Orders() {
  const [orderApprove, setOrderApprove] = useState([]);
  const [orderPayment, setOrderPayment] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      orderAPI
        .getOrderApprove()
        .then((orderData) => {
          setOrderApprove(orderData);
        })
        .catch((err) => {
          console.error("error", err);
        });
        orderAPI
        .getOrderPayment()
        .then((orderData) => {
          const paymentFalseOrders = orderData.filter(
            (order) => order.payment === false
          );
          setOrderPayment(paymentFalseOrders);
        })
        .catch((err) => {
          console.error("error", err);
        });
    };
    fetchData();

    // Return a cleanup function to clear the interval
    return () => clearInterval();
  }, []);
  console.log("test");
  console.log(orderApprove.length);

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
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "approve" ? "bg-gray-300" : ""
          }`}
          onClick={() => navigate("/orders/approve")}
        >
          ที่ต้องอนุมัติคำสั่งซื้อ
          {orderApprove.length > 0 ? (
            <div className="relative inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderApprove.length > 99 ? "99+" : orderApprove.length}
              </span>
            </div>
          ) : null}
        </button>
        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "waitPayment" ? "bg-gray-300" : ""
          }`}
          onClick={() => navigate("/orders/waitPayment")}
        >
          รอชำระเงิน
          {orderApprove.length > 0 ? (
            <div className="relative inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderPayment.length > 99 ? "99+" : orderPayment.length}
              </span>
            </div>
          ) : null}
        </button>

        <button
          className={`bg-gray-100 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "checkPayment" ? "bg-gray-300" : ""
          }`}
          onClick={() => navigate("/orders/checkPayment")}
        >
          ตรวจสอบการชำระเงิน
          {orderApprove.length > 0 ? (
            <div className="relative inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderPayment.length > 99 ? "99+" : orderPayment.length}
              </span>
            </div>
          ) : null}
        </button>

        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "prepareDelivery" ? "bg-gray-200" : ""
          }`}
          onClick={() => navigate("/orders/prepareDelivery")}
        >
          ผ้าม่านที่กำลังดำเนินการ
          {orderApprove.length > 0 ? (
            <div className="relative inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderApprove.length > 99 ? "99+" : orderApprove.length}
              </span>
            </div>
          ) : null}
        </button>
        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "sendOrder" ? "bg-gray-400" : ""
          }`}
          onClick={() => navigate("/orders/sendOrder")}
        >
          ที่ต้องจัดส่ง
          {orderApprove.length > 0 ? (
            <div className="relative inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderApprove.length > 99 ? "99+" : orderApprove.length}
              </span>
            </div>
          ) : null}
        </button>
        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "sendOrdered" ? "bg-gray-400" : ""
          }`}
          onClick={() => navigate("/orders/sendOrdered")}
        >
          ที่จัดส่งแล้ว
          {orderApprove.length > 0 ? (
            <div className="relative inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderApprove.length > 99 ? "99+" : orderApprove.length}
              </span>
            </div>
          ) : null}
        </button>
        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "completed" ? "bg-gray-400" : ""
          }`}
          onClick={() => navigate("/orders/completed")}
        >
          สำเร็จ
          {orderApprove.length > 0 ? (
            <div className="relative inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderApprove.length > 99 ? "99+" : orderApprove.length}
              </span>
            </div>
          ) : null}
        </button>
        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "cancelled" ? "bg-gray-200" : ""
          }`}
          onClick={() => navigate("/orders/cancelled")}
        >
          ยกเลิกแล้ว
          {orderApprove.length > 0 ? (
            <div className="relative inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderApprove.length > 99 ? "99+" : orderApprove.length}
              </span>
            </div>
          ) : null}
        </button>
      </div>

      <div className="">{renderContent("")}</div>
    </>
  );
}

export default Orders;
