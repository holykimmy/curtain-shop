import React, { useEffect, useState } from "react";
import { CloudinaryContext } from "cloudinary-react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import productAPI from "../../services/productAPI";
import typeAPI from "../../services/typeAPI";
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
  const [isLoading, setIsLoading] = useState(true);

  const { productId } = useParams();

  const [data, setData] = useState({
    productId: productId,
    brand: "",
    p_type: "",
    name: "",
    color: "",
    detail: "",
    price: "",
    image: ""
  });

  // const [data, setData] = useState({});

  const [user, setUser] = React.useState({
    f_name: "",
    l_name: "",
    email: "",
    tell: "",
    address: ""
  });
  // const [user, setUser] = React.useState({})

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
          address: decodedToken.user.address
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
      cancelButtonText: "ไม่ใช่"
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
          b: parseInt(result[3], 16)
        }
      : null;
  };

  const [types, setTypes] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const type = await typeAPI.getAllTypes();
        setTypes(type);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching all brands:", error);
      }
    };

    fetch();
  }, []);
  console.log("testtt");
  // console.table(types);

  //product
  useEffect(() => {
    setIsLoading(true);
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
            image: productData.image
          });

          const rgbColor = hexToRgb(productData.color);
          setBackground(rgbColor);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    };
    fetchData();
  }, [productId]);

  //login
  const [selectedType, setSelectedType] = useState("");
  const [pricerail, setPricerail] = useState("");
  const [selectedRail, setSelectedRail] = useState("");
  const [typeById, setTypeById] = useState("");
  const [selectedTwolayer, setSelectedTwolayer] = useState("");

  console.log("typedi", typeById, pricerail);

  const handleCustom = (productId, productName) => {
    navigate(`/custom-product/${productId}`);
  };

  const handleRadioChangeTwolayer = (event) => {
    setSelectedTwolayer(event.target.value);
  };

  const handleRadioChangeRail = (event) => {
    setSelectedRail(event.target.value);
  };

  const [bgType, setBgType] = useState("");

  const handleRadioChange = (twolayer, name, price_rail, bgimage) => {
    console.log("rin", price_rail, twolayer, bgimage);
    setSelectedType(name);
    setTypeById(twolayer);
    setPricerail(price_rail);
    setBgType(bgimage);
  };
  console.log("handch", pricerail);
  console.log("bgtype", bgType);
  //add to cart

  // const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  console.log("--------", idUser);

  const addToCartForLoggedInUser = ({
    idUser,
    selectedRail,
    selectedType,
    selectedTwolayer,
    pricerail,
    typeById,
    width,
    height,
    ...data
  }) => {
    let cart = {};

    // ตรวจสอบค่า localStorage.getItem('cart')
    const cartFromStorage = localStorage.getItem("cart");
    // console.log("localStorage.getItem('cart'):", cartFromStorage);

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
          item.twolayer,
          item.width,
          item.height
        );
      });
    }
    console.log("------------end--------");
    // console.table(
    //   data.id,
    //   selectedType,
    //   selectedRail,
    //   selectedTwolayer,
    //   width,
    //   height
    // );

    if (!cart[idUser]) {
      cart[idUser] = [];
    }

    const existingProductIndex = cart[idUser].findIndex(
      (item) =>
        item.productId === data.id &&
        item.type === selectedType &&
        item.width === width &&
        item.height === height &&
        item.rail === selectedRail &&
        item.twolayer === selectedTwolayer
    );

    console.log("existingProductIndex:", existingProductIndex);

    function generateCartId() {
      return Math.floor(Math.random() * 1000000); // สร้างเลขสุ่ม 6 หลักเป็น cartId
    }
    console.log(data);
    if (existingProductIndex !== -1) {
      // เพิ่มค่า count ของสินค้านี้
      cart[idUser][existingProductIndex].count++;
      const numberOfPieces = Math.ceil(width / data.p_width);
      console.log(
        "numberOfPieces",
        width,
        "/",
        data.p_width,
        " = ",
        numberOfPieces
      );

      // คำนวณผ้าทั้งหมด
      const totalFabric = numberOfPieces * 2;
      console.log("totalFabric", numberOfPieces, "* 2 = ", totalFabric);

      // คำนวณค่าผ้าต่อชิ้น
      const fabricCostPerPiece = (height * totalFabric * data.price) / 100;
      console.log(
        "fabricCostPerPiece",
        "[",
        height,
        "*",
        totalFabric,
        "*",
        data.price,
        "]/100",
        " = ",
        fabricCostPerPiece
      );

      let priceofrail = 0;
      console.log(selectedRail);
      if (selectedRail === "รับราง") {
        priceofrail = (pricerail * width) / 100;
        console.log(
          "price rail [",
          pricerail,
          "*",
          width,
          " ]/100 = ",
          priceofrail
        );
      }
      console.log("price rail", priceofrail);
      const TotalPiece = fabricCostPerPiece + priceofrail;

      cart[idUser][existingProductIndex].totalPiece = TotalPiece;
    } else {
      const numberOfPieces = Math.ceil(width / data.p_width);
      console.log(
        "numberOfPieces",
        width,
        "/",
        data.p_width,
        " = ",
        numberOfPieces
      );

      // คำนวณผ้าทั้งหมด
      const totalFabric = numberOfPieces * 2;
      console.log("totalFabric", numberOfPieces, "* 2 = ", totalFabric);

      // คำนวณค่าผ้าต่อชิ้น
      const fabricCostPerPiece = (height * totalFabric * data.price) / 100;
      console.log(
        "fabricCostPerPiece",
        "[",
        height,
        "*",
        totalFabric,
        "*",
        data.price,
        "]/100",
        " = ",
        fabricCostPerPiece
      );

      let priceofrail = 0;
      console.log(selectedRail);
      if (selectedRail === "รับราง") {
        priceofrail = (pricerail * width) / 100;
        console.log(
          "price rail [",
          pricerail,
          "*",
          width,
          " ]/100 = ",
          priceofrail
        );
      }
      console.log("price rail", priceofrail);
      const TotalPiece = fabricCostPerPiece + priceofrail;

      const productData = {
        productId: data.id,
        brand: data.brand,
        p_type: data.p_type,
        name: data.name,
        color: data.color,
        detail: data.detail,
        width: width,
        p_width: data.p_width,
        height: height,
        price: data.price,
        image: data.image,
        type: selectedType,
        price_rail: pricerail,
        rail: selectedRail,
        twolayer: selectedTwolayer,
        cartId: generateCartId(),
        totalPiece: TotalPiece,
        count: 1
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
      payload: unique
    });
    Swal.fire({
      icon: "success",
      title: "เพิ่มสินค้าในตระกร้าเรียบร้อยแล้ว",
      showConfirmButton: false,
      timer: 1500 // 1.5 วินาที
    });
  };

  const handleAddToCart = ({
    selectedRail,
    selectedType,
    selectedTwolayer,
    pricerail,
    width,
    height,
    ...data
  }) => {
    if (selectedType) {
      if (!selectedTwolayer) {
        Swal.fire({
          icon: "warning",
          title: "กรุณาเลือกว่าจะทำม่าน2ชั้นหรือไม่",
          showConfirmButton: false,
          timer: 1500 // 1.5 วินาที
        });
        return;
      }
    }
    if (!selectedType) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกประเภทของสินค้าที่ต้องการสั่งตัด",
        showConfirmButton: false,
        timer: 1500 // 1.5 วินาที
      });
      return;
    }

    if (!width || !height) {
      Swal.fire({
        icon: "warning",
        text: "กรุณาระบุขนาดของสินค้า",
        showConfirmButton: false,
        timer: 1500 // 1.5 วินาที
      });
      return;
    }

    if (height < 149) {
      Swal.fire({
        icon: "warning",
        text: "หน้าต่างต้องมีความสูงมากกว่า 150 ซม.",
        showConfirmButton: false,
        timer: 1500 // 1.5 วินาที
      });
      return;
    }

    if (width < 99) {
      Swal.fire({
        icon: "warning",
        title: "หน้าต่างต้องมีความกว้างมากกว่า 100 ซม.",
        showConfirmButton: false,
        timer: 1500 // 1.5 วินาที
      });
      return;
    }

    if (!selectedRail) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกว่าจะรับรางหรือไม่",
        showConfirmButton: false,
        timer: 1500 // 1.5 วินาที
      });
      return;
    }

    console.log("idUSer=====", idUser);
    // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบหรือไม่
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      addToCartForLoggedInUser({
        idUser,
        selectedRail,
        selectedType,
        selectedTwolayer,
        typeById,
        pricerail,
        width,
        height,
        ...data
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setSelectedCurtain((prev) => ({
      ...prev,
      main: bgType
    }));
    setIsLoading(false);
  }, [bgType]);

  const default_product = {
    id: 1,
    main: bgType
  };

  const [selectedCurtain, setSelectedCurtain] = useState(default_product);

  const [background, setBackground] = useState(data.color);

  const [product, setProduct] = useState([]);

  console.log("test");
  console.log(data.p_type);
  const firstdata = data.p_type ? data.p_type.split(",")[0].trim() : "";
  console.log(firstdata);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        let productData;
        // ตรวจสอบค่า data.p_type และกำหนดให้เรียกใช้ productAPI ตามที่ต้องการ
        if (firstdata === "ผ้าใยสังเคราะห์ (polyester)") {
          productData = await productAPI.getProductTypePolyester();
          setProduct(productData);
          setIsLoading(false);
        } else if (firstdata === "ผ้าฝ้าย (cotton)") {
          productData = await productAPI.getProductTypeCotton();
          setProduct(productData);
          setIsLoading(false);
        } else if (firstdata === "ผ้ากำมะหยี่ (velvet)") {
          productData = await productAPI.getProductTypeVelvet();
          setProduct(productData);
          setIsLoading(false);
        } else if (firstdata === "ผ้าซาติน (satin)") {
          productData = await productAPI.getProductTypeSatin();
          setProduct(productData);
          setIsLoading(false);
        } else if (firstdata === "ผ้าลินิน (linen)") {
          productData = await productAPI.getProductTypeLinen();
          setProduct(productData);
          setIsLoading(false);
        } else if (firstdata === "ผ้าใยผสม (mixed)") {
          productData = await productAPI.getProductTypeMixed();
          setProduct(productData);
          setIsLoading(false);
        } else if (firstdata === "ผ้ากันแสง (blackout)") {
          productData = await productAPI.getProductTypeBlackout();
          setProduct(productData);
          setIsLoading(false);
        } else if (firstdata === "ผ้าโปร่ง (sheer)") {
          productData = await productAPI.getProductTypeSheer();
          setProduct(productData);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล", err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [firstdata]);
  // console.log(product);

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
            <div className="rounded-lg w-[180px] shadow-3xl hover:shadow-2xl h-auto md:h-full flex-col md:pb-2 bg-white ">
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
        <div className=" flex flex-wrap p-11 justify-center items-center">
          <img
            className="flex w-[200px] h-[280px] mt-[25px] rounded shadow-xl "
            src={data.image}
            alt="product"
          />
          <CloudinaryContext className="flex w-[320px] " cloudName="dwmpdaqqh">
            <div className="image__container">
              <div className="image">
                <TransformedImage
                  rgb={background}
                  selectedCurtain={selectedCurtain}
                />
              </div>{" "}
            </div>
          </CloudinaryContext>

          <div className="flex-col p-0 sm:p-0 pl-10 pr-10 pt-5 ">
            <p className="text-base md:text-lg lg:text-lg xl:text-lg mx-4 my-4 text-brown-400">
              ชื่อสินค้า : {data.name}
            </p>
            <p className="text-sm my-2 md:text-base lg:text-base xl:text-base text-brown-400">
              ยี่ห้อสินค้า : {data.brand}
            </p>
            <p className="text-sm md:text-base lg:text-base xl:text-base my-2 text-brown-400">
              ประเภทของผ้าม่าน : {data.p_type}
            </p>
            <div
              style={{ backgroundColor: data.color }}
              className="text-center flex items-center text-xs sm:text-sm lg:text-base xl:text-base h-7 w-[60%] text-white rounded-full shadow-xl "
            >
              <p className="mx-auto">{data.color}</p>
            </div>
            <div className="text-sm md:text-base lg:text-base xl:text-base x mt-4 text-brown-400 whitespace-pre-wrap">
              {data.detail}
            </div>
            <p className="mt-4 text-sm md:text-base lg:text-base xl:text-base text-brown-400">
              ความกว้างของหน้าผ้า : {data.p_width} เซนติเมตร
            </p>
            <p className="mt-4 text-sm md:text-base lg:text-base xl:text-base text-brown-400">
              ราคาสินค้า : {data.price} บาท/หลา
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center mb-10">
        <div className=" basis-1/3 items-center">
          <p className="text-gray-700 text-sm mt-4 pl-5 text-center ">
            ต้องการสั่งตัดผ้าม่านแบบใด
          </p>

          {types.map((item, index) => (
            <div
              key={index}
              className=" basis-1/3 text-center  text-browntop text-base mt-2  mb-2"
            >
              <input
                className="ml-2"
                type="radio"
                id={item.id}
                name="selectedType"
                value={item.name}
                checked={selectedType === item.name}
                onChange={() =>
                  handleRadioChange(
                    item.twolayer,
                    item.name,
                    item.price_rail,
                    item.bgimage
                  )
                }
              />
              <label className="ml-2" htmlFor={item.name}>
                {item.name}
              </label>
            </div>
          ))}

          <p className="text-center text-gray-700 text-sm mt-4 pl-5">
            ** ทางร้านมีบริการรับตัดม่านหลุดย์
          </p>
        </div>

        <div className="w-3/5 ml-3 flex flex-nowrap overflow-x-auto">
          {types.map((item, index) => (
            <div key={index} className="p-2">
              <div className="rounded-lg shadow-3xl hover:shadow-2xl md:h-full flex-col md:pb-2 bg-white">
                <div className="relative  h-[140px] w-[200px] sx:h-[140px] sx:w-[200px] md:h-[200px] md:w-[300px] lg:h-[200px] lg:w-[300px] xl:h-[200px] xl:w-[300px]">
                  <img
                    className="w-auto h-full object-cover rounded-t-lg bg-contain bg-center"
                    src={`${process.env.REACT_APP_AWS}${item.image}`}
                    alt="type"
                  />
                  <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25 rounded-t-lg "></div>
                  <div className="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                    {item.name}
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
          >
            สามารถดูวิธีการวัดขนาดของผ้าม่านได้ที่นี่
          </Link>
        </span>
      </p>
      <div className="flex justify-center w-full">
        <div>
          <p className="mt-4 ml-5 text-sm text-brown-400">กว้าง</p>
          <input
            class="appearance-none rounded w-[140px] py-2 px-3 ml-2 my-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={width}
            required
            min="100"
            onChange={(e) => setWidth(e.target.value)}
          />
        </div>
        <div>
          <p className="mt-4 text-sm ml-5 text-brown-400">สูง</p>
          <input
            class="appearance-none  rounded w-[140px] py-2 px-3 ml-2 my-2  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={height}
            type="number"
            min="150"
            required
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
        <p className="  mt-14 text-sm ml-5 text-brown-400"> เซนติเมตร</p>
      </div>
      {typeById === "ได้" ? (
        <>
          <p className="text-base mx-7 my-4 text-brown-400">
            ต้องการทำเป็นม่าน2ชั้นหรือไม่
          </p>{" "}
          {["ทำ", "ไม่ทำ"].map((twolayer) => (
            <div
              key={twolayer}
              className=" flex-row text-left  text-browntop text-lg mt-2  mb-2"
            >
              <input
                className="ml-5 text-base"
                type="radio"
                id={twolayer}
                name="selectedTwolayer"
                value={twolayer}
                checked={selectedTwolayer === twolayer}
                onChange={handleRadioChangeTwolayer}
              />
              <label className="ml-2" htmlFor={twolayer}>
                {twolayer}
              </label>
            </div>
          ))}
        </>
      ) : (
        <>
          {" "}
          <p className="text-base mx-4 my-4 text-brown-400">
            ไม่สามารถทำม่าน2ชั้นได้
          </p>
        </>
      )}
      <p className="text-base mx-7 my-4 text-brown-400">ต้องการรับรางหรือไม่</p>{" "}
      {["รับราง", "ไม่รับราง"].map((rail) => (
        <div
          key={rail}
          className=" flex-row text-left  text-browntop text-base mt-2  mb-2"
        >
          <input
            className="ml-5 text-base"
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
        {isLoggedIn ? (
          <button
            onClick={() =>
              handleAddToCart({
                ...data,
                width,
                height,
                selectedType,
                selectedTwolayer,
                pricerail,
                selectedRail
              })
            }
            className=" mt-10  mb-3 px-4 py-2 rounded-lg inline-block text-base bg-brown-200 hover:bg-browntop hover:shadow-xl text-white focus:outline-none focus:shadow-outline"
          >
            เพิ่มลงลงตระกร้าสินค้า
          </button>
        ) : (
          <Link
            to={{ pathname: "/login", state: `custom-product/${productId}` }}
          >
            <button className="my-4 text-white hover:shadow-2xl bg-red-400 rounded-xl p-2 w-[150px]">
              {" "}
              เข้าสู่ระบบเพื่อเพิ่มสินค้าลงตระกร้า{" "}
            </button>
          </Link>
        )}
      </div>
      <Footer></Footer>
    </>
  );
}

export default CustomPage;
