import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";

const WaitForPayment = ({idUser}) => {
  const navigate = useNavigate();

  const handleDeleteAddress = async (id) => {
    // แสดง Confirm Dialog เพื่อยืนยันการลบที่อยู่
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
        const response = await axios.delete(
          `${process.env.REACT_APP_API}/customer/delete-address/${idUser}/${id}`
        );

        // ถ้าการลบสำเร็จ
        if (response.status === 200) {
          // อัปเดต UI และแสดงข้อความแจ้งเตือน
        //   setAddress(address.filter((addr) => addr.id !== id));
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
  return (
    <>
      {/* {velvetProducts.map((product) => ( */}
        <div key="" className="flex justify-center">
          <div className="flex justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <div className="pl-5 w-[60%]">
              <p className=" text-center text-md sm:text-md md:text-lg lg:text-xl xl-text-xl text-brown-400">
                Order Number : 1245675
              </p>

              <p className="text-sm sm:text-md md:text-md md:text-lg lg:text-lg text-brown-400">
                สั่งเมื่อ : 16.02.2024 T16.40PM
              </p>

              <p className="text-sm sm:text-md md:text-md md:text-lg lg:text-lg text-brown-400">
                ชื่อผู้สั่ง : พิธา สุขใจ
              </p>

              <p className="text-sm sm:text-sm md:text-md md:text-lg lg:text-lg text-brown-400">
                ราคารวม : บาท
              </p>
              <div className="mt-5"></div>
              {/* <SwitchButton
                visibility={product.visibility}
                productId={product._id}
              /> */}
            </div>
            <div>
              <div>
                <button
                  className=" bg-blue-200 py-2 px-auto w-[80px] rounded-full shadow-xl hover:bg-blue-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-md lg:text-md xl:text-md  text-white "
                //   onClick={() => handleEditProduct(product._id, product.name)}
                >
                  ดูคำสั่งซื้อ
                </button>
              </div>
              <button
                className="bg-red-300 mt-3 py-2 px-auto w-[80px] rounded-full shadow-xl hover:bg-red-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-md lg:text-md xl:text-md text-white"
                // onClick={() => handleDeleteProduct(product._id, product.name)}
              >
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
export default WaitForPayment;
