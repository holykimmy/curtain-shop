import React, { useEffect, useState } from "react";
import Navbaradmin from "./Navbaradmin";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import categoryAPI from "../../services/categoryAPI";
import axios from "axios";

function AddBrandPage() {
  const [state, setState] = useState({
    brand: ""
  });
  const [data, setData] = useState([]);
  const [brand, setBrand] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      Swal.fire({
        customClass: {
          popup: "bg-transparent"
        },
        backdrop: "rgba(255, 255, 255, 0.5)",
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false, // ห้ามคลิกภายนอกสไปน์
        allowEscapeKey: false // ห้ามใช้ปุ่ม Esc ในการปิดสไปน์
      });
    } else {
      Swal.close();
    }
  }, [isLoading]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const brands = await categoryAPI.getAllBrands();
        setData(brands);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchData(); // fetchData
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    categoryAPI
      .createBrand(brand)
      .then((response) => {
        Swal.fire({
          title: "Saved",
          icon: "success"
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          text: err.response.data.error
        });
      });
  };

  const inputValue = (name) => (event) => {
    const value = event.target.value;
    if (name === "brand") {
      setBrand(value);
    }
    console.log(name, "=", value);
  };
  const [editingItem, setEditingItem] = useState(null);
  const [editedValue, setEditedValue] = useState("");

  const handleEdit = (item) => {
    setEditingItem(item.brand);
    setEditedValue(item.brand);
  };

  const handleUpdate = (item) => {
    axios
      .put(
        `${process.env.REACT_APP_API}/category/update-brand/${item._id}`,
        { brand: editedValue } // ข้อมูล brand ใน body
      )
      .then((response) => {
        // ปรับปรุงหรือแสดงข้อมูลใหม่หลังจากอัปเดตข้อมูล
        console.log(response.data);
        // แสดง SweetAlert แจ้งเตือนเมื่อการแก้ไขสำเร็จ
        Swal.fire({
          icon: "success",
          title: "แก้ไขสำเร็จ",
          showConfirmButton: false,
          timer: 1500 // หากต้องการให้ SweetAlert หายไปโดยอัตโนมัติหลังจากเวลาที่กำหนด
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <Navbaradmin></Navbaradmin>
      <div className=" items-center justify-center mt-5 pb-5 p-10 bg-white w-[80%] m-auto">
        <p class="text-center text-xl text-b-font font-bold">
          แบรนด์สินค้าที่มีอยู่แล้ว
        </p>

        <ol>
          {Array.isArray(data) &&
            data.map((item) => (
              <li key={item.brand}>
                <div className="flex justify-between my-2">
                  <p className="flex">{item.brand}</p>
                  <button
                    className="flex shadow rounded text-white p-2 bg-sky-400 hover:bg-sky-600 hover:shadow-2xl mr-2"
                    onClick={() => handleEdit(item)}
                  >
                    แก้ไข
                  </button>
                </div>
                {editingItem === item.brand ? (
                  <div className="flex justify-start">
                    <input
                      className=" flex border shadow rounded text-gray-700"
                      type="text"
                      value={editedValue}
                      onChange={(e) => setEditedValue(e.target.value)}
                    />
                    {editingItem === item.brand ? (
                      <button
                        className=" ml-5 flex shadow rounded text-white p-2 bg-green-400 hover:bg-green-600 hover:shadow-2xl"
                        onClick={() => handleUpdate(item)}
                      >
                        ยืนยัน
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </li>
            ))}
        </ol>

        <form onSubmit={submitForm} class="bg-white ">
          <p className="text-gray-700 items-center md:text-base mt-4 pl-5">
            เพิ่ม brand สินค้า
          </p>
          <div class="input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-6">
            <input
              class="appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="p_name"
              type="text"
              value={brand}
              onChange={inputValue("brand")}
              placeholder="ชื่อ brand สินค้า"
            />
          </div>

          <div class="flex items-center justify-center">
            <button
              class="w-full bg-stone-500 hover:bg-browntop text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              value="save"
              type="submit"
            >
              ยืนยัน
            </button>
          </div>
        </form>
      </div>
      <Link
        to="/add-product"
        type="button"
        class="fixed bottom-0  flex justify-center ml-2 mb-2 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
      >
        <svg
          class="w-5 h-5 rtl:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
          />
        </svg>
        <span>กลับไป</span>
      </Link>
    </>
  );
}

export default AddBrandPage;
