import React from "react";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMdEyeOff } from "react-icons/io";
// import "./login.css";
function LoginPage() {
  const [formData, setFormData] = useState({
    user: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  axios.defaults.withCredentials = true;

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/customer/login`,
        {
          user: formData.user,
          password: formData.password
        }
      );
      // ตรวจสอบว่าการเข้าสู่ระบบสำเร็จหรือไม่
      if (response.data.Status === "Success") {
        console.log(response.data.role);

        let intended = location.state; //redirec to path
        if (intended) {
          localStorage.setItem("token", response.data.token);
          axios.defaults.headers.common["authtoken"] = response.data.token; // Set token as a default header
          navigate("../" + intended);
        } else {
          if (response.data.role === "admin") {
            localStorage.setItem("token", response.data.token);
            axios.defaults.headers.common["authtoken"] = response.data.token; // Set token as a default header
            navigate("/dashboard");
          } else {
            localStorage.setItem("token", response.data.token);
            axios.defaults.headers.common["authtoken"] = response.data.token; // Set token as a default header
            navigate("/");
          }
        }
      } else {
        setError(
          response.data.error || "An error occurred. Please try again later."
        );
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <div className="w-full bg-brown-bg flex h-screen items-center justify-center">
        <div class="container w-11/12 sm:w-96 mx-auto">
          <form
            onSubmit={submitForm}
            class="bg-white rounded-[18px] shadow px-8 pt-6 pb-8 mb-4  "
          >
            <p class="text-center text-2xl text-b-font font-bold">
              เข้าสู่ระบบ
            </p>

            <div class="flex items-center input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-6 pl-2">
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
                id="user"
                name="user"
                type="text"
                value={formData.user}
                required
                onChange={handleChange}
                placeholder="email หรือ เบอร์โทร"
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
                value={formData.password}
                required
                onChange={handleChange}
                placeholder="Enter password"
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

          
            {error && (
              <div className="text-red-300 text-xs ml-2 mb-2 "> {error} </div>
            )}
            <div class="flex items-center justify-center">
              <button
                class="w-full bg-stone-500 hover:bg-browntop hover:shadow-md text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                value="save"
                type="submit"
              >
                เข้าสู่ระบบ
              </button>
            </div>
            <div class="flex items-center justify-center mt-1">
              <Link
                to="/forgot-password"
                class="text-sm text-b-font hover:text-b-gray"
              >
                ลืมรหัสผ่าน
              </Link>
            </div>
            <div class="flex items-center justify-center mt-8">
              <p class="text-b-gray mr-3">ยังไม่ได้ลงทะเบียน?</p>

              <Link
                to="/register"
                class="font-bold text-lg text-browntop hover:text-b-sli"
              >
                สร้างบัญชี
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default LoginPage;
