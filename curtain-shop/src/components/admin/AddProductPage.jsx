import React, { useState, useEffect } from "react";
import { SwatchesPicker } from "react-color";
import { Link } from "react-router-dom";
import Navbaradmin from "./Navbaradmin";
import Swal from "sweetalert2";
import categoryAPI from "../../services/categoryAPI";
import productAPI from "../../services/productAPI";
function AddProductPage() {
  // สร้าง state สำหรับเก็บข้อมูล
  const [state, setState] = useState({
    brand: "",
    p_type: "",
    name: "",
    color: "",
    detail: "",
    price: "",
  });

  const [brandOptions, setBrandOptions] = useState([]);
  const [pTypeOptions, setPTypeOptions] = useState([]);
  const [price, setPrice] = useState("");

  const { brand, p_type, name, color, detail } = state;

  const fetchBrands = async () => {
    try {
      const brandOptions = await categoryAPI.getAllBrands();
      setBrandOptions(brandOptions);
    } catch (error) {
      console.error("Error fetching all brands:", error);
    }
  };

  const fetchPTypeOptions = (selectedBrand) => {
    productAPI
      .getPTypeOptions(selectedBrand)
      .then((pTypeOptions) => {
        setPTypeOptions(pTypeOptions);
        setState((prevState) => ({
          ...prevState,
          brand: selectedBrand,
          p_type: "", // รีเซ็ต p_type เมื่อเลือก brand ใหม่
        }));
      })
      .catch((error) => {
        console.error("Error fetching p_type options:", error);
      });
  };

  useEffect(() => {
    fetchBrands()
    const intervalId = setInterval(fetchBrands, 5000); //refresh
    return () => clearInterval(intervalId);
  }, []);

  const handleBrandChange = (event) => {
    const selectedBrand = event.target.value;
    setPTypeOptions([]); // Clear p_type options when brand changes
    fetchPTypeOptions(selectedBrand);
  };

  const inputValue = (name) => (event) => {
    const value = event.target.value;
    console.log(name, "=", value);
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleColorChange = (selectedColor) => {
    setState((prevState) => ({
      ...prevState,
      color: selectedColor.hex,
    }));
  };

  const handlePriceChange = (event) => {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/^0+/, "");
    const numericValue = Math.abs(Number(inputValue));

    setPrice(numericValue);
  };

  const buttonStyle = {
    backgroundColor: color || "transparent",
  };

  const submitForm = (e) => {
    e.preventDefault();
    console.table({ brandOptions, pTypeOptions, name, color, detail, price });
    productAPI
      .createProduct(brand, p_type, name, color, detail, price)
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

  return (
    <>
      <Navbaradmin></Navbaradmin>

      <div class="w-full inline-flex justify-center items-center mt-5 pb-5">
        <Link
          to="/add-brand"
          class="bg-gray-300  hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
        >
          เพิ่มแบรนด์สินค้า
        </Link>
        <Link
          to="/add-category"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
        >
          เพิ่มประเภทผ้าม่าน
        </Link>
      </div>
      <div className="w-full items-center justify-center mt-5 pb-5">
        <form
          onSubmit={submitForm}
          class="bg-white w-[80%] items-center justify-center m-auto mb-10"
        >
          {/* {JSON.stringify(state)} */}
          <p class="text-center text-2xl text-b-font font-bold">เพิ่มสินค้า</p>
          <p className="text-gray-700 md:text-base mt-4 pl-5">แบรนด์สินค้า</p>
          <select
            class="input-group w-full data-te-select-init shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-5"
            id="p_brand"
            type="text"
            value={state.brand}
            onChange={handleBrandChange}
          >
            <option value="">เลือกแบรนด์สินค้า</option>
            {brandOptions.map((brand) => (
              <option key={brand.slug} value={brand.slug}>
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
            // multiple
            value={state.p_type}
            onChange={inputValue("p_type")}
          >
            <option value="">เลือกประเภทสินค้า</option>
            {pTypeOptions.map((pType) => (
              <option key={pType} value={pType}>
                {pType}
              </option>
            ))}
          </select>
          <div class="input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-6">
            <input
              class="appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="p_name"
              type="text"
              value={name}
              onChange={inputValue("name")}
              placeholder="ชื่อสินค้า"
            />
          </div>

          <SwatchesPicker
            class="appearance-none border-none rounded justify-center w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="p_color"
            color={color}
            onChange={handleColorChange} // Call the handler when a color is selected
          ></SwatchesPicker>
          <div className="my-5 flex justify-center">
            <div
              style={buttonStyle}
              class="h-6 w-6 rounded-full shadow-xl inline-block  mr-2"
            ></div>
            <p className="text-gray-700 md:text-base text-center inline-block">
              {/* Display the selected color's name or hex code */}
              {color || "No color selected"}
            </p>
          </div>
          <div class="input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
            <input
              class="appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="p_detail"
              type="text"
              value={detail}
              onChange={inputValue("detail")}
              placeholder="รายละเอียดสินค้า"
            />
          </div>
          <div class="input-groupfle shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
            <input
              class="appearance-none border-none rounded w-[90%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="p_price"
              value={price}
              onChange={handlePriceChange}
              type="number"
              step="0.01"
              placeholder="ราคาสินค้า"
            />
            <span className=" w-[10%] text-center text-gray-500 ml-2 m-auto p-auto ">
              บาท
            </span>
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
        to="/menu"
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

export default AddProductPage;
