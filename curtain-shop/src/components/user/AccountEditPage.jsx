import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import { BsPinFill } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
import Footer from "../Footer";
import customerAPI from "../../services/customerAPI";
function EditAccoutPage() {
  //login

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = React.useState("");
  const [idUser, setIdUser] = React.useState("");
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
  const [user, setUser] = React.useState({
    username: "",
    f_name: "",
    l_name: "",
    email: "",
    tell: "",
    address: ""
  });

  const [data, setData] = useState({
    f_name: "",
    l_name: "",
    email: "",
    tell: ""
  });

  const { f_name, l_name, email, tell } = data;

  console.table(data);

  const resetPassword = (emailf) => {
    console.log("test");
    console.log(emailf);

    Swal.fire({
      text: "คุณต้องการเปลี่ยนรหัสผ่านใช่หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่"
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/reset-password/${idUser}`);
      }
    });
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
          address: decodedToken.user.address
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await customerAPI.getCustomerById(idUser);
        setData(data);
        setIsLoading(false);
      } catch (err) {
        console.error("erro", err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [idUser]);

  const handleLogoutAuto = () => {
    // Logout user
    localStorage.removeItem("token");
    setUserName(""); // Clear user name or any other relevant state
    navigate("/");
  };

  const handleLogout = () => {
    Swal.fire({
      title: `คุณต้องการออกจากระบบใช่หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่"
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

  const handleTellChange = (e) => {
    const inputNumber = e.target.value;

    if (inputNumber.length <= 10) {
      // ตรวจสอบว่า inputNumber เป็นตัวเลขและมีค่ามากกว่าหรือเท่ากับ 0 หรือไม่
      if (!isNaN(inputNumber) && Number(inputNumber) >= 0) {
        setData((prevState) => ({
          ...prevState,
          tell: inputNumber
        }));
      }
    }
  };

  const inputValue = (name) => (event) => {
    const value = event.target.value;
    console.log(name, "=", value);
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitForm = (e) => {
    e.preventDefault();
    console.log("User Data:", {
      f_name,
      l_name,
      email,
      tell
    });
    setIsLoading(true);
    setIsLoading(false);

    // ตรวจสอบรูปแบบของอีเมลและหมายเลขโทรศัพท์
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      // แสดงข้อความข้อผิดพลาด
      Swal.fire({
        title: "Invalid Email Format",
        icon: "error"
      });
      return;
    }

    if (!/^(09|08|06|02)\d{0,8}$/.test(tell)) {
      // แสดงข้อความข้อผิดพลาด
      Swal.fire({
        title: "Invalid Phone Number Format",
        icon: "error"
      });
      return;
    }

    Swal.fire({
      title: "ยืนยันการแก้ไขข้อมูล",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก"
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        axios
          .put(`${process.env.REACT_APP_API}/customer/edit-profile/${idUser}`, {
            f_name,
            l_name,
            email,
            tell
          })
          .then((response) => {
            setIsLoading(false);
            Swal.fire({
              text: "แก้ไขข้อมูลเรียบร้อยแล้ว",
              icon: "success",
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              // รีโหลดหน้าเว็บ
              window.location.reload();
            });
          })
          .catch((err) => {
            setIsLoading(false);

            Swal.fire({
              icon: "error",
              text: err.response.data.error
            });
          });
      }
    });
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
          แก้ไขข้อมูล
        </h5>
      </div>
      <div className="flex-col justify-center ">
        <div className="flex">
          <h5 className="inline-block text-base  text-b-font ml-2 mt-2 md:mt-5 md:ml-3 md:pl-4  ">
            username : {data.username}
          </h5>
        </div>
        <div class="flex mt-2 ml-3 pl-4 ">
          <button
            class=" text-base text-stone-500 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => resetPassword(data.email)}
          >
            เปลี่ยนรหัสผ่าน
          </button>
        </div>
        <form onSubmit={submitForm}>
          <div className="flex items-center justify-between px-3 md:w-[520px]  mt-5 md:pl-4 ">
            <div className=" inline-block text-base  text-b-font   md:ml-3   ">
              {" "}
              ชื่อ :{" "}
            </div>
            <input
              class="appearance-none border-gray-300 rounded w-[280px] md:w-[400px] ml-3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="f_name"
              type="text"
              value={data.f_name}
              onChange={inputValue("f_name")}
            />
          </div>
          <div className="flex items-center justify-between px-3 md:w-[520px] mt-5 md:pl-4 ">
            <div className=" inline-block text-base  text-b-font   md:ml-3   ">
              {" "}
              นามสกุล :{" "}
            </div>
            <input
              class="appearance-none border-gray-300 rounded w-[280px] md:w-[400px] ml-3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="l_name"
              type="text"
              value={data.l_name}
              onChange={inputValue("l_name")}
            />
          </div>

          <div className="flex items-center justify-between px-3 md:w-[520px]  mt-5 md:pl-4 ">
            <div className=" inline-block text-base  text-b-font   md:ml-3   ">
              {" "}
              email :{" "}
            </div>
            <input
              class="appearance-none border-gray-300 rounded w-[280px] md:w-[400px] ml-3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              value={data.email}
              onChange={inputValue("email")}
            />
          </div>
          <div className="flex items-center justify-between px-3 md:w-[520px]  mt-5 md:pl-4 ">
            <div className=" inline-block text-base  text-b-font   md:ml-3   ">
              {" "}
              เบอร์โทร :{" "}
            </div>
            <input
              class="appearance-none border-gray-300 rounded w-[280px] md:w-[400px] ml-3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tell"
              type="text"
              value={data.tell}
              onChange={handleTellChange}
            />
          </div>

          <div className="flex items-center justify-center mt-8">
            <button
              className="w-[50%] text-center bg-brown-300 hover:bg-browntop hover:shadow-md text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              value="save"
              type="submit"
            >
              แก้ไขข้อมูล
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export default EditAccoutPage;
