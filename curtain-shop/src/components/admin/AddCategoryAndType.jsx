import React, { useEffect, useState } from "react";
import Navbaradmin from "./Navbaradmin";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import categoryAPI from "../../services/categoryAPI";

function AddCategoryPage() {
  const [state, setState] = useState({
    brand: "",
    p_types: [],
  });
  const [data, setData] = useState([]);
  const [brand, setBrand] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      Swal.fire({
        customClass: {
          popup: "bg-transparent",
        },
        backdrop: "rgba(255, 255, 255, 0.5)",
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false, // ห้ามคลิกภายนอกสไปน์
        allowEscapeKey: false, // ห้ามใช้ปุ่ม Esc ในการปิดสไปน์
      });
    } else {
      Swal.close();
    }
  }, [isLoading]);


  

  const { p_types } = state;

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
    fetchData();
  }, []);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setState({ ...state, p_types: [...p_types, value] });
    } else {
      setState({
        ...state,
        p_types: p_types.filter((type) => type !== value),
      });
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    // Combine all selected types into a single object
    const p_typej = p_types.join(", ");
    const p_type = [p_typej];

    console.log(brand, "select", p_type);
    categoryAPI
      .createType(brand, p_type)
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
  };

  return (
    <>
      <Navbaradmin></Navbaradmin>
      <div className="w-full items-center justify-center mt-5 pb-5">
        <form
          onSubmit={submitForm}
          class="bg-white w-[70%] items-center justify-center m-auto"
        >
          {/* {JSON.stringify(state)} */}
          <p className="text-gray-700 md:text-base mt-4 pl-5">แบรนด์สินค้า</p>
          <select
            class="input-group w-full data-te-select-init shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-5"
            id="p_brand"
            type="text"
            value={brand}
            onChange={inputValue("brand")}
          >
           
            <option value="brand">เลือกแบรนด์สินค้า</option>
            {data.map((brand) => (
              <option key={brand.slug}>{brand.brand}</option>
            ))}
          </select>

          <p className="text-gray-700 md:text-base mt-4 pl-5">
            ประเภทของสินค้า
          </p>

          {[
            "ผ้ากำมะหยี่ (velvet)",
            "ผ้าฝ้าย (cotton)",
            "ผ้าผ้าซาติน (satin)",
            "ผ้าลินิน (linen)",
            "ผ้าใยสังเคราะห์ (polyester)",
            "ผ้าใยผสม (mixed)",
            "ผ้ากันแสง (blackout)",
            "ผ้าโปร่ง (sheer)"
          ].map((type) => (
            <div key={type} className="text-browntop text-lg mt-2 ml-2 mb-2 ">
              <input
                className="ml-2"
                type="checkbox"
                id={type}
                name={type}
                value={type}
                checked={p_types.includes(type)}
                onChange={handleCheckboxChange}
              />
              <label className="ml-2" htmlFor={type}>
                {type}
              </label>
            </div>
          ))}

          <div class="flex items-center justify-center">
            <button
              class="w-full bg-stone-500 hover:bg-browntop text-white font-bold py-2 px-4 mt-5 rounded focus:outline-none focus:shadow-outline"
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
        class="fixed bottom-0 flex justify-center ml-2 mb-2 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
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
