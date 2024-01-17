import React, { useEffect, useState } from "react";
import Navbaradmin from "./Navbaradmin";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
function AddCategoryPage() {
  const [state, setState] = useState({
    brand: "",
    p_type: "",
  });
  const [data, setData] = useState([]);
  const [brand, setBrand] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/category/brand`);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const { p_type } = state;
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    // Make an initial GET request when the component mounts
    axios
      .get(`${process.env.REACT_APP_API}/category/brand`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []); // Empty dependency array means it will only run once on mount

  //   const { brand, p_type } = state;
  const submitForm = (e) => {
    e.preventDefault();
    console.table({ brand, p_type });
    console.log("API URL = ", process.env.REACT_APP_API);
    axios
      .post(`${process.env.REACT_APP_API}/category/create-type`, {
        brand,
        p_type: p_type,
      })
      .then((response) => {
        Swal.fire({
          title: "Saved",
          icon: "success",
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          text: err.response.data.error,
        });
      });
  };

  const inputValue = (name) => (event) => {
    console.log(name, "=", event.target.value);
    if (name === "brand") {
      setBrand(event.target.value);
    } else if (name === "p_type") {
      // แก้ไขเพื่อรองรับการเลือกหลายตัวเลือก
      const selectedOptions = Array.from(
        event.target.selectedOptions,
        (option) => option.value
      );
      setState({ ...state, [name]: selectedOptions });
    }
  };

  return (
    <>
      <Navbaradmin></Navbaradmin>
      <div className="w-full items-center justify-center mt-5 pb-5">
        <form onSubmit={submitForm} class="bg-white w-[70%] items-center justify-center m-auto">
          {/* {JSON.stringify(state)} */}
          <p className="text-gray-700 md:text-base mt-4 pl-5">แบรนด์สินค้า</p>
          <select
            class="input-group w-full data-te-select-init shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-5"
            id="p_brand"
            type="text"
            value={brand}
            onChange={inputValue("brand")}
          >
            {/* {data.map((item) => (
              <option key={item.brand} value>{item.brand}</option>
            ))} */}
             <option value="brand">เลือกแบรนด์สินค้า</option>
            {data.map((brand) => (
              <option key={brand.slug} >
                {brand.brand}
              </option>
            ))}
          </select>
          <p className="text-gray-700 md:text-base mt-4 pl-5">
            ประเภทของสินค้า
          </p>
          <select
            class="input-group w-full data-te-select-init shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-5"
            id="p_type"
            type="text"
            value={p_type}
            onChange={inputValue("p_type")}
          >
            <option disabled selected value="">เลือกประเภทสินค้า</option>
            <option>ผ้ากำมะหยี่</option>
            <option>ผ้าฝ้าย</option>
            <option>ผ้าผ้าซาติน</option>
            <option>ผ้าลินิน</option>
            <option>ผ้าใยสังเคราะห์</option>
            <option>ผ้าใยผสม</option>
            <option>ผ้ากันแสง</option>
            <option>ม่านล็อกลอน</option>
          </select>

          <div class="flex items-center justify-center">
            <button
              class="w-full bg-b-btn hover:bg-browntop text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              value="save"
              type="submit"
            >
              ยืนยัน
            </button>
          </div>
        </form>
      </div>
      <Link to="/add-product"
        type="button"
        class="fixed bottom-0 w-full flex justify-center ml-2 mb-2 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
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

export default AddCategoryPage;
