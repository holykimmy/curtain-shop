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

function Orders() {
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

      <label
        className="mx-auto mt-4 mb-4 relative bg-white min-w-sm max-w-2xl flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-2xl gap-2 shadow-xl focus-within:border-gray-300"
        for="search-bar"
      >
        <input
          id="search-bar"
          placeholder="ค้นหาข้อมูล"
          className="px-6 py-2 w-full rounded-md flex-1 outline-none bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="w-full md:w-auto px-6 py-3 bg-gray-500 border-gray-500 text-white fill-white active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-xl transition-all disabled:opacity-70 "
        >
          <div className="relative">
            <div className="flex items-center transition-all opacity-1 valid:">
              <span className="text-sm font-semibold whitespace-nowrap truncate mx-auto">
                Search
              </span>
            </div>
          </div>
        </button>
      </label>

      {searchResults.length > 0 ? (
        searchResults.map((product) => (
          <div key={product._id} className="flex justify-center">
            <div className="flex justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
              <img
                className=" w-[100px] h-[200px]  sm:w-[100px] sm:h-[200px] md:w-[100px] md:h-[200px] lg:w-[300px] lg:h-[400px] rounded bg-contain bg-center"
                src={`${process.env.REACT_APP_API}/images/${product.image}`}
                alt="product"
              />

              <div className="pl-5 w-[60%]">
                <p className="text-sm sm:text-sm md:text-lg lg:text-lg xl-text-xl text-brown-400">
                  ชื่อสินค้า :
                </p>
                <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                  แบรนด์สินค้า :
                </p>
                <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                  ประเภทของผ้าม่าน :
                </p>

                <div className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400 whitespace-pre-wrap">
                  รายละเอียดสินค้า :
                </div>

                <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                  ราคา : {product.price} บาท
                </p>
                <div className="mt-5"></div>
                <SwitchButton
                  visibility={product.visibility}
                  productId={product._id}
                />
              </div>
              <div>
                <div>
                  <button
                    className=" bg-blue-200 py-2 px-auto w-[80px] rounded-full shadow-xl hover:bg-blue-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-md lg:text-md xl:text-md  text-white "
                    onClick={() => handleEditProduct(product._id, product.name)}
                  >
                    แก้ไขข้อมูล
                  </button>
                </div>
                <button
                  className="bg-red-300 mt-3 py-2 px-auto w-[80px] rounded-full shadow-xl hover:bg-red-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-md lg:text-md xl:text-md text-white"
                  onClick={() => handleDeleteProduct(product._id, product.name)}
                >
                  ลบข้อมูล
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>ไม่พบข้อมูล</p>
      )}

      <div class="titlea bg-gray-100 py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-8 xl:h-8 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-base md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
          ผ้ากำมะหยี่ (velvet)
        </h5>
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

              <p className="text-sm sm:text-sm md:text-md md:text-lg lg:text-lg text-brown-400">
                ราคารวม : {product.price} บาท
              </p>
              <div className="mt-5"></div>
              {/* <SwitchButton
                visibility={product.visibility}
                productId={product._id}
              /> */}
            </div>
            <div>
              <div>
                <button
                  className=" bg-blue-200 py-2 px-auto w-[80px] rounded-full shadow-xl hover:bg-blue-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-md lg:text-md xl:text-md  text-white "
                  onClick={() => handleEditProduct(product._id, product.name)}
                >
                  ดูคำสั่งซื้อ
                </button>
              </div>
              <button
                className="bg-red-300 mt-3 py-2 px-auto w-[80px] rounded-full shadow-xl hover:bg-red-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-md lg:text-md xl:text-md text-white"
                onClick={() => handleDeleteProduct(product._id, product.name)}
              >
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Orders;
