import React, { useEffect, useState } from "react";
import Navbaradmin from "./Navbaradmin";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import productAPI from "../../services/productAPI";
import SwitchButton from "./switchbutton";
import CustomerAPI from "../../services/customerAPI";
import Swal from "sweetalert2";
import SwitchEnable from "./switchEnable";
import customerAPI from "../../services/customerAPI";

function Customers() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(true);
    const fetchData = () => {
      CustomerAPI.getAllCustomer()
        .then((orderData) => {
          setData(orderData);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("error", err);
          setIsLoading(false);
        });
    };
    fetchData();
  }, []);
  console.log(data);

  const [address, setAddress] = useState([]);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const addressData = await customerAPI.getCustomerAddressById();
      setAddress(addressData);
      setIsLoading(false);
    } catch (err) {
      console.error("erro", err);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  console.log(address);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const searchData = await CustomerAPI.getSearch(searchTerm);
      setSearchResults(searchData);
      console.log(searchData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbaradmin />

      <div className="w-max-full max-h-max">
        <p className=" w-full justify-center text-center p-3 shadow-lg text-base md:text-xl xl:text-2xl text-b-font ">
          ข้อมูลลูกค้า
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
          ? searchResults.map((customer) => (
              <>
                <div key={customer._id} className="flex justify-center">
                  <div className="flex  flex-col justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
                    <div className="pl-5 w-[60%]">
                      <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                        ชื่อ - นามสกุล : {customer.customer.f_name}{" "}
                        <span className="ml-2">
                          {" "}
                          {customer.customer.l_name}{" "}
                        </span>
                      </p>
                      <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                        อีเมลล์ : {customer.customer.email}
                      </p>
                      <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                        เบอร์โทรศัพท์ : {customer.customer.tell}
                      </p>

                      <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                        คำสั่งซื้อ : {customer.cart.length}
                      </p>

                      {customer.address && customer.address.length > 0 && (
                        <>
                          {customer.address.map((address, index) => (
                            <div key={index} className="mt-4">
                              <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                                ที่อยู่ {index + 1}{" "}
                              </p>
                              <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                                บ้านเลขที่ : {address.houseNo}
                              </p>
                              <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                                แขวง/ตำบล : {address.sub_district}
                              </p>
                              <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                                เขต/อำเภอ : {address.district}
                              </p>
                              <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                                จังหวัด : {address.province}
                              </p>
                              <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                                รหัสไปรษณีย์ : {address.postcode}
                              </p>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                    <div className="flex items-center ml-7 mt-5 ">
                      <SwitchEnable
                        enable={customer.customer.enable}
                        idUser={customer.customer._id}
                      />
                    </div>
                  </div>
                </div>
                <hr className="w-full mt-4 mb-2 border-gray-300" />
              </>
            ))
          : searchTerm && (
              <>
                <p className="text-sm text-gray-600">ไม่พบข้อมูล</p>
                <hr className="w-full mt-4 mb-2 border-gray-300" />
              </>
            )}
        {data.map((customer) => (
          <div key={customer._id} className="flex justify-center">
            <div className="flex  flex-col justify-between w-[97%] sm:w-[97%] md:w-[85%] h-auto  bg-white shadow-md border rounded mt-2 mb-4  p-3">
              <div className="pl-5 w-[60%]">
                <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                  ชื่อ - นามสกุล : {customer.customer.f_name}{" "}
                  <span className="ml-2"> {customer.customer.l_name} </span>
                </p>
                <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                  อีเมลล์ : {customer.customer.email}
                </p>
                <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                  เบอร์โทรศัพท์ : {customer.customer.tell}
                </p>
                <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                  คำสั่งซื้อ : {customer.cart.length} รายการ
                </p>

                {customer.address && customer.address.length > 0 && (
                  <>
                    {customer.address.map((address, index) => (
                      <div key={index} className="mt-4">
                        <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                          ที่อยู่ {index + 1}{" "}
                        </p>
                        <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                          บ้านเลขที่ : {address.houseNo}
                        </p>
                        <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                          แขวง/ตำบล : {address.sub_district}
                        </p>
                        <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                          เขต/อำเภอ : {address.district}
                        </p>
                        <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                          จังหวัด : {address.province}
                        </p>
                        <p className="text-sm sm:text-sm md:text-md lg:text-md xl-text-lg text-brown-400">
                          รหัสไปรษณีย์ : {address.postcode}
                        </p>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="flex items-center ml-7 mt-5 ">
                <SwitchEnable
                  enable={customer.customer.enable}
                  idUser={customer.customer._id}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Customers;
