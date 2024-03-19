import React from "react";
import ReactDOM from "react-dom/client";
import { useEffect, useState } from "react";
import $ from "jquery";
import { BsPinFill } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
import Footer from "../Footer";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

function AddressPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = React.useState("");
  const [idUser, setIdUser] = React.useState("");
  const [user, setUser] = React.useState({
    username:"",
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
        console.log("addresssjhf", decodedToken.user.addres);
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

  const [address, setAddress] = useState({
    name: "",
    tell: "",
    houseNo: "",
    sub_district: "",
    district: "",
    province: "",
    postcode: "",
  });

  useEffect(() => {
    if (window.jQuery && window.jQuery.Thailand) {
      window.jQuery.Thailand({
        $district: window.jQuery("#sub_district"),
        $amphoe: window.jQuery("#district"),
        $province: window.jQuery("#province"),
        $zipcode: window.jQuery("#postcode"),
      });

      // เมื่อ autocomplete ใส่ค่าเข้ามาให้ trigger event change เพื่ออัปเดต state ของ input fields
      window.jQuery("#sub_district").change();
      window.jQuery("#district").change();
      window.jQuery("#province").change();
      window.jQuery("#postcode").change();

      // อัปเดตค่า address เมื่อ autocomplete ใส่ค่าเข้ามา
      window.jQuery(document).on("thailand:autocomplete:end", function (event) {
        const data = event.originalEvent.data;
        setAddress({
          sub_district: data.district[0].name,
          district: data.amphoe[0].name,
          province: data.province[0].name,
          postcode: data.zipcode,
        });
      });
    }
  }, []);

  // const handleChange = (e) => {
  //   const { id, value } = e.target;
  //   setAddress((prevState) => ({
  //     ...prevState,
  //     [id]: value,
  //   }));
  // };

  const inputValue = (name) => (event) => {
    const value = event.target.value;
    console.log(name, "=", value);
    setAddress((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update address based on selected autocomplete values
      const updatedAddress = {
        name: address.name,
        tell: address.tell,
        houseNo: address.houseNo,
        sub_district: document.getElementById("sub_district").value,
        district: document.getElementById("district").value,
        province: document.getElementById("province").value,
        postcode: document.getElementById("postcode").value,
      };

      setAddress(updatedAddress); // Update the address state

      // Send updated address to the API
      const response = await axios.post(
        `${process.env.REACT_APP_API}/customer/add-address`,
        {
          id: idUser,
          address: [updatedAddress], // Send the updated address
        }
      );

      // Handle response based on status
      if (response.status === 200) {
        // Show success message
        Swal.fire({
          icon: "success",
          title: "บันทึกที่อยู่สำเร็จ",
          text: "ข้อมูลที่อยู่ถูกบันทึกเรียบร้อยแล้ว",
        });
      } else {
        // Show error message
        Swal.fire({
          icon: "error",
          title: "บันทึกที่อยู่ไม่สำเร็จ",
          text: "ไม่สามารถบันทึกที่อยู่ได้ในขณะนี้ กรุณาลองใหม่ภายหลัง",
        });
      }
    } catch (error) {
      console.error(error);
      // Show error message
      Swal.fire({
        icon: "error",
        text: error.response.data.error,
      });
    }
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        userName={userName}
        idUser={idUser}
      ></Navbar>
      <div className=" w-full  flex h-screen items-center justify-center bg-brown-bg ">
        <div class=" mx-4 items-center w-11/12 sm:w-96 rounded-[18px] shadow px-8 pt-6 pb-8 mb-4 bg-white ">
          <p class="text-center text-2xl text-b-font font-bold">เพิ่มที่อยู่</p>
          {/* {JSON.stringify(address)} */}

          <form onSubmit={handleSubmit} class="bg-white ">
            <p class="text-browntop mt-3 ml-2 ">ที่อยู่</p>
            <input
              className="m-auto mt-2 mb-3 items-center shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="houseNo"
              type="text"
              value={address.name}
              required
              onChange={inputValue("name")}
              placeholder="ชื่อ - นามสกุล"
            />
            <input
              className="m-auto mt-2 mb-3 items-center shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="houseNo"
              type="text"
              value={address.tell}
              required
              onChange={inputValue("tell")}
              placeholder="เพิ่มเบอร์มือถือ"
            />

            <input
              className="m-auto mt-2 mb-3 items-center shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="houseNo"
              type="text"
              value={address.houseNo}
              required
              onChange={inputValue("houseNo")}
              placeholder="บ้านเลขที่ 101/11 ,ซอย สุขใจ, อาคาร A ขั้น 29 , ห้อง 101"
            />

            <p class="text-browntop mt-3 ml-2 ">แขวง/ตำบล</p>

            <input
              className="m-auto mt-2 mb-3 items-center shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="sub_district"
              type="text"
              value={address.sub_district}
              required
              onChange={inputValue("sub_district")}
              placeholder="แขวง/ตำบล"
            />

            <p class="text-browntop mt-3 ml-2 ">เขต/อำเภอ</p>
            <input
              className="m-auto mt-2 mb-3 items-center shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="district"
              value={address.district}
              type="text"
              required
              onChange={inputValue("district")}
              placeholder="เขต/อำเภอ"
            />

            <p class="text-browntop mt-3 ml-2 ">จังหวัด</p>
            <input
              className="m-auto mt-2 mb-3 items-center shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="province"
              type="text"
              value={address.province}
              required
              onChange={inputValue("province")}
              placeholder="จังหวัด"
            />
            <p class="text-browntop mt-3 ml-2 ">รหัสไปรษณีย์</p>
            <input
              className="m-auto mt-2 mb-3 items-center shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="postcode"
              type="text"
              value={address.postcode}
              required
              onChange={inputValue("postcode")}
              placeholder="10000"
            />

            <button
              class="w-full mt-3 bg-stone-500 hover:bg-browntop text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              value="save"
              type="submit"
            >
              เพิ่มที่อยู่
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
export default AddressPage;
