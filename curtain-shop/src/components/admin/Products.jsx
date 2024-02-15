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

  const handleSearch = async () => {
    try {
      const searchData = await productAPI.getSearch(searchTerm);
      setSearchResults(searchData); // เซตค่า searchResults ที่ได้จากการค้นหาเข้า state
    } catch (error) {
      console.error("Error fetching search results:", error);
      // แสดงข้อความผิดพลาดหรือจัดการข้อผิดพลาดตามที่ต้องการ
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const intervalId = setInterval(() => {
      fetchData();
    }, 500000); // 5 วินาที

    fetchData();
    return () => clearInterval(intervalId);
  }, []);

  // const history = useHistory();
  const navigate = useNavigate();

  const handleEditProduct = (
    productId,
    productName,
    brand,
    p_type,
    name,
    color,
    detail,
    price
  ) => {
    Swal.fire({
      title: `คุณต้องการแก้ไขข้อมูลสินค้า ${productName} ใช่หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/update-product/${productId}`, {
          state: {
            brand,
            p_type,
            name,
            color,
            detail,
            price,
          },
        });
      }
    });
  };

  const handleDeleteProduct = (productId, productName) => {
    console.log(productId);
    Swal.fire({
      title: `คุณต้องการลบข้อมูลสินค้า ${productName} ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        // ทำการลบสินค้าโดยใช้ ID ของสินค้า
        productAPI
          .deleteProduct(productId)
          .then((response) => {
            console.log("Product deleted successfully");
            // อัพเดท state หรือทำอื่น ๆ ตามต้องการหลังจากลบสินค้าเสร็จสิ้น
            // เรียก fetchData เพื่ออัพเดทข้อมูลใหม่หลังจากลบสินค้า
          })
          .catch((error) => {
            console.error("Error deleting product:", error);
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
        class="mx-auto mt-4 mb-4 relative bg-white min-w-sm max-w-2xl flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-2xl gap-2 shadow-xl focus-within:border-gray-300"
        for="search-bar"
      >
        <input
          id="search-bar"
          placeholder="ค้นหาข้อมูล"
          class="px-6 py-2 w-full rounded-md flex-1 outline-none bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          class="w-full md:w-auto px-6 py-3 bg-gray-500 border-gray-500 text-white fill-white active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-xl transition-all disabled:opacity-70 "
        >
          <div class="relative">
            <div class="flex items-center transition-all opacity-1 valid:">
              <span class="text-sm font-semibold whitespace-nowrap truncate mx-auto">
                Search
              </span>
            </div>
          </div>
        </button>
      </label>

      {searchResults.length > 0 ? (
        searchResults.map((product) => (
          <div key={product._id} className="flex justify-center">
            <div className="flex justify-between w-[85%] h-auto bg-white shadow-md border rounded mt-2 mb-4 p-3">
              <img className="w-[25%] rounded" src={blackout} alt="blackout" />
              <div className="pl-5 w-[50%]">
                <p className="text-lg text-brown-400">{product.name}</p>
                <p className="text-md text-brown-400">{product.brand}</p>
                <p className="text-md text-brown-400">{product.p_type}</p>
                <p className="text-md text-brown-400">{product.color}</p>
                <p className="text-md text-brown-400">{product.detail}</p>
                <p className="text-md text-brown-400">{product.price}</p>
              </div>
              <div>
                <div>
                  <button
                    className=" mt-3 mb-3 inline-block text-md  text-green-300 "
                    onClick={() => handleEditProduct(product._id, product.name)}
                  >
                    แก้ไขข้อมูล
                  </button>
                </div>
                <button
                  className="mt-3 mb-3 inline-block text-md text-red-300"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  ลบข้อมูล <FaTrashAlt className="inline-block text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>ไม่พบข้อมูล</p>
      )}

      <div class="titlea bg-gray-100 py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-8 xl:h-8 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-base md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
          ผ้ากำมะหยี่ (velvet)
        </h5>
      </div>

      {velvetProducts.map((product) => (
        <div key={product._id} className="flex justify-center">
          <div className=" flex justify-between w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <img class="w-[25%] rounded  " src={blackout} alt="blackout" />
            <div className="pl-5 w-[50%]">
              <p className="text-lg text-brown-400">{product.name}</p>
              <p className="text-md text-brown-400">{product.brand}</p>
              <p className="text-md text-brown-400">{product.p_type}</p>
              <p className="text-md text-brown-400">{product.color}</p>
              <p className="text-md text-brown-400">{product.detail}</p>
              <p className="text-md text-brown-400">{product.price}</p>
            </div>
            <div>
              <div>
                <button
                  className=" mt-3 mb-3 inline-block text-md  text-green-300 "
                  onClick={() => handleEditProduct(product._id, product.name)}
                >
                  แก้ไขข้อมูล
                </button>
              </div>
              <button
                className="mt-3 mb-3 inline-block text-md text-red-300"
                onClick={() => handleDeleteProduct(product._id, product.name)}
              >
                ลบข้อมูล <FaTrashAlt className="inline-block text-red-400" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <div class="titlea bg-gray-100 py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-8 xl:h-8 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-base md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
          ผ้าฝ้าย (cotton)
        </h5>
      </div>
      {cottonProducts.map((product) => (
        <div key={product._id} className="flex justify-center">
          <div className=" flex justify-between w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <img class="w-[25%] rounded  " src={blackout} alt="blackout" />
            <div className="pl-5 w-[50%]">
              <p className="text-lg text-brown-400">{product.name}</p>
              <p className="text-md text-brown-400">{product.brand}</p>
              <p className="text-md text-brown-400">{product.p_type}</p>
              <p className="text-md text-brown-400">{product.color}</p>
              <p className="text-md text-brown-400">{product.detail}</p>
              <p className="text-md text-brown-400">{product.price}</p>
            </div>
            <div>
              <div>
                <button
                  className=" mt-3 mb-3 inline-block text-md  text-green-300 "
                  onClick={() => handleEditProduct(product._id, product.name)}
                >
                  แก้ไขข้อมูล
                </button>
              </div>
              <button
                className=" mt-3 mb-3 inline-block text-md  text-red-300 "
                onClick={() => handleDeleteProduct(product._id)}
              >
                {" "}
                ลบข้อมูล <FaTrashAlt className="inline-block  text-red-400" />{" "}
              </button>
            </div>
          </div>
        </div>
      ))}

      <div class="titlea bg-gray-100 py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-8 xl:h-8 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-base md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
          ผ้าผ้าซาติน (satin)
        </h5>
      </div>
      {satinProducts.map((product) => (
        <div key={product._id} className="flex justify-center">
          <div className=" flex justify-between w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <img class="w-[25%] rounded  " src={blackout} alt="blackout" />
            <div className="pl-5 w-[50%]">
              <p className="text-lg text-brown-400">{product.name}</p>
              <p className="text-md text-brown-400">{product.brand}</p>
              <p className="text-md text-brown-400">{product.p_type}</p>
              <p className="text-md text-brown-400">{product.color}</p>
              <p className="text-md text-brown-400">{product.detail}</p>
              <p className="text-md text-brown-400">{product.price}</p>
            </div>
            <div>
              <div>
                <button
                  className=" mt-3 mb-3 inline-block text-md  text-green-300 "
                  onClick={() => handleEditProduct(product._id, product.name)}
                >
                  แก้ไขข้อมูล
                </button>
              </div>
              <button
                className=" mt-3 mb-3 inline-block text-md  text-red-300 "
                onClick={() => handleDeleteProduct(product._id)}
              >
                {" "}
                ลบข้อมูล <FaTrashAlt className="inline-block  text-red-400" />{" "}
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
        <div key={product._id} className="flex justify-center">
          <div className=" flex justify-between w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <img class="w-[25%] rounded  " src={blackout} alt="blackout" />
            <div className="pl-5 w-[50%]">
              <p className="text-lg text-brown-400">{product.name}</p>
              <p className="text-md text-brown-400">{product.brand}</p>
              <p className="text-md text-brown-400">{product.p_type}</p>
              <p className="text-md text-brown-400">{product.color}</p>
              <p className="text-md text-brown-400">{product.detail}</p>
              <p className="text-md text-brown-400">{product.price}</p>
            </div>
            <div>
              <div>
                <button
                  className=" mt-3 mb-3 inline-block text-md  text-green-300 "
                  onClick={() => handleEditProduct(product._id, product.name)}
                >
                  แก้ไขข้อมูล
                </button>
              </div>
              <button
                className=" mt-3 mb-3 inline-block text-md  text-red-300 "
                onClick={() => handleDeleteProduct(product._id)}
              >
                {" "}
                ลบข้อมูล <FaTrashAlt className="inline-block  text-red-400" />{" "}
              </button>
            </div>
          </div>
        </div>
      ))}

      <div class="titlea bg-gray-100 py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-8 xl:h-8 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-base md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
          ผ้าใยสังเคราะห์ (polyester)
        </h5>
      </div>
      {polyesterProducts.map((product) => (
        <div key={product._id} className="flex justify-center">
          <div className=" flex justify-between w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <img class="w-[25%] rounded  " src={blackout} alt="blackout" />
            <div className="pl-5 w-[50%]">
              <p className="text-lg text-brown-400">{product.name}</p>
              <p className="text-md text-brown-400">{product.brand}</p>
              <p className="text-md text-brown-400">{product.p_type}</p>
              <p className="text-md text-brown-400">{product.color}</p>
              <p className="text-md text-brown-400">{product.detail}</p>
              <p className="text-md text-brown-400">{product.price}</p>
            </div>
            <div>
              <div>
                <button
                  className=" mt-3 mb-3 inline-block text-md  text-green-300 "
                  onClick={() => handleEditProduct(product._id, product.name)}
                >
                  แก้ไขข้อมูล
                </button>
              </div>
              <button
                className=" mt-3 mb-3 inline-block text-md  text-red-300 "
                onClick={() => handleDeleteProduct(product._id)}
              >
                {" "}
                ลบข้อมูล <FaTrashAlt className="inline-block  text-red-400" />{" "}
              </button>
            </div>
          </div>
        </div>
      ))}

      <div class="titlea bg-gray-100 py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-8 xl:h-8 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-base md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
          ผ้าใยผสม (mixed)
        </h5>
      </div>
      {mixedProducts.map((product) => (
        <div key={product._id} className="flex justify-center">
          <div className=" flex justify-between w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <img class="w-[25%] rounded  " src={blackout} alt="blackout" />
            <div className="pl-5 w-[50%]">
              <p className="text-lg text-brown-400">{product.name}</p>
              <p className="text-md text-brown-400">{product.brand}</p>
              <p className="text-md text-brown-400">{product.p_type}</p>
              <p className="text-md text-brown-400">{product.color}</p>
              <p className="text-md text-brown-400">{product.detail}</p>
              <p className="text-md text-brown-400">{product.price}</p>
            </div>
            <div>
              <div>
                <button
                  className=" mt-3 mb-3 inline-block text-md  text-green-300 "
                  onClick={() => handleEditProduct(product._id, product.name)}
                >
                  แก้ไขข้อมูล
                </button>
              </div>
              <button
                className=" mt-3 mb-3 inline-block text-md  text-red-300 "
                onClick={() => handleDeleteProduct(product._id)}
              >
                {" "}
                ลบข้อมูล <FaTrashAlt className="inline-block  text-red-400" />{" "}
              </button>
            </div>
          </div>
        </div>
      ))}

      <div class="titlea bg-gray-100 py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-8 xl:h-8 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-base md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
          ผ้ากันแสง (blackout)
        </h5>
      </div>
      {blackoutProducts.map((product) => (
        <div key={product._id} className="flex justify-center">
          <div className=" flex justify-between w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <img class="w-[25%] rounded  " src={blackout} alt="blackout" />
            <div className="pl-5 w-[50%]">
              <p className="text-lg text-brown-400">{product.name}</p>
              <p className="text-md text-brown-400">{product.brand}</p>
              <p className="text-md text-brown-400">{product.p_type}</p>
              <p className="text-md text-brown-400">{product.color}</p>
              <p className="text-md text-brown-400">{product.detail}</p>
              <p className="text-md text-brown-400">{product.price}</p>
            </div>
            <div>
              <div>
                <button
                  className=" mt-3 mb-3 inline-block text-md  text-green-300 "
                  onClick={() => handleEditProduct(product._id, product.name)}
                >
                  แก้ไขข้อมูล
                </button>
              </div>
              <button
                className=" mt-3 mb-3 inline-block text-md  text-red-300 "
                onClick={() => handleDeleteProduct(product._id)}
              >
                {" "}
                ลบข้อมูล <FaTrashAlt className="inline-block  text-red-400" />{" "}
              </button>
            </div>
          </div>
        </div>
      ))}

      <div class="titlea bg-gray-100 py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-8 xl:h-8 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-base md:text-xl xl:text-xl text-b-font  pl-4 p-2 my-1">
          ม่านล็อกลอน (wave curtains)
        </h5>
      </div>
      {waveProducts.map((product) => (
        <div key={product._id} className="flex justify-center">
          <div className=" flex justify-between w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
            <img class="w-[25%] rounded  " src={blackout} alt="blackout" />
            <div className="pl-5 w-[50%]">
              <p className="text-lg text-brown-400">{product.name}</p>
              <p className="text-md text-brown-400">{product.brand}</p>
              <p className="text-md text-brown-400">{product.p_type}</p>
              <p className="text-md text-brown-400">{product.color}</p>
              <p className="text-md text-brown-400">{product.detail}</p>
              <p className="text-md text-brown-400">{product.price}</p>
            </div>
            <div>
              <div>
                <button
                  className=" mt-3 mb-3 inline-block text-md  text-green-300 "
                  onClick={() => handleEditProduct(product._id, product.name)}
                >
                  แก้ไขข้อมูล
                </button>
              </div>
              <button
                className=" mt-3 mb-3 inline-block text-md  text-red-300 "
                onClick={() => handleDeleteProduct(product._id)}
              >
                {" "}
                ลบข้อมูล <FaTrashAlt className="inline-block  text-red-400" />{" "}
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Products;
