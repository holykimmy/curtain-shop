import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import typeAPI from "../../services/typeAPI";
import { Link, useNavigate, useParams } from "react-router-dom";

const ProductInCart = ({ item, idUser }) => {
  const dispatch = useDispatch();
  const [updatedItem, setUpdatedItem] = useState(item);
  const [cart, setCart] = useState([]);
  const [] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  console.log("testtt");
  console.log(item);

  console.log("-----------------------------");
  const getTotalPiece = (item) => {
    const numberOfPieces = Math.ceil(item.width / item.p_width);

    // คำนวณผ้าทั้งหมด
    const totalFabric = numberOfPieces * 2;

    // คำนวณค่าผ้าต่อชิ้น
    const fabricCostPerPiece = (item.height * totalFabric * item.price) / 100;

    console.table(item.rail, item.price_rail, item.width);
    let pricerail = 0;
    if (item.rail === "รับราง") {
      pricerail = (item.price_rail * item.width) / 100;
    }
    console.log("af  = ", pricerail);
    const TotalPiece = fabricCostPerPiece * item.count + pricerail;
    return TotalPiece;
  };

  console.log("-----------------------------");

  const handleMergeProducts = (updatedCart) => {
    let mergedCart = {};

    updatedCart.forEach((product) => {
      if (!mergedCart[idUser]) {
        mergedCart[idUser] = []; // สร้าง array สำหรับ idUser ถ้ายังไม่มี
      }

      const existingProductIndex = mergedCart[idUser].findIndex(
        (item) =>
          item.productId === product.productId &&
          item.type === product.type &&
          item.width === product.width &&
          item.height === product.height &&
          item.twolayer === product.twolayer &&
          item.rail === product.rail
      );

      if (existingProductIndex !== -1) {
        // หากพบสินค้าที่มีข้อมูลเหมือนกันใน mergedCart
        mergedCart[idUser][existingProductIndex].count += product.count; // เพิ่มจำนวนสินค้า
      } else {
        // หากไม่พบสินค้าที่มีข้อมูลเหมือนกันใน mergedCart
        mergedCart[idUser].push(product); // เพิ่มสินค้าใหม่เข้าไปในตะกร้า
      }
    });

    return mergedCart;
  };

  const handleChangeCount = (e) => {
    const count = e.target.value < 1 ? 1 : e.target.value;

    // เช็คว่าจำนวนที่ใส่มามากกว่าจำนวนสินค้าที่มีอยู่หรือไม่
    if (count > item.quatity) {
      toast.error("จำนวนสินค้าที่มีจำกัดสูงสุดแล้ว");
      return;
    }

    // คำนวณค่า totalPiece ใหม่
    const updatedItem = {
      ...item,
      count: count,
      totalPiece: getTotalPiece({ ...item, count: count })
    };

    // อัพเดทสถานะใน local state ทันที
    setUpdatedItem(updatedItem);

    // อัพเดทตะกร้าสินค้าใน local storage และ Redux store
    updateCart(updatedItem);
  };

  const updateCart = (updatedItem) => {
    let cart = {};

    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    // อัพเดทจำนวนสินค้าและค่า totalPiece สำหรับสินค้าที่กำหนดในตะกร้า
    const updatedCart = cart[idUser].map((product) => {
      if (product.cartId === updatedItem.cartId) {
        return updatedItem;
      }
      return product;
    });

    // อัพเดทตะกร้าใน local storage
    cart[idUser] = updatedCart;
    localStorage.setItem("cart", JSON.stringify(cart));

    // ส่งค่าตะกร้าที่อัพเดทไปยัง Redux store
    dispatch({
      type: "ADD_TO_CART",
      payload: handleMergeProducts(updatedCart)
    });
  };

  const handleChangeWidth = (e) => {
    const width = e.target.value < 100 ? 100 : e.target.value;

    // คำนวณค่า totalPiece ใหม่
    const updatedItem = {
      ...item,
      width: width,
      totalPiece: getTotalPiece({ ...item, width: width })
    };

    // อัพเดทสถานะใน local state ทันที
    setUpdatedItem(updatedItem);

    // อัพเดทตะกร้าสินค้าใน local storage และ Redux store
    updateCart(updatedItem);
  };

  const handleChangeHeight = (e) => {
    const height = e.target.value < 150 ? 150 : e.target.value;
    // คำนวณค่า totalPiece ใหม่
    const updatedItem = {
      ...item,
      height: height,
      totalPiece: getTotalPiece({ ...item, height: height })
    };

    // อัพเดทสถานะใน local state ทันที
    setUpdatedItem(updatedItem);

    // อัพเดทตะกร้าสินค้าใน local storage และ Redux store
    updateCart(updatedItem);
  };

  const handleRailChange = (e) => {
    const { value } = e.target;

    // ทำการอัปเดตค่าใน item โดยตรง
    item.rail = value;
    // คำนวณค่า totalPiece ใหม่
    const updatedItem = {
      ...item,
      rail: item.rail,
      totalPiece: getTotalPiece({ ...item, rail: item.rail })
    };

    // อัพเดทสถานะใน local state ทันที
    setUpdatedItem(updatedItem);

    // อัพเดทตะกร้าสินค้าใน local storage และ Redux store
    updateCart(updatedItem);
  };

  const handleRemove = () => {
    let cart = {};
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    // Check if the cart exists for the current user
    if (cart[idUser]) {
      // Filter out the product to remove from the cart
      cart[idUser] = cart[idUser].filter(
        (product) => product.cartId !== item.cartId
      );

      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Update Redux store
      dispatch({
        type: "ADD_TO_CART",
        payload: cart
      });
    }
  };

  const numberWithCommas = (x) => {
    if (x == null) {
      // เพิ่มการตรวจสอบค่า null หรือ undefined
      return ""; // หรือค่าที่คุณต้องการให้ส่งออก
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const handleDetailProduct = (productId, productName) => {
    Swal.fire({
      text: `คุณต้องการดูข้อมูลสินค้า ${productName} ใช่หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่"
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/product-detail/${productId}`);
      }
    });
  };

  return (
    <tbody>
      <tr className="text-center ">
        <td
          className=" hidden sm:table-cell  text-browntop px-2 py-1 border  border-gray-300   "
          onClick={() => handleDetailProduct(item.productId, item.name)}
        >
          <img className="w-[300px] rounded" src={item.image} alt="product" />
        </td>
        <td className="w-[100px] text-sm text-browntop px-2 py-1 border border-gray-300">
          {item.name}
        </td>
        <td className="text-browntop text-sm  px-2 py-1 border border-gray-300">
          {item.brand}
        </td>
        <td className="hidden sm:table-cell text-browntop text-xs text-left px-2 py-1 border border-gray-300 ">
          {item.detail.split("\r\n")[0]}
        </td>
        <td className="w-[100px] text-browntop  text-sm px-2 py-1 border border-gray-300 ">
          {item.type}
        </td>
        <td className=" w-[100px] text-browntop text-sm px-2 py-1 border border-gray-300 ">
          {item.twolayer}
        </td>
        <td className=" text-browntop text-sm px-2 py-1 border border-gray-300 ">
          <select
            className="mb-2 rounded-lg text-sm w-[110px]"
            value={item.rail}
            onChange={handleRailChange}
          >
            <option value="รับราง">รับราง</option>
            <option value="ไม่รับราง">ไม่รับราง</option>
          </select>
        </td>
        <td className="text-browntop text-sm px-2 py-1 border  border-gray-300">
          <div className="flex items-center">
            <input
              onChange={handleChangeWidth}
              className="form-control sx:w-[57px]  sm:w-[57px] md:w-[75px] lg:w-[75px] xl:w-[75px] mb-2 rounded-lg text-sm mr-2"
              type="number"
              value={item.width}
            />
           
          <input
            onChange={handleChangeHeight}
            className="form-control sx:w-[57px]  sm:w-[57px] md:w-[75px] lg:w-[75px] xl:w-[75px] mb-2 rounded-lg text-sm"
            type="number"
            value={item.height}
          /> <span className="w-[50px]">/ ซม.</span>
          </div>
        </td>

        <td className="w-[150px] text-browntop  text-sm px-2 py-1 border border-gray-300 ">
        <div className="flex items-center">
          <input
            onChange={handleChangeCount}
            className="form-control w-[50px] mb-2 rounded-lg text-sm"
            type="number"
            value={item.count}
          />{" "}
          <span className="w-[50px]">ชุด</span>
          </div>
        </td>
        <td className="text-browntop text-sm px-2 py-1 border border-gray-300 ">
        <div className="flex items-center">
          {numberWithCommas(getTotalPiece(item))}  <span className="w-[50px]">บาท</span> </div>
        </td>

        <td className="px-2 py-1 border border-gray-300 ...">
          <MdDeleteForever
            onClick={handleRemove}
            className="text-red-300  rounded-l-full h-10 w-10 hover:shadow-xl "
          />
        </td>
      </tr>
    </tbody>
  );
};

export default ProductInCart;
