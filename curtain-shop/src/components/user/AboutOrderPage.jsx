import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import { BsPinFill } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
import Footer from "../Footer";
import WaitForPayment from "./about-order/waitforpayment";
import customerAPI from "../../services/customerAPI";
function AboutOrderPage() {
  //login

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = React.useState("");
  const [idUser, setIdUser] = React.useState("");

  const [user, setUser] = React.useState({
    username: "",
    f_name: "",
    l_name: "",
    email: "",
    tell: "",
    address: "",
  });

  const [selectedButton, setSelectedButton] = useState("waitPayment"); // เริ่มต้นที่รอการชำระ

  const renderContent = () => {
    switch (selectedButton) {
      case 'waitPayment':
        return <WaitForPayment idUser={idUser}/>;
      case 'prepareDelivery':
        return <div>เนื้อหาสำหรับเตรียมการจัดส่ง</div>;
      case 'pendingDelivery':
        return <div>เนื้อหาสำหรับที่ต้องได้รับ</div>;
      case 'completed':
        return <div>เนื้อหาสำหรับสำเร็จ</div>;
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
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    fetchData();
    return () => clearInterval(interval);
  }, [idUser]);

  const handleEditAddress = (addressData) => {
    const { id } = addressData;
    navigate(`/edit-address/${id}`);
  };

  const handleDeleteAddress = async (id) => {
    // แสดง Confirm Dialog เพื่อยืนยันการลบที่อยู่
    const confirmation = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "ท่านต้องการที่จะลบที่อยู่นี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบที่อยู่",
      cancelButtonText: "ยกเลิก",
    });

    // ถ้าผู้ใช้ยืนยันการลบ
    if (confirmation.isConfirmed) {
      try {
        // ทำการลบที่อยู่โดยส่งคำขอไปยังเซิร์ฟเวอร์
        const response = await axios.delete(
          `${process.env.REACT_APP_API}/customer/delete-address/${idUser}/${id}`
        );

        // ถ้าการลบสำเร็จ
        if (response.status === 200) {
          // อัปเดต UI และแสดงข้อความแจ้งเตือน
          setAddress(address.filter((addr) => addr.id !== id));
          Swal.fire({
            icon: "success",
            title: "ลบที่อยู่สำเร็จ",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          console.log("เกิดข้อผิดพลาดในการลบที่อยู่");
        }
      } catch (error) {
        // แสดงข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถลบที่อยู่ได้",
        });
        console.error(error);
      }
    }
  };
  //login
  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        userName={userName}
        idUser={idUser}
      ></Navbar>{" "}
      <div class="titlea bg-brown-bg  w-full  h-full py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
          การซื้อของฉัน
        </h5>
      </div>
      <div className="flex justify-center">
        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-lg hover:shadow-2xl text-center text-base text-brown-600 my-4 p-2 ${
            selectedButton === "waitPayment" ? "bg-gray-400" : ""
          }`}
          onClick={() => setSelectedButton("waitPayment")}
        >
          รอการต้องชำระ
        </button>
        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-lg hover:shadow-2xl text-center text-base text-brown-600 my-4 p-2 ${
            selectedButton === "prepareDelivery" ? "bg-gray-400" : ""
          }`}
          onClick={() => setSelectedButton("prepareDelivery")}
        >
          เตรีมการจัดส่ง
        </button>
        <button
          className={`bg-gray-200 w-[200px] shadow-md hover:bg-gray-400 hover:text-lg hover:shadow-2xl text-center text-base text-brown-600 my-4 p-2 ${
            selectedButton === "pendingDelivery" ? "bg-gray-400" : ""
          }`}
          onClick={() => setSelectedButton("pendingDelivery")}
        >
          ที่ต้องได้รับ
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
export default AboutOrderPage;
