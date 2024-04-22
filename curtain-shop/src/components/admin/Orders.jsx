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
  const [orderWaitPayment, setOrderWaitPayment] = useState([]);
  const [orderVerifyPayment, setOrderVerifyPayment] = useState([]);
  const [orderPrepare, setOrderPrepare] = useState([]);
  const [orderSend, setOrderSend] = useState([]);
  const [orderSended, setOrderSended] = useState([]);
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true);
  //       const orderDataApprove = await orderAPI.getOrderApprove();
  //       setOrderApprove(orderDataApprove);
  
  //       const orderDataPayment = await orderAPI.getOrderPayment();
  //       const paymentFalseOrders = orderDataPayment.filter(
  //         (order) => order.payment === false
  //       );
  //       setOrderWaitPayment(paymentFalseOrders);
  
  //       const paymentTrueOrders = orderDataPayment.filter(
  //         (order) => order.payment === true
  //       );
  //       setOrderVerifyPayment(paymentTrueOrders);
  
  //       const orderDataPrepare = await orderAPI.getOrderPrepare();
  //       setOrderPrepare(orderDataPrepare);
  
  //       const orderDataSend = await orderAPI.getOrderSend();
  //       const sendFalseOrders = orderDataSend.filter(
  //         (order) => order.sendproduct === false
  //       );
  //       setOrderSend(sendFalseOrders);
  
  //       const sendTrueOrders = orderDataSend.filter(
  //         (order) => order.sendproduct === true
  //       );
  //       setOrderSended(sendTrueOrders);
  
  //       const orderDataComplete = await orderAPI.getOrderComplete();
  //       const completeTrueOrders = orderDataComplete.filter(
  //         (order) => order.complete === true
  //       );
  //       setOrderComplete(completeTrueOrders);
  
  //       const orderDataAll = await orderAPI.getOrderAll();
  //       const cancelledOrders = orderDataAll.filter(
  //         (order) => order.enable === false || order.cancelled === true
  //       );
  //       setOrderCancelled(cancelledOrders);
  //       setIsLoading(false);

  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setIsLoading(false);

  //     } 
  //   };

  //   setIsLoading(false);
  //   fetchData();

 
  // }, []);

  useEffect(() => {
    setIsLoading(true);
  
    Promise.all([
      orderAPI.getOrderApprove(),
      orderAPI.getOrderPayment(),
      orderAPI.getOrderPrepare(),
      orderAPI.getOrderSend(),
      orderAPI.getOrderComplete(),
      orderAPI.getOrderAll()
    ])
    .then(([orderDataApprove, orderDataPayment, orderDataPrepare, orderDataSend, orderDataComplete, orderDataAll]) => {
      setOrderApprove(orderDataApprove);
      const paymentFalseOrders = orderDataPayment.filter(
        (order) => order.payment === false
      );
      setOrderWaitPayment(paymentFalseOrders);
      const paymentTrueOrders = orderDataPayment.filter(
        (order) => order.payment === true
      );
      setOrderVerifyPayment(paymentTrueOrders);
      setOrderPrepare(orderDataPrepare);
      const sendFalseOrders = orderDataSend.filter(
        (order) => order.sendproduct === false
      );
      setOrderSend(sendFalseOrders);
      const sendTrueOrders = orderDataSend.filter(
        (order) => order.sendproduct === true
      );
      setOrderSended(sendTrueOrders);
      const completeTrueOrders = orderDataComplete.filter(
        (order) => order.complete === true
      );
      setOrderComplete(completeTrueOrders);
      const cancelledOrders = orderDataAll.filter(
        (order) => order.enable === false || order.cancelled === true
      );
      setOrderCancelled(cancelledOrders);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    });
  }, []);
  
  
  
 
  const [userName, setUserName] = React.useState("");
  const [userData, setUserData] = useState(null);

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

      <div className="flex justify-start md:justify-center flex-nowrap overflow-x-auto">
        <button
          className={`whitespace-nowrap bg-gray-100 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "approve" ? "bg-gray-300" : ""
          }`}
          onClick={() => navigate("/orders/approve")}
        >
          ที่ต้องอนุมัติคำสั่งซื้อ
          {orderApprove.length > 0 ? (
            <div className="relative ml-2 inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderApprove.length > 99 ? "99+" : orderApprove.length}
              </span>
            </div>
          ) : null}
        </button>
        <button
          className={`whitespace-nowrap bg-gray-100 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "waitPayment" ? "bg-gray-300" : ""
          }`}
          onClick={() => navigate("/orders/waitPayment")}
        >
          รอชำระเงิน
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
          className={`whitespace-nowrap bg-gray-100 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "checkPayment" ? "bg-gray-300" : ""
          }`}
          onClick={() => navigate("/orders/checkPayment")}
        >
          ตรวจสอบการชำระเงิน
          {orderVerifyPayment.length > 0 ? (
            <div className="relative ml-2 inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderVerifyPayment.length > 99
                  ? "99+"
                  : orderVerifyPayment.length}
              </span>
            </div>
          ) : null}
        </button>

        <button
          className={`whitespace-nowrap bg-gray-100 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "prepareDelivery" ? "bg-gray-300" : ""
          }`}
          onClick={() => navigate("/orders/prepareDelivery")}
        >
          ผ้าม่านที่กำลังดำเนินการ
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
          className={`whitespace-nowrap bg-gray-100 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "sendOrder" ? "bg-gray-300" : ""
          }`}
          onClick={() => navigate("/orders/sendOrder")}
        >
          ที่ต้องจัดส่ง
          {orderSend.length > 0 ? (
            <div className="relative ml-2 inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderSend.length > 99 ? "99+" : orderSend.length}
              </span>
            </div>
          ) : null}
        </button>
        <button
          className={`whitespace-nowrap bg-gray-100 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "sendOrdered" ? "bg-gray-300" : ""
          }`}
          onClick={() => navigate("/orders/sendOrdered")}
        >
          ที่จัดส่งแล้ว
          {orderSended.length > 0 ? (
            <div className="relative ml-2 inline-block">
              <RiNotification3Fill className=" h-8 w-8 text-red-300 filter drop-shadow-md" />
              <span className="absolute top-1 right-[1px] mr-1 mt-1 text-white  text-xs px-2">
                {orderSended.length > 99 ? "99+" : orderSended.length}
              </span>
            </div>
          ) : null}
        </button>
        <button
          className={`whitespace-nowrap bg-gray-100 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "completed" ? "bg-gray-300" : ""
          }`}
          onClick={() => navigate("/orders/completed")}
        >
          สำเร็จ
          {orderComplete.length > 0 ? (
        
              <span className="ml-2">
                ({orderComplete.length > 99 ? "99+" : orderComplete.length})
              </span>
      
          ) : null}
        </button>
        <button
          className={`whitespace-nowrap bg-gray-100 w-[200px] shadow-md hover:bg-gray-400 hover:text-white hover:shadow-2xl text-center text-xs sm:text-xs md:text-sm text-brown-600 my-4 p-2 flex items-center justify-center ${
            selectedButton === "cancelled" ? "bg-gray-300" : ""
          }`}
          onClick={() => navigate("/orders/cancelled")}
        >
          ยกเลิกแล้ว
          {orderCancelled.length > 0 ? (
            
              <span className="ml-2">
                ({orderCancelled.length > 99 ? "99+" : orderCancelled.length})
                </span>
            
          ) : null}
        </button>
      </div>

      <div className="">{renderContent("")}</div>
    </>
  );
}

export default Orders;
