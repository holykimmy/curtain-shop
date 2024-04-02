import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar";
import { BsPinFill } from "react-icons/bs";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import Footer from "../../Footer";
import productAPI from "../../../services/productvisAPI";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
function Polyester() {
  //token login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = React.useState("");
  const [idUser, setIdUser] = useState(null);
  const [user, setUser] = React.useState({
    f_name: "",
    l_name: "",
    email: "",
    tell: "",
    address: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    Swal.fire({
      html: "<span class='text-gray-600'>Loading...</span>",
      backdrop: `
    #ffff
  
  `,
      customClass: {
        popup: "shadow-2xl border border-gray-300", // เพิ่มเส้นขอบและกำหนดสีเทา
      },
      showConfirmButton: false, // ไม่แสดงปุ่มยืนยัน
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        if (!isLoading) {
          Swal.close();
        }
      },
    });
  }


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

  const handleDetailProduct = (productId, productName) => {
    Swal.fire({
      title: `คุณต้องการดูข้อมูลสินค้า ${productName} ใช่หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/product-detail/${productId}`);
      }
    });
  };

  const [product, setProduct] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await productAPI.getProductTypePolyester();
        setProduct(productData);
        setIsLoading(false); 
        Swal.close();
      } catch (err) {
        setIsLoading(false);
        Swal.close();
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล", err);
      }
    };

    fetchData();
  }, []);

 

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        userName={userName}
      ></Navbar>

      <div class="titlea bg-brown-bg py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
          ผ้าใยสังเคราะห์ ( polyester )
        </h5>
      </div>

      <div className="flex flex-wrap justify-center mt-2 mb-2 md:mt-10 md:mb-10 ">
        {/* part */}
        {product.map((product) => (
          <div
            key={product._id}
            className=" p-2 md:p-4 max-w-[180px] md:max-w-sm "
          >
            {/* card--1 */}

            <div class="flex rounded-lg shadow-3xl hover:shadow-2xl h-auto md:h-full flex-col  md:pb-5 bg-white ">
              <div class="relative ">
                <img
                  className=" w-full rounded-t-lg bg-contain bg-center"
                  src={product.image}
                  alt="product"
                />
                <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>

                <div class="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                  {product.p_type}
                </div>
              </div>

              {/* <div class="px-6 py-4 pl-5"> */}
              <div class="pt-4 px-4 font-semibold text-brown-600 text-base md:text-base lg:text-lg inline-block hover:text-browntop transition duration-500 ease-in-out">
                รายละเอียด
              </div>
              <div class="pt-2 px-4 font-semibold text-brown-600 text-sm md:text-base lg:text-base inline-block hover:text-browntop transition duration-500 ease-in-out">
                รหัส : {product.name}
              </div>
              <div className="pt-2 pb-4 px-4  text-sm md:text-base lg:text-base xl:text-base text-brown-400 whitespace-pre-wrap">
                {product.detail.split("\r\n")[0]}
              </div>
              {/* </div> */}

              <button
                onClick={() => handleDetailProduct(product._id, product.name)}
                class="pl-5 mt-3 text-brown-500 text-sm md:base hover:text-browntop inline-flex items-center"
              >
                อ่านพิ่มเติม
                <HiOutlineArrowSmRight />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Footer></Footer>
    </>
  );
}
export default Polyester;
