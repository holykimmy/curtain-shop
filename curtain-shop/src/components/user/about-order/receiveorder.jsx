import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import customerAPI from "../../../services/customerAPI";

const ReceiveOrder = ({ idUser }) => {
  const navigate = useNavigate();

  const [userOrder, setUserOrder] = useState([]);

  console.log("idUser", idUser);
  console.log("djkhfgajk;h");

  useEffect(() => {
    const fetchData = () => {
      customerAPI
        .getOrderByIdSend(idUser)
        .then((orderData) => {
          setUserOrder(orderData);
        })
        .catch((err) => {
          console.error("error", err);
        });
    };
    fetchData();

    // Return a cleanup function to clear the interval
    return () => clearInterval();
  }, [idUser]);

  console.log(userOrder);

  const handleCancelOrder = async (idOrder) => {
    // แสดงข้อความยืนยันจากผู้ใช้ก่อนที่จะทำการยกเลิกคำสั่งซื้อ
    const confirmation = await Swal.fire({
      title: "ยืนยันการยกเลิกคำสั่งซื้อ",
      text: "คุณแน่ใจหรือไม่ที่ต้องการยกเลิกคำสั่งซื้อนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    });

    // หากผู้ใช้กดปุ่มยืนยัน
    if (confirmation.isConfirmed) {
      try {
        const response = await customerAPI.updateOrderEnable(idOrder, false);
        console.log(response); // แสดงข้อความที่ได้รับจากการอัปเดตสถานะคำสั่งซื้อ
        await Swal.fire({
          title: "ยกเลิกสำเร็จ",
          text: "คำสั่งซื้อถูกยกเลิกสำเร็จแล้ว",
          icon: "success",
        });
        window.location.reload();
      } catch (error) {
        console.error("Error cancelling order:", error);
        // ทำการจัดการข้อผิดพลาดตามที่ต้องการ
      }
    }
  };

  const handlePaymentOrder = async (idOrder) => {
    navigate(`/payment/${idOrder}`);
  };

  return (
    <>
      {userOrder.map((order) => (
        <div key={order._id} className="flex justify-center">
          <div className="flex justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <div className="pl-5 w-full">
              <p className=" text-center text-md sm:text-md md:text-lg lg:text-xl xl-text-xl text-brown-400">
                Order Number : {order._id}
              </p>

              <p className="text-sm sm:text-md md:text-md md:text-lg lg:text-lg text-brown-400">
                สั่งเมื่อ : {order.createdAt}
              </p>

              <p className="text-sm sm:text-md md:text-md md:text-lg lg:text-lg text-brown-400">
                ชื่อ : {order.orderBy.f_name} {order.orderBy.l_name}
              </p>

              <div className="flex flex-wrap justify-center">
                {order.products.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between shadow-xl w-full rounded-lg bg-white sm:flex-row mt-4 mx-4 p-5"
                  >
                    <div className="flex">
                      <img
                        className="m-5 h-40 w-30 rounded-md border object-cover object-center"
                        src={`${process.env.REACT_APP_API}/images/${item.product.image}`}
                        alt="product"
                      />
                      <div className="flex flex-col px-4 py-4 mt-4">
                        <span className="font-semibold">
                          ชื่อสินค้า : {item.product.name}
                        </span>
                        <span className="font-semibold">
                          ยี่ห้อ : {item.product.brand}
                        </span>
                        <span className="float-right text-gray-600">
                          รหัสสี : {item.product.color}
                        </span>
                        <p className="text-md font-bold">
                          ความกว้างของหน้าผ้า : {item.product.p_width}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col mt-4 mr-10">
                      <p className="text-md font-bold">
                        การสั่งตัดผ้าม่าน : {item.type}
                      </p>
                      <p className="text-md font-bold">
                        ราคา/หลา : {item.product.price} บาท
                      </p>
                      <p className="text-md font-bold">
                        ขนาด : {item.width} x {item.height} เซนติเมตร
                      </p>
                      <p className="text-md font-bold">
                        จำนวน : {item.count} หลา
                      </p>
                      <p className="text-md font-bold">
                        รวม : {item.product.price * item.count} บาท
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {order.sendAddress && (
                <p className="text-sm sm:text-sm md:text-md md:text-lg lg:text-lg text-brown-400 mt-[50px]">
                  ที่อยู่ที่ต้องจัดส่ง : {order.sendAddress.name}{" "}
                  {order.sendAddress.tell} {order.sendAddress.sub_dristri}{" "}
                  {order.sendAddress.district} {order.sendAddress.province}{" "}
                  {order.sendAddress.postcode}
                </p>
              )}

              <p className="text-sm sm:text-sm md:text-md md:text-lg lg:text-lg text-brown-400 mt-[10px]">
                ค่าจัดส่ง : {order.deliveryIs} บาท
              </p>
              <p className="text-sm sm:text-sm md:text-md md:text-lg lg:text-lg text-brown-400">
                ราคารวม : {order.totalPrice} บาท
              </p>

              <div className="flex justify-end ">
                <button
                  className=" bg-blue-200 py-2 px-auto w-[100px] rounded-full shadow-xl mx-2 hover:bg-blue-400 text-center md:mt-3 md:mb-3 md:inline-block text-base sm:text-base md:text-md lg:text-md xl:text-md  text-white "
                  onClick={() => handlePaymentOrder(order._id)}
                >
                  ดูรายละเอียดคำสั่งซื้อ
                </button>
                <button
                  className="bg-red-300 mt-3 py-2 px-auto w-[120px] rounded-full shadow-xl hover:bg-red-400 text-center md:mt-3 md:mb-3 md:inline-block text-base sm:text-base md:text-md lg:text-md xl:text-md text-white"
                  onClick={() => handleCancelOrder(order._id)}
                >
                  ได้รับคำสั่งซื้อเรียนร้อยแล้ว
                </button>

              
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
export default ReceiveOrder;
