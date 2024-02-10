import React, { useEffect, useState } from "react";
import Navbaradmin from "./Navbaradmin";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import categoryAPI from "../../services/categoryAPI";
function AddBrandPage() {
  const [setState] = useState({
    brand: "",
  });
  const [data, setData] = useState([]);
  const [brand, setBrand] = useState("");

  const fetchData = async () => {
    try {
      const brands = await categoryAPI.getAllBrands();
      setData(brands);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000); //refresh
    return () => clearInterval(intervalId);
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    categoryAPI
      .createBrand(brand)
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
    const value = event.target.value;
    if (name === "brand") {
      setBrand(value);
    }
    console.log(name, "=", value);
    setData((prevState) => ({ ...prevState, [name]: value }));
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
            data.map((item) => <li key={item.brand}>{item.brand}</li>)}
        </ol>

        {/* <ol>{data.map((item) => (
            <li key={item.slug}>{item.slug}</li>))}
          </ol> */}
        {/* <li key={item.id}>{item}</li>))} */}
        <form onSubmit={submitForm} class="bg-white ">
          {/* {JSON.stringify(state)} */}
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
              class="w-full bg-b-btn hover:bg-browntop text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

export default AddBrandPage;
