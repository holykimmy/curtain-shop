import React, { useEffect, useState } from "react";
import Navbaradmin from "./Navbaradmin";
import Swal from "sweetalert2";
import { Link, useParams, useNavigate } from "react-router-dom";
import typeAPI from "../../services/typeAPI";
import { Image, Transformation, CloudinaryContext } from "cloudinary-react";

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
        setIsLoading(false);
        console.error("Error fetching all brands:", error);
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
        Swal.close();
      } catch (error) {
        console.error("Error fetching all brands:", error);
      }
    };

    fetch();
  }, []);

  console.log(data);

  const handleFileSelectionBg = (e) => {
    const bgimage = e.target.files[0];
    console.log("bgimage", bgimage);

    setImagebg(bgimage); // อัปเดตค่าไฟล์ใหม่

    // แสดงตัวอย่างรูปภาพ
    const previewURL = URL.createObjectURL(bgimage);
    setImagePreviewBg(previewURL);
  };

  console.log(name, price_rail, image, selectedTwolayer);

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
      const response = await typeAPI.updateTypeBgById(id, formData);
      Swal.close();
      Swal.fire({
        text: "เพิ่มข้อมูลเรียบร้อย",
        icon: "success"
      });
      window.location.reload();
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err.response.data.error
      });
    }
  };

  return (
    <>
      <Navbaradmin></Navbaradmin>
      <div className=" items-center justify-center mt-5 pb-5 p-10 bg-white w-full m-auto">
        <p class="text-center text-xl text-b-font font-bold">
          เพิ่มรูปแสดงตัวอย่างของ{name}
        </p>

        <form onSubmit={submitForm} enctype="multipart/form-data">
          <div className="flex mb-5 sm:flex-col md:flex-row lg:flex-row xl:flex-row justify-center md:justify-around items-center">
            <img
              className="flex filter drop-shadow-xl appearance-none border-none  mt-4 w-auto h-[350px] rounded justify-center py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              src={`${process.env.REACT_APP_AWS}${data.image}`}
              alt="Preview"
            />{" "}
          </div>

          <input
            type="file"
            name="bgimage"
            id="bgimage"
            accept="image/*"
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
          <div className="flex justify-center ">
            <CloudinaryContext
              className="flex w-[320px] "
              cloudName="dwmpdaqqh"
            >
              <div className="image__container">
                <div className="image">
                  <Image className="w-[800px]" publicID={data.bgimage} />
                </div>{" "}
              </div>
            </CloudinaryContext>
          </div>

          <div class="flex items-center mt-5 justify-center">
            <button
              class="w-full my-5 bg-stone-500 hover:bg-browntop text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
