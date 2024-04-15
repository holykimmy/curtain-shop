import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import { BsPinFill } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
import Footer from "../Footer";
import customerAPI from "../../services/customerAPI";
function AccoutPage() {
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
    fetchData();
  }, [idUser]);
  console.log(address);

  const handleEditAddress = (addressData) => {
    const { id } = addressData;
    navigate(`/edit-address/${id}`);
  };

  const handleDeleteAddress = async (addressData) => {
    // แสดง Confirm Dialog เพื่อยืนยันการลบที่อยู่
    const { id } = addressData;
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
        const response = await customerAPI.deleteAddress(id);
        console.log(response);
        // ถ้าการลบสำเร็จ
        if (response.message === "Address deleted successfully") {
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
        <h5 className=" inline-block text-base  text-b-font  pl-4 p-2 my-1">
          โปรไฟล์ส่วนตัว
        </h5>
      </div>
      <div className="flex-col justify-center">
        <div className="flex">
          <h5 className=" inline-block text-base  text-b-font  mt-5 ml-3 pl-4  ">
            username : {user.username}
          </h5>
        </div>
        <div className="flex">
          <h5 className=" inline-block text-base  text-b-font  mt-2 ml-3 pl-4 ">
            ชื่อ - นามสกุล : {userName}
          </h5>
        </div>

        <div className="flex">
          <h5 className=" inline-block text-base  text-b-font  mt-2 ml-3 pl-4 ">
            อีเมลล์ : {user.email}
          </h5>
        </div>
        <div className="flex">
          <h5 className=" inline-block text-base  text-b-font  mt-2 ml-3 pl-4 ">
            เบอร์โทร : {user.tell}
          </h5>
        </div>
        <div className="flex-col">
          {address.map((addressData, index) => (
            <div
              className="p-6 flex-col m-6 rounded-lg bg-white shadow-xl hover:shadow-2xl"
              key={index}
            >
              <p className="mt-3 text-base text-brown-400">
                ที่อยู่ : {index + 1}
              </p>

              <p className="mt-3 text-base text-brown-400">
                ชื่อ : {addressData.name}
              </p>
              <p className="mt-3 text-base text-brown-400">
                เบอร์โทร : {addressData.tell}
              </p>
              <p className="mt-3 text-base text-brown-400">
                บ้านเลขที่ : {addressData.houseNo}
              </p>
              <p className="mt-3 text-base text-brown-400">
                แขวง/อำเถอ : {addressData.sub_district}
              </p>
              <p className="mt-3 text-base text-brown-400">
                เขต/ตำบล : {addressData.district}
              </p>
              <p className="mt-3 text-base text-brown-400">
                จังหวัด : {addressData.province}
              </p>
              <p className="mt-3 text-base text-brown-400">
                รหัสไปรษณีย์ : {addressData.postcode}
              </p>
              <div className="flex">
                <div className="flex">
                  <button
                    className=" mx-4 mt-4  mb-2 px-4 py-2 rounded-lg inline-block text-base bg-green-400 hover:bg-green-600 hover:shadow-xl text-white focus:outline-none focus:shadow-outline"
                    onClick={() => handleEditAddress(addressData)}
                  >
                    แก้ไขที่อยู่
                  </button>
                </div>
                <div className="flex">
                  <button
                    className="mx-4 mt-4 mb-2 px-4 py-2 rounded-lg inline-block text-base bg-red-400 hover:bg-red-600 hover:shadow-xl text-white focus:outline-none focus:shadow-outline"
                    onClick={() => handleDeleteAddress(addressData)}
                  >
                    ลบที่อยู่
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div class="flex items-center justify-center mt-8">
        <Link
          to="/address"
          class="w-[50%] text-center bg-stone-500 hover:bg-browntop hover:shadow-md text-white font-bold py-2 px-4 mb-5 rounded focus:outline-none focus:shadow-outline"
          value="save"
          type="submit"
        >
          เพิ่มที่อยู่
        </Link>
      </div>
    </>
  );
}
export default AccoutPage;
