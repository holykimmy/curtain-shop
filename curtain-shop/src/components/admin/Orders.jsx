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
import PrepareOrder from "./about-order/prepareorder";
import RecieveOrder from "./about-order/receiveorder";
import CompleteOrder from "./about-order/completeorder";


function Orders() {
  const [velvetProducts, setVelvetProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userName, setUserName] = React.useState("");
  const [userData, setUserData] = useState(null);

  const [selectedButton, setSelectedButton] = useState("waitPayment"); // เริ่มต้นที่รอการชำระ

  const renderContent = () => {
    switch (selectedButton) {
      case "approve":
        return <ApproveOrder />;
      case "waitPayment":
        return <WaitForPayment />;
      case "prepareDelivery":
        return <PrepareOrder />;
      case "pendingDelivery":
        return <RecieveOrder />;
      case "completed":
        return <CompleteOrder />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const velvetData = await productAPI.getProductTypeVelvet();
        setVelvetProducts(velvetData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000); // 5 วินาที

    fetchData();
    return () => clearInterval(intervalId);
  }, []);

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
          // Swal.fire("Unauthorized", "You are not authorized to access this page", "error");
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
  const navigate = useNavigate();

  const handleEditProduct = (productId, productName) => {
    Swal.fire({
      title: `คุณต้องการดูรายละเอียกของ order ใช่หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/order-detail`);
      }
    });
  };

  const handleSearch = async () => {
    try {
      const searchData = await productAPI.getSearch(searchTerm);
      setSearchResults(searchData); // เซตค่า searchResults ที่ได้จากการค้นหาเข้า state
    } catch (error) {
      console.error("Error fetching search results:", error);
      // แสดงข้อความผิดพลาดหรือจัดการข้อผิดพลาดตามที่ต้องการ
    }
  };

  const handleDeleteProduct = (productId, productName) => {
    console.log(productId);
    Swal.fire({
      title: `คุณต้องการลบข้อมูลสินค้า ${productName} ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        // ทำการลบสินค้าโดยใช้ ID ของสินค้า
        productAPI
          .deleteProduct(productId)
          .then((response) => {
            console.log("Product deleted successfully");
            // อัพเดท state หรือทำอื่น ๆ ตามต้องการหลังจากลบสินค้าเสร็จสิ้น
            // เรียก fetchData เพื่ออัพเดทข้อมูลใหม่หลังจากลบสินค้า
          })
          .catch((error) => {
            console.error("Error deleting product:", error);
          });
      } else {
        // ผู้ใช้เลือกยกเลิกการลบสินค้า
        console.log("Cancelled delete operation");
      }
    });
  };

  return (
    <>
      <Navbaradmin />
      <div class="flex justify-center shadow-lg p-3">
        <p className="text-base md:text-xl xl:text-2xl text-b-font ">
          ข้อมูลการสั่งตัดสินค้า
        </p>
      </div>

      <div className="flex justify-center">

        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-lg hover:shadow-2xl text-center text-base text-brown-600 my-4 p-2 ${
            selectedButton === "approve" ? "bg-gray-400" : ""
          }`}
          onClick={() => setSelectedButton("approve")}
        >
          ที่ต้องอนุมัติคำสั่งซื้อ
        </button>

        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-lg hover:shadow-2xl text-center text-base text-brown-600 my-4 p-2 ${
            selectedButton === "waitPayment" ? "bg-gray-400" : ""
          }`}
          onClick={() => setSelectedButton("waitPayment")}
        >
          กำลังรอการชำระเงิน
        </button>

        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-lg hover:shadow-2xl text-center text-base text-brown-600 my-4 p-2 ${
            selectedButton === "prepareDelivery" ? "bg-gray-400" : ""
          }`}
          onClick={() => setSelectedButton("prepareDelivery")}
        >
          ผ้าม่านที่กำลังดำเนินการ
        </button>
        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-lg hover:shadow-2xl text-center text-base text-brown-600 my-4 p-2 ${
            selectedButton === "pendingDelivery" ? "bg-gray-400" : ""
          }`}
          onClick={() => setSelectedButton("pendingDelivery")}
        >
          ที่จัดส่งแล้ว
        </button>
        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-lg hover:shadow-2xl text-center text-base text-brown-600 my-4 p-2 ${
            selectedButton === "completed" ? "bg-gray-400" : ""
          }`}
          onClick={() => setSelectedButton("completed")}
        >
          สำเร็จ
        </button>
      </div>

      <div className="">{renderContent()}</div>

   
    </>
  );
}

export default Orders;
