import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const SwitchButton = ({ enable, idUser }) => {
  const [isOn, setIsOn] = useState(enable);

  const toggleSwitch = () => {
    const enable = !isOn;
    setIsOn(enable);

    // แสดง SweetAlert2 สำหรับการยืนยัน
    Swal.fire({
      title: `ยืนยันการเปลี่ยนแปลงสถานะ`,
      text: `คุณต้องการเปลี่ยนสถานะเป็น ${
        enable ? "ใช้งานได้" : "ปิดการใช้งาน"
      } ใช่หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่"
    }).then((result) => {
      if (result.isConfirmed) {
        // ส่งข้อมูลการเปลี่ยนแปลงไปยังเซิร์ฟเวอร์
        console.log("id", idUser);
        console.log(enable);
        axios
          .put(
            `${process.env.REACT_APP_API}/customer/update-enable/${idUser}`,
            { enable: enable }
          )
          .then((response) => {
            Swal.fire({
              title: "เปลี่ยนแปลงสถานะสำเร็จ",
              icon: "success"
            });
          })
          .catch((error) => {
            console.error("Error updating visibility:", error);
            Swal.fire({
              title: "มีข้อผิดพลาด",
              text: "เกิดข้อผิดพลาดในการเปลี่ยนแปลงสถานะ",
              icon: "error"
            });
            setIsOn(!enable);
          });
      } else {
        setIsOn(!enable); // ย้อนกลับการเปลี่ยนแปลงในสถานะ UI
      }
    });
  };

  return (
    <div className="flex justify-start">
      <button
       className={`${
        isOn ? 'bg-green-500' : 'bg-gray-300'
      } w-[68px] h-[25px] md:w-18 md:h-8 rounded-full p-1 transition-colors duration-300 ease-in-out`}
      onClick={toggleSwitch}
      >
        <span
          className={`${
            isOn
              ? "translate-x-5 md:translate-x-4"
              : "translate-x-[-15px] md:translate-x-[-14px] "
          } inline-block w-[18px] h-[18px] md:w-6 md:h-6 rounded-full  bg-white shadow-md transform transition-transform duration-300 ease-in-out`}
        />
      </button>
      <span
        className={`ml-5 text-sx md:text-base  ${
          isOn ? "text-green-500" : "text-gray-700"
        }`}
      >
        {isOn ? "ใช้งานได้" : "ปิดการใช้งาน"}
      </span>
    </div>
  );
};

export default SwitchButton;
