import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const SwitchButtonConfirm = ({ visibility, productId }) => {
  const [isOn, setIsOn] = useState(visibility);

  const toggleSwitch = () => {
    const newVisibility = !isOn;
    setIsOn(newVisibility);

    Swal.fire({
      title: `ยืนยันการเปลี่ยนแปลงสถานะ`,
      text: `คุณต้องการเปลี่ยนสถานะเป็น ${newVisibility ? 'อนุมติคำสั่งซื้อ' : 'ไม่อนุมัติคำสั่งซื้อ'} ใช่หรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ไม่ใช่',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("id",productId);
        console.log(visibility);
        axios.put(`${process.env.REACT_APP_API}/product/update-visibility/${productId}`, { visibility: newVisibility })
          .then(response => {
            console.log('Visibility updated successfully');
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
            setIsOn(!newVisibility);
          });
      } else {
        setIsOn(!newVisibility); 
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
        {isOn ? 'อนุมติคำสั่งซื้อ' : 'ไม่อนุมัติคำสั่งซื้อ'}
      </span>
    </div>
  );
};

export default SwitchButtonConfirm;
