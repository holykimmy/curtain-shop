import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Footer from "../Footer";
import Swal from "sweetalert2";
import axios from "axios";
import customerAPI from "../../services/customerAPI";
import r6 from "../img/r6.jpg";

function CheckOrdeerPage() {
  const { idOrder } = useParams();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = React.useState("");
  const [idUser, setIdUser] = React.useState("");
  const [currentOrder, setCurrentOrder] = useState([]);

  const [user, setUser] = React.useState({
    username: "",
    f_name: "",
    l_name: "",
    email: "",
    tell: "",
    address: "",
  });

  useEffect(() => {
    const fetchData = () => {
      customerAPI
        .getOrderByIdOrder(idOrder)
        .then((orderData) => {
          setCurrentOrder(orderData);
        })
        .catch((err) => {
          console.error("error", err);
        });
    };
    fetchData();
  }, [idOrder]);

  console.log(currentOrder);

  console.log("check order");

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
  }, [idUser]);
  console.log("testtt");

  if (!isLoggedIn) {
    console.log("hellotest tset ");
    navigate("/");
  }

  const handleLogoutAuto = () => {
    // Logout user
    localStorage.removeItem("token");
    setUserName("");

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

  //see address
  const [address, setAddress] = useState([]);
  console.log(idUser);

  useEffect(() => {
    const fetchData = () => {
      customerAPI
        .getCustomerAddressById(idUser)
        .then((addressData) => {
          setAddress(addressData);
        })
        .catch((err) => {
          console.error("error", err);
        });
    };
    fetchData();

    // Return a cleanup function to clear the interval
    return () => clearInterval();
  }, [idUser]);
  console.log("dkjhafkdsj");
  console.log(address);

  const [sendAddress, setSendAddress] = useState("");

  const handleAddressSelect = (selectedId) => {
    setSendAddress(selectedId);
    console.log("Selected Address ID:", selectedId);
  };

  const deliveryOptions = [
    {
      id: 500,
      title: "ทางร้านขนส่งพร้อมติดตั้ง",
      duration: "ระยะเวลา: 7-14 วัน",
    },
    {
      id: 200,
      title: "จัดส่งสินค้าทางขนส่ง",
      duration: "ระยะเวลา: 7-14 วัน",
    },
  ];

  const [selectedDelivery, setSelecteDelivery] = useState("");
  // console.log("testtt deli");
  const handleDeliveryChange = (optionId) => {
    setSelecteDelivery(optionId);
  };

  console.log("select", selectedDelivery);

  // const submitForm = async (e) => {
  //   e.preventDefault();
  //   const deliveryIs = selectedDelivery;
  //   console.table("deliveryis", deliveryIs);
  //   if (!deliveryIs) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "กรุณาเลือกการจัดส่ง",
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //     return; // หยุดการทำงานของฟังก์ชันหลังจากแสดงแจ้งเตือน
  //   }
  //   console.table(deliveryIs);

  //   if (!sendAddress) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "กรุณาเลือกที่อยู่ที่ต้องการจัดส่ง",
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //     return; // หยุดการทำงานของฟังก์ชันหลังจากแสดงแจ้งเตือน
  //   }
  //   console.table("tetst", sendAddress);

  //   const confirmed = true;

  //   try {
  //     const fileInput = document.getElementById("fileInput");
  //     const formData = new FormData();
  //     if (!fileInput.files[0]) {
  //       Swal.fire({
  //         icon: "error",
  //         text: "กรุณาเลือกแนบรูปหน้าต่างของคุณ",
  //       });
  //       return; // ออกจากฟังก์ชันไปทันที
  //     }

  //     formData.append("windowimg", fileInput.files[0]);

  //     const response = await axios.put(
  //       `${process.env.REACT_APP_API}/customer/cart-to-order/${idOrder}`,
  //       {
  //         sendAddress,
  //         deliveryIs,
  //         confirmed,
  //         formData,
  //       }
  //     );
  //     console.log(response.data); // แสดงข้อมูลที่ API ตอบกลับ

  //     Swal.fire({
  //       icon: "success",
  //       title: "บันทึกข้อมูลเรียบร้อย",
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //     navigate(`/payment/${idOrder}`, idOrder);
  //   } catch (err) {
  //     console.error(err);
  //     Swal.fire({
  //       icon: "error",
  //       title: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //   }
  // };

  const submitForm = async (e) => {
    e.preventDefault();
    const deliveryIs = selectedDelivery;
    console.table("deliveryis", deliveryIs);
    if (!deliveryIs) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกการจัดส่ง",
        showConfirmButton: false,
        timer: 1500,
      });
      return; // หยุดการทำงานของฟังก์ชันหลังจากแสดงแจ้งเตือน
    }
    console.table(deliveryIs);

    if (!sendAddress) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกที่อยู่ที่ต้องการจัดส่ง",
        showConfirmButton: false,
        timer: 1500,
      });
      return; // หยุดการทำงานของฟังก์ชันหลังจากแสดงแจ้งเตือน
    }
    console.table("tetst", sendAddress);

    const confirmed = true;

    try {
      const fileInput = document.getElementById("fileInput");
      const formData = new FormData();
      if (!fileInput.files[0]) {
        Swal.fire({
          icon: "error",
          text: "กรุณาเลือกแนบรูปหน้าต่างของคุณ",
        });
        return; // ออกจากฟังก์ชันไปทันที
      }

      formData.append("windowimg", fileInput.files[0]);

      const response = await axios.put(
        `${process.env.REACT_APP_API}/customer/cart-to-order/${idOrder}`,
        formData, 
        {
          params: {
            sendAddress,
            deliveryIs,
            confirmed,
          },
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        }
      );
      console.log(response.data); 

      Swal.fire({
        icon: "success",
        title: "บันทึกข้อมูลเรียบร้อย",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate(`/payment/${idOrder}`, idOrder);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };


  function handleFileSelect(event) {
    const file = event.target.files[0];

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "ไฟล์ไม่ถูกต้อง",
        text: "กรุณาเลือกไฟล์ที่เป็น .png, .jpeg หรือ .jpg เท่านั้น",
      });
      return;
    }
    const formData = new FormData();
    formData.append("windownimg", file);

    // ส่งข้อมูลไปยังเซิร์ฟเวอร์ โดยใช้ Fetch API
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("อัปโหลดสำเร็จ", data);
        // ดำเนินการต่อไปตามที่คุณต้องการ
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาดขณะอัปโหลด", error);
        // จัดการข้อผิดพลาดตามที่คุณต้องการ
      });
  }

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      {" "}
      <div className="h-screen w-full bg-gradient-to-r from-5% from-white via-50% via-brown-bg to-90% to-white">
        <Navbar
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          userName={userName}
          idUser={idUser}
        ></Navbar>

        <div class="titlea bg-brown-bg py-1 shadow-md">
          <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
          <h5 className=" inline-block text-base md:text-lg xl:text-lg text-b-font  pl-4 p-2 my-1">
            ยืนยันคำสั่งซื้อ
          </h5>
        </div>

        <form encType="multipart/form-data" onSubmit={submitForm}>
          <div class="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
            <div class="px-4 pt-8">
              <p class="text-sm md:text-lg xl:text-lg text-b-font">
                ข้อมูลคำสั่งซื้อ
              </p>
              <p class="text-sm md:text-base xl:text-base text-gray-600">
                กรุณาตรวจสอบรายการสินค้าของคุณ
              </p>
              {currentOrder.map((order) => (
                <div key={order._id}>
                  <h2 class="text-sm md:text-base xl:text-base text-gray-600">
                    Order ID: {order._id}
                  </h2>
                  <h3 class="text-sm md:text-base xl:text-base text-gray-600">
                    Total Price: {numberWithCommas(order.totalPrice)} บาท{" "}
                  </h3>
                  {/* Add more details as needed */}
                  <div class="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
                    {order.products.map((item) => (
                      <div
                        key={item._id}
                        class="flex flex-col shadow-xl  rounded-lg bg-white sm:flex-row"
                      >
                        <img
                          class="m-5 h-auto w-[100px] rounded-md border object-cover object-center"
                          src={`${process.env.REACT_APP_API}/images/${item.product.image}`}
                          alt="product"
                        />
                        <div class="flex w-full flex-col px-4 py-4">
                          <span class="text-sm md:text-base xl:text-base text-gray-800">
                            {" "}
                            ชื่อสินค้า : {item.product.name}
                          </span>
                          <span class="text-sm md:text-base xl:text-base text-gray-800">
                            {" "}
                            ยี่ห้อ : {item.product.brand}
                          </span>

                          <span class="text-sm md:text-base xl:text-base text-gray-800">
                            รหัสสี : {item.product.color}
                          </span>

                          <p class="text-sm md:text-base xl:text-base text-gray-800">
                            {" "}
                            ความกว้างของหน้าผ้า : {item.product.p_width} ซม.
                          </p>
                          <div class="text-xs md:text-sm xl:text-sm whitespace-pre-wrap">
                            รายละเอียดเพิ่มเติม :{item.product.detail}
                          </div>
                          <p class="text-sm md:text-base xl:text-base text-gray-800">
                            {" "}
                            การสั่งตัดผ้าม่าน : {item.type}
                          </p>
                          <p class="text-sm md:text-base xl:text-base text-gray-800">
                            {" "}
                            ราคา/หลา : {numberWithCommas(
                              item.product.price
                            )}{" "}
                          </p>
                          <p class="text-sm md:text-base xl:text-base text-gray-800">
                            {" "}
                            ขนาด : {numberWithCommas(item.width)} x{" "}
                            {numberWithCommas(item.height)} เซนติเมตร{" "}
                          </p>
                          <p class="text-sm md:text-base xl:text-base text-gray-800">
                            จำนวน : {numberWithCommas(item.count)} หลา{" "}
                          </p>
                          <p class="text-sm md:text-base xl:text-base text-gray-800">
                            รวม :{" "}
                            {numberWithCommas(item.product.price * item.count)}{" "}
                            บาท{" "}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <p class="mt-8 text-sm text-b-font">เลือกการขนส่ง</p>
              {deliveryOptions.map((option) => (
                <div key={option.id} className="relative mt-4 text-xs">
                  <input
                    className="peer hidden text-xs"
                    id={`radio_${option.id}`}
                    type="radio"
                    name="deliveryOption"
                    value={option.id}
                    checked={selectedDelivery === option.id}
                    onChange={() =>
                      handleDeliveryChange(
                        option.id,
                        option.title,
                        option.duration
                      )
                    }
                  />
                  <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                  <label
                    className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    htmlFor={`radio_${option.id}`}
                  >
                    {/* <img
                      className="w-14 object-contain"
                      src="/images/naorrAeygcJzX0SyNI4Y0.png"
                      alt=""
                    /> */}
                    <div className="ml-5">
                      <span className="mt-2 ">{option.title}</span>
                      <p className="text-slate-500 text-sm leading-6">
                        {option.duration}
                      </p>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div class="bg-brown-blog mt-10  px-4 pt-8 lg:mt-0">
              <select
                className="mb-2 rounded-lg text-sm"
                onChange={(e) => handleAddressSelect(e.target.value)}
              >
                <option value="">โปรดเลือกที่อยู่ที่ต้องการจัดส่ง</option>
                {address.map((address) => (
                  <option key={address.id} value={address.id}>
                    {`${address.name}, ${address.houseNo}, ${address.sub_district}, ${address.district}, ${address.province} ${address.postcode}`}
                  </option>
                ))}
              </select>

              <p>
                <Link
                  to="/address"
                  className=" mt-2 mb-3 px-4 py-2 rounded-lg text-sm  hover:text-base text-gray-900 hover:text-gray-600"
                >
                  เพิ่มที่อยู่ใหม่ ->
                </Link>
              </p>

              <p class="text-sm md:text-base xl:text-base font-medium">
                ข้อมูลการชำระเงิน
              </p>
              <p class="text-xs md:text-base xl:text-base  text-gray-1000">
                รายละเอียดการชำระเงินของท่าน
              </p>
              {currentOrder.map((order) => (
                <div key={order._item}>
                  <div class="mt-6 border-t border-b py-2">
                    <div class="flex-col items-center justify-between">
                      {order.products.map((item) => (
                        <div key={item._id}>
                          <p className="ml-10 text-sm md:text-base xl:text-base  text-gray-900 my-2">
                            {item.product.name} ขนาด {item.width} x{" "}
                            {item.height} เซนติเมตร x {item.count} ={" "}
                            {item.product.price * item.count}
                          </p>
                        </div>
                      ))}
                      <p class="mt-4 text-sm md:text-base xl:text-base font-medium text-gray-900">
                        {" "}
                        ราคารวม : {numberWithCommas(order.totalPrice)} บาท{" "}
                      </p>
                    </div>

                    <div class="flex items-center justify-between">
                      <p class="text-sm md:text-base xl:text-base font-medium text-gray-900">
                        ค่าจัดส่ง
                      </p>
                      <p class="font-semibold text-sm md:text-base xl:text-base text-gray-900">
                        {selectedDelivery} บาท{" "}
                      </p>
                    </div>
                  </div>
                  <div class="mt-6 flex items-center justify-between">
                    <p class="text-sm md:text-base xl:text-base font-medium text-gray-900">
                      ราคารวมทั้งหมด
                    </p>
                    <p class="text-sm md:text-base xl:text-base font-semibold text-gray-900">
                      {numberWithCommas(order.totalPrice + selectedDelivery)}{" "}
                      บาท
                    </p>
                  </div>

                  <p className="text-md mt-5 mb-2 leading-6 text-gray-800">
                    แนปรูปภาพหน้าต่างของคุณ
                  </p>
                  <div className="flex items-center shadow-md space-x-6 bg-white p-3 rounded-md">
                    {/* <form id="uploadForm" encType="multipart/form-data"> */}
                      <label id="uploadForm" className="block">
                        <span className="sr-only">เลือกรูป</span>
                        <input
                          id="fileInput"
                          name="windowimg"
                          type="file"
                          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                          onChange={handleFileSelect}
                        />
                      </label>
                    {/* </form> */}
                  </div>

                  <button
                    value="save"
                    type="submit"
                    class="mt-4 mb-8 w-full text-xs md:text-sm xl:text-sm  rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
                  >
                    ยืนยันคำสั่งซื้อ
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
        <div className="flex justify-center items-center ">
          <p class="p-5 xl:text-2xl text-b-font text-lg"></p>
        </div>
        <Footer></Footer>
      </div>
    </>
  );
}
export default CheckOrdeerPage;
