import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import orderAPI from "../../../services/orderAPI";

const ApproveOrder = ({ idUser }) => {
  const navigate = useNavigate();
  const [userOrder, setUserOrder] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (isLoading) {
      Swal.fire({
        customClass: {
          popup: "bg-transparent"
        },
        backdrop: "rgba(255, 255, 255, 0.5)",
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
    setIsLoading(true);
    const fetchData = () => {
      orderAPI
        .getOrderApprove()
        .then((orderData) => {
          setUserOrder(orderData);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("error", err);
          setIsLoading(false);
        });
    };
    fetchData();
  }, [idUser]);

  console.log(userOrder);

  const handleCancelOrder = async (idOrder, idUser) => {
    const confirmation = await Swal.fire({
      title: "ยืนยันการยกเลิกคำสั่งซื้อ",
      text: "คุณแน่ใจหรือไม่ที่ต้องการยกเลิกคำสั่งซื้อนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก"
    });

    if (confirmation.isConfirmed) {
      navigate(`/order-cancel/${idOrder}`, {});
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const searchData = await orderAPI.searchOrderApprove(searchTerm);
      setSearchResults(searchData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setIsLoading(false);
    }
  };

  const handleApproveOrder = async (idOrder, order) => {
    const confirmation = await Swal.fire({
      text: "คุณต้องการอนุมัติคำสั่งซื้อใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ยกเลิก"
    });

    if (confirmation.isConfirmed) {
      try {
        setIsLoading(true);
        const response = await orderAPI.updateOrderApprove(
          idOrder,
          order,
          true
        );
        setIsLoading(false);
        await Swal.fire({
          text: "คำสั่งซื้อได้รับการยืนยันแล้ว",
          icon: "success"
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Error cancelling order:", error);
        setIsLoading(false);
      }
    }
  };

  const handdleOrderdetail = async (idOrder) => {
    // แสดงข้อความยืนยันจากผู้ใช้ก่อนที่จะทำการยกเลิกคำสั่งซื้อ
    const confirmation = await Swal.fire({
      text: "ดูรายละเอียดคำสั่งซื้อ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก"
    });

    // หากผู้ใช้กดปุ่มยืนยัน
    if (confirmation.isConfirmed) {
      navigate(`/order-detail-ad/${idOrder}`, {});
    }
  };
  const numberWithCommas = (x) => {
    const formattedNumber = parseFloat(x).toFixed(2);
    return formattedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <label
        className="mx-auto mt-4 mb-4 relative bg-white min-w-sm max-w-2xl flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-2xl gap-2 shadow-xl focus-within:border-gray-300"
        for="search-bar"
      >
        <input
          id="search-bar"
          placeholder="ค้นหาข้อมูล"
          className="px-6 py-2 w-full rounded-md flex-1 outline-none bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="w-full md:w-auto px-6 py-3 bg-gray-500 border-gray-500 text-white fill-white active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-xl transition-all disabled:opacity-70 "
        >
          <div className="relative">
            <div className="flex items-center transition-all opacity-1 valid:">
              <span className="text-xs whitespace-nowrap truncate mx-auto">
                Search
              </span>
            </div>
          </div>
        </button>
      </label>

      {searchResults.length > 0
        ? searchResults.map((order) => (
            <>
              <div key={order._id} className="flex justify-center">
                <div className="flex justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
                  <div className="pl-5 w-full">
                    <p className=" text-center text-sm sm:text-xs md:text-xs lg:text-base xl:text-xbasel text-brown-400">
                      Order Number : {order._id}
                    </p>

                    <p className="text-sm sm:text-xs md:text-xs lg:text-base xl:text-base text-brown-400">
                      สั่งเมื่อ : {order.createdAt}
                    </p>

                    <p className="text-sm sm:text-xs md:text-xs lg:text-base xl:text-base text-brown-400">
                      ชื่อ : {order.orderBy.f_name} {order.orderBy.l_name}
                    </p>

                    {/* <div className="flex flex-wrap justify-center py-4"> */}
                    {order.products.map((item, index) => (
                      <div
                        key={item._id}
                        className="flex flex-wrap justify-center pt-4 px-5 "
                      >
                        <div className="flex justify-between w-full bg-white flex-row sm:flex-col md:flex-row lg:flex-row  mt-1  ">
                          <div className="flex flex-col mt-4">
                            <div className="flex flex-col ">
                              <span className="text-sm text-gray-600">
                                ชื่อสินค้า : {item.product.name}
                              </span>
                              <span className="text-sm text-gray-600">
                                ยี่ห้อ : {item.product.brand}
                              </span>
                              <span className="text-sm text-gray-600">
                                รหัสสี : {item.product.color}
                              </span>
                              <p className="text-sm text-gray-600">
                                ความกว้างของหน้าผ้า : {item.product.p_width} ซม.
                              </p>
                              <p className="text-sm text-gray-600">
                                ราคา/หลา :{" "}
                                {numberWithCommas(item.product.price)} บาท
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col ">
                            <p className="text-sm text-gray-600">
                              {item.twolayer === "ทำ"
                                ? "ม่าน 2 ชั้น"
                                : "ม่านชั้นเดียว"}
                            </p>

                            <p className="text-sm text-gray-600">
                              ม่านที่สั่งตัด : {item.type}
                            </p>
                            <p className="text-sm text-gray-600">
                              เพิ่มเติม : {item.detailwd}
                            </p>

                            <p className="text-sm text-gray-600">
                              ขนาด : {item.width} x {item.height} เซนติเมตร
                            </p>
                            <p className="text-sm text-gray-600">
                              จำนวน : {item.count} หลา
                            </p>
                            <p className="text-sm text-gray-600">
                              รวม : {numberWithCommas(item.totalPiece)} บาท
                            </p>
                          </div>
                        </div>

                        {index !== order.products.length - 1 && (
                          <hr className="w-full mt-4 mb-2 border-gray-300" />
                        )}
                      </div>
                    ))}
                    {/* </div> */}

                    {order.sendAddress && (
                      <p className="text-sm sm:text-xs md:text-xs lg:text-base xl:text-base text-brown-400 mt-10">
                        ที่อยู่ที่ต้องจัดส่ง : {order.sendAddress.name}{" "}
                        {order.sendAddress.tell} {order.sendAddress.sub_dristri}{" "}
                        {order.sendAddress.district}{" "}
                        {order.sendAddress.province}{" "}
                        {order.sendAddress.postcode}
                      </p>
                    )}

                    <p className=" text-sm sm:text-xs md:text-xs lg:text-xs xl:text-base text-brown-400 mt-1 whitespace-pre-wrap">
                      การจัดส่ง : {order.deliveryIs.split("\n")[0]}
                    </p>
                    <p className="text-sm sm:text-xs md:text-xs lg:text-xs xl:text-base text-brown-400 mt-1">
                      ราคารวม : {numberWithCommas(order.totalPrice)} บาท
                    </p>
                    <p className="text-sm sm:text-xs md:text-xs lg:text-xs xl:text-base text-brown-400 mt-1">
                      สถานะ:{" "}
                      {order.approve
                        ? "ได้รับการอนุมัติแล้ว"
                        : "รอการอนุมัติจากร้านค้า"}
                    </p>
                    {order.approve ? (
                      <p className="text-sm sm:text-xs md:text-xs lg:text-base xl:text-base text-brown-400 mt-1">
                        สถานะการชำระเงิน :{" "}
                        {order.payment
                          ? order.verifypayment
                            ? "ยืนยันการชำระเงินแล้ว"
                            : "รอการยืนยันจากทางร้านค้า"
                          : "กรุณาชำระเงิน"}
                      </p>
                    ) : (
                      ""
                    )}

                    <div className="flex justify-between">
                      <div className="flex justify-start ">
                        {" "}
                        <button
                          onClick={() => handdleOrderdetail(order._id)}
                          className=" hover:text-brown-500 mx-2 py-2 px-auto  hover:text-shadow-xl text-sm sm:text-xs md:text-xs lg:text-base xl:text-base text-brown-400 mt-2 mr-4"
                        >
                          {" "}
                          ดูรายละเอียดคำสั่งซื้อ{" "}
                        </button>
                      </div>

                      <div className="flex justify-end ">
                        <button
                          className="bg-green-400 mt-3 mx-2 py-2 px-4 rounded-lg shadow-xl hover:bg-green-200 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-sm md:text-sm lg:text-base xl:text-base  text-white"
                          onClick={() => handleApproveOrder(order._id, order)}
                        >
                          อนุมัติ
                        </button>

                        <button
                          className="bg-red-300 mt-3  mx-2 py-2 px-2 rounded-lg shadow-xl hover:bg-red-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-sm md:text-sm lg:text-base xl:text-base  text-white"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          ยกเลิกคำสั่งซื้อ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>{" "}
              </div>
              <hr className="w-full mt-4 mb-2 border-gray-300" />
            </>
          ))
        : searchTerm && (
            <>
              <p className="text-sm text-gray-600">ไม่พบข้อมูล</p>
              <hr className="w-full mt-4 mb-2 border-gray-300" />
            </>
          )}
      {userOrder.map((order) => (
        <div key={order._id} className="flex justify-center">
          <div className="flex justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <div className="pl-5 w-full">
              <p className=" text-center text-sm sm:text-xs md:text-xs lg:text-base xl:text-xbasel text-brown-400">
                Order Number : {order._id}
              </p>

              <p className="text-sm sm:text-xs md:text-xs lg:text-base xl:text-base text-brown-400">
                สั่งเมื่อ : {order.createdAt}
              </p>

              <p className="text-sm sm:text-xs md:text-xs lg:text-base xl:text-base text-brown-400">
                ชื่อ : {order.orderBy.f_name} {order.orderBy.l_name}
              </p>

              {/* <div className="flex flex-wrap justify-center py-4"> */}
              {order.products.map((item, index) => (
                <div
                  key={item._id}
                  className="flex flex-wrap justify-center pt-4 px-5 "
                >
                  <div className="flex justify-between w-full bg-white flex-row sm:flex-col md:flex-row lg:flex-row  mt-1  ">
                    <div className="flex flex-col mt-4">
                      <div className="flex flex-col ">
                        <span className="text-sm text-gray-600">
                          ชื่อสินค้า : {item.product.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          ยี่ห้อ : {item.product.brand}
                        </span>
                        <span className="text-sm text-gray-600">
                          รหัสสี : {item.product.color}
                        </span>
                        <p className="text-sm text-gray-600">
                          ความกว้างของหน้าผ้า : {item.product.p_width} ซม.
                        </p>
                        <p className="text-sm text-gray-600">
                          ราคา/หลา : {numberWithCommas(item.product.price)} บาท
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col ">
                      <p className="text-sm text-gray-600">
                        {item.twolayer === "ทำ"
                          ? "ม่าน 2 ชั้น"
                          : "ม่านชั้นเดียว"}
                      </p>

                      <p className="text-sm text-gray-600">
                        ม่านที่สั่งตัด : {item.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        เพิ่มเติม : {item.detailwd}
                      </p>

                      <p className="text-sm text-gray-600">
                        ขนาด : {item.width} x {item.height} เซนติเมตร
                      </p>
                      <p className="text-sm text-gray-600">
                        จำนวน : {item.count} หลา
                      </p>
                      <p className="text-sm text-gray-600">
                        รวม : {numberWithCommas(item.totalPiece)} บาท
                      </p>
                    </div>
                  </div>

                  {index !== order.products.length - 1 && (
                    <hr className="w-full mt-4 mb-2 border-gray-300" />
                  )}
                </div>
              ))}
              {/* </div> */}

              {order.sendAddress && (
                <p className="text-sm sm:text-xs md:text-xs lg:text-base xl:text-base text-brown-400 mt-10">
                  ที่อยู่ที่ต้องจัดส่ง : {order.sendAddress.name}{" "}
                  {order.sendAddress.tell} {order.sendAddress.sub_dristri}{" "}
                  {order.sendAddress.district} {order.sendAddress.province}{" "}
                  {order.sendAddress.postcode}
                </p>
              )}

              <p className=" text-sm sm:text-xs md:text-xs lg:text-xs xl:text-base text-brown-400 mt-1 whitespace-pre-wrap">
                การจัดส่ง : {order.deliveryIs.split("\n")[0]}
              </p>
              <p className="text-sm sm:text-xs md:text-xs lg:text-xs xl:text-base text-brown-400 mt-1">
                ราคารวม : {numberWithCommas(order.totalPrice)} บาท
              </p>
              <p className="text-sm sm:text-xs md:text-xs lg:text-xs xl:text-base text-brown-400 mt-1">
                สถานะ:{" "}
                {order.approve
                  ? "ได้รับการอนุมัติแล้ว"
                  : "รอการอนุมัติจากร้านค้า"}
              </p>
              {order.approve ? (
                <p className="text-sm sm:text-xs md:text-xs lg:text-base xl:text-base text-brown-400 mt-1">
                  สถานะการชำระเงิน :{" "}
                  {order.payment
                    ? order.verifypayment
                      ? "ยืนยันการชำระเงินแล้ว"
                      : "รอการยืนยันจากทางร้านค้า"
                    : "กรุณาชำระเงิน"}
                </p>
              ) : (
                ""
              )}

              <div className="flex justify-between">
                <div className="flex justify-start ">
                  {" "}
                  <button
                    onClick={() => handdleOrderdetail(order._id)}
                    className=" hover:text-brown-500 mx-2 py-2 px-auto  hover:text-shadow-xl text-sm sm:text-xs md:text-xs lg:text-base xl:text-base text-brown-400 mt-2 mr-4"
                  >
                    {" "}
                    ดูรายละเอียดคำสั่งซื้อ{" "}
                  </button>
                </div>

                <div className="flex justify-end ">
                  <button
                    className="bg-green-400 mt-3 mx-2 py-2 px-4 rounded-lg shadow-xl hover:bg-green-200 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-sm md:text-sm lg:text-base xl:text-base  text-white"
                    onClick={() => handleApproveOrder(order._id, order)}
                  >
                    อนุมัติ
                  </button>

                  <button
                    className="bg-red-300 mt-3  mx-2 py-2 px-2 rounded-lg shadow-xl hover:bg-red-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-sm md:text-sm lg:text-base xl:text-base  text-white"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    ยกเลิกคำสั่งซื้อ
                  </button>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
      ))}
    </>
  );
};
export default ApproveOrder;
