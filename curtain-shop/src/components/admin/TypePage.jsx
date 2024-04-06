import React, { useEffect, useState } from "react";
import Navbaradmin from "./Navbaradmin";
import Swal from "sweetalert2";
import { Link , useNavigate } from "react-router-dom";
import typeAPI from "../../services/typeAPI";
function AddTypePage() {
  const  navigate = useNavigate();
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [price_rail, setPrice_rail] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedTwolayer, setSelectedTwolayer] = useState("");

  const [isLoading, setIsLoading] = useState(true);

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
    const fetch = async () => {
      try {
        setIsLoading(true);
        const types = await typeAPI.getAllTypes();
        setData(types);
        setIsLoading(false);
  
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching all brands:", error);
      }
    };

    fetch();
  }, []);
  console.table(data);



  const handdleDetail = async (id,name) => {
    // แสดงข้อความยืนยันจากผู้ใช้ก่อนที่จะทำการยกเลิกคำสั่งซื้อ
    const confirmation = await Swal.fire({
      text: `ท่านต้องการแก้ไข ${name} ใช่หรือไม่`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่",
      cancelButtonText: "ยกเลิก",
    });

    // หากผู้ใช้กดปุ่มยืนยัน
    if (confirmation.isConfirmed) {
      navigate(`/update-type/${id}`, {});
    }
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const submitForm = (e) => {
    e.preventDefault();

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

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price_rail", price_rail);
    formData.append("image", image);
    formData.append("twolayer", selectedTwolayer);

    typeAPI
      .createType(formData)
      .then((response) => {
        Swal.close();
        Swal.fire({
          text: "เพิ่มข้อมูลเรียบร้อย",
          icon: "success"
        });
        window.location.reload();
      })
      .catch((err) => {
        Swal.close();
        Swal.fire({
          icon: "error",
          text: err.response.data.error
        });
      });
  };

  return (
    <>
      <Navbaradmin></Navbaradmin>
      <div className=" items-center justify-center mt-5 pb-5  bg-white w-full m-auto">
       

        <div class="w-full inline-flex justify-center items-center mt-5 pb-5">
        <Link
          to="/add-type"
          class="bg-gray-300  hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
        >
          เพิ่มประเภทการสั่งตัดสินค้า
        </Link></div>

        <p class="text-left text-xl ml-5 text-b-font font-bold">
          ประเภทการสั่งตัดที่มี
        </p>

        <div className="overflow-x-auto mt-5">
          <table class="min-w-full text-left text-sm font-light">
            <thead class="border-b font-medium dark:border-neutral-500">
              <tr className="bg-gray-200">
                <th className="px-6 py-4 border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-base text-center text-gray-700">
                  ชื่อ
                </th>
                <th className="px-6 py-4 border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-base text-center text-gray-700">
                  ม่าน2ชั้น
                </th>
                <th className="px-6 py-4 border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-base text-center text-gray-700">
                  ราคาราง/100 ซม.
                </th>
                <th className="px-6 py-4 border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-base text-center text-gray-700">
                  รูปภาพ
                </th>
                <th className="px-6 py-4 border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-base text-center text-gray-700"/>

               
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b dark:border-neutral-500">
                  <td className="p-2 border text-center border-blue-gray-50 text-gray-700">
                    {item.name}
                  </td>

                  <td className="p-2 border text-center border-blue-gray-50 text-gray-700">
                     ทำ{item.twolayer}
                  </td>
                  <td className="p-2 pr-5 border text-right border-blue-gray-50 text-gray-700">
                    {item.price_rail} บาท{" "}
                  </td>
                  <td className="p-2 border text-center flex justify-center items-center border-blue-gray-50 text-gray-700">
                    <img
                      src={`${process.env.REACT_APP_AWS}${item.image}`}
                      alt="types"
                      className="h-[150px] max-w-full"
                    />
                  </td>
                  <td className="p-2 pr-5 border justify-center border-blue-gray-50 text-gray-700">
                    <button
                      onClick={() => handdleDetail(item._id,item.name)}
                      className="bg-blue-300 hover:bg-blue-600 p-2 rounded text-white "
                    >
                    แก้ไข
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}

export default AddTypePage;
