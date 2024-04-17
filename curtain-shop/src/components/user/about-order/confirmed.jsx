import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import customerAPI from "../../../services/customerAPI";

const Confirmed = ({ idUser }) => {
  const navigate = useNavigate();

  const [userOrder, setUserOrder] = useState([]);
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

  console.log("idUser", idUser);
  console.log("djkhfgajk;h");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const orderData = await customerAPI.getOrderById(idUser);
        const confirmOrders = orderData.filter((order) => !order.confirmed);
        setUserOrder(confirmOrders);
        setIsLoading(false);
      } catch (error) {
        console.error("error", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idUser]);

  console.log("testttt");
  console.log("order :", userOrder);

  const handleCancelOrder = async (idOrder) => {
    console.log("testtttt");
    const confirmation = await Swal.fire({
      text: "คุณแน่ใจหรือไม่ที่ต้องการยกเลิกคำสั่งซื้อนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก"
    });

    if (confirmation.isConfirmed) {
      try {
        setIsLoading(true);

        const response = await customerAPI.updateOrderEnable(idOrder, false);
        console.log(response);
        setIsLoading(false);

        await Swal.fire({
          text: "คำสั่งซื้อถูกยกเลิกสำเร็จแล้ว",
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

  const handleCheckOrder = async (idOrder) => {
    navigate(`/check-order/${idOrder}`, {});
  };

  const numberWithCommas = (x) => {
    const formattedNumber = parseFloat(x).toFixed(2);
    return formattedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
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
                      </div>
                    </div>

                    <div className="flex flex-col ">
                      <p className="text-sm text-gray-600">
                        การสั่งตัดผ้าม่าน : {item.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        ราคา/หลา : {numberWithCommas(item.product.price)} บาท
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

              <p className="text-sm sm:text-xs md:text-xs lg:text-xs xl:text-base text-brown-400 mt-1">
                ราคารวม : {numberWithCommas(order.totalPrice)} บาท
              </p>

              <div className="flex justify-between">
                <div className="flex justify-start ">
                  {/* {" "}
                  <button
                    onClick={() => handdleOrderdetail(order._id)}
                    className=" hover:text-brown-500 mx-2 py-2 px-auto  hover:text-shadow-xl text-sm sm:text-xs md:text-xs lg:text-base xl:text-base text-brown-400 mt-2 mr-4"
                  >
                    {" "}
                    ดูรายละเอียดคำสั่งซื้อ{" "}
                  </button> */}
                </div>
                <div className="flex justify-end ">
                  <button
                    className="bg-blue-400 mt-3 mx-2 py-2 px-2 rounded-lg shadow-xl hover:bg-blue-200 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-sm md:text-sm lg:text-base xl:text-base  text-white"
                    onClick={() => handleCheckOrder(order._id)}
                  >
                    ยืนยันคำสั่งซื้อ
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
export default Confirmed;
