import React, { useState, useEffect } from "react";
import { SliderPicker, SketchPicker, SwatchesPicker } from "react-color";
import { Link } from "react-router-dom";
import Navbaradmin from "./Navbaradmin";
import Swal from "sweetalert2";
import showAPI from "../../services/showAPI";
function AddProductPage() {
  const [state, setState] = useState({
    name: []
  });

  const { name } = state;

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const inputValue = (name) => (event) => {
    const value = event.target.value;
    console.log(name, "=", value);
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileSelection = (e) => {
    const image = e.target.files[0];
    setImage(image); // อัปเดตค่าไฟล์ใหม่
    // แสดงตัวอย่างรูปภาพ
    const previewURL = URL.createObjectURL(image);
    setImagePreview(previewURL);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setState({ ...state, name: [...name, value] });
    } else {
      setState({
        ...state,
        name: name.filter((type) => type !== value)
      });
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    const ShowImgName = name.join(", "); //
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

    // Create FormData object
    const formData = new FormData();

    formData.append("name", ShowImgName);
    formData.append("image", image);
    console.log("formData:");
    console.log(formData.get("name"));
    console.log(formData.get("image"));
    console.log("endl");

    showAPI
      .createShow(formData)
      .then((response) => {
        Swal.close();
        Swal.fire({
          text: "เพิ่มข้อมูลเรียบร้อย",
          icon: "success"
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

      <div className="w-full items-center justify-center mt-5 pb-5">
        <form
          onSubmit={submitForm}
          /* ตรวจสอบว่ามี enctype และถูกต้องหรือไม่ */
          enctype="multipart/form-data"
          class="bg-white w-[80%] items-center justify-center m-auto mb-10"
        >
          {/* {JSON.stringify(state)} */}
          <p class="text-center text-2xl text-b-font font-bold">
            เพิ่มรูปภาพผลงานร้าน
          </p>

          <div class="input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-6">
            <input
              class="appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="p_name"
              type="text"
              value={name}
              onChange={inputValue("name")}
              placeholder="รายละเอียด"
            />
          </div>

          {["ม่านจีบ", "ม่านพับ", "ม่านตาไก่", "ม่านลอน", "ม่าน2ชั้น"].map(
            (type) => (
              <div key={type} className="text-browntop text-lg mt-2 ml-2 mb-2 ">
                <input
                  className="ml-2"
                  type="checkbox"
                  id={type}
                  name={type}
                  value={type}
                  checked={name.includes(type)}
                  onChange={handleCheckboxChange}
                />
                <label className="ml-2" htmlFor={type}>
                  {type}
                </label>
              </div>
            )
          )}

          <input
            className="my-5"
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleFileSelection}
          />
          <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row justify-center md:justify-around items-center">
            {/* Image preview */}
            {imagePreview && (
              <img
                className="flex appearance-none border-none  mt-4 w-auto h-[350px] rounded justify-center py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                src={imagePreview}
                alt="Preview"
              />
            )}
          </div>

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
      <Link
        to="/showimg"
        type="button"
        class="fixed bottom-0 flex justify-center ml-2 mb-2 w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
      >
        <svg
          class="w-5 h-5 rtl:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
          />
        </svg>
        <span>กลับไป</span>
      </Link>
    </>
  );
}

export default AddProductPage;
