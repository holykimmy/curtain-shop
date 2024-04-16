import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import productAPI from "../../services/productAPI";
import Footer from "../Footer";
import { HiOutlineArrowSmRight, HiOutlineCursorClick } from "react-icons/hi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";

function ContactPage() {
  const { productId } = useParams();
  const [data, setData] = useState({});

  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

        setIsLoading(false);
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล", err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [firstdata]);
  console.log(product);

  //login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = React.useState("");
  const [idUser, setIdUser] = React.useState("");
  const [user, setUser] = React.useState({
    f_name: "",
    l_name: "",
    email: "",
    tell: "",
    address: ""
  });

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
        setData(productData);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    };

    fetchData();
  }, [productId]);

  const handleDetailProduct = (productId, productName) => {
    Swal.fire({
      title: `คุณต้องการดูข้อมูลสินค้า ${productName} ใช่หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่"
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/product-detail/${productId}`);
      }
    });
  };

  const handleCustom = (productId, productName) => {
    navigate(`/custom-product/${productId}`);
  };

  return (
    <>
      <div className="">
        <Navbar
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          userName={userName}
        ></Navbar>
        <div class="titlea bg-brown-bg  w-full  h-full py-1 shadow-md">
          <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
          <h5 className=" inline-block text-sm sx:text-sm sm:text-sm md:text-md xl:text-md text-b-font  pl-4 p-2 my-1">
            {data.p_type}
          </h5>
        </div>

        <div className="flex overflow-x-auto max-w-screen justify-center  ">
          <div className=" p-2 md:p-4  sx:w-full sm:w-full md:w-[90%] ">
            <div key={data.productId} className="flex justify-center">
              <div className="flex flex-col items-center  sm:flex-col md:flex-col lg:flex-row xl:flex-row justify-between w-[90%] h-auto shadow-md border rounded mt-2 mb-4 p-3">
                <img
                  className="w-[400px] md:h-full rounded "
                  src={data.image}
                  alt="product"
                />

                <div className="pl-10 pr-10 pt-5 ">
                  <p className="text-base sm:text-base md:text-lg lg:text-lg xl:text-lg mx-4 my-4 text-brown-400">
                    ชื่อสินค้า : {data.name}
                  </p>
                  <p className="text-xs  sm:text-sm md:text-base lg:text-base xl:text-base my-2 text-brown-400">
                    ยี่ห้อสินค้า : {data.brand}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base lg:text-base xl:text-base my-2 text-brown-400">
                    ประเภทของผ้าม่าน : {data.p_type}
                  </p>
                  <div
                    style={{ backgroundColor: data.color }}
                    className="m-2 text-center flex items-center text-xs sm:text-sm lg:text-base xl:text-base h-7 w-[60%] text-white rounded-full shadow-xl "
                  >
                    {" "}
                    <p className="items-center mx-auto ">{data.color}</p>
                  </div>
                  <div className="text-xs sm:text-sm md:text-base lg:text-base xl:text-base mt-4 text-brown-400 whitespace-pre-wrap">
                    {data.detail}
                  </div>
                  <p className=" mt-4 text-xs sm:text-sm  md:text-base lg:text-base xl:text-base text-brown-400">
                    ความกว้างของหน้าผ้า : {data.p_width} ซม.
                  </p>
                  <p className="mt-4 text-xs sm:text-sm md:text-base lg:text-base xl:text-base text-brown-400">
                    ราคาสินค้า : {data.price} บาท/หลา
                  </p>

                  <Link
                    to="/gauging-curtain"
                    className=" mt-2 mb-3 px-4 py-2 rounded-lg inline-block text-sm  text-brown-500 hover:text-brown-300 hover:text-base"
                  >
                    สามารถดูวิธีการวัดขนาดของผ้าม่านได้ที่นี่
                    <HiOutlineCursorClick className="inline-block h-5 w-auto ml-2" />
                  </Link>
                  <div>
                    <button
                      onClick={() => handleCustom(productId, data.name)}
                      className=" mt-10  mb-3 px-4 py-2 rounded-lg inline-block text-base bg-brown-200 hover:bg-browntop hover:shadow-xl text-white focus:outline-none focus:shadow-outline"
                    >
                      เพิ่มลงลงตระกร้าสินค้า
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="font-semibold text-brown-600 text-sm md:text-base lg:text-base ml-10 my-5 ">
          {" "}
          สินค้าแนะนำเพิ่มเติมเกี่ยวกับสินค้าในหมวด {data.p_type}
        </div>
        <div className="flex flex-nowrap overflow-x-auto max-w-screen">
          {product &&
            product.map((product) => (
              <div key={product._id} className="p-2 md:p-4">
                <div className="rounded-lg w-[180px] md:w-[200px] lg:w-[200px] xl:w-[230px]  shadow-3xl hover:shadow-2xl h-auto md:h-full flex-col md:pb-5 bg-white ">
                  <div className="relative ">
                    <img
                      className="w-full rounded-t-lg bg-contain bg-center"
                      src={product.image}
                      alt="product"
                    />
                    <div className="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-xs md:text-md hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                      {product.p_type}
                    </div>
                  </div>

                  <div className="pt-4 px-4 font-semibold text-brown-600 text-xs md:text-sm lg:text-sm inline-block hover:text-browntop transition duration-500 ease-in-out">
                    รายละเอียด
                  </div>
                  <div className="pt-2 px-4 font-semibold text-brown-600 text-xs md:text-sm lg:text-sm inline-block hover:text-browntop transition duration-500 ease-in-out">
                    ยี่ห้อ : {product.brand}
                  </div>
                  <div className="pt-2 pb-4 px-4  text-xs md:text-sm lg:text-sm xl:text-base text-brown-400 whitespace-pre-wrap">
                    {product.detail.split("\r\n")[0]}
                  </div>

                  <button
                    onClick={() =>
                      handleDetailProduct(product._id, product.name)
                    }
                    className="pl-5 mt-3 text-brown-500 text-sm md:base hover:text-browntop inline-flex items-center"
                  >
                    อ่านพิ่มเติม
                    <HiOutlineArrowSmRight />
                  </button>
                </div>
              </div>
            ))}
        </div>

        <Footer></Footer>
      </div>
    </>
  );
}
export default ContactPage;
