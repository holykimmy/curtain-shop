import React from "react";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate, useLocation , useParams } from "react-router-dom";
import { IoMdEyeOff } from "react-icons/io";
// import "./login.css";
function ResetPage() {

  const { idUser } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    setPasswordMatch(event.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    setPasswordMatch(event.target.value === password);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  axios.defaults.withCredentials = true;

  const resetPassword = () => {
    if (!password || !confirmPassword) {
      Swal.fire({
        icon: "error",
        text: "กรุณากรอกรหัสผ่าน"
      });
      return;
    }

    if (!passwordMatch) {
      Swal.fire({
        icon: "error",
        text: "รหัสผ่านไม่ตรงกัน"
      });
      return;
    }

    axios
      .post(`${process.env.REACT_APP_API}/customer/reset-password/${idUser}`, {
        password: password
      })
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            text: "เปลี่ยนรหัสผ่านสำเร็จ"
          });
        } else {
          Swal.fire({
            icon: "error",
            text: "มีข้อผิดพลาดเกิดขึ้น"
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          text: error.response.data.error || "มีข้อผิดพลาดเกิดขึ้น"
        });
      });
  };

  return (
    <>
      <div className="w-full bg-brown-bg flex h-screen items-center justify-center">
        <div class="container bg-white p-6 rounded-[18px] w-11/12 sm:w-96 mx-auto">
          <div clasName="rounded-[18px] shadow px-8 pt-6 pb-8 mb-4  ">
            <p class="text-center text-2xl text-b-font font-bold">
              รหัสผ่านใหม่
            </p>
            <p class="text-left text-sm text-b-font mt-4 font-bold">
              กรุณากรอกรหัสผ่านใหม่
            </p>
            <div className="flex items-center input-group shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-6 pl-2">
              <span className="input-group-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </span>
              <input
                className="ml-2 appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter password"
              />
             
            </div>
            <p class="text-left text-sm text-b-font mt-4 font-bold">
              ยืนยันรหัสผ่านอีกครั้ง
            </p>
            <div className="flex items-center input-group shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-6 pl-2">
              <span className="input-group-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 cursor-pointer"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                className="ml-2 appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm password"
              />
            </div>

            <div className="ml-2 mb-2">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={toggleShowPassword}
              />
              <p className="inline-block ml-2 text-sm text-b-font">แสดงรหัสผ่าน</p>
            </div>

            {passwordMatch ? null : (
              <p className="text-red-500">รหัสผ่านไม่ตรงกัน</p>
            )}
           

            <div class="flex items-center justify-center">
              <button
                class="w-full bg-stone-500 hover:bg-browntop hover:shadow-md text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => resetPassword()}
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
export default ResetPage;
