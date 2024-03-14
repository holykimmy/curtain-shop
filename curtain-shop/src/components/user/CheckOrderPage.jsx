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

    // Return a cleanup function to clear the interval
    return () => clearInterval();
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
      const response = await axios.put(
        `${process.env.REACT_APP_API}/customer/cart-to-order/${idOrder}`,
        {
          sendAddress,
          deliveryIs,
          confirmed,
        }
      );
      console.log(response.data); // แสดงข้อมูลที่ API ตอบกลับ
      Swal.fire({
        icon: "success",
        title: "บันทึกข้อมูลเรียบร้อย",
        showConfirmButton: false,
        timer: 1500,
      });
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

  const handlePaymentOrder = async (idOrder) => {
    navigate(`/payment/${idOrder}`);
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
          <h5 className=" inline-block text-lg md:text-xl xl:text-3xl text-b-font  pl-4 p-2 my-1">
            ยืนยันคำสั่งซื้อ
          </h5>
        </div>

        <form onSubmit={submitForm}>
          <div class="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
            <div class="px-4 pt-8">
              <p class="text-2xl text-b-font">ข้อมูลคำสั่งซื้อ</p>
              <p class="text-gray-400">กรุณาตรวจสอบรายการสินค้าของคุณ</p>
              {currentOrder.map((order) => (
                <div key={order._id}>
                  <h2>Order ID: {order._id}</h2>
                  <h3>Total Price: {order.totalPrice}</h3>
                  <h3>Confirmed: {order.confirmed ? "Yes" : "No"}</h3>
                  {/* Add more details as needed */}
                  <div class="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
                    {order.products.map((item) => (
                      <div
                        key={item._id}
                        class="flex flex-col shadow-xl  rounded-lg bg-white sm:flex-row"
                      >
                        <img
                          class="m-5 h-50 w-40 rounded-md border object-cover object-center"
                          src={`${process.env.REACT_APP_API}/images/${item.product.image}`}
                          alt="product"
                        />
                        <div class="flex w-full flex-col px-4 py-4">
                          <span class="font-semibold">
                            {" "}
                            ชื่อสินค้า : {item.product.name}
                          </span>
                          <span class="font-semibold">
                            {" "}
                            ยี่ห้อ : {item.product.brand}
                          </span>

                          <span class="float-right text-gray-600">
                            รหัสสี : {item.product.color}
                          </span>

                          <p class="text-md font-bold">
                            {" "}
                            ความกว้างของหน้าผ้า : {item.product.p_width}
                          </p>
                          <div class="float-right text-gray-600 whitespace-pre-wrap">
                            รายละเอียดเพิ่มเติม :{item.product.detail}
                          </div>
                          <p class="text-md font-bold">
                            {" "}
                            การสั่งตัดผ้าม่าน : {item.type}
                          </p>
                          <p class="text-md font-bold">
                            {" "}
                            ราคา/หลา : {item.product.price}{" "}
                          </p>
                          <p class="text-md font-bold">
                            {" "}
                            ขนาด : {item.width} x {item.height} เซนติเมตร{" "}
                          </p>
                          <p class="text-md font-bold">
                            จำนวน : {item.count} หลา{" "}
                          </p>
                          <p class="text-md font-bold">
                            รวม : {item.product.price * item.count} บาท{" "}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <p class="mt-8 text-2xl text-b-font">เลือกการขนส่ง</p>
              {deliveryOptions.map((option) => (
                <div key={option.id} className="relative mt-4">
                  <input
                    className="peer hidden"
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
                    <img
                      className="w-14 object-contain"
                      src="/images/naorrAeygcJzX0SyNI4Y0.png"
                      alt=""
                    />
                    <div className="ml-5">
                      <span className="mt-2 font-semibold">{option.title}</span>
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
                className="mb-2 rounded-lg"
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
                  className=" mt-2 mb-3 px-4 py-2 rounded-lg text-base  text-gray-900 hover:text-gray-600"
                >
                  เพิ่มที่อยู่ใหม่ ->
                </Link>
              </p>

              <p class="text-2xl font-medium">ข้อมูลการชำระเงิน</p>
              <p class=" text-gray-1000">รายละเอียดการชำระเงินของท่าน</p>
              {currentOrder.map((order) => (
                <div key={order._item}>
                  <div class="mt-6 border-t border-b py-2">
                    <div class="flex-col items-center justify-between">
                      {order.products.map((item) => (
                        <div key={item._id}>
                          <p className="ml-10 font-semibold text-lg text-gray-900 my-2">
                            {item.product.name} ขนาด {item.width} x{" "}
                            {item.height} เซนติเมตร x {item.count} ={" "}
                            {item.product.price * item.count}
                          </p>
                        </div>
                      ))}
                      <p class="mt-4 text-lg font-medium text-gray-900">
                        {" "}
                        ราคารวม : {order.totalPrice} บาท{" "}
                      </p>
                    </div>

                    <div class="flex items-center justify-between">
                      <p class="text-lg font-medium text-gray-900">ค่าจัดส่ง</p>
                      <p class="font-semibold text-lg text-gray-900">200</p>
                    </div>
                  </div>
                  <div class="mt-6 flex items-center justify-between">
                    <p class="text-lg font-medium text-gray-900">
                      ราคารวมทั้งหมด
                    </p>
                    <p class="text-lg font-semibold text-gray-900">
                      {order.totalPrice + 200} บาท
                    </p>
                  </div>
                  <button
                    value="save"
                    type="submit"
                    class="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
                    onClick={() => handlePaymentOrder(order._id)}
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
