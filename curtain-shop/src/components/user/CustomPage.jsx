import React, { useEffect, useState } from "react";
import { CloudinaryContext } from "cloudinary-react";
import {
  SliderPicker,
  SwatchesPicker,
  ChromePicker,
  CirclePicker,
  SketchPicker,
} from "react-color";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import productAPI from "../../services/productAPI";
import Footer from "../Footer";
import TransformedImage from "./Tranformedimage";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import _ from "lodash";

var { Alpha } = require("react-color/lib/components/common");

function CustomPage() {
  //login

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = React.useState("");
  const [idUser, setIdUser] = React.useState("");

  const { productId } = useParams();
  // console.log(productId);

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

  const [user, setUser] = React.useState({
    f_name: "",
    l_name: "",
    email: "",
    tell: "",
    address: "",
  });
  useEffect(() => {
    const authToken = localStorage.getItem("token");

    if (authToken) {
      // Set up axios default headers
      axios.defaults.headers.common["authtoken"] = authToken;

      const decodedToken = jwtDecode(authToken); // Decode the token

      if (decodedToken && decodedToken.user) {
        const { f_name, l_name } = decodedToken.user;

        const id = decodedToken.id;
        setUserName(`${f_name} ${l_name}`);
        setIdUser(`${id}`);
        console.log("addresssjhf", decodedToken.user.addres);
        setUser({
          f_name: f_name,
          l_name: l_name,
          email: decodedToken.user.email,
          tell: decodedToken.user.tell,
          address: decodedToken.user.address,
        });

        setIsLoggedIn(true);
      } else {
        setUserData(decodedToken.user);
      }

      if (
        decodedToken &&
        decodedToken.exp &&
        decodedToken.exp * 1000 < Date.now()
      ) {
        // Token expired, logout user
        handleLogoutAuto();
      }



    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogoutAuto = () => {
    // Logout user
    localStorage.removeItem("token");
    setUserName(""); // Clear user name or any other relevant state

    // Redirect to login page or perform any other action
    navigate("/"); // Redirect to login page
  };

  const handleLogout = () => {
    Swal.fire({
      title: `คุณต้องการออกจากระบบใช่หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        // ยืนยันออกจากระบบ
        localStorage.removeItem("token");
        setUserName("");

        // ใช้ useNavigate เพื่อนำผู้ใช้กลับไปยังหน้าหลัก
        navigate("/"); // ลิงก์ไปยังหน้าหลัก
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/product/${productId}`
        );
        const productData = res.data;
        // console.log("Product Data:", productData); // ให้ดูค่า productData ที่ได้รับมา
        //ถ้าเจอ
        if (productData) {
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
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [productId]);


  //login
  const [selectedType, setSelectedType] = useState("");

  const handleRadioChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleAddToCart = (data) => {
    console.log("data in ", data);

    let cart = [];

    // ตรวจสอบค่า localStorage.getItem('cart')
    const cartFromStorage = localStorage.getItem("cart");
    console.log("localStorage.getItem('cart'):", cartFromStorage);

  
    try {
      // พยายามแปลงข้อมูลใน localStorage เป็น JSON object
      if (cartFromStorage) {
          cart = JSON.parse(cartFromStorage);
      }
  } catch (error) {
      console.error("Error parsing JSON:", error);
      // กรณีที่เกิดข้อผิดพลาดในการแปลง JSON
      // ลบข้อมูลที่ไม่ถูกต้องออกจาก localStorage
      localStorage.removeItem("cart");
  }
    
    console.log("cart before push:", cart);

    const productData = {
      productId: data.productId,
      brand: data.brand,
      p_type: data.p_type,
      name: data.name,
      color: data.color,
      detail: data.detail,
      price: data.price,
      image: data.image,
    };
    console.log("p data : ", productData);

    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    
    // ตรวจสอบค่าของ cart ก่อนที่จะ push ข้อมูลเข้าไป
    console.log("cart before push:", cart);

    cart.push({
      ...productData,
      count: 1,
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    // ตรวจสอบค่า cart หลังจาก push ข้อมูลเข้าไป
    console.log("cart after push:", cart);
};


  // ตัวอย่างการเรียกใช้
  // const data = { /* ข้อมูลของสินค้า */ };
  // handleAddToCart(data); // ส่งข้อมูล data เข้าไปในฟังก์ชัน handleAddToCart

  const default_product = {
    id: 1,
    main: "test2_ocvii1",
  };

  // const index = "curtain-";
  // const [curtain, setCurtain] = useState([
  //   default_product,
  //   { id: 2, main: "test1_gvyquf" },
  //   { id: 3, main: "curtain_fev3fs" },
  // ]);

  const [selectedCurtain, setSelectedCurtain] = useState(default_product);

  const [background, setBackground] = useState({
    rgb: { r: 160, g: 25, b: 25 },
  });

  const [currentColor, setCurrentColor] = useState("#3D3D44");
  const appStyle = {
    height: "100vh",
    color: "white",
    backgroundColor: currentColor.hex,
    transition: "ease all 300ms",
  };

  const selectProduct = (productThumbail) => {
    selectedCurtain(productThumbail);
  };

  const changeProductColor = (color) => {
    setBackground(color);
  };

  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await productAPI.getProductTypePolyester();
        setProduct(productData);
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล", err);
      }
    };
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    fetchData();
    return () => clearInterval(interval);
  }, []);

  const images = [
    "curtain-1.jpg",
    "curtain-2.jpg",
    "curtain-3.jpg",
    "curtain-4.jpg",
    "curtain-5.jpg",
    "curtain-6.jpg",
    "curtain-7.jpg",
    "curtain-8.jpg",
  ];
  const curtainNames = [
    "ม่านจีบ",
    "ม่านพับ",
    "ม่านตาไก่",
    "ม่านลอน",
    "ม่านลอน",
    "ม่านหลุยส์",
    "ม่านหลุยส์",
    "ม่านหลุยส์",
    "ม่านหลุยส์",
  ];

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        userName={userName}
      ></Navbar>
      <div class="titlea bg-brown-bg  w-full  h-full py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
          ออกแบบผ้าม่านของคุณ
        </h5>
      </div>

      <div className="flex flex-nowrap overflow-x-auto max-w-screen">
        {product.map((product) => (
          <div key={product._id} className="p-2">
            <div className="rounded-lg w-[200px] shadow-3xl hover:shadow-2xl h-auto md:h-full flex-col md:pb-2 bg-white ">
              <div className="relative ">
                <img
                  className="w-full rounded-t-lg bg-contain bg-center"
                  src={`${process.env.REACT_APP_API}/images/${product.image}`}
                  alt="product"
                />
                <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>
                <div className="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                  {product.name}
                </div>
              </div>
              <Link
                to="/product-detail"
                className="pl-5 mt-3 text-brown-500 text-sm md:base hover:text-browntop inline-flex items-center"
              >
                อ่านพิ่มเติม
                <HiOutlineArrowSmRight />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center">
        <div className="flex p-11">
          <img
            className="w-[300px] rounded shadow-xl "
            src={`${process.env.REACT_APP_API}/images/${data.image}`}
            alt="product"
          />
          <CloudinaryContext
            cloudName="dwmpdaqqh"
            className="w-[400px] hover:w-[450px]"
          >
            <div className="image__container">
              <div className="image">
                <TransformedImage
                  rgb={background.rgb}
                  selectedCurtain={selectedCurtain}
                />
              </div>
            </div>
          </CloudinaryContext>
        </div>
      </div>

      <div className="flex flex-row mb-10">
        <div className="basis-1/3">
          <p className="text-gray-700 md:text-base mt-4 pl-5">
            ต้องการสั่งตัดผ้าม่านแบบใด
          </p>

          {["ม่านจีบ", "ม่านพับ", "ม่านตาไก่", "ม่านลอน", "ม่านหลุยส์"].map(
            (type) => (
              <div
                key={type}
                className="basis-1/3 text-browntop text-lg mt-2 ml-10 mb-2"
              >
                <input
                  className="ml-2"
                  type="radio"
                  id={type}
                  name="selectedType"
                  value={type}
                  checked={selectedType === type}
                  onChange={handleRadioChange}
                />
                <label className="ml-2" htmlFor={type}>
                  {type}
                </label>
              </div>
            )
          )}

          <p className="text-gray-700 md:text-base mt-4 pl-5">
            ** หากเป็นม่านหลุยด์แนะนำให้สอบถามลายระเอียดเพิ่มเติม
          </p>
        </div>
        <div className="w-3/5 flex flex-nowrap overflow-x-auto">
          {images.map((image, index) => (
            <div key={index} className="p-2">
              <div className="rounded-lg shadow-3xl hover:shadow-2xl md:h-full flex-col md:pb-2 bg-white">
                <div className="relative h-[280px] w-[340px]">
                  <img
                    className="w-auto h-full object-cover rounded-t-lg bg-contain bg-center"
                    src={require(`../img/type-cut/${image}`)}
                    alt="type"
                  />
                  <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25 rounded-t-lg "></div>
                  <div className="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                    {curtainNames[index]}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="justify-center items-center test-center">
        {" "}
        <p className="mt-4 mb-4 text-base text-center text-brown-400">
          ราคาสินค้าต่อหลา : {data.price}
        </p>
      </div>

      <div className="flex justify-center w-full">
        <div>
          <p className="mt-4 ml-5 text-sm text-brown-400">กว้าง</p>
          <input class="appearance-none  rounded w-[150px] py-2 px-3 ml-2 my-2  text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div>
          <p className="mt-4 text-sm ml-5 text-brown-400">ยาว</p>
          <input class="appearance-none  rounded w-[150px] py-2 px-3 ml-2 my-2  text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => handleAddToCart(data)}
          // onClick={handleAddToCart}
          className=" mt-10  mb-3 px-4 py-2 rounded-lg inline-block text-base bg-brown-200 hover:bg-browntop hover:shadow-xl text-white focus:outline-none focus:shadow-outline"
          // onClick={() => handleAddToCart(data)}
        >
          เพิ่มลงลงตระกร้าสินค้า
        </button>
      </div>
      <Footer></Footer>
    </>
  );
}

export default CustomPage;
