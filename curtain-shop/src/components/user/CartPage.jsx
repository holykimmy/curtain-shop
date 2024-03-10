import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import Footer from "../Footer";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ProductInCart from "./ProductIncart";
function CartPage() {
  const dispatch = useDispatch();

  //calculator
  const { cart } = useSelector((state) => ({ ...state }));

  const getTotal = () => {
    return cart.reduce((currenValue, nextValue) => {
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
  //login check

  //save order
  const handleSaveOrder = () => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "บันทึกคำสั่งซื้อสำเร็จ",
      showConfirmButton: false,
      timer: 1500,
    });
    navigate("/checkout");
  };

  const showCartItems = () => {
    return (
      <div className="flex items-center justify-center mb-[10%]">
        <table class="table-auto w-[100%] border-collapse border border-gray-300 ">
          <thead>
            <tr>
              <th className="text-browntop px-2 py-1 border border-gray-300 ...">
                รูปภาพ
              </th>
              <th className="text-browntop px-2 py-1 border border-gray-300 ...">
                รหัสสินค้า
              </th>
              <th className="text-browntop px-2 py-1 border border-gray-300 ...">
                ยี่ห้อสินค้า
              </th>
              <th className="text-browntop px-2 py-1 border border-gray-300 ...">
               รายการสินค้า
              </th>
              <th className="text-browntop px-2 py-1 border border-gray-300 ...">
                ประเภท
              </th> <th className="text-browntop px-2 py-1 border border-gray-300 ...">
                ราง
              </th>
              <th className="text-browntop px-2 py-1 border border-gray-300 ...">
                ขนาด
              </th>
              <th className="text-browntop px-2 py-1 border border-gray-300 ...">
                ราคา/หลา
              </th>
              <th className="text-browntop px-2 py-1 border border-gray-300 ...">
                จำนวนสินค้า
              </th>
              <th className="text-browntop px-2 py-1 border border-gray-300 ...">
                
              </th>
            </tr>
          </thead>

          {cart.map((item) => (
            <ProductInCart key={item.productId} item={item} />
          ))}
        </table>
      </div>
    );
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        userName={userName}
        idUser={idUser}
      ></Navbar>
      <div class="titlea bg-brown-bg py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
          รายการสินค้าของคุณ
        </h5>
      </div>
      {/* Cart */}
      <div className="container-fluid">
        {/* <div className="flex-row"> Cart Page </div> */}
        <div className="col-md-8 text-brown-500 text-lg text-center my-5 ">
          {" "}
          ตระกร้าสินค้า / {cart.length} product
        </div>
        <div className="flex flex-row justify-between">

          {!cart.length ? <p>no product in cart</p> : showCartItems()}

          <div className="flex-col mr-10  w-[25%]">
            {" "}
            <hr />
            <h4 className=" text-brown-400 my-2" >รายการสินค้า </h4>
            <hr />
            <hr />
            {cart.map((item, index) => (
              <p key={index} className=" text-brown-400 my-1">
                {item.name} ขนาด {item.width} x {item.height} เซนติเมตร x {item.count} = {item.price * item.count}
              </p>
            ))}
            <hr />
            <hr />
            <h4 className=" text-brown-400 my-2 " >ราคารวม : {getTotal()} บาท </h4>
            <hr />
            {isLoggedIn ? (
              <button
                className="my-4 text-white hover:shadow-2xl bg-green-400 rounded-xl p-2 w-[150px]"
                disable={!cart.length}
                onClick={handleSaveOrder}
              >
                ชำระเงิน
              </button>
            ) : (
              <Link to="/login" state="cart">
                <button className="my-4 text-white hover:shadow-2xl bg-red-400 rounded-xl p-2 w-[150px]">
                  {" "}
                  เข้าสู่ระบบเพื่อทำรายการต่อ{" "}
                </button>
              </Link>
            )}
          </div>
        </div>

      </div>
      <Footer></Footer>
    </>
  );
}
export default CartPage;