import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import productAPI from "../../services/productAPI";
import Footer from "../Footer";
import { HiOutlineArrowSmRight, HiOutlineCursorClick } from "react-icons/hi";
import { Link } from "react-router-dom";
function ContactPage() {
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
          ผ้าใยสังเคราะห์ ( polyester )
        </h5>
      </div>
      {/* {product.map((product) => ( */}
      <div className="flex overflow-x-auto max-w-screen justify-center m-5 ">
        <div className=" p-2 md:p-4 w-[90%]">
          <div key={product._id} className="flex justify-center">
            <div className="flex justify-between w-[90%] h-auto shadow-md border rounded mt-2 mb-4 p-3">
              <img
                className="w-[40%] rounded"
                src={`${process.env.REACT_APP_API}/images/asia-fabric-plus-18-(polyester)-an12-b67f4809-011e-486e-9d24-f2036fd730a9-.jpg`}
                alt="product"
              />

              <div className="pl-10 pr-10 pt-5 ">
                <p className="text-lg mx-4 my-4 text-brown-400">
                  ชื่อสินค้า : AF17-3 {product.name}
                </p>
                <p className="text-base my-2 text-brown-400">
                  ยี่ห้อสินค้า : asia-fabric-plus-18 {product.brand}
                </p>
                <p className="text-base my-2 text-brown-400">
                  ประเภทของผ้าม่าน : ผ้าใยสังเคราะห์ (polyester){product.p_type}
                </p>
                <div
                  style={{ backgroundColor: product.color }}
                  className="h-7 w-[60%] text-white rounded-full shadow-xl inline-block pl-5 ml-4 mr-2"
                >
                  {" "}
                  {product.color}{" "}
                </div>
                <div className="text-base mt-4 text-brown-400 whitespace-pre-wrap">
                  <span className>รายละเอียดสินค้า : </span> ผ้าม่าน PRO TEXTILE
                  ผ้าสีทองอ่อน เป็นผ้าผิวมันสะท้อนเเสง
                  ตัวผ้ามีการพิมพ์ลาดลายดอกบัวบานผสานกับดอกบัวตูม
                  ลวดลายมีความเด่นชัด เท็กซ์เจอร์ในการสัมผัสและเนื้อผ้าดี
                  ป้องกันแสงได้ถึง 95%
                  ทำให้ช่วยในการพักผ่อนและให้ความเป็นส่วนตัว \r\nประเภทผ้า :
                  ผ้าทำจาก Polyester 100 % มีความเหนียว คงทน และแข็งแรง
                  คงสภาพและคงรูปร่างได้ดี และไม่ยับง่าย
                  ความสามารถในการดูดความชื้นต่ำ \r\nการทำความสะอาด :
                  สามารถซักน้ำและซักแห้งได้ แต่ซักอย่างอ่อนโยน
                  และไม่ควรใช้สารฟอกขาว \r\n\r\n\r\nข้อแนะนำ :
                  การรีดเนื้อผ้าควรใช้ไฟอ่อนถึงปานกลาง {product.detail}
                </div>
                <p className="mt-4 text-base text-brown-400">
                  ราคาสินค้า : 350 {product.price} บาท/หลา
                </p>
               
                <button
                  className=" mt-2 mb-3 px-4 py-2 rounded-lg inline-block text-sm  text-brown-500 hover:text-brown-300 hover:text-base"
                  // onClick={() => handleEditProduct(product._id, product.name)}
                >
                  สามารถดูวิธีการวัดขนาดของผ้าม่านได้ที่นี่
                  <HiOutlineCursorClick className="inline-block h-5 w-auto ml-2" />
                </button>
                <div>
                  <Link to="/custom-product">
                  <button
                    className=" mt-10  mb-3 px-4 py-2 rounded-lg inline-block text-base bg-brown-200 hover:bg-browntop hover:shadow-xl text-white focus:outline-none focus:shadow-outline"
                    // onClick={() => handleEditProduct(product._id, product.name)}
                  >
                    เพิ่มลงลงตระกร้าสินค้า
                  </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ))} */}

      <div className="font-semibold text-brown-600 text-base md:text-lg lg:text-lg ml-10 my-5 ">
        {" "}
        สินค้าแนะนำเพิ่มเติมเกี่ยวกับสินค้าในหมวด{" "}
      </div>
      <div className="flex flex-nowrap overflow-x-auto max-w-screen">
        {product.map((product) => (
          <div key={product._id} className="p-2 md:p-4">
            <div className="rounded-lg w-[230px] shadow-3xl hover:shadow-2xl h-auto md:h-full flex-col md:pb-5 bg-white ">
              <div className="relative ">
                <img
                  className="w-full rounded-t-lg bg-contain bg-center"
                  src={`${process.env.REACT_APP_API}/images/${product.image}`}
                  alt="product"
                />
                <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>
                <div className="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                  {product.p_type}
                </div>
              </div>

              <div className="pt-4 px-4 font-semibold text-brown-600 text-base md:text-base lg:text-lg inline-block hover:text-browntop transition duration-500 ease-in-out">
                รายละเอียด
              </div>
              <div className="pt-2 px-4 font-semibold text-brown-600 text-sm md:text-base lg:text-base inline-block hover:text-browntop transition duration-500 ease-in-out">
                ยี่ห้อ : {product.brand}
              </div>
              <div className="pt-2 pb-4 px-4  text-xs md:text-sm lg:text-sm xl:text-base text-brown-400 whitespace-pre-wrap">
                {product.detail.split("\r\n")[0]}
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

      <Footer></Footer>
    </>
  );
}
export default ContactPage;
