import React from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import blackout from "../img/products/blackout.jpeg";
import Footer from "../Footer";
import ProductDetail from "./ProductDetail";
import r6 from "../img/r6.jpg";

function CheckOrdeerPage() {
  return (
    <>
      {" "}
      <div className="h-screen w-full bg-gradient-to-r from-5% from-white via-50% via-brown-bg to-90% to-white">
        <Navbar></Navbar>

        <div class="titlea bg-brown-bg py-1 shadow-md">
          <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
          <h5 className=" inline-block text-lg md:text-xl xl:text-3xl text-b-font  pl-4 p-2 my-1">
            ยืนยันคำสั่งซื้อ
          </h5>
        </div>
        <div class="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
          <div class="px-4 pt-8">
            <p class="text-2xl text-b-font">ข้อมูลคำสั่งซื้อ</p>
            <p class="text-gray-400">กรุณาตรวจสอบรายการสินค้าของคุณ</p>
            <div class="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
              <div class="flex flex-col rounded-lg bg-white sm:flex-row">
                <img class="m-5 h-50 w-40 rounded-md border object-cover object-center" src={r6} alt="" />
                <div class="flex w-full flex-col px-4 py-4">
                  <span class="font-semibold">AN-13</span>
                  <span class="float-right text-gray-600">ความกว้าง : 280 ซม.</span>
                  <span class="float-right text-gray-600">ความยาว : 300 ซม.</span>
                  <span class="float-right text-gray-600">รหัสสี : Black</span>
                  <span class="float-right text-gray-600">ผ้าม่านที่สั่งตัด : ม่านจีบ</span>
                  <span class="float-right text-gray-600">รายละเอียดเพิ่มเติม : อยากให้ผ้าม่านมีความยาวลงมาปิดพื้นพอดี แล้วก็อยากให้มีอะไรมาปิดรางผ้าม่าน </span>
                  <p class="text-lg font-bold">800 บาท</p>
                </div>
              </div>
              <div class="flex flex-col rounded-lg bg-white sm:flex-row">
                <img class="m-5 h-50 w-40 rounded-md border object-cover object-center" src={r6} alt="" />
                <div class="flex w-full flex-col px-4 py-4">
                  <span class="font-semibold">AN-14</span>
                  <span class="float-right text-gray-600">ความกว้าง : 1200 ซม.</span>
                  <span class="float-right text-gray-600">ความยาว : 1500 ซม.</span>
                  <span class="float-right text-gray-600">รหัสสี : #25565</span>
                  <span class="float-right text-gray-600">ผ้าม่านที่สั่งตัด : ม่านตาไก่</span>
                  <span class="float-right text-gray-600">รายละเอียดเพิ่มเติม : glglgl</span>
                  <p class="text-lg font-bold">900 บาท</p>
                </div>
              </div>
              <div class="flex flex-col rounded-lg bg-white sm:flex-row">
                <img class="m-5 h-50 w-40 rounded-md border object-cover object-center" src={r6} alt="" />
                <div class="flex w-full flex-col px-4 py-4">
                  <span class="font-semibold">AN-15</span>
                  <span class="float-right text-gray-600">ความกว้าง : 400 ซม.</span>
                  <span class="float-right text-gray-600">ความยาว : 800 ซม.</span>
                  <span class="float-right text-gray-600">รหัสสี : #5525</span>
                  <span class="float-right text-gray-600">ผ้าม่านที่สั่งตัด : ม่านลอน</span>
                  <span class="float-right text-gray-600">รายละเอียดเพิ่มเติม : glglgl</span>
                  <p class="text-lg font-bold">1000 บาท</p>
                </div>
              </div>
            </div>
            

            <p class="mt-8 text-2xl text-b-font">เลือกการขนส่ง</p>
            <form class="mt-5 grid gap-6">
              <div class="relative">
                <input class="peer hidden" id="radio_1" type="radio" name="radio" checked />
                <span class="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                <label class="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4" for="radio_1">
                  <img class="w-14 object-contain" src="/images/naorrAeygcJzX0SyNI4Y0.png" alt="" />
                  <div class="ml-5">
                    <span class="mt-2 font-semibold">ทางร้านขนส่งพร้อมติดตั้ง</span>
                    <p class="text-slate-500 text-sm leading-6">ระยะเวลา: 7-14 วัน</p>
                  </div>
                </label>
              </div>
              <div class="relative">
                <input class="peer hidden" id="radio_2" type="radio" name="radio" checked />
                <span class="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                <label class="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4" for="radio_2">
                  <img class="w-14 object-contain" src="/images/oG8xsl3xsOkwkMsrLGKM4.png" alt="" />
                  <div class="ml-5">
                    <span class="mt-2 font-semibold">จัดส่งสินค้าทางขนส่ง</span>
                    <p class="text-slate-500 text-sm leading-6">ระยะเวลา: 7-14 วัน</p>
                  </div>
                </label>
              </div>
            </form>
          </div>
          <div class="bg-brown-blog mt-10  px-4 pt-8 lg:mt-0">
            <p class="text-2xl font-medium">ข้อมูลการชำระเงิน</p>
            <p class=" text-gray-1000">รายละเอียดการชำระเงินของท่าน</p>
            <div class="">

              <div class="mt-6 border-t border-b py-2">
                <div class="flex items-center justify-between">
                  <p class="text-lg font-medium text-gray-900">ราคาออเดอร์</p>
                  <p class="font-semibold text-lg text-gray-900">2000 บาท</p>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-lg font-medium text-gray-900">ค่าจัดส่ง</p>
                  <p class="font-semibold text-lg text-gray-900">200 บาท</p>
                </div>
              </div>
              <div class="mt-6 flex items-center justify-between">
                <p class="text-lg font-medium text-gray-900">ราคารวมทั้งหมด</p>
                <p class="text-lg font-semibold text-gray-900">3000 บาท</p>
              </div>
            </div>
            <button class="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white">ยืนยันคำสั่งซื้อ</button>
          </div>
        </div>
        <div className="flex justify-center items-center ">
          <p class="p-5 xl:text-2xl text-b-font text-lg"></p>
        </div>
        <Footer></Footer>
      </div>
      
    </>
  );
}
export default CheckOrdeerPage;