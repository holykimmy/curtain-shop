import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const SwitchButton = ({ role, idUser }) => {
  const [isOn, setIsOn] = useState(role);

  const toggleSwitch = () => {
    if(role === "user"){
      role = !isOn
    }
    setIsOn(role);

    // แสดง SweetAlert2 สำหรับการยืนยัน
    Swal.fire({
      title: `ยืนยันการเปลี่ยนแปลงสถานะ`,
      text: `คุณต้องการเปลี่ยนสถานะเป็น ${role ? 'admin' : 'ไม่มีสินค้าในร้านค้า'} ใช่หรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ไม่ใช่',
    }).then((result) => {
      if (result.isConfirmed) {
        // ส่งข้อมูลการเปลี่ยนแปลงไปยังเซิร์ฟเวอร์
        console.log("id",idUser);
        console.log(role);
        axios.put(`${process.env.REACT_APP_API}/customer/update-role/${idUser}`, { role: role })
          .then(response => {
            Swal.fire({
              title: 'เปลี่ยนแปลงสถานะสำเร็จ',
              icon: 'success',
            });
          })
          .catch(error => {
            console.error('Error updating visibility:', error);
            Swal.fire({
              title: 'มีข้อผิดพลาด',
              text: 'เกิดข้อผิดพลาดในการเปลี่ยนแปลงสถานะ',
              icon: 'error',
            });
            setIsOn(!role);
          });
      } else {
        
        setIsOn(!role); // ย้อนกลับการเปลี่ยนแปลงในสถานะ UI
      }
    });
  };

  return (
    <div className="flex justify-start">
      <button
        className={`${
          isOn ? 'bg-green-500' : 'bg-gray-300'
        } sm:w-12 sm:h-7 md:w-14 md:h-8 rounded-full p-1 transition-colors duration-300 ease-in-out`}
        onClick={toggleSwitch}
      >
        <span
          className={`${
            isOn ? 'translate-x-3' : 'translate-x-0'
          } inline-block sm:w-4 sm:h-4 md:w-6 md:h-6 rounded-full  bg-white shadow-md transform transition-transform duration-300 ease-in-out`}
        />
      </button>
      <span className={`ml-5 sm:text-sm md:text-base  ${isOn ? 'text-green-500' : 'text-gray-700'}`}>
        {isOn ? 'ใช้งานได้' : 'ปิดการใช้งาน'}
      </span>
    </div>
  );
};

export default SwitchButton;
