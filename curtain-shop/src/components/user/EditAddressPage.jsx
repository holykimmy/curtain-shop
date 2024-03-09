import React from "react";
import ReactDOM from "react-dom/client";
import { useEffect, useState } from "react";
import $ from "jquery";
import { BsPinFill } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
import Footer from "../Footer";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "../Navbar";

function EditAddressPage() {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = React.useState("");
  const [idUser, setIdUser] = React.useState("");
  // const [addressData, setAddressData] = useState(null);
  const [addressData, setAddressData] = useState({
    houseNo: "",
    sub_district: "",
    district: "",
    province: "",
    postcode: "",
  });
  // console.table(_id,idUser);

  // console.log("adddara",addressData);

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

  const [address, setAddress] = useState({
    houseNo: "",
    sub_district: "",
    district: "",
    province: "",
    postcode: "",
  });

  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/customer/get-address/${idUser}/${_id}`
        );
        setAddressData(response.data);
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    fetchAddressData();
  }, [_id]);

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
          houseNo: data.district[0].parent_name,
          sub_district: data.district[0].name,
          district: data.amphoe[0].name,
          province: data.province[0].name,
          postcode: data.zipcode,
        });
      });
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAddress((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const inputValue = (name) => (event) => {
    const value = event.target.value;
    console.log(name, "=", value);
    setAddress((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedAddress = {
        houseNo: address.houseNo,
        sub_district: address.sub_district,
        district: address.district,
        province: address.province,
        postcode: address.postcode,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API}/customer/update-address/${idUser}/${_id}`,
        { newAddress: updatedAddress }
      );

      if (response.status === 200) {
        // แสดงข้อความยืนยันการเปลี่ยนแปลงที่อยู่
        Swal.fire({
          title: "ยืนยันการเปลี่ยนแปลงที่อยู่",
          text: "คุณต้องการเปลี่ยนแปลงที่อยู่ใช่หรือไม่?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ใช่",
          cancelButtonText: "ไม่ใช่",
        }).then((result) => {
          if (result.isConfirmed) {
            // แสดงข้อความสำเร็จ
            Swal.fire({
              icon: "success",
              title: "บันทึกที่อยู่สำเร็จ",
              text: "ข้อมูลที่อยู่ถูกบันทึกเรียบร้อยแล้ว",
            });
          }
        });
      } else {
        // แสดงข้อความข้อผิดพลาด
        Swal.fire({
          icon: "error",
          title: "บันทึกที่อยู่ไม่สำเร็จ",
          text: "ไม่สามารถบันทึกที่อยู่ได้ในขณะนี้ กรุณาลองใหม่ภายหลัง",
        });
      }
    } catch (error) {
      console.error(error);
      // แสดงข้อความข้อผิดพลาด
      Swal.fire({
        icon: "error",
        text: error.response.data.error,
      });
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // Update address based on selected autocomplete values
  //     const updatedAddress = {
  //       houseNo: document.getElementById("houseNo").value,
  //       sub_district: document.getElementById("sub_district").value,
  //       district: document.getElementById("district").value,
  //       province: document.getElementById("province").value,
  //       postcode: document.getElementById("postcode").value,
  //     };

  //     // Send updated address to the API
  //     const response = await axios.put(
  //       `${process.env.REACT_APP_API}/customer/update-address/${idUser}/${_id}`,
  //       {
  //         newAddress: updatedAddress, // Send the updated address in the body of the request
  //       }
  //     );

  //     // Handle response based on status
  //     if (response.status === 200) {
  //       // Show confirmation message
  //       Swal.fire({
  //         title: "ยืนยันการเปลี่ยนแปลงที่อยู่",
  //         text: "คุณต้องการเปลี่ยนแปลงที่อยู่ใช่หรือไม่?",
  //         icon: "question",
  //         showCancelButton: true,
  //         confirmButtonColor: "#3085d6",
  //         cancelButtonColor: "#d33",
  //         confirmButtonText: "ใช่",
  //         cancelButtonText: "ไม่ใช่",
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           // Show success message
  //           Swal.fire({
  //             icon: "success",
  //             title: "บันทึกที่อยู่สำเร็จ",
  //             text: "ข้อมูลที่อยู่ถูกบันทึกเรียบร้อยแล้ว",
  //           });
  //         }
  //       });
  //     } else {
  //       // Show error message
  //       Swal.fire({
  //         icon: "error",
  //         title: "บันทึกที่อยู่ไม่สำเร็จ",
  //         text: "ไม่สามารถบันทึกที่อยู่ได้ในขณะนี้ กรุณาลองใหม่ภายหลัง",
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     // Show error message
  //     Swal.fire({
  //       icon: "error",
  //       text: error.response.data.error,
  //     });
  //   }
  // };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        userName={userName}
        idUser={idUser}
      ></Navbar>

      <div className=" w-full  flex h-screen items-center justify-center bg-brown-bg ">
        <div class="container w-11/12 sm:w-96 mx-auto rounded-[18px] shadow px-8 pt-6 pb-8 mb-4 bg-white ">
          <p class="text-center text-2xl text-b-font font-bold">เพิ่มที่อยู่</p>
          {/* {JSON.stringify(address)} */}
          <p>{addressData.houseNo}</p>
          <p>{addressData.sub_district}</p>
          <p>{addressData.district}</p>
          <p>{addressData.province}</p>
          <p>{addressData.postcode}</p>

          <form onSubmit={handleSubmit} class="bg-white ">
            <p class="text-browntop mt-3 ml-2 ">ที่อยู่</p>
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
              onChange={handleChange}
              placeholder="แขวง/ตำบล"
            />

            <p class="text-browntop mt-3 ml-2 ">เขต/อำเภอ</p>
            <input
              className="m-auto mt-2 mb-3 items-center shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="district"
              value={address.district}
              type="text"
              required
              onChange={handleChange}
              placeholder="เขต/อำเภอ"
            />

            <p class="text-browntop mt-3 ml-2 ">จังหวัด</p>
            <input
              className="m-auto mt-2 mb-3 items-center shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="province"
              type="text"
              value={address.province}
              required
              onChange={handleChange}
              placeholder="จังหวัด"
            />
            <p class="text-browntop mt-3 ml-2 ">รหัสไปรษณีย์</p>
            <input
              className="m-auto mt-2 mb-3 items-center shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="postcode"
              type="text"
              value={address.postcode}
              required
              onChange={handleChange}
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
export default EditAddressPage;
