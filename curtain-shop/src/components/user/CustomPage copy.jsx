import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import productAPI from "../../services/productAPI";
import Footer from "../Footer";
import { HiOutlineArrowSmRight } from "react-icons/hi";
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
      <div className="flex w-full justify-center m-5 ">
        <div className=" p-2 md:p-4 w-[90%]">
          <div key={product._id} className="flex justify-center">
            <div className="flex justify-between w-[90%] h-auto shadow-md border rounded mt-2 mb-4 p-3">
              <img
                className="w-[40%] rounded"
                src={`${process.env.REACT_APP_API}/images/asia-fabric-plus-18-(polyester)-af17-3-d33b3a96-6422-4a35-bf56-e13727903165.jpg`}
                alt="product"
              />

              <div className="pl-10 pr-10 pt-5 ">
                <p className="text-lg mx-4 my-4 text-brown-400">
                  ชื่อสินค้า : AF17-3 {product.name}
                </p>
                <p className="text-md my-2 text-brown-400">
                  ยี่ห้อสินค้า : asia-fabric-plus-18 {product.brand}
                </p>
                <p className="text-md my-2 text-brown-400">
                  ประเภทของผ้าม่าน : ผ้าใยสังเคราะห์ (polyester){product.p_type}
                </p>

                <div
                  style={{ backgroundColor: product.color }}
                  className="h-7 w-[60%] text-white rounded-full shadow-xl inline-block pl-5 ml-4 mr-2"
                >
                  {" "}
                  {product.color}{" "}
                </div>

          
                <p className="mt-4 text-md text-brown-400">
                  ราคาสินค้า : 500 {product.price} บาท
                </p>

                <div>
                  <button
                    className=" mt-10  mb-3 px-4 py-2 rounded-lg inline-block text-md bg-browntop  text-white"
                    // onClick={() => handleEditProduct(product._id, product.name)}
                  >
                    เพิ่มลงลงตระกร้าสินค้า
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ))} */}

     

      <Footer></Footer>
    </>
  );
}
export default ContactPage;
