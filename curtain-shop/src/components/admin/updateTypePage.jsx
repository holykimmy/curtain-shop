import React, { useEffect, useState } from "react";
import Navbaradmin from "./Navbaradmin";
import Swal from "sweetalert2";
import { Link, useParams, useNavigate } from "react-router-dom";
import typeAPI from "../../services/typeAPI";
import { IoIosAddCircleOutline } from "react-icons/io";

function UpdateTypePage() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [price_rail, setPrice_rail] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [bgimage, setImagebg] = useState(null);
  const [imagePreviewBg, setImagePreviewBg] = useState(null);

  const [selectedTwolayer, setSelectedTwolayer] = useState("");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  console.log("test");
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
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    } else {
      Swal.close();
    }
  }, [isLoading]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const types = await typeAPI.getTypeById(id);
        setData(types);
        setIsLoading(false);
        Swal.close();
      } catch (error) {
        console.error("Error fetching all brands:", error);
        setIsLoading(false);
      }
    };

    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const types = await typeAPI.getTypeById(id);
        setData(types);
        setName(types.name);
        setPrice_rail(types.price_rail);
        setSelectedTwolayer(types.twolayer);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching all brands:", error);
        setIsLoading(false);
      }
    };

    fetch();
  }, []);

  console.log(data);

  const handleFileSelection = (e) => {
    const image = e.target.files[0];
    console.log("image", image);

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

  console.log(data.name);
  const handleDelete = () => {
    Swal.fire({
      text: `คุณต้องการลบ ${data.name} ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่"
    }).then((result) => {
      setIsLoading(true);

      if (result.isConfirmed) {
        typeAPI
          .deleteTypeById(id)
          .then((response) => {
            setIsLoading(false);
            Swal.fire({
              text: "ลบข้อมูลสำเร็จ",
              icon: "success"
            }).then(() => {
              navigate("/type");
            });
          })
          .catch((error) => {
            console.error("Error deleting product:", error);
            setIsLoading(false);
          });
      } else {
        console.log("Cancelled delete operation");
        setIsLoading(false);
      }
    });
  };

  console.log(name, price_rail, image, selectedTwolayer);

  const submitForm = (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price_rail", price_rail);
    if (image) {
      formData.append("image", image);
    }
    if (bgimage) {
      formData.append("bgimage", bgimage);
    }
    formData.append("twolayer", selectedTwolayer);

    console.log(id, formData);
    console.log("formDataAPI:");
    console.log(formData.get("name"));
    console.log(formData.get("price_rail"));

    console.log("image", formData.get("image"));

    console.log(formData.get("twolayer"));

    console.log("endlAPI");

    update(e, id, formData);
  };

  const update = async (e, productId, formData) => {
    // Pass formData as an argument
    e.preventDefault();
    try {
      const response = await typeAPI.updateTypeById(id, formData);
      setIsLoading(false);
      Swal.fire({
        text: "เพิ่มข้อมูลเรียบร้อย",
        icon: "success"
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err.response.data.error
      });
      setIsLoading(false);

    }
  };

  return (
    <>
      <Navbaradmin></Navbaradmin>
      <div className=" items-center justify-center mt-5 pb-5 p-10 bg-white w-full m-auto">
        <p class="text-center text-xl text-b-font font-bold">
          ประเภทการสั่งตัดที่ต้องการแก้ไข
        </p>

        <form
          onSubmit={submitForm}
          enctype="multipart/form-data"
          class="bg-white "
        >
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

          <div class="flex mt-2 ml-3 pl-4  mb-5  items-center">
            <IoIosAddCircleOutline className="inline-block h-6 w-6 bg-brown-300  text-white rounded-full drop-shadow-md" />
            <Link
              to={`/update-typebg/${id}`}
              className=" text-base hover:text-brown-500 text-stone-500 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              เพิ่มรูปภาพเพื่อแสดงตัวอย่างผ้าม่านได้ที่นี่
            </Link>
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

          <div className="flex sm:flex-col md:flex-row lg:flex-row xl:flex-row justify-center md:justify-around items-center">
            <img
              className="flex filter drop-shadow-xl appearance-none border-none  mt-4 w-auto h-[350px] rounded justify-center py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              src={`${process.env.REACT_APP_AWS}${data.image}`}
              alt="Preview"
            />{" "}
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
              บาท/ ซม.
            </span>
          </div>

          <p className="text-gray-700 items-center sm:text-base md:text-base mt-5 pl-5">
            สามารถทำเป็นม่าน2ชั้น ได้หรือไม่ ?
          </p>

          {["ได้", "ไม่ได้"].map((twolayer) => (
            <div
              key={twolayer}
              className="flex-row text-left text-browntop text-lg mt-2 mb-2"
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

          <div class="flex items-center mt-5 justify-center">
            <button
              class="w-full bg-stone-500 hover:bg-browntop text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              value="save"
              type="submit"
            >
              ยืนยัน
            </button>
          </div>
        </form>

        <button
          className="w-[100px] bg-white border border-red-500 mt-5 hover:bg-red-600 text-red-500 hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline float-right"
          onClick={() => handleDelete()}
        >
          ลบข้อมูล
        </button>
      </div>
    </>
  );
}

export default UpdateTypePage;
