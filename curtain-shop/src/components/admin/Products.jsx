import React, { useEffect, useState } from "react";
import Navbaradmin from "./Navbaradmin";
import { BsPinFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import blackout from "../img/products/blackout.jpeg";
import { FaTrashAlt } from "react-icons/fa";
import productAPI from "../../services/productAPI";
import Swal from "sweetalert2";
import axios from "axios";
import SwitchButton from "./switchbutton";
import { jwtDecode } from "jwt-decode";
function Products() {
  // const { productId } = useParams();
  const [velvetProducts, setVelvetProducts] = useState([]);
  const [cottonProducts, setCottonProducts] = useState([]);
  const [satinProducts, setSatinProducts] = useState([]);
  const [linenProducts, setLinenProducts] = useState([]);
  const [polyesterProducts, setPolesterProducts] = useState([]);
  const [mixedProducts, setMixedProducts] = useState([]);
  const [blackoutProducts, setBlackoutProducts] = useState([]);
  const [waveProducts, setWaveProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userName, setUserName] = React.useState("");
  const [userData, setUserData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      Swal.fire({
        customClass: {
          popup: "bg-transparent"
        },
        backdrop: "rgba(255, 255, 255, 0.7)",
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

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const searchData = await productAPI.getSearch(searchTerm);
      setSearchResults(searchData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching search results:", error);
      // แสดงข้อความผิดพลาดหรือจัดการข้อผิดพลาดตามที่ต้องการ
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    console.log("authToken", authToken);

    if (authToken) {
      // Set up axios default headers
      axios.defaults.headers.common["authtoken"] = authToken;

      const decodedToken = jwtDecode(authToken);

      if (decodedToken && decodedToken.user) {
        const { f_name, l_name } = decodedToken.user;
        setUserName(`${f_name} ${l_name}`);
      }

      if (decodedToken && decodedToken.user) {
        if (decodedToken.user.role !== "admin") {
          window.location.href = "/login";
        } else {
          setUserData(decodedToken.user);
        }
      }
    } else {
      window.location.href = "/login";

      Swal.fire(
        "Unauthorized",
        "You are not authorized to access this page",
        "error"
      );
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const velvetData = await productAPI.getProductTypeVelvet();
        setVelvetProducts(velvetData);

        const cottonData = await productAPI.getProductTypeCotton();
        setCottonProducts(cottonData);

        const satinData = await productAPI.getProductTypeSatin();
        setSatinProducts(satinData);

        const linenProducts = await productAPI.getProductTypeLinen();
        setLinenProducts(linenProducts);

        const polyesterData = await productAPI.getProductTypePolyester();
        setPolesterProducts(polyesterData);

        const mixedData = await productAPI.getProductTypeMixed();
        setMixedProducts(mixedData);

        const blackoutData = await productAPI.getProductTypeBlackout();
        setBlackoutProducts(blackoutData);

        const waveData = await productAPI.getProductTypeWave();
        setWaveProducts(waveData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleEditProduct = (productId, productName) => {
    Swal.fire({
      text: `คุณต้องการแก้ไขข้อมูลสินค้า ${productName} ใช่หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่"
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/update-product/${productId}`);
      }
    });
  };

  const handleDeleteProduct = (productId, productName) => {
    console.log(productId);
    Swal.fire({
      text: `คุณต้องการลบข้อมูลสินค้า ${productName} ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่"
    }).then((result) => {
      setIsLoading(true);

      if (result.isConfirmed) {
        productAPI
          .deleteProduct(productId)
          .then((response) => {
            setIsLoading(false);
            console.log("Product deleted successfully");
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error deleting product:", error);
            setIsLoading(false);

          });
      } else {
        // ผู้ใช้เลือกยกเลิกการลบสินค้า
        console.log("Cancelled delete operation");
      }
    });
  };

  return (
    <>
      <Navbaradmin />
      <label
        className="mx-auto mt-4 mb-4 relative bg-white min-w-sm max-w-2xl flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-2xl gap-2 shadow-xl focus-within:border-gray-300"
        for="search-bar"
      >
        <input
          id="search-bar"
          placeholder="ค้นหาข้อมูล"
          className="px-6 py-2 w-full rounded-md flex-1 outline-none bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="w-full md:w-auto px-6 py-3 bg-gray-500 border-gray-500 text-white fill-white active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-xl transition-all disabled:opacity-70 "
        >
          <div className="relative">
            <div className="flex items-center transition-all opacity-1 valid:">
              <span className="text-sm font-semibold whitespace-nowrap truncate mx-auto">
                Search
              </span>
            </div>
          </div>
        </button>
      </label>

      {searchResults.length > 0
        ? searchResults.map((product) => (
          <div key={product._id} className="flex justify-center ">
          <div className="flex flex-col items-center md:items-start jusify-center md:flex-row md:justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <img
              className=" w-[150px]  sm:w-w-[150px]  md:w-[200px] lg:w-[300px] lg:h-[400px] rounded bg-contain bg-center shadow-md"
              src={product.image}
              alt="product"
            />

            <div className="pl-5 md:w-[58%] mt-2">
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                ชื่อสินค้า : {product.name}
              </p>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                แบรนด์สินค้า : {product.brand}
              </p>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                ประเภทของผ้าม่าน : {product.p_type}
              </p>
              <div
                style={{ backgroundColor: product.color }}
                className="m-2 text-center flex items-center text-xs sm:text-sm lg:text-base xl:text-base h-7 w-[60%] text-white rounded-full shadow-xl "
              >
                {" "}
                <p className="items-center mx-auto ">{product.color}</p>
              </div>
              <div className="text-xs md:text-sm lg:text-base xl-text-lg text-brown-400 whitespace-pre-wrap">
                รายละเอียดสินค้า : {product.detail}
              </div>
              <div className="text-sm sm:text-sm md:text-base lg:text-md xl-text-lg text-brown-400 whitespace-pre-wrap">
                ความกว้างของหน้าผ้า : {product.p_width} เซนติเมตร{" "}
              </div>

              <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                ราคา : {product.price} บาท
              </p>
              <div className="mt-5"></div>
              <SwitchButton
                visibility={product.visibility}
                productId={product._id}
              />
            </div>
           
              <div className="flex-row justify-center items-center md:flex-col md:mt-0 mt-10 ">
                <button
                  className=" bg-blue-300 mt-3 m-2 py-2 px-auto w-[80px] md:w-full rounded-lg shadow-xl hover:bg-blue-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-sm  text-white"
                  onClick={() => handleEditProduct(product._id, product.name)}
                >
                  แก้ไขข้อมูล
                </button>

                <button
                  className=" bg-red-300 mt-3 m-2 py-2 px-auto w-[80px] md:w-full rounded-lg shadow-xl hover:bg-red-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-sm text-white"
                  onClick={() => handleDeleteProduct(product._id, product.name)}
                >
                  ลบข้อมูล
                </button>
              </div>
            
          </div>
        </div>
          ))
        : ""}

      <div class="titlea bg-gray-100 py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-8 xl:h-8 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-base md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
          ผ้ากำมะหยี่ (velvet)
        </h5>
      </div>

      {velvetProducts.map((product) => (
        <div key={product._id} className="flex justify-center ">
          <div className="flex flex-col items-center md:items-start jusify-center md:flex-row md:justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <img
              className=" w-[150px]  sm:w-w-[150px]  md:w-[200px] lg:w-[300px] lg:h-[400px] rounded bg-contain bg-center shadow-md"
              src={product.image}
              alt="product"
            />

            <div className="pl-5 md:w-[58%] mt-2">
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                ชื่อสินค้า : {product.name}
              </p>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                แบรนด์สินค้า : {product.brand}
              </p>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                ประเภทของผ้าม่าน : {product.p_type}
              </p>
              <div
                style={{ backgroundColor: product.color }}
                className="m-2 text-center flex items-center text-xs sm:text-sm lg:text-base xl:text-base h-7 w-[60%] text-white rounded-full shadow-xl "
              >
                {" "}
                <p className="items-center mx-auto ">{product.color}</p>
              </div>
              <div className="text-xs md:text-sm lg:text-base xl-text-lg text-brown-400 whitespace-pre-wrap">
                รายละเอียดสินค้า : {product.detail}
              </div>
              <div className="text-sm sm:text-sm md:text-base lg:text-md xl-text-lg text-brown-400 whitespace-pre-wrap">
                ความกว้างของหน้าผ้า : {product.p_width} เซนติเมตร{" "}
              </div>

              <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                ราคา : {product.price} บาท
              </p>
              <div className="mt-5"></div>
              <SwitchButton
                visibility={product.visibility}
                productId={product._id}
              />
            </div>

            <div className="flex-row justify-center items-center md:flex-col md:mt-0 mt-10 ">
              <button
                className=" bg-blue-300 mt-3 m-2 py-2 px-auto w-[80px] md:w-full rounded-lg shadow-xl hover:bg-blue-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-sm  text-white"
                onClick={() => handleEditProduct(product._id, product.name)}
              >
                แก้ไขข้อมูล
              </button>

              <button
                className=" bg-red-300 mt-3 m-2 py-2 px-auto w-[80px] md:w-full rounded-lg shadow-xl hover:bg-red-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-sm text-white"
                onClick={() => handleDeleteProduct(product._id, product.name)}
              >
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="titlea bg-gray-100 py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-8 xl:h-8 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-base md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
          ผ้าฝ้าย (cotton)
        </h5>
      </div>

      {cottonProducts.map((product) => (
        <div key={product._id} className="flex justify-center ">
          <div className="flex flex-col items-center md:items-start jusify-center md:flex-row md:justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <img
              className=" w-[150px]  sm:w-w-[150px]  md:w-[200px] lg:w-[300px] lg:h-[400px] rounded bg-contain bg-center shadow-md"
              src={product.image}
              alt="product"
            />

            <div className="pl-5 md:w-[58%] mt-2">
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                ชื่อสินค้า : {product.name}
              </p>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                แบรนด์สินค้า : {product.brand}
              </p>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                ประเภทของผ้าม่าน : {product.p_type}
              </p>
              <div
                style={{ backgroundColor: product.color }}
                className="m-2 text-center flex items-center text-xs sm:text-sm lg:text-base xl:text-base h-7 w-[60%] text-white rounded-full shadow-xl "
              >
                {" "}
                <p className="items-center mx-auto ">{product.color}</p>
              </div>
              <div className="text-xs md:text-sm lg:text-base xl-text-lg text-brown-400 whitespace-pre-wrap">
                รายละเอียดสินค้า : {product.detail}
              </div>
              <div className="text-sm sm:text-sm md:text-base lg:text-md xl-text-lg text-brown-400 whitespace-pre-wrap">
                ความกว้างของหน้าผ้า : {product.p_width} เซนติเมตร{" "}
              </div>

              <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                ราคา : {product.price} บาท
              </p>
              <div className="mt-5"></div>
              <SwitchButton
                visibility={product.visibility}
                productId={product._id}
              />
            </div>

            <div className="flex-row justify-center items-center md:flex-col md:mt-0 mt-10 ">
              <button
                className=" bg-blue-300 mt-3 m-2 py-2 px-auto w-[80px] md:w-full rounded-lg shadow-xl hover:bg-blue-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-sm  text-white"
                onClick={() => handleEditProduct(product._id, product.name)}
              >
                แก้ไขข้อมูล
              </button>

              <button
                className=" bg-red-300 mt-3 m-2 py-2 px-auto w-[80px] md:w-full rounded-lg shadow-xl hover:bg-red-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-sm text-white"
                onClick={() => handleDeleteProduct(product._id, product.name)}
              >
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="titlea bg-gray-100 py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-8 xl:h-8 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-base md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
          ผ้าผ้าซาติน (satin)
        </h5>
      </div>
      {satinProducts.map((product) => (
        <div key={product._id} className="flex justify-center ">
          <div className="flex flex-col items-center md:items-start jusify-center md:flex-row md:justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <img
              className=" w-[150px]  sm:w-w-[150px]  md:w-[200px] lg:w-[300px] lg:h-[400px] rounded bg-contain bg-center shadow-md"
              src={product.image}
              alt="product"
            />

            <div className="pl-5 md:w-[58%] mt-2">
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                ชื่อสินค้า : {product.name}
              </p>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                แบรนด์สินค้า : {product.brand}
              </p>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                ประเภทของผ้าม่าน : {product.p_type}
              </p>
              <div
                style={{ backgroundColor: product.color }}
                className="m-2 text-center flex items-center text-xs sm:text-sm lg:text-base xl:text-base h-7 w-[60%] text-white rounded-full shadow-xl "
              >
                {" "}
                <p className="items-center mx-auto ">{product.color}</p>
              </div>
              <div className="text-xs md:text-sm lg:text-base xl-text-lg text-brown-400 whitespace-pre-wrap">
                รายละเอียดสินค้า : {product.detail}
              </div>
              <div className="text-sm sm:text-sm md:text-base lg:text-md xl-text-lg text-brown-400 whitespace-pre-wrap">
                ความกว้างของหน้าผ้า : {product.p_width} เซนติเมตร{" "}
              </div>

              <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                ราคา : {product.price} บาท
              </p>
              <div className="mt-5"></div>
              <SwitchButton
                visibility={product.visibility}
                productId={product._id}
              />
            </div>

            <div className="flex-row justify-center items-center md:flex-col md:mt-0 mt-10 ">
              <button
                className=" bg-blue-300 mt-3 m-2 py-2 px-auto w-[80px] md:w-full rounded-lg shadow-xl hover:bg-blue-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-sm  text-white"
                onClick={() => handleEditProduct(product._id, product.name)}
              >
                แก้ไขข้อมูล
              </button>

              <button
                className=" bg-red-300 mt-3 m-2 py-2 px-auto w-[80px] md:w-full rounded-lg shadow-xl hover:bg-red-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-sm text-white"
                onClick={() => handleDeleteProduct(product._id, product.name)}
              >
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      ))}

      <div class="titlea bg-gray-100 py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-8 xl:h-8 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-base md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
          ผ้าลินิน (linen)
        </h5>
      </div>

      {linenProducts.map((product) => (
        <div key={product._id} className="flex justify-center ">
          <div className="flex flex-col items-center md:items-start jusify-center md:flex-row md:justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <img
              className=" w-[150px]  sm:w-w-[150px]  md:w-[200px] lg:w-[300px] lg:h-[400px] rounded bg-contain bg-center shadow-md"
              src={product.image}
              alt="product"
            />

            <div className="pl-5 md:w-[58%] mt-2">
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                ชื่อสินค้า : {product.name}
              </p>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                แบรนด์สินค้า : {product.brand}
              </p>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                ประเภทของผ้าม่าน : {product.p_type}
              </p>
              <div
                style={{ backgroundColor: product.color }}
                className="m-2 text-center flex items-center text-xs sm:text-sm lg:text-base xl:text-base h-7 w-[60%] text-white rounded-full shadow-xl "
              >
                {" "}
                <p className="items-center mx-auto ">{product.color}</p>
              </div>
              <div className="text-xs md:text-sm lg:text-base xl-text-lg text-brown-400 whitespace-pre-wrap">
                รายละเอียดสินค้า : {product.detail}
              </div>
              <div className="text-sm sm:text-sm md:text-base lg:text-md xl-text-lg text-brown-400 whitespace-pre-wrap">
                ความกว้างของหน้าผ้า : {product.p_width} เซนติเมตร{" "}
              </div>

              <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                ราคา : {product.price} บาท
              </p>
              <div className="mt-5"></div>
              <SwitchButton
                visibility={product.visibility}
                productId={product._id}
              />
            </div>

            <div className="flex-row justify-center items-center md:flex-col md:mt-0 mt-10 ">
              <button
                className=" bg-blue-300 mt-3 m-2 py-2 px-auto w-[80px] md:w-full rounded-lg shadow-xl hover:bg-blue-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-sm  text-white"
                onClick={() => handleEditProduct(product._id, product.name)}
              >
                แก้ไขข้อมูล
              </button>

              <button
                className=" bg-red-300 mt-3 m-2 py-2 px-auto w-[80px] md:w-full rounded-lg shadow-xl hover:bg-red-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-sm text-white"
                onClick={() => handleDeleteProduct(product._id, product.name)}
              >
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="titlea bg-gray-100 py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-8 xl:h-8 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-base md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
          ผ้าใยสังเคราะห์ (polyester)
        </h5>
      </div>
      {polyesterProducts.map((product) => (
        <div key={product._id} className="flex justify-center ">
          <div className="flex flex-col items-center md:items-start jusify-center md:flex-row md:justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <img
              className=" w-[150px]  sm:w-w-[150px]  md:w-[200px] lg:w-[300px] lg:h-[400px] rounded bg-contain bg-center shadow-md"
              src={product.image}
              alt="product"
            />

            <div className="pl-5 md:w-[58%] mt-2">
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                ชื่อสินค้า : {product.name}
              </p>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                แบรนด์สินค้า : {product.brand}
              </p>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                ประเภทของผ้าม่าน : {product.p_type}
              </p>
              <div
                style={{ backgroundColor: product.color }}
                className="m-2 text-center flex items-center text-xs sm:text-sm lg:text-base xl:text-base h-7 w-[60%] text-white rounded-full shadow-xl "
              >
                {" "}
                <p className="items-center mx-auto ">{product.color}</p>
              </div>
              <div className="text-xs md:text-sm lg:text-base xl-text-lg text-brown-400 whitespace-pre-wrap">
                รายละเอียดสินค้า : {product.detail}
              </div>
              <div className="text-sm sm:text-sm md:text-base lg:text-md xl-text-lg text-brown-400 whitespace-pre-wrap">
                ความกว้างของหน้าผ้า : {product.p_width} เซนติเมตร{" "}
              </div>

              <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                ราคา : {product.price} บาท
              </p>
              <div className="mt-5"></div>
              <SwitchButton
                visibility={product.visibility}
                productId={product._id}
              />
            </div>

            <div className="flex-row justify-center items-center md:flex-col md:mt-0 mt-10 ">
              <button
                className=" bg-blue-300 mt-3 m-2 py-2 px-auto w-[80px] md:w-full rounded-lg shadow-xl hover:bg-blue-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-sm  text-white"
                onClick={() => handleEditProduct(product._id, product.name)}
              >
                แก้ไขข้อมูล
              </button>

              <button
                className=" bg-red-300 mt-3 m-2 py-2 px-auto w-[80px] md:w-full rounded-lg shadow-xl hover:bg-red-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-sm text-white"
                onClick={() => handleDeleteProduct(product._id, product.name)}
              >
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="titlea bg-gray-100 py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-8 xl:h-8 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-base md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
          ผ้าใยผสม (mixed)
        </h5>
      </div>
      {mixedProducts.map((product) => (
        <div key={product._id} className="flex justify-center ">
          <div className="flex flex-col items-center md:items-start jusify-center md:flex-row md:justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <img
              className=" w-[150px]  sm:w-w-[150px]  md:w-[200px] lg:w-[300px] lg:h-[400px] rounded bg-contain bg-center shadow-md"
              src={product.image}
              alt="product"
            />

            <div className="pl-5 md:w-[58%] mt-2">
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                ชื่อสินค้า : {product.name}
              </p>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                แบรนด์สินค้า : {product.brand}
              </p>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                ประเภทของผ้าม่าน : {product.p_type}
              </p>
              <div
                style={{ backgroundColor: product.color }}
                className="m-2 text-center flex items-center text-xs sm:text-sm lg:text-base xl:text-base h-7 w-[60%] text-white rounded-full shadow-xl "
              >
                {" "}
                <p className="items-center mx-auto ">{product.color}</p>
              </div>
              <div className="text-xs md:text-sm lg:text-base xl-text-lg text-brown-400 whitespace-pre-wrap">
                รายละเอียดสินค้า : {product.detail}
              </div>
              <div className="text-sm sm:text-sm md:text-base lg:text-md xl-text-lg text-brown-400 whitespace-pre-wrap">
                ความกว้างของหน้าผ้า : {product.p_width} เซนติเมตร{" "}
              </div>

              <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                ราคา : {product.price} บาท
              </p>
              <div className="mt-5"></div>
              <SwitchButton
                visibility={product.visibility}
                productId={product._id}
              />
            </div>

            <div className="flex-row justify-center items-center md:flex-col md:mt-0 mt-10 ">
              <button
                className=" bg-blue-300 mt-3 m-2 py-2 px-auto w-[80px] md:w-full rounded-lg shadow-xl hover:bg-blue-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-sm  text-white"
                onClick={() => handleEditProduct(product._id, product.name)}
              >
                แก้ไขข้อมูล
              </button>

              <button
                className=" bg-red-300 mt-3 m-2 py-2 px-auto w-[80px] md:w-full rounded-lg shadow-xl hover:bg-red-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-sm text-white"
                onClick={() => handleDeleteProduct(product._id, product.name)}
              >
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="titlea bg-gray-100 py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-8 xl:h-8 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-base md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
          ผ้ากันแสง (blackout)
        </h5>
      </div>
      {blackoutProducts.map((product) => (
        <div key={product._id} className="flex justify-center ">
          <div className="flex flex-col items-center md:items-start jusify-center md:flex-row md:justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <img
              className=" w-[150px]  sm:w-w-[150px]  md:w-[200px] lg:w-[300px] lg:h-[400px] rounded bg-contain bg-center shadow-md"
              src={product.image}
              alt="product"
            />

            <div className="pl-5 md:w-[58%] mt-2">
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                ชื่อสินค้า : {product.name}
              </p>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                แบรนด์สินค้า : {product.brand}
              </p>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg  text-brown-400">
                ประเภทของผ้าม่าน : {product.p_type}
              </p>
              <div
                style={{ backgroundColor: product.color }}
                className="m-2 text-center flex items-center text-xs sm:text-sm lg:text-base xl:text-base h-7 w-[60%] text-white rounded-full shadow-xl "
              >
                {" "}
                <p className="items-center mx-auto ">{product.color}</p>
              </div>
              <div className="text-xs md:text-sm lg:text-base xl-text-lg text-brown-400 whitespace-pre-wrap">
                รายละเอียดสินค้า : {product.detail}
              </div>
              <div className="text-sm sm:text-sm md:text-base lg:text-md xl-text-lg text-brown-400 whitespace-pre-wrap">
                ความกว้างของหน้าผ้า : {product.p_width} เซนติเมตร{" "}
              </div>

              <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                ราคา : {product.price} บาท
              </p>
              <div className="mt-5"></div>
              <SwitchButton
                visibility={product.visibility}
                productId={product._id}
              />
            </div>

            <div className="flex-row justify-center items-center md:flex-col md:mt-0 mt-10 ">
              <button
                className=" bg-blue-300 mt-3 m-2 py-2 px-auto w-[80px] md:w-full rounded-lg shadow-xl hover:bg-blue-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-sm  text-white"
                onClick={() => handleEditProduct(product._id, product.name)}
              >
                แก้ไขข้อมูล
              </button>

              <button
                className=" bg-red-300 mt-3 m-2 py-2 px-auto w-[80px] md:w-full rounded-lg shadow-xl hover:bg-red-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-sm text-white"
                onClick={() => handleDeleteProduct(product._id, product.name)}
              >
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Products;
