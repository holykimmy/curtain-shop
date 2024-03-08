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

import { jwtDecode } from "jwt-decode";
import { BsPinFill } from "react-icons/bs";

function OrderDetail() {
  const [velvetProducts, setVelvetProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userName, setUserName] = React.useState("");
  const [userData, setUserData] = useState(null);

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
      title: `คุณต้องการดูรายละเอียกของ order  ${productName} ใช่หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/update-product/${productId}`);
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
          รายละเอียดคำสั่งซื้อ
        </p>
      </div>

      {velvetProducts.map((product) => (
        <div key={product._id} className="flex justify-center">
          <div className="flex justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <div className="pl-5 w-[60%]">
              <p className=" text-center text-md sm:text-md md:text-lg lg:text-xl xl-text-xl text-brown-400">
                Order Number : 1245675
              </p>

              <p className="text-sm sm:text-md md:text-md md:text-lg lg:text-lg text-brown-400">
                สั่งเมื่อ : 16.02.2024 T16.40PM
              </p>

              <p className="text-sm sm:text-md md:text-md md:text-lg lg:text-lg text-brown-400">
                ชื่อผู้สั่ง : พิธา สุขใจ
              </p>

              <p className="text-sm sm:text-md md:text-md md:text-lg lg:text-lg text-brown-400">
               รายละเอียดตำสั่งซื้อ
              </p>
              <p className="text-sm sm:text-md md:text-md md:text-lg lg:text-lg text-brown-400">
              
              .
              </p>
              <p className="text-sm sm:text-md md:text-md md:text-lg lg:text-lg text-brown-400">
               .
              </p>
              <p className="text-sm sm:text-md md:text-md md:text-lg lg:text-lg text-brown-400">
               .
              </p>

              <p className="text-sm sm:text-md md:text-md md:text-lg lg:text-lg text-brown-400">
               ราคารวม :  256 บาท
              </p>

              <div className="mt-5"></div>
              {/* <SwitchButton
                visibility={product.visibility}
                productId={product._id}
              /> */}
              <SwitchBtnConfirm
                visibility={product.visibility}
                productId={product._id}
              />
              <div className="h-3"></div>
              <SwitchBtnSend 
                visibility={product.visibility}
                productId={product._id}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default OrderDetail;
