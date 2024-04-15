import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const SwitchButton = ({ visibility, productId }) => {
  const [isOn, setIsOn] = useState(visibility);

  const toggleSwitch = () => {
    const newVisibility = !isOn;
    setIsOn(newVisibility);

    // แสดง SweetAlert2 สำหรับการยืนยัน
    Swal.fire({
      title: `ยืนยันการเปลี่ยนแปลงสถานะ`,
      text: `คุณต้องการเปลี่ยนสถานะเป็น ${newVisibility ? 'มีสินค้าในร้านค้า' : 'ไม่มีสินค้าในร้านค้า'} ใช่หรือไม่?`,
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
              text: 'เปลี่ยนแปลงสถานะสำเร็จ',
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
    <div className="flex justify-start items-center">
      <button
        className={`${
          isOn ? 'bg-green-500' : 'bg-gray-300'
        } w-[72px] h-[25px] md:w-18 md:h-8 rounded-full p-1 transition-colors duration-300 ease-in-out`}
        onClick={toggleSwitch}
      >
        {/* sm:w-4 sm:h-4 */}
        <span
          className={`${
            isOn ? 'translate-x-5 md:translate-x-4' : 'translate-x-[-15px] md:translate-x-[-14px] '
          } inline-block w-[18px] h-[18px] md:w-6 md:h-6 rounded-full  bg-white shadow-md transform transition-transform duration-300 ease-in-out`}
        />
      </button>
      <span className={`ml-5 text-sx md:text-base  ${isOn ? 'text-green-500' : 'text-gray-700'}`}>
        {isOn ? 'มีสินค้าในร้านค้า' : 'ไม่มีสินค้า'}
      </span>
    </div>
  );
};

export default SwitchButton;
