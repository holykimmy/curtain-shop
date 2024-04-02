import React, { useEffect, useState } from "react";
import { CloudinaryContext } from "cloudinary-react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import productAPI from "../../services/productAPI";
import Footer from "../Footer";
import TransformedImage from "./Tranformedimage";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";

function CustomPage() {
  //login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = React.useState("");
  const [idUser, setIdUser] = React.useState("");

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

  const [user, setUser] = React.useState({
    f_name: "",
    l_name: "",
    email: "",
    tell: "",
    address: "",
  });


  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    Swal.fire({
      html: "<span class='text-gray-600'>Loading...</span>",
      backdrop: `
    #ffff
  
  `,
      customClass: {
        popup: "shadow-2xl border border-gray-300", // เพิ่มเส้นขอบและกำหนดสีเทา
      },
      showConfirmButton: false, // ไม่แสดงปุ่มยืนยัน
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        if (!isLoading) {
          Swal.close();
        }
      },
    });
  }


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
        console.log("address", decodedToken.address);
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
  }, [idUser]);

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

  // Function to convert hex color to RGB
  const hexToRgb = (hexColor) => {
    const hex = hexColor.replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => {
        return r + r + g + g + b + b;
      }
    );
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  //product
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
            id: productData._id,
            brand: productData.brand,
            p_type: productData.p_type,
            name: productData.name,
            color: productData.color,
            detail: productData.detail,
            p_width: productData.p_width,
            price: productData.price,
            image: productData.image,
          });

          const rgbColor = hexToRgb(productData.color);
          setBackground(rgbColor);
          setIsLoading(false); 
          Swal.close();       
         }
      } catch (error) {
        setIsLoading(false); 
        Swal.close();
        console.error(error);
      }
    };
    fetchData();
  }, [productId]);

  //login
  const [selectedType, setSelectedType] = useState("");
  const [selectedRail, setSelectedRail] = useState("");

  const handleCustom = (productId, productName) => {
    navigate(`/custom-product/${productId}`);
  };

  const handleRadioChangeRail = (event) => {
    setSelectedRail(event.target.value);
  };

  const handleRadioChange = (event) => {
    setSelectedType(event.target.value);
  };

  //add to cart

  // const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const addToCartForGuest = ({
    selectedRail,
    selectedType,
    width,
    height,
    ...data
  }) => {
   

    let cart = [];

    const cartFromStorage = localStorage.getItem("cart");
    console.log("localStorage.getItem('cart'):", cartFromStorage);

    try {
      if (cartFromStorage) {
        cart = JSON.parse(cartFromStorage);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      // กรณีที่เกิดข้อผิดพลาดในการแปลง JSON
      // ลบข้อมูลที่ไม่ถูกต้องออกจาก localStorage
      localStorage.removeItem("cart");
    }

    console.log("data.id", data.id);

    console.log("------------data--------");
    cart.forEach((item) => {
      console.table(
        item.productId,
        item.type,
        item.rail,
        item.width,
        item.height
      );
    });
    console.log("------------end--------");
    console.table(data.id, selectedType, selectedRail, width, height);

    const existingProductIndex = cart.findIndex(
      (item) =>
        item.productId === data.id &&
        item.type === selectedType &&
        item.width === width &&
        item.height === height &&
        item.rail === selectedRail
    );

    console.log("existingProductIndex:", existingProductIndex);

    function generateCartId() {
      return Math.floor(Math.random() * 1000000); // สร้างเลขสุ่ม 6 หลักเป็น cartId
    }

    if (existingProductIndex !== -1) {
      // เพิ่มค่า count ของสินค้านี้
      cart[existingProductIndex].count++;
    } else {
      const productData = {
        productId: data.id,
        brand: data.brand,
        p_type: data.p_type,
        name: data.name,
        color: data.color,
        detail: data.detail,
        width: width,
        height: height,
        price: data.price,
        image: data.image,
        type: selectedType,
        rail: selectedRail,
        cartId: generateCartId(),
      };

      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.push({
        ...productData,
        count: 1,
      });
    }
    let unique = _.uniqWith(cart, _.isEqual);

    localStorage.setItem("cart", JSON.stringify(unique));

    dispatch({
      type: "ADD_TO_CART",
      payload: unique,
    });

    Swal.fire({
      icon: "success",
      title: "เพิ่มสินค้าในตระกร้าเรียบร้อยแล้ว",
      showConfirmButton: false,
      timer: 1500, // 1.5 วินาที
    });
  };

  console.log("--------", idUser);

  const addToCartForLoggedInUser = ({
    idUser,
    selectedRail,
    selectedType,
    width,
    height,
    ...data
  }) => {
    let cart = {};

    // ตรวจสอบค่า localStorage.getItem('cart')
    const cartFromStorage = localStorage.getItem("cart");
    console.log("localStorage.getItem('cart'):", cartFromStorage);

    try {
      if (cartFromStorage) {
        cart = JSON.parse(cartFromStorage);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
     
      localStorage.removeItem("cart");
    }

    console.log("data.id", data.id);

    console.log("------------data--------");
    if (cart[idUser]) {
      cart[idUser].forEach((item) => {
        console.table(
          item.productId,
          item.type,
          item.rail,
          item.width,
          item.height
        );
      });
    }
    console.log("------------end--------");
    console.table(data.id, selectedType, selectedRail, width, height);

    if (!cart[idUser]) {
      cart[idUser] = [];
    }

    const existingProductIndex = cart[idUser].findIndex(
      (item) =>
        item.productId === data.id &&
        item.type === selectedType &&
        item.width === width &&
        item.height === height &&
        item.rail === selectedRail
    );

    console.log("existingProductIndex:", existingProductIndex);

    function generateCartId() {
      return Math.floor(Math.random() * 1000000); // สร้างเลขสุ่ม 6 หลักเป็น cartId
    }

    if (existingProductIndex !== -1) {
      // เพิ่มค่า count ของสินค้านี้
      cart[idUser][existingProductIndex].count++;
    } else {
      const productData = {
        productId: data.id,
        brand: data.brand,
        p_type: data.p_type,
        name: data.name,
        color: data.color,
        detail: data.detail,
        width: width,
        height: height,
        price: data.price,
        image: data.image,
        type: selectedType,
        rail: selectedRail,
        cartId: generateCartId(),
        count: 1,
      };

      cart[idUser].push(productData);
    }

    let unique = {};
    for (const key in cart) {
      if (Object.hasOwnProperty.call(cart, key)) {
        unique[key] = _.uniqWith(cart[key], _.isEqual);
      }
    }

    localStorage.setItem("cart", JSON.stringify(unique));

    dispatch({
      type: "ADD_TO_CART",
      payload: unique,
    });

    Swal.fire({
      icon: "success",
      title: "เพิ่มสินค้าในตระกร้าเรียบร้อยแล้ว",
      showConfirmButton: false,
      timer: 1500, // 1.5 วินาที
    });
  };

  const handleAddToCart = ({
    selectedRail,
    selectedType,
    width,
    height,
    ...data
  }) => {
    // console.table(selectedRail, selectedType, width, height, data);

    if (!selectedType) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกประเภทของสินค้าที่ต้องการสั่งตัด",
        showConfirmButton: false,
        timer: 1500, // 1.5 วินาที
      });
      return;
    }

    if (!width || !height) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาระบุขนาดของสินค้า",
        showConfirmButton: false,
        timer: 1500, // 1.5 วินาที
      });
      return;
    }

    if (!selectedRail) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกว่าจะรับรางหรือไม่",
        showConfirmButton: false,
        timer: 1500, // 1.5 วินาที
      });
      return;
    }

    console.log("idUSer=====", idUser);
    // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบหรือไม่
    if (!isLoggedIn) {
      // กรณีที่ผู้ใช้ยังไม่ได้เข้าสู่ระบบ
      addToCartForGuest({
        idUser,
        selectedRail,
        selectedType,
        width,
        height,
        ...data,
      });
    } else {
      // กรณีที่ผู้ใช้เข้าสู่ระบบแล้ว
      addToCartForLoggedInUser({
        idUser,
        selectedRail,
        selectedType,
        width,
        height,
        ...data,
      });
    }
  };

  const default_product = {
    id: 1,
    main: "test2_ocvii1",
  };

  const index = "curtain-";
  const [curtain, setCurtain] = useState([
    default_product,
    { id: 2, main: "test1_gvyquf" },
    { id: 3, main: "curtain_fev3fs" },
  ]);

  const [selectedCurtain, setSelectedCurtain] = useState(default_product);

  const [background, setBackground] = useState(data.color);

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
  
    fetchData();
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
        idUser={idUser}
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
                  src={product.image}
                  alt="product"
                />
                <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>
                <div className="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                  {product.name}
                </div>
              </div>
              <button
                onClick={() => handleCustom(product._id, product.name)}
                className=" mt-10 mb-3 px-4 py-2 rounded-lg inline-block text-base  text-browntop focus:outline-none focus:shadow-outline"
              >
                เลือกสินค้า
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center">
        <div className="flex p-11 justify-center ">
          <img
            className="w-[200px] h-[280px] mt-[25px] rounded shadow-xl "
            src={data.image}
            alt="product"
          />
          <CloudinaryContext
            cloudName="dwmpdaqqh"
            className="w-[400px] hover:w-[450px]"
          >
            <div className="image__container">
              <div className="image">
                <TransformedImage
                  rgb={background}
                  selectedCurtain={selectedCurtain}
                />
              </div>{" "}
            </div>
          </CloudinaryContext>
          <div className="pl-10 pr-10 pt-5 ">
            <p className="text-base mx-4 my-4 text-brown-400">
              ชื่อสินค้า : {data.name}
            </p>
            <p className="text-sm my-2 text-brown-400">
              ยี่ห้อสินค้า : {data.brand}
            </p>
            <p className="text-sm my-2 text-brown-400">
              ประเภทของผ้าม่าน : {data.p_type}
            </p>
            <div
              style={{ backgroundColor: data.color }}
              className="h-7 w-[60%] text-white text-sm rounded-full shadow-xl inline-block pl-5 ml-4 mr-2"
            >
              {" "}
              {data.color}{" "}
            </div>
            <div className="text-sm mt-4 text-brown-400 whitespace-pre-wrap">
              {data.detail}
            </div>
            <p className="mt-4 text-sm text-brown-400">
              ความกว้างของหน้าผ้า : {data.p_width} เซนติเมตร
            </p>
            <p className="mt-4 text-sm text-brown-400">
              ราคาสินค้า : {data.price} บาท/หลา
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-row mb-10">
        <div className=" basis-1/3 items-center">
          <p className="text-gray-700 md:text-base mt-4 pl-5 text-center ">
            ต้องการสั่งตัดผ้าม่านแบบใด
          </p>

          {["ม่านจีบ", "ม่านพับ", "ม่านตาไก่", "ม่านลอน"].map((type) => (
            <div
              key={type}
              className=" basis-1/3 text-center  text-browntop text-lg mt-2  mb-2"
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
          ))}

          <p className="text-center text-gray-700 md:text-base mt-4 pl-5">
            ** ทางร้านมีบริการรับตัดม่านหลุดย์
          </p>
        </div>
        <div className="w-3/5 flex flex-nowrap overflow-x-auto">
          {images.map((image, index) => (
            <div key={index} className="p-2">
              <div className="rounded-lg shadow-3xl hover:shadow-2xl md:h-full flex-col md:pb-2 bg-white">
                <div className="relative h-[200px] w-[300px]">
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
          ราคาสินค้าต่อหลา : {data.price} บาท
        </p>
      </div>

      <p className="mt-4 text-center text-base text-brown-400">
        ขนาดของหน้าต่างที่ต้องการสั่งตัดผ้าม่าน{" "}
        <span>
          {" "}
          <Link
            to="/gauging-curtain"
            className=" mt-2 mb-3 px-4 py-2 rounded-lg inline-block text-base  text-brown-500 hover:text-brown-300 hover:text-lg"
            // onClick={() => handleEditProduct(product._id, product.name)}
          >
            สามารถดูวิธีการวัดขนาดของผ้าม่านได้ที่นี่
          </Link>
        </span>
      </p>

      <div className="flex justify-center w-full">
        <div>
          <p className="mt-4 ml-5 text-sm text-brown-400">กว้าง</p>
          <input
            class="appearance-none rounded w-[150px] py-2 px-3 ml-2 my-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={width}
            required
            min="0"
            onChange={(e) => setWidth(e.target.value)}
          />
        </div>
        <div>
          <p className="mt-4 text-sm ml-5 text-brown-400">ยาว</p>
          <input
            class="appearance-none  rounded w-[150px] py-2 px-3 ml-2 my-2  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={height}
            type="number"
            required
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
        <p className="  mt-14 text-sm ml-5 text-brown-400"> เซนติเมตร</p>
      </div>

      {["รับราง", "ไม่รับราง"].map((rail) => (
        <div
          key={rail}
          className=" flex-row text-center  text-browntop text-lg mt-2  mb-2"
        >
          <input
            className="ml-2"
            type="radio"
            id={rail}
            name="selectedRail"
            value={rail}
            checked={selectedRail === rail}
            onChange={handleRadioChangeRail}
          />
          <label className="ml-2" htmlFor={rail}>
            {rail}
          </label>
        </div>
      ))}

      <div className="flex justify-center">
        <button
          onClick={() =>
            handleAddToCart({
              ...data,
              width,
              height,
              selectedType,
              selectedRail,
            })
          }
          className=" mt-10  mb-3 px-4 py-2 rounded-lg inline-block text-base bg-brown-200 hover:bg-browntop hover:shadow-xl text-white focus:outline-none focus:shadow-outline"
        >
          เพิ่มลงลงตระกร้าสินค้า
        </button>
      </div>
      <Footer></Footer>
    </>
  );
}

export default CustomPage;
