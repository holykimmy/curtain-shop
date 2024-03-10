import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const SwitchButtonSend = ({ visibility, productId }) => {
  const [isOn, setIsOn] = useState(visibility);

  const toggleSwitch = () => {
    const newVisibility = !isOn;
    setIsOn(newVisibility);

    // แสดง SweetAlert2 สำหรับการยืนยัน
    Swal.fire({
      title: `ยืนยันการเปลี่ยนแปลงสถานะ`,
      text: `คุณต้องการเปลี่ยนสถานะเป็น ${newVisibility ? 'จัดส่งสินค้าเรียบร้อยแล้ว' : 'ยังไม่ได้จัดส่งสินค้า'} ใช่หรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ไม่ใช่',
    }).then((result) => {
      if (result.isConfirmed) {
        // ส่งข้อมูลการเปลี่ยนแปลงไปยังเซิร์ฟเวอร์
        console.log("id",productId);
        console.log(visibility);
        axios.put(`${process.env.REACT_APP_API}/product/update-visibility/${productId}`, { visibility: newVisibility })
          .then(response => {
            console.log('Visibility updated successfully');
            // แจ้งเตือนการเปลี่ยนแปลงเสร็จสิ้น
            Swal.fire({
              title: 'เปลี่ยนแปลงสถานะสำเร็จ',
              icon: 'success',
            });
          })
          .catch(error => {
            console.error('Error updating visibility:', error);
            // แจ้งเตือนเมื่อมีข้อผิดพลาดเกิดขึ้น
            Swal.fire({
              title: 'มีข้อผิดพลาด',
              text: 'เกิดข้อผิดพลาดในการเปลี่ยนแปลงสถานะ',
              icon: 'error',
            });
            // ถ้ามีข้อผิดพลาดเกิดขึ้นในการเรียก API ให้ย้อนกลับการเปลี่ยนแปลงในสถานะ UI
            setIsOn(!newVisibility);
          });
      } else {
        // ถ้าผู้ใช้ยกเลิกการยืนยัน
        setIsOn(!newVisibility); // ย้อนกลับการเปลี่ยนแปลงในสถานะ UI
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
        {isOn ? 'จัดส่งสินค้าเรียบร้อยแล้ว' : 'ยังไม่ได้จัดส่งสินค้า'}
      </span>
    </div>
  );
};

export default SwitchButtonSend;