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
import { Link } from "react-router-dom";
import productAPI from "../../services/productAPI";
import Footer from "../Footer";
import TransformedImage from "./Tranformedimage";
var { Alpha } = require("react-color/lib/components/common");

function CustomPage() {
  const default_product = {
    id: 1,
    main: "test2_ocvii1",
  };

  const [curtain, setCurtain] = useState([
    default_product,
    { id: 2, main: "test1_gvyquf" },
    { id: 3, main: "curtain_fev3fs" },
  ]);

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

  return (
    <>
      <Navbar></Navbar>
      <div class="titlea bg-brown-bg  w-full  h-full py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
         ออกแบบผ้าม่านของคุณ
        </h5>
      </div>
      <div className="flex flex-nowrap overflow-x-auto max-w-screen">
        {product.map((product) => (
          <div key={product._id} className="p-2">
            <div className="rounded-lg w-[200px] shadow-3xl hover:shadow-2xl h-auto md:h-full flex-col md:pb-5 bg-white ">
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
            className="w-[300px] rounded"
            src={`${process.env.REACT_APP_API}/images/asia-fabric-plus-18-(polyester)-af17-21-1329151e-eaf4-4c61-a6b7-13d31aefd3b7.jpg`}
            alt="product"
          />
          <CloudinaryContext cloudName="dwmpdaqqh" className="w-[400px]">
            <div className="image__container">
              <div className="image">
                <TransformedImage
                  rgb={background.rgb}
                  selectedCurtain={selectedCurtain}
                />
              </div>
            </div>
            {/* <div className="image__thumbnail">
          {curtain.map((curtain_fev3fs) => (
            <div
              id="div2"
              className="thumbnail"
              key={curtain_fev3fs.id}
            >
              <TransformedImage
                rgb={background.rgb}
                selectedCurtain={curtain_fev3fs}
              />
            </div>
          ))}
        </div> */}
          </CloudinaryContext>
          <div className="mt-[80px]">
            <SwatchesPicker
              color={background}
              onChangeComplete={changeProductColor}
            />
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default CustomPage ;
