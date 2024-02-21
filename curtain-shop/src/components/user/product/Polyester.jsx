import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar";
import { BsPinFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import blackout from "../../img/products/blackout.jpeg";
import Footer from "../../Footer";
import ProductDetail from "../ProductDetail";
import productAPI from "../../../services/productAPI";
function Polyester() {
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

      <div class="titlea bg-brown-bg py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
          ผ้าใยสังเคราะห์ ( polyester )
        </h5>
      </div>

      <div className="flex flex-wrap justify-center mt-2 mb-2 md:mt-10 md:mb-10 ">
        {/* part */}
        {product.map((product) => (
          <div
            key={product._id}
            className=" p-2 md:p-4 max-w-[180px] md:max-w-sm "
          >
            {/* card--1 */}
            <Link to="/product-detail">
              <div class="flex rounded-lg shadow-3xl hover:shadow-2xl h-auto md:h-full flex-col  md:pb-5 bg-white ">
                <div class="relative ">
                  <Link to="/product-detail">
                    <img
                      className=" w-full rounded-t-lg bg-contain bg-center"
                      src={`${process.env.REACT_APP_API}/images/${product.image}`}
                      alt="product"
                    />
                    <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>
                  </Link>

                  <div class="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                    {product.p_type}
                  </div>
                </div>

                <div class="px-6 py-4 pl-5">
                  <p class="font-semibold text-brown-600 text-base md:text-md lg:text-lg inline-block hover:text-browntop transition duration-500 ease-in-out">
                    รายละเอียด
                  </p>
                  <p class="text-brown-500 text-xs md:text-sm">
                   {product.detail}
                  </p>
                </div>

                <Link
                  to="/product-detail"
                  class="pl-5 mt-3 text-brown-500 text-sm md:base hover:text-browntop inline-flex items-center"
                >
                  อ่านพิ่มเติม
                  <HiOutlineArrowSmRight />
                </Link>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* card product flex*/}
      <div className="flex flex-wrap justify-center mt-2 mb-2 md:mt-10 md:mb-10 ">
        {/* part */}
        <div class=" p-2 md:p-4 max-w-[180px] md:max-w-sm   ">
          {/* card--1 */}
          <Link to="/product-detail">
            <div class="flex rounded-lg shadow-3xl hover:shadow-2xl h-[280px] md:h-full flex-col  md:pb-5 bg-white ">
              <div class="relative ">
                <Link to="/product-detail">
                  <img
                    class="w-full rounded-t-lg "
                    src={blackout}
                    alt="blackout"
                  />
                  <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>
                </Link>

                <div class="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                  Black Out
                </div>
              </div>

              <div class="px-6 py-4 pl-5">
                <p class="font-semibold text-brown-600 text-base md:text-lg inline-block hover:text-browntop transition duration-500 ease-in-out">
                  คุณสมบัติ
                </p>
                <p class="text-brown-500 text-xs md:text-sm">
                  ผ้าแบล็คเอ้าท์ (Black out) สามารถป้องกันแสงได้ 100%
                  และป้องกันรังสี UV
                </p>
              </div>

              <Link
                to="/product-detail"
                class="pl-5 mt-3 text-brown-500 text-sm md:base hover:text-browntop inline-flex items-center"
              >
                อ่านพิ่มเติม
                <HiOutlineArrowSmRight />
              </Link>
            </div>
          </Link>
        </div>

        {/* part */}
        <div class=" p-2 md:p-4 max-w-[180px] md:max-w-sm   ">
          {/* card--1 */}
          <Link to="/product-detail">
            <div class="flex rounded-lg shadow-3xl hover:shadow-2xl h-[280px] md:h-full flex-col  md:pb-5 bg-white ">
              <div class="relative ">
                <Link to="/product-detail">
                  <img
                    class="w-full rounded-t-lg "
                    src={blackout}
                    alt="blackout"
                  />
                  <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>
                </Link>

                <div class="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                  Black Out
                </div>
              </div>

              <div class="px-6 py-4 pl-5">
                <p class="font-semibold text-brown-600 text-base md:text-lg inline-block hover:text-browntop transition duration-500 ease-in-out">
                  คุณสมบัติ
                </p>
                <p class="text-brown-500 text-xs md:text-sm">
                  ผ้าแบล็คเอ้าท์ (Black out) สามารถป้องกันแสงได้ 100%
                  และป้องกันรังสี UV
                </p>
              </div>

              <Link
                to="/product-detail"
                class="pl-5 mt-3 text-brown-500 text-sm md:base hover:text-browntop inline-flex items-center"
              >
                อ่านพิ่มเติม
                <HiOutlineArrowSmRight />
              </Link>
            </div>
          </Link>
        </div>

        {/* part */}
        <div class=" p-2 md:p-4 max-w-[180px] md:max-w-sm   ">
          {/* card--1 */}
          <Link to="/product-detail">
            <div class="flex rounded-lg shadow-3xl hover:shadow-2xl h-[280px] md:h-full flex-col  md:pb-5 bg-white ">
              <div class="relative ">
                <Link to="/product-detail">
                  <img
                    class="w-full rounded-t-lg "
                    src={blackout}
                    alt="blackout"
                  />
                  <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>
                </Link>

                <div class="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                  Black Out
                </div>
              </div>

              <div class="px-6 py-4 pl-5">
                <p class="font-semibold text-brown-600 text-base md:text-lg inline-block hover:text-browntop transition duration-500 ease-in-out">
                  คุณสมบัติ
                </p>
                <p class="text-brown-500 text-xs md:text-sm">
                  ผ้าแบล็คเอ้าท์ (Black out) สามารถป้องกันแสงได้ 100%
                  และป้องกันรังสี UV
                </p>
              </div>

              <Link
                to="/product-detail"
                class="pl-5 mt-3 text-brown-500 text-sm md:base hover:text-browntop inline-flex items-center"
              >
                อ่านพิ่มเติม
                <HiOutlineArrowSmRight />
              </Link>
            </div>
          </Link>
        </div>

        {/* part */}
        <div class=" p-2 md:p-4 max-w-[180px] md:max-w-sm   ">
          {/* card--1 */}
          <Link to="/product-detail">
            <div class="flex rounded-lg shadow-3xl hover:shadow-2xl h-[280px] md:h-full flex-col  md:pb-5 bg-white ">
              <div class="relative ">
                <Link to="/product-detail">
                  <img
                    class="w-full rounded-t-lg "
                    src={blackout}
                    alt="blackout"
                  />
                  <div class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25  rounded-t-lg "></div>
                </Link>

                <div class="absolute shadow-md rounded-r-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                  Black Out
                </div>
              </div>

              <div class="px-6 py-4 pl-5">
                <p class="font-semibold text-brown-600 text-base md:text-lg inline-block hover:text-browntop transition duration-500 ease-in-out">
                  คุณสมบัติ
                </p>
                <p class="text-brown-500 text-xs md:text-sm">
                  ผ้าแบล็คเอ้าท์ (Black out) สามารถป้องกันแสงได้ 100%
                  และป้องกันรังสี UV
                </p>
              </div>

              <Link
                to="/product-detail"
                class="pl-5 mt-3 text-brown-500 text-sm md:base hover:text-browntop inline-flex items-center"
              >
                อ่านพิ่มเติม
                <HiOutlineArrowSmRight />
              </Link>
            </div>
          </Link>
        </div>
      </div>

      <Footer></Footer>
    </>
  );
}
export default Polyester;
