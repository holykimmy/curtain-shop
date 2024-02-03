import React from "react";
import ReactDOM from "react-dom/client";
import {useEffect,useState} from "react"
import $ from 'jquery';

function AddressPage() {

  const [address, setAddress] = useState({
    houseNo: '',
    sub_district: '',
    district: '',
    province: '',
    postcode: '',

  });

  useEffect(() => {
      if (window.jQuery && window.jQuery.Thailand) {
        window.jQuery.Thailand({
          $district: window.jQuery('#sub_district'),
          $amphoe: window.jQuery('#district'),
          $province: window.jQuery('#province'),
          $zipcode: window.jQuery('#postcode'),
        });
      }
  }, []); 
   
  const submitForm = (e) => {
    e.preventDefault();
  
};

  return (
    <>
      <div className=" w-full  flex h-screen items-center justify-center bg-brown-bg ">
        <div class="container w-11/12 sm:w-96 mx-auto rounded-[18px] shadow px-8 pt-6 pb-8 mb-4 bg-white ">
          <p class="text-center text-2xl text-b-font font-bold">เพิ่มที่อยู่</p>
          <form  
          onSubmit={submitForm} 
          class="bg-white ">
            <p class="text-browntop mt-3 ml-2 ">ที่อยู่</p>
            <input
              className="m-auto mt-2 mb-3 items-center shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="houseNo"
              type="text"
              placeholder="บ้านเลขที่ 101/11 ,ซอย สุขใจ, อาคาร A ขั้น 29 , ห้อง 101"
            />
            <p class="text-browntop mt-3 ml-2 ">แขวง/ตำบล</p>
            <input
              className="m-auto mt-2 mb-3 items-center shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="sub_district"
              type="text"
              placeholder="แขวง/ตำบล"
            />

            <p class="text-browntop mt-3 ml-2 ">เขต/อำเภอ</p>
            <input
              className="m-auto mt-2 mb-3 items-center shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="district"
              type="text"
              placeholder="เขต/อำเภอ"
            />

            <p class="text-browntop mt-3 ml-2 ">จังหวัด</p>
            <input
              className="m-auto mt-2 mb-3 items-center shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="province"
              type="text"
              placeholder="จังหวัด"
            />
            <p class="text-browntop mt-3 ml-2 ">รหัสไปรษณีย์</p>
            <input
              className="m-auto mt-2 mb-3 items-center shadow appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="postcode"
              type="text"
              placeholder="10000"
            />

            <button
              class="w-full mt-3 bg-b-btn hover:bg-browntop text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              value="save"
              type="submit"
            >
              เพิ่มที่อยู่
            </button>
          </form>
        </div>
      </div>
     

    </>
  );
}
export default AddressPage;
