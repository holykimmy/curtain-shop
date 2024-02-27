import React, { useState, useEffect } from "react";
import { SliderPicker, SketchPicker, SwatchesPicker } from "react-color";
import { Link, useParams, useLocation } from "react-router-dom";
import Navbaradmin from "./Navbaradmin";
import Swal from "sweetalert2";
import categoryAPI from "../../services/categoryAPI";
import productAPI from "../../services/productAPI";
import axios from "axios";

function UpdateProductPage() {
  const { productId } = useParams();

  const [data, setData] = useState({
    productId: productId,
    brand: "",
    p_type: "",
    name: "",
    color: "",
    detail: "",
    price: "",
    image: "",
  });

  const [form, setForm] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [brandOptions, setBrandOptions] = useState([]);
  const [pTypeOptions, setPTypeOptions] = useState([]);
  const [price, setPrice] = useState("");
  const [selectedBrandSlug, setSelectedBrandSlug] = useState("");

  const { brand, p_type, name, color, detail } = data;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/product/${productId}`
        );
        const productData = res.data;
        console.log("Product Data:", productData); // ให้ดูค่า productData ที่ได้รับมา
        if (productData) {

            // เรียกใช้ฟังก์ชันเพื่อดึงประเภทสินค้า
        // fetchBrands(productData.brand);
       
        fetchPTypeOptions(productData.brand);

          setData({
            ...data,
            brand: productData.brand,
            p_type: productData.p_type,
            name: productData.name,
            color: productData.color,
            detail: productData.detail,
            price: productData.price,
            image: productData.image,
          });
        }
        console.log("Product Data:", data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [productId]);
  
  const fetchBrands = async () => {
    try {
      const brandOptions = await categoryAPI.getAllBrands();
      console.log("brandoption", brandOptions);
      setBrandOptions(brandOptions);
    } catch (error) {
      console.error("Error fetching all brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
    const intervalId = setInterval(fetchBrands, 500000); //refresh
    return () => clearInterval(intervalId);
  }, []);

  const fetchPTypeOptions = (selectedBrandSlug) => {
    categoryAPI
      .getTypeOf(selectedBrandSlug) // ปรับให้ใช้ API getTypeOfPs และส่ง selectedBrandSlug เข้าไป
      .then((result) => {
        setPTypeOptions(result.p_type); // กำหนดค่า pTypeOptions จากข้อมูลที่ได้จาก API
        setData((prevState) => ({
          ...prevState,
          brand: result.brand,
          p_type: "", // รีเซ็ต p_type เมื่อเลือก brand ใหม่
        }));
      })
      .catch((error) => {
        console.error("Error fetching p_type options:", error);
      });
  };

  const handleBrandChange = (event) => {
    const selectedBrandSlug = event.target.value;
    const selectedBrand = brandOptions.find(
      (brand) => brand.slug === selectedBrandSlug
    );
    console.log("selectedbrand", selectedBrandSlug.brand);
    if (selectedBrand) {
      // ตรวจสอบว่า selectedBrand ไม่เป็น undefined
      setData((prevState) => ({
        ...prevState,
        brand: selectedBrand.brand,
        // slug: selectedBrand.slug,
        // brand: selectedBrand ? selectedBrand.brand : "", // Use selected brand's name if available, otherwise set to empty string
        p_type: "", // Reset p_type when brand changes
      }));
      console.log("selectslug",selectedBrand.slug);
      fetchPTypeOptions(selectedBrandSlug);
    }
  };
  const inputValue = (name) => (event) => {
    const value = event.target.value;
    console.log(name, "=", value);
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleColorChange = (selectedColor) => {
    setData((prevState) => ({
      ...prevState,
      color: selectedColor.hex,
    }));
  };

  const handlePriceChange = (event) => {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/^0+/, "");
    const numericValue = Math.abs(Number(inputValue));

    setData((prevState) => ({
      ...prevState,
      price: numericValue,
    }));
  };


  const handleFileSelection = (e) => {
    const image = e.target.files[0];
    setImage(image); // อัปเดตค่าไฟล์ใหม่

    // แสดงตัวอย่างรูปภาพ
    const previewURL = URL.createObjectURL(image);
    setImagePreview(previewURL);
  };

  const buttonStyle = {
    backgroundColor: color || "transparent",
  };

  const submitForm = (e, productId, data, image) => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData();
    formData.append("brand", data.brand);
    formData.append("p_type", data.p_type);
    formData.append("name", data.name);
    formData.append("color", data.color);
    formData.append("detail", data.detail);
    formData.append("price", data.price);
    if (image) {
      formData.append("image", image);
    }
    console.log("formData:");
    console.log(formData.get("brand"));
    console.log(formData.get("p_type"));
    console.log(formData.get("name"));
    console.log(formData.get("color"));
    console.log(formData.get("detail"));
    console.log(formData.get("price"));
    console.log(formData.get("image")); 
    console.log("endl");

    // Call the update function with formData
    update(e, productId, formData);
    
  };

  const update = async (e, productId, formData) => {
    // Pass formData as an argument
    e.preventDefault();
    try {
      const response = await productAPI.updateProduct(productId, formData);
      Swal.fire({
        title: "Saved",
        icon: "success",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err.response.data.error,
      });
    }
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
         onSubmit={(e) => submitForm(e, productId, data, image)}
          /* ตรวจสอบว่ามี enctype และถูกต้องหรือไม่ */
          enctype="multipart/form-data"
          class="bg-white w-[80%] items-center justify-center m-auto mb-10"
        >
          {/* {JSON.stringify(data)} */}
          <p class="text-center text-2xl text-b-font font-bold">เพิ่มสินค้า</p>
          <p className="text-gray-700 md:text-base mt-4 pl-5">แบรนด์สินค้า</p>
          <select
            className="input-group w-full data-te-select-init shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-5"
            id="brand"
            type="text"
            value={data.brand}
            onChange={handleBrandChange}
          >
            <option value={data.brand}>{data.brand}</option>
            {brandOptions.map((option) => (
              <option
                key={option.slug}
                value={option.slug}
                selected={option.brand === data.brand}
              >
                {option.brand}
              </option>
            ))}
          </select>

          <p className="text-gray-700 md:text-base mt-4 pl-5">
            ประเภทของสินค้า
          </p>
          <select
            className="input-group w-full data-te-select-init shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-5"
            id="p_type"
            type="text"
            value={data.p_type}
            onChange={inputValue("p_type")}
          >
            <option value="{data.p_type}">{data.p_type}</option>
            {pTypeOptions &&
              pTypeOptions.map((pType) => (
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
              value={data.name}
              onChange={inputValue("name")}
              placeholder="ชื่อสินค้า"
            />
          </div>
          {/* Input for file selection */}
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleFileSelection}
          />

          <div className="flex justify-center">
            {/* Image preview */}
            {imagePreview && (
              <img
                className="appearance-none border-none  mt-4 w-auto h-[350px] rounded justify-center py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                src={imagePreview}
                alt="Preview"
              />
            )}
            <img
              className="appearance-none border-none  mt-4 w-auto h-[350px] rounded justify-center py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              src={`${process.env.REACT_APP_API}/images/${data.image}`}
              alt="Preview"
            />

            <SketchPicker
              class="appearance-none border-none  m-5 rounded justify-center w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="p_color"
              color={data.color}
              onChange={handleColorChange} // Call the handler when a color is selected
            ></SketchPicker>
            <div className="h-10"></div>
            <SwatchesPicker
              class="appearance-none border-none m-5 rounded justify-center w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="p_color"
              color={data.color}
              onChange={handleColorChange} // Call the handler when a color is selected
            ></SwatchesPicker>
          </div>
          <div className="my-5 flex justify-center">
            <div
              style={buttonStyle}
              class="h-6 w-[60%] rounded-full shadow-xl inline-block  mr-2"
            ></div>
            <p className="text-gray-700 md:text-base text-center inline-block">
              {/* Display the selected color's name or hex code */}
              {color || "No color selected"}
            </p>
          </div>

          <div class="input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
            <textarea
              class="appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="p_detail"
              value={data.detail}
              onChange={inputValue("detail")}
              placeholder="รายละเอียดสินค้า"
            />
          </div>
          <div class="input-groupfle shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
            <input
              class="appearance-none border-none rounded w-[90%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="p_price"
              value={data.price}
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

export default UpdateProductPage;
