import React, { useEffect, useState } from "react";
import Navbaradmin from "./Navbaradmin";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import typeAPI from "../../services/typeAPI";
function UpdateTypePage() {
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
    const fetchBrands = async () => {
      try {
        setIsLoading(true);
        const types = await typeAPI.getAllTypes();
        setData(types);
        setIsLoading(false);
        Swal.close();
      } catch (error) {
        console.error("Error fetching all brands:", error);
      }
    };

    fetchBrands();
  }, []);

  console.log(data);
  const handleFileSelection = (e) => {
    const image = e.target.files[0];
    setImage(image); // อัปเดตค่าไฟล์ใหม่

    // แสดงตัวอย่างรูปภาพ
    const previewURL = URL.createObjectURL(image);
    setImagePreview(previewURL);
  };

  const handlePriceChange = (e) => {
    const inputNumber = e.target.value;
    // ตรวจสอบว่า inputNumber เป็นตัวเลขและมีค่ามากกว่าหรือเท่ากับ 0 หรือไม่
    if (!isNaN(inputNumber) && Number(inputNumber) >= 0) {
      setPrice_rail(inputNumber);
    }
  };

  const handleRadioChangeTwolayer = (event) => {
    setSelectedTwolayer(event.target.value);
  };

  const [twoLayerStr, setTwoLayer] = useState(""); 

useEffect(() => {
  if (selectedTwolayer === "ได้") {
    setTwoLayer(true); 
  } else if (selectedTwolayer === "ไม่ได้") {
    setTwoLayer(false); 
  }
}, [selectedTwolayer]); 


  console.log("two : ", twoLayerStr);

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
    formData.append("twolayer", twoLayerStr);

    typeAPI
      .createProduct(formData)
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
      <div className=" items-center justify-center mt-5 pb-5 p-10 bg-white w-full m-auto">
        <p class="text-center text-xl text-b-font font-bold">
          ประเภทการสั่งตัดที่ต้องการแก้ไข
        </p>

        <div className="overflow-x-auto mt-5">
          <table class="min-w-full text-left text-sm font-light">
            <thead class="border-b font-medium dark:border-neutral-500">
              <tr className="bg-gray-200">
                <th className="px-6 py-4 border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-base text-center text-gray-700">
                  ชื่อ 
                </th>
                <th className="px-6 py-4 border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-base text-center text-gray-700">
                  ราคาราง/100 ซม.
                </th>
                <th className="px-6 py-4 border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-base text-center text-gray-700">
                  รูปภาพ
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b dark:border-neutral-500">
                  <td className="p-2 border text-center border-blue-gray-50 text-gray-700">
                    {item.name} {item.twolayer ? "ทำม่าน2ชั้นได้" : null}

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form
          onSubmit={submitForm}
          enctype="multipart/form-data"
          class="bg-white "
        >
          <p className="text-gray-700 items-center md:text-base mt-4 pl-5">
            เพิ่มประเภทการสั่งตัด
          </p>

          <div class="input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-6">
            <input
              class="appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="p_name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ชื่อประเภทที่ต้องการเพิ่ม"
            />
          </div>

          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleFileSelection}
          />

          <div className="flex sm:flex-col md:flex-row lg:flex-row xl:flex-row justify-center md:justify-around items-center">
            {/* Image preview */}
            {imagePreview && (
              <img
                className="flex appearance-none border-none  mt-4 w-auto h-[350px] rounded justify-center py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                src={imagePreview}
                alt="Preview"
              />
            )}
          </div>

          <div class="input-groupfle shadow appearance-none border mt-5 rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
            <input
              class="appearance-none border-none rounded sm:w-[70%] md:w-[90%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="p_price"
              value={price_rail}
              onChange={handlePriceChange}
              type="number"
              step="0.00"
              placeholder="ราคาราง/100 ซม."
            />
            <span className=" w-[10%] text-center text-gray-500 ml-2 m-auto p-auto ">
              บาท
            </span>
          </div>

          <p className="text-gray-700 items-center md:text-base mt-4 pl-5">
            สามารถทำเป็นผ้าม่าน2ชั้นได้หรือไม่
          </p>

          {["ได้", "ไม่ได้"].map((twolayer) => (
            <div
              key={twolayer}
              className="flex-row text-center text-browntop text-lg mt-2 mb-2"
            >
              <input
                className="ml-2"
                type="radio"
                id={twolayer}
                value={twolayer}
                checked={selectedTwolayer === twolayer}
                onChange={handleRadioChangeTwolayer}
              />
              <label className="ml-2" htmlFor={twolayer}>
                {twolayer}
              </label>
            </div>
          ))}

          <div class="flex items-center justify-center">
            <button
              class="w-full bg-stone-500 hover:bg-browntop text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              value="save"
              type="submit"
            >
              ยืนยัน
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default UpdateTypePage;
