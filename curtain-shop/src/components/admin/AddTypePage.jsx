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
  const [bgimage, setImagebg] = useState(null);
  const [imagePreviewBg, setImagePreviewBg] = useState(null);
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

  const handleFileSelectionBg = (e) => {
    const bgimage = e.target.files[0];
    console.log("bgimage", bgimage);

    setImagebg(bgimage); // อัปเดตค่าไฟล์ใหม่

    // แสดงตัวอย่างรูปภาพ
    const previewURL = URL.createObjectURL(bgimage);
    setImagePreviewBg(previewURL);
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



  const handdleDetail = async (id,name) => {
    // แสดงข้อความยืนยันจากผู้ใช้ก่อนที่จะทำการยกเลิกคำสั่งซื้อ
    const confirmation = await Swal.fire({
      title: `ท่านต้องการแก้ไข ${name} ใช่หรือไม่`,
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
    formData.append("bgimage", bgimage);
    formData.append("twolayer", selectedTwolayer);
    
    console.log("formData:");
    console.log(formData.get("name"));
    console.log(formData.get("price_rail"));
    console.log(formData.get("image"));
    console.log(formData.get("bgimage"));
    console.log(formData.get("twolayer"));

    console.log("endl");
    typeAPI
      .createType(formData)
      .then((response) => {
        Swal.close();
        Swal.fire({
          text: "เพิ่มข้อมูลเรียบร้อย",
          icon: "success"
        }).then(() => {
          navigate("/type"); 
        });
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
         ประเภทการสั่งตัดที่ต้องการเพิ่ม
        </p>


        <form
          onSubmit={submitForm}
          enctype="multipart/form-data"
          class="bg-white "
        >
         

          <div class="input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-6">
            <input
              class="appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ชื่อประเภทการสั่งตัด ex. ม่านจีบ"
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

          <input
            type="file"
            name="bgimage"
            id="bgimage"
            
            onChange={handleFileSelectionBg}
          />

          <div className="flex sm:flex-col md:flex-row lg:flex-row xl:flex-row justify-center md:justify-around items-center">
            {/* Image preview */}
            {imagePreviewBg && (
              <img
                className="flex appearance-none border-none  mt-4 w-auto h-[350px] rounded justify-center py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                src={imagePreviewBg}
                alt="Preview"
              />
            )}
          </div>

          <div class="input-groupfle shadow appearance-none border mt-5 rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
            <input
              class="appearance-none border-none rounded sm:w-[70%] md:w-[90%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              className="flex-row text-left text-browntop text-lg ml-7 mt-2 mb-2"
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

          <div class="flex items-center justify-center ">
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

export default AddTypePage;
