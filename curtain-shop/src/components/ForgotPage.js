import React from "react";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate, useLocation } from "react-router-dom";
function ForgotPage() {
  const [emailf, setEmailf] = useState("");

  useEffect(() => {
    console.log("Email changed:", emailf);
  }, [emailf]);

  const handleChange = (e) => {
    setEmailf(e.target.value);
  };

  axios.defaults.withCredentials = true;

 
  const resetPassword = (emailf) => {
    console.log("test");
    console.log(emailf);
    if (!emailf) {
      Swal.fire({
        icon: "error",
        text: "กรุณากรอก email"
      });
      return; // ออกจากฟังก์ชันไปทันที
    }

    axios
      .post(`${process.env.REACT_APP_API}/customer/forgot-password`, {
        email: emailf
      })
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            text: "กรุณาตรวจสอบอีเมลของคุณเพื่อดำเนินการต่อ"
          });
        } else {
          Swal.fire({
            icon: "error",
            text: "email ไม่ถูกต้อง"
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          text: "ไม่พบ email ของคุณ"
        });
      });
  };

  return (
    <>
      <div className="w-full bg-brown-bg flex h-screen items-center justify-center">
        <div class="container bg-white p-6 rounded-[18px] w-11/12 sm:w-96 mx-auto">
          <div clasName="rounded-[18px] shadow px-8 pt-6 pb-8 mb-4  ">
            <p class="text-center text-2xl text-b-font font-bold">
              ลืมรหัสผ่าน
            </p>
            <p class="text-left text-sm text-b-font mt-4 font-bold">
              กรุณากรอก email ของคุณเพื่อทำการรีเซตรหัสผ่าน
            </p>
            <div class="flex items-center input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline  mt-2 mb-5 pl-2">
              <span class="input-group-icon ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-6 h-6 "
                >
                  <path
                    strokeLinecap="round "
                    d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25"
                  />
                </svg>
              </span>

              <input
                class="appearance-none border-none rounded w-full py-2 px-3 ml-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                type="email"
                value={emailf}
                required
                onChange={handleChange}
              />
            </div>

            <div class="flex items-center justify-center">
              <button
                class="w-full bg-stone-500 hover:bg-browntop hover:shadow-md text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => resetPassword(emailf)}
              >
                ส่ง
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ForgotPage;
