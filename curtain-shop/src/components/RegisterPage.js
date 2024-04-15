import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [data, setData] = useState({
    f_name: "",
    l_name: "",
    username: "",
    email: "",
    tell: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const { f_name, l_name, username, email, tell } = data;

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

  const navigate = useNavigate();

  const handleTellChange = (e) => {
    const inputNumber = e.target.value;

    if (inputNumber.length <= 10) {
      // ตรวจสอบว่า inputNumber เป็นตัวเลขและมีค่ามากกว่าหรือเท่ากับ 0 หรือไม่
      if (!isNaN(inputNumber) && Number(inputNumber) >= 0) {
        setData((prevState) => ({
          ...prevState,
          tell: inputNumber
        }));
      }
    }
  };

  const submitForm = (e) => {
    e.preventDefault();

    // ตรวจสอบว่ารหัสผ่านและยืนยันรหัสผ่านตรงกันหรือไม่
    if (password === confirmPassword) {
      // ทำการบันทึกข้อมูลหรือกระทำอื่นๆ ตามที่ต้องการ
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        Swal.fire({
          title: "Invalid Email Format",
          icon: "error"
        });
        return;
      }

      if (!/^(09|08|06|02)\d{0,8}$/.test(data.tell)) {
        Swal.fire({
          title: "Invalid Phone Number Format",
          icon: "error"
        });
        return;
      }

      console.log("Password matched. Ready to save data.");
      // console.table({ f_name, l_name, username, email, tell, password });
      console.log("API URL = ", process.env.REACT_APP_API);
      axios
        .post(`${process.env.REACT_APP_API}/customer/register`, {
          f_name,
          l_name,
          username,
          email,
          tell,
          password
        })
        .then((response) => {
          Swal.fire({
            text: "สมัครสมาชิกเสร็จสิ้น",
            icon: "success",
            showCancelButton: false,
            timer: 1500
          })
          // .then(() => {
          //   navigate("/login");
          // });
        })
        .catch((err) => {
         

          Swal.fire({
            icon: "error",
            text: err.response.data.error
          });
        });
    } else {
    
      Swal.fire({
        text: " รหัสผ่านไม่ตรงกัน ",
        icon: "error"
      });
    }
  };

  const inputValue = (name) => (event) => {
    const value = event.target.value;
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <>
      <div className=" w-full bg-brown-bg  flex h-screen items-center justify-center p-5">
        <div class="container w-11/12 sm:w-96 mx-auto ">
          <form
            onSubmit={submitForm}
            className="bg-white rounded-[18px] shadow px-8 pt-6 pb-8 mb-4  "
          >
            <p class="text-center text-2xl text-b-font font-bold">
              สมัครสมาชิก
            </p>

            <div class="flex items-center input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-6 pl-2">
              <span class="input-group-icon ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                class="appearance-none border-none rounded w-full py-2 px-3 ml-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  "
                name="f_name"
                type="text"
                value={data.f_name}
                required
                onChange={inputValue("f_name")}
                placeholder="ชื่อ"
              />
            </div>

            <div class="flex items-center input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-6 pl-2">
              <span class="input-group-icon ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                class="appearance-none border-none rounded w-full py-2 px-3 ml-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="l_name"
                type="text"
                value={data.l_name}
                required
                onChange={inputValue("l_name")}
                placeholder="นามสกุล"
              />
            </div>

            <div class="flex items-center input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-6 pl-2">
              <span class="input-group-icon ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                class="appearance-none border-none rounded w-full py-2 px-3 ml-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="username"
                type="text"
                value={data.username}
                onChange={inputValue("username")}
                required
                placeholder="ตั้ง username ของท่าน"
              />
            </div>

            <div class="flex items-center input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-6 pl-2">
              <span class="input-group-icon ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round "
                    d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25"
                  />
                </svg>
              </span>
              <input
                class="flex items-center appearance-none border-none rounded w-full py-2 px-3 ml-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="email"
                type="text"
                value={data.email}
                required
                onChange={inputValue("email")}
                placeholder="Enter email"
              />
            </div>
            {/* <p>{isValidEmail ? "Email is valid" : "Invalid email format"}</p> */}

            <div class="flex items-center input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-6 pl-2">
              <span class="input-group-icon ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                class="appearance-none border-none rounded w-full py-2 px-3 ml-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="tell"
                type="tel"
                value={data.tell}
                required
                onChange={handleTellChange}
                placeholder="Enter number"
              />
            </div>

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

            {/* Confirm Password Input */}
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
              <p className="inline-block ml-2 text-sm text-b-font">
                แสดงรหัสผ่าน
              </p>
            </div>

            {passwordMatch ? null : (
              <p className="text-red-500">รหัสผ่านไม่ตรงกัน</p>
            )}
            {error && { error }}
            {/* {passwordMatch ? null : (
              <p className="text-red-500">รหัสผ่านไม่ตรงกัน</p>
            )}
            {error && <p className="text-red-500">{error.msg}</p>} */}
            <div class="flex items-center justify-center mt-10">
              <button
                class="w-full bg-stone-500 hover:bg-browntop text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                value="save"
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default RegisterPage;
