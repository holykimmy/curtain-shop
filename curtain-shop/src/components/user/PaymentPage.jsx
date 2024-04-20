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
import bangkokBank from "../img/bank/bangkokbank.png";

function PaymentPage() {
  const { idOrder } = useParams();
  console.log("idOrder", idOrder);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = React.useState("");
  const [idUser, setIdUser] = React.useState("");
  const [currentOrder, setCurrentOrder] = useState([]);
  const [depositOrder, setDepositOrder] = useState("");
  const [totalDeposit, setTotalDisposit] = useState("");
  const [user, setUser] = React.useState({
    username: "",
    f_name: "",
    l_name: "",
    email: "",
    tell: "",
    address: ""
  });

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

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      customerAPI
        .getOrderByIdOrder(idOrder)
        .then((orderData) => {
          setCurrentOrder(orderData);
          console.log("in order", orderData[0].deposit);
          if (orderData[0].deposit) {
            setTotalDisposit(orderData[0].totalPrice * 0.5);
          } else {
            setTotalDisposit(orderData[0].totalPrice);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("error", err);
          setIsLoading(false);
        });
    };
    fetchData();
  }, [idOrder, depositOrder, totalDeposit]);

  console.log("testtt", depositOrder);

  console.log("order : ", currentOrder);

  console.log("check order toto dis", totalDeposit);

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
      navigate("/login");
    }
  }, [idUser]);

  console.log("testtt");

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

  //see address
  const [address, setAddress] = useState([]);
  console.log(idUser);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = () => {
      customerAPI
        .getCustomerAddressById(idUser)
        .then((addressData) => {
          setAddress(addressData);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("error", err);
          setIsLoading(false);
        });
    };
    fetchData();
  }, [idUser]);
  console.log(address);

  const handlePayment = async (idOrder) => {
    try {
      const fileInput = document.getElementById("fileInput");
      const formData = new FormData();
      if (!fileInput.files[0]) {
        Swal.fire({
          icon: "error",
          title: "กรุณาแนบสลิป",
          text: "กรุณาเลือกไฟล์สลิปเงินโอน"
        });
        return; // ออกจากฟังก์ชันไปทันที
      }

      formData.append("slipmoney", fileInput.files[0]);
      setIsLoading(true);

      const response = await axios.put(
        `${process.env.REACT_APP_API}/customer/order/payment/${idOrder}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      if (response.status === 200) {
        // แสดง Swal แจ้งเตือน
        setIsLoading(false);
        Swal.fire({
          icon: "success",
          title: "การชำระเงินเรียบร้อย",
          text: "ขอบคุณสำหรับการชำระเงิน"
        }).then(() => {
          navigate(`/order-detail/${idOrder}`);
        });
      } else {
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "มีข้อผิดพลาดในการชำระเงิน"
        });
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "มีข้อผิดพลาดในการชำระเงิน"
      });
      setIsLoading(false);

    }
  };

  function handleFileSelect(event) {
    const file = event.target.files[0];

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "ไฟล์ไม่ถูกต้อง",
        text: "กรุณาเลือกไฟล์ที่เป็น .png, .jpeg หรือ .jpg เท่านั้น"
      });
      return;
    }
    const formData = new FormData();
    formData.append("slipmoney", file);

  }

  const numberWithCommas = (x) => {
    const formattedNumber = parseFloat(x).toFixed(2);
    return formattedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

  function handleDepositPayment(deposit) {
    let message;

    if (deposit) {
      message = "คุณต้องการจ่ายมัดจำก่อน 50% ใช่หรือไม่?";
    } else {
      message = "คุณต้องการจ่ายเต็มราคาเลยใช่หรือไม่?";
    }

    console.log("testt deposit : ", deposit);

    Swal.fire({
      title: message,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่"
    }).then((result) => {
      if (result.isConfirmed) {
        // ทำการอัปเดตค่ามัดจำผ่าน customerAPI.updateOrderDepositPayment
        customerAPI
          .updateOrderDepositPayment(idOrder, deposit)
          .then((response) => {
            Swal.fire({
              icon: "success"
            });
            setDepositOrder(deposit);
          })
          .catch((error) => {
            Swal.fire({
              text: "เกิดข้อผิดพลาด",
              icon: "error"
            });
            console.error("Error updating deposit:", error);
          });
      }
    });
  }

  return (
    <>
      {" "}
      <div className="h-screen w-full">
        <Navbar
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          userName={userName}
          idUser={idUser}
        ></Navbar>

        <div class="titlea  py-1 shadow-md">
          <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
          <h5 className=" inline-block text-md md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
            การชำระสินค้า
          </h5>
        </div>

        {currentOrder.map((order) => (
          <div key={order._id}>
            <div className="py-14 px-4 md:px-100 2xl:px-100 2xl:container 2xl:mx-auto">
              <div className="flex justify-start item-start space-y-2 flex-col ">
                <h1 className="text-base sm:text-base md:text-md lg:text-lg xl:text-lg font-semibold leading-7 lg:leading-9  text-gray-800">
                  หมายเลขออเดอร์ของคุณ : {order._id}
                </h1>
                <p className="text-xs sm:text-xs md:text-base lg:text-md xl:text-md font-medium leading-6 text-gray-600">
                  วันที่สั่งซื้อ : {order.createdAt}{" "}
                </p>
              </div>
              <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                  <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                    <p className="xt-base sm:text-base md:text-md lg:text-lg xl:text-lg  font-semibold leading-6 xl:leading-5 text-gray-800">
                      สินค้าที่สั่งตัด
                    </p>
                    {order.products.map((item) => (
                      <div
                        key={item._id}
                        className="mt-4 md:mt-6 flex  flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full "
                      >
                        <div className="pb-4 md:pb-8 w-full md:w-60">
                          <img
                            className="w-full hidden md:block"
                            src={item.product.image}
                            alt="product"
                          />
                        </div>
                        <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
                          <div className="w-full flex flex-col justify-start items-start space-y-8">
                            <h3 className="text-base sm:text-base md:text-md lg:text-lg xl:text-lg  font-semibold leading-6 text-gray-800">
                              {item.product.name}
                            </h3>
                            <div className="flex justify-start items-start flex-col space-y-2">
                              <p className="text-sm leading-none text-gray-800">
                                <span className="text-gray-600">
                                  ประเภท : {item.product.p_type}
                                </span>
                              </p>
                              <p className="text-sm leading-none text-gray-800">
                                <span className="text-gray-600">
                                  ยี่ห้อ : {item.product.brand}
                                </span>
                              </p>
                              <p className="text-sm leading-none text-gray-800">
                                <span className="text-gray-600">
                                  ขนาด : {item.width} x {item.height} ซม.
                                </span>
                              </p>

                              <p className="text-sm leading-none text-gray-800">
                                <span className="text-gray-600">
                                  รหัสสี : {item.product.color}
                                </span>
                              </p>
                              <p className="text-sm leading-none text-gray-800">
                                <span className="text-gray-600">
                                  ความกว้างหน้าผ้า : {item.product.p_width} ซม.
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between space-x-8 items-start w-full">
                            <div className="flex-col">
                              {" "}
                              <p className="text-xs sm:text-xs md:text-sm xl:text-sm  leading-6">
                                ผ้าม่านที่สั่งตัด : {item.type}
                              </p>{" "}
                              <p className="text-base sm:text-sm md:text-sm   leading-6">
                                จำนวน : {item.count} ชุด
                              </p>
                            </div>

                            <p className="text-xs sm:text-xs md:text-sm xl:text-sm font-semibold leading-6 text-gray-800">
                              ราคา {numberWithCommas(item.totalPiece)} บาท
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-base leading-4 text-gray-800  px-4 py-6 space-y-4 md:space-y-6 xl:space-y-8">
                    รูปหน้าหน้าต่าง
                  </p>
                  <div className="flex flex-row justify-around items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                    {order.windowimg.map((url, index) => (
                      <img
                        key={index}
                        className="w-[150px]  m-4 drop-shadow-md "
                        src={`${process.env.REACT_APP_AWS}${url}`}
                        alt="product"
                      />
                    ))}
                  </div>

                  <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                    <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                      <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                        <div className="flex justify-between items-center w-full">
                          <p className="text-xs md:text-sm xl:text-base leading-4 text-gray-800">
                            การจัดส่ง
                          </p>
                          <p className="text-xs md:text-sm xl:text-base  leading-4 text-gray-600 whitespace-pre-wrap text-right">
                            {order.deliveryIs}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <p className="text-base font-semibold leading-4  text-gray-800">
                          ราคารวม
                        </p>
                        <p className="text-base font-semibold leading-4 text-gray-600">
                          {numberWithCommas(order.totalPrice)} บาท
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                      <h3 className="text-xl font-semibold leading-5 text-gray-800">
                        ชำระสินค้า
                      </h3>
                      <div className="flex justify-between items-start w-full">
                        <div className="flex justify-center items-center space-x-4">
                          <div class="w-8 h-8">
                            <img
                              class="w-full h-full"
                              alt="logo"
                              src="https://i.ibb.co/L8KSdNQ/image-3.png"
                            />
                          </div>
                          <div className="flex flex-col justify-start items-center">
                            <p className="text-sm leading-6 font-semibold text-gray-800">
                              ทางร้านกำลังจัดเตรียมสินค้า
                              <br />
                              <span className="font-normal">
                                จะทำการจัดส่งสินค้าทันทีหลังจากที่ตัดผ้าม่านเสร็จ
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {order.approve ? (
                        <>
                          <p className="text-lg font-semibold leading-6 text-gray-800">
                            เลือกสลิปการโอนเงินของคุณ
                          </p>
                          <div className="flex mr-3 items-center justify-start">
                            <img
                              className="h-14 sx:h-10 filter drop-shadow-md mr-4"
                              src={bangkokBank}
                              alt="bank"
                            />
                            <div>
                              <p className="text-lg  sx:text-base pt-2 font-bold  text-indigo-900">
                                071-0-73508-5
                              </p>
                              <p className="text-base sx:text-sm font-semibold text-indigo-900">
                                นางเบ็ญจา ฤทธี
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between mt-4">
                            <button
                              className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md"
                              onClick={() => handleDepositPayment(true)}
                            >
                              จ่ายแบบมัดจำ 50%
                            </button>
                            <button
                              className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md"
                              onClick={() => handleDepositPayment(false)}
                            >
                              จ่ายเต็มราคาเลย
                            </button>
                          </div>

                          <p className="text-sm leading-6 text-gray-800">
                            ราคาที่ต้องชำระ{" "}
                            <span className="text-base font-bold">
                              {numberWithCommas(totalDeposit)}
                            </span>{" "}
                            บาท
                          </p>

                          <div className="flex items-center shadow-md space-x-6 bg-white p-3 rounded-md">
                            <form id="uploadForm" encType="multipart/form-data">
                              <label className="block">
                                <span className="sr-only">เลือกรูป</span>
                                <input
                                  id="fileInput"
                                  name="slipmoney"
                                  type="file"
                                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                  onChange={handleFileSelect}
                                />
                              </label>
                            </form>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm leading-6 font-semibold text-gray-800">
                          รอการอนุมัติคำสั่งซื้อจากทางร้าน
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col ">
                  <h3 className="text-base sm:text-base md:text-md font-semibold leading-5 text-gray-800">
                    ข้อมูลลูกค้า
                  </h3>
                  <div className="flex  flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0 ">
                    <div className="flex flex-col justify-start items-start flex-shrink-0">
                      <div className="flex justify-center  w-full  md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                        <div className=" flex justify-start items-start flex-col space-y-2">
                          <p className="text-sm sm:text-xs md:text-md leading-4 text-left text-gray-800">
                            ชื่อ - นามสกุล : {order.orderBy.f_name}{" "}
                            {order.orderBy.l_name}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                            stroke="#1F2937"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3 7L12 13L21 7"
                            stroke="#1F2937"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="cursor-pointer text-sm leading-5 text-gray-800">
                          E-mail : {order.orderBy.email}
                        </p>
                      </div>
                      <div className="flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          class="bi bi-phone"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                          <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                        </svg>
                        <p className="cursor-pointer text-sm leading-5 text-gray-800">
                          เบอร์โทรศัพท์ : {order.orderBy.tell}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between xl:h-full  items-stretch w-full flex-col mt-6 md:mt-0">
                      <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row  items-center md:items-start ">
                        <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-4 xl:mt-8">
                          <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">
                            ที่อยู่ที่ต้องการจัดส่ง
                          </p>

                          {/* <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                            {order.sendAddress.name} {order.sendAddress.houseNo}{" "}
                            {order.sendAddress.sub_district}{" "}
                            {order.sendAddress.district}{" "}
                            {order.sendAddress.province}{" "}
                            {order.sendAddress.postcode}
                          </p> */}

                          {order.sendAddress && (
                            <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                              {order.sendAddress.name}{" "}
                              {order.sendAddress.houseNo}{" "}
                              {order.sendAddress.sub_district}{" "}
                              {order.sendAddress.district}{" "}
                              {order.sendAddress.province}{" "}
                              {order.sendAddress.postcode}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* <p className="flex w-full justify-center items-center md:justify-start md:items-start">
                        {!order.approve
                          ? "รอการอนุมัติคำสั่งซื้อจากทางร้าน"
                          : ""}
                      </p> */}

                      <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                        {!order.payment ? (
                          <button
                            onClick={() => handlePayment(order._id)}
                            disabled={!order.approve}
                            className="mt-6 md:mt-0 py-5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 border border-gray-800 font-medium w-96 2xl:w-full text-base leading-4 text-gray-800"
                          >
                            ยืนยันการชำระ
                          </button>
                        ) : (
                          "ท่านได้ทำการชำระเงินเรียบร้อยแล้ว"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="py-14 px-4 md:px-100 2xl:px-100 2xl:container 2xl:mx-auto h-10"></div>

        <Footer></Footer>
      </div>
    </>
  );
}
export default PaymentPage;
