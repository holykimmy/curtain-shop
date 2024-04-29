import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import showAPI from "../../services/showAPI";
import { BsPinFill } from "react-icons/bs";
import w1 from "../img/work/w1.jpg";
import w2 from "../img/work/w2.jpg";
import w3 from "../img/work/w3.jpg";
import w4 from "../img/work/w4.jpg";
import w5 from "../img/work/w5.jpg";
import w6 from "../img/work/w6.jpg";
import w7 from "../img/work/w7.jpg";
import w8 from "../img/work/w8.jpg";
import w9 from "../img/work/w9.jpg";
import w10 from "../img/work/w10.jpg";
import w11 from "../img/work/w11.jpg";
import w12 from "../img/work/w12.jpg";
import w13 from "../img/work/w13.jpg";
import w14 from "../img/work/w14.jpg";
import w15 from "../img/work/w15.jpg";
import w16 from "../img/work/w16.jpg";
import w17 from "../img/work/w17.jpg";
import w18 from "../img/work/w18.jpg";
import w20 from "../img/work/w20.jpg";
import w21 from "../img/work/w21.jpg";
import w22 from "../img/work/w22.jpg";
import w23 from "../img/work/w23.jpg";
import w24 from "../img/work/w24.jpg";
import w25 from "../img/work/w25.jpg";
import w26 from "../img/work/w26.jpg";
import w27 from "../img/work/w27.jpg";
import w28 from "../img/work/w28.jpg";
import w29 from "../img/work/w29.jpg";
import w30 from "../img/work/w30.jpg";
import w31 from "../img/work/w31.jpg";
import w32 from "../img/work/w32.jpg";
import w33 from "../img/work/w33.jpg";
import w34 from "../img/work/w34.jpg";
import w35 from "../img/work/w35.jpg";
import w36 from "../img/work/w36.jpg";
import w37 from "../img/work/w37.jpg";
import w38 from "../img/work/w38.jpg";
import w39 from "../img/work/w39.jpg";
import w40 from "../img/work/w40.jpg";
import w41 from "../img/work/w41.jpg";
import w42 from "../img/work/w42.jpg";
import w43 from "../img/work/w43.jpg";
import Footer from "../Footer";

function ServicePage() {
  const [data, setData] = useState([]);
  const [brand, setBrand] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await showAPI.getAllImage();
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchData(); // fetchData
  }, []);

  return (
    <>
      {" "}
      <div className="h-screen w-full bg-gradient-to-r from-5% from-white via-50% via-brown-bg to-90% to-white">
        <Navbar></Navbar>

        <div class="titlea  py-1 shadow-md">
          <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
          <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
            ผลงานของร้าน
          </h5>
        </div>
        <div className="flex justify-center items-center ">
          <p class="p-5 xl:text-4xl text-b-font text-lg"></p>
        </div>

        <div class="Achievement">
          <div className="photo-gallery lg:grid-cols-3 lg:px-20 xl:px-32">
            {[...Array(3)].map((_, columnIndex) => (
              <div key={columnIndex} className="column">
                {data
                  .slice(
                    columnIndex * Math.ceil(data.length / 3),
                    (columnIndex + 1) * Math.ceil(data.length / 3)
                  )
                  .map((item, index) => (
                    <div key={item._id} className="photo">
                      <div className="relative rounded-t-lg ">
                        <img
                          className="w-auto h-full object-cover rounded-t-lg bg-contain bg-center"
                          src={`${process.env.REACT_APP_AWS}${item.image}`}
                          alt="type"
                        />
                        <div className="absolute shadow-md rounded-r-lg rounded-l-lg bottom-0 left-0 bg-white/30 px-4 py-2 text-white text-sm hover:bg-white hover:text-browntop transition duration-500 ease-in-out">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
      
        </div>

        <div className="flex justify-center items-center ">
          <p class="p-5 xl:text-4xl text-b-font text-lg"></p>
        </div>
        <Footer></Footer>
      </div>
    </>
  );
}
export default ServicePage;
