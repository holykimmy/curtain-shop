import React, { useEffect, useState } from "react";
import Navbaradmin from "./Navbaradmin";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import productAPI from "../../services/productAPI";
import SwitchButton from "./switchbutton";
import receptAPI from "../../services/receptAPI";
import Swal from "sweetalert2";

function HistoryInvoice() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = () => {
      receptAPI
        .getAllInvoice()
        .then((data) => {
          setData(data);
        })
        .catch((err) => {
          console.error("error", err);
        });
    };
    fetchData();
  }, []);
  console.log(data);

  const handleSearch = async () => {
    try {
      const searchData = await productAPI.getSearch(searchTerm);
      setSearchResults(searchData); // เซตค่า searchResults ที่ได้จากการค้นหาเข้า state
    } catch (error) {
      console.error("Error fetching search results:", error);
      // แสดงข้อความผิดพลาดหรือจัดการข้อผิดพลาดตามที่ต้องการ
    }
  };

  const handdleOrderdetail = async (id) => {
    // แสดงข้อความยืนยันจากผู้ใช้ก่อนที่จะทำการยกเลิกคำสั่งซื้อ
    const confirmation = await Swal.fire({
      title: "ดูรายละเอียดคำสั่งซื้อ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    });

    // หากผู้ใช้กดปุ่มยืนยัน
    if (confirmation.isConfirmed) {
      navigate(`/invoice-detail/${id}`, {});
    }
  };

  const handleEditProduct = (id, productName) => {
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
        navigate(`/invoice-update/${id}`);
      }
    });
  };

  const handleDeleteProduct = (id, productName) => {
    console.log(id);
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
        receptAPI
          .deleteRecept(id)
          .then((response) => {
            console.log("Product deleted successfully");
          
          })
          .catch((error) => {
            console.error("Error deleting product:", error);
          });
          window.location.reload();
      } else {
        // ผู้ใช้เลือกยกเลิกการลบสินค้า
        console.log("Cancelled delete operation");
      }
    });
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <Navbaradmin />

      <div className="w-max-full max-h-max">
        <p className=" w-full justify-center text-center p-3 shadow-lg text-base md:text-xl xl:text-2xl text-b-font ">
          ใบแจ้งหนี้
        </p>{" "}
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
              <div key={product._id} className="flex justify-center"></div>
            ))
          : searchTerm && (
              <>
                <p className="text-sm text-gray-600">ไม่พบข้อมูล</p>
                <hr className="w-full mt-4 mb-2 border-gray-300" />
              </>
            )}

        {data.map((customer) => (
          <div key={customer._id} className="flex justify-center">
            <div className="flex justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
              <div className="pl-5 w-[60%]">
                <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                  เรียนคุณ : {customer.fullname}{" "}
                </p>
                <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                  เรื่อง : {customer.subject}
                </p>
                <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                  ที่อยู่ : {customer.address}
                </p>

                <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                  วันที่ : {customer.createdAt}
                </p>
                <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                  วันที่ส่งมอบ : {customer.deliveryDate}
                </p>


                <p className="mt-2 text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                  รายการทั้งหมด : {customer.rows.length}
                </p>

                <p className="mt-2 text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                  ราคารวม : {numberWithCommas(customer.totalPrice)} บาท
                </p><button
                  onClick={() => handdleOrderdetail(customer._id)}
                  className=" hover:text-brown-500 mx-2 py-2 px-auto  hover:text-shadow-xl text-sm sm:text-xs md:text-xs lg:text-base xl:text-base text-brown-400 mt-2 mr-4"
                >
                  {" "}
                  ดูรายละเอียดคำสั่งซื้อ{" "}
                </button>
              </div>
              <div>
                
                <div>
                  <button  onClick={() => handleEditProduct(customer._id, customer.fullname)} className=" bg-blue-200 py-2 px-auto w-[80px] rounded-full shadow-xl hover:bg-blue-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-md lg:text-md xl:text-md  text-white ">
                    แก้ไขข้อมูล
                  </button>
                </div>
                <button onClick={() => handleDeleteProduct(customer._id, customer.fullname)} className="bg-red-300 mt-3 py-2 px-auto w-[80px] rounded-full shadow-xl hover:bg-red-400 text-center md:mt-3 md:mb-3 md:inline-block text-xs sm:text-xs md:text-md lg:text-md xl:text-md text-white">
                  ลบข้อมูล
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default HistoryInvoice;
