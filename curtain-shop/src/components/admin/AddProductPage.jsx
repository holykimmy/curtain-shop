import React, { useState } from "react";
import { SwatchesPicker } from "react-color";
import Navbaradmin from "./Navbaradmin";
import { BiSolidBookmark } from "react-icons/bi";

function AddProductPage() {
  // Define a state variable to store the selected color
  const [selectedColor, setSelectedColor] = useState(null);

  // Function to handle color selection
  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
    // updateButtonColor(color.hex); // Update the button's color
  };

  // Function to update the button's color
//   const updateButtonColor = (color) => {
//     const button = document.getElementById("colorButton");
//     if (button) {
//       button.style.backgroundColor = color;
//     }
//   };
  const buttonStyle = {
    backgroundColor: selectedColor || "transparent",
  };

  return (
    <>
      <Navbaradmin></Navbaradmin>
      <div className="w-full flex items-center justify-center mt-5">
        <form class="bg-white ">
          <p class="text-center text-2xl text-b-font font-bold">เพิ่มสินค้า</p>

          <p className="text-gray-700 md:text-base mt-4 pl-5">แบรนด์สินค้า</p>
          <select
            class="input-group data-te-select-init shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-5"
            id="p_brand"
            type="text"
          >
            <option>brand</option>
            <option>No</option>
            <option>Maybe</option>
          </select>
          <p className="text-gray-700 md:text-base mt-4 pl-5">
            ประเภทของสินค้า
          </p>
          <select
            class="input-group data-te-select-init shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-5"
            id="p_type"
            type="text"
          >
            <option>blackout</option>
            <option>No</option>
            <option>Maybe</option>
          </select>

          <div class="input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-6">
            <input
              class="appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="p_name"
              type="text"
              placeholder="ชื่อสินค้า"
            />
          </div>

          <SwatchesPicker
            class="appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="p_color"
            onChange={handleColorChange} // Call the handler when a color is selected
          ></SwatchesPicker>
          <div className="my-5 flex justify-center">
            <div style={buttonStyle} class="h-6 w-6 rounded-full shadow-xl inline-block  mr-2">
            </div>
            <p className="text-gray-700 md:text-base text-center inline-block">
              {/* Display the selected color's name or hex code */}
              {selectedColor || "No color selected"}
            </p>
          </div>

          <div class="input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
            <input
              class="appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="p_detail"
              type="text"
              placeholder="รายละเอียดสินค้า"
            />
          </div>
          <div class="input-group  shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
            <input
              class="appearance-none border-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="p_price"
              type="number"
              placeholder="ราคาสินค้า"
            />
          </div>

          <div class="flex items-center justify-center">
            <button
              class="w-full bg-b-btn hover:bg-browntop text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              ยืนยัน
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddProductPage;
