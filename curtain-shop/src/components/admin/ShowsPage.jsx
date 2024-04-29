import React, { useEffect, useState } from "react";
import Navbaradmin from "./Navbaradmin";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import showAPI from "../../services/showAPI";

function ShowPage() {
  const [state, setState] = useState({
    name: ""
  });
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
  const handleDeleteProduct = (id, name) => {
    console.log(id);
    Swal.fire({
      text: `คุณต้องการลบรูป ${name} ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่"
    }).then((result) => {
      setIsLoading(true);

      if (result.isConfirmed) {
        showAPI
          .deleteShow(id)
          .then((response) => {
            setIsLoading(false);
            console.log("img deleted successfully");
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error deleting product:", error);
            setIsLoading(false);

          });
      } else {
        // ผู้ใช้เลือกยกเลิกการลบสินค้า
        console.log("Cancelled delete operation");
        setIsLoading(false);
      }
    });
  };

  return (
    <>
      <Navbaradmin></Navbaradmin>
      <div className=" items-center justify-center mt-5 pb-5 p-10 bg-white w-[80%] m-auto">

      <div class="w-full inline-flex justify-end items-center mt-5 pb-5">
        <Link
          to="/add-showimg"
          class="bg-gray-300  hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
        >
          เพิ่มรูปภาพผลงานร้าน
        </Link>
       
      </div>

        <p class="text-center text-xl text-b-font font-bold">
          ผลงานในร้าน
        </p>

        <ol>
          {Array.isArray(data) &&
            data.map((item) => (
              <li key={item._id}>
                <div className="flex justify-between my-2">
                  <p className="flex">{item.name}</p>
                  <img
                      src={`${process.env.REACT_APP_AWS}${item.image}`}
                      alt="types"
                      className="w-[400px] max-w-full object-contain"
                    />
                </div>
                <div className="flex justify-end">
                <button
                    className="flex  shadow rounded text-white p-2 bg-red-300 hover:bg-red-600 hover:shadow-2xl mr-2"
                    onClick={() => handleDeleteProduct(item._id, item.name)}

                  >
                    ลบรูปภาพ
                  </button></div>

              </li>
            ))}
        </ol>

   
      </div>
     
    </>
  );
}

export default ShowPage;
