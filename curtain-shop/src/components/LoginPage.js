import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/login.css";
function LoginPage() {
  return (
    <>
    
    <div className="w-full bg-brown-bg flex h-screen items-center justify-center">
      <div class="container w-11/12 sm:w-96 mx-auto">
        <form class="bg-white rounded-[18px] shadow px-8 pt-6 pb-8 mb-4  ">
          <p class="text-center text-2xl text-b-font font-bold">เข้าสู่ระบบ</p>

          <div class="input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-6">
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
              class="appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="Enter email"
            />
          </div>

          <div class="input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </span>
            <input
              class="appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter password"
            />
          </div>

          <p class="text-red-500 text-xs italic mb-6">
            Please choose a password.
          </p>
          <div class="flex items-center justify-center">
            <button
              class="w-full bg-b-btn hover:bg-browntop text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Sign In
            </button>
          </div>
          <div class="flex items-center justify-center mt-8">
            <p class="text-b-gray mr-3">ยังไม่ได้ลงทะเบียน?</p>

            <a
              class="font-bold text-lg text-browntop hover:text-b-sli"
              href="#"
            >
              สร้างบัญชี
            </a>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
export default LoginPage;
