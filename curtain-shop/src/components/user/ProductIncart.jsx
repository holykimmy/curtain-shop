import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";

const ProductInCart = ({ item, idUser }) => {
  const dispatch = useDispatch();
  const [updatedItem, setUpdatedItem] = useState(item);
  const [cart, setCart] = useState([]);
  const [] = useState([]);

  // const updateReduxAndLocalStorage = (updatedCart) => {
  //   localStorage.setItem("cart", JSON.stringify(updatedCart));

  //   dispatch({
  //     type: "ADD_TO_CART",
  //     payload: updatedCart,
  //   });
  // };

  // const updateReduxAndLocalStorage = (updatedCart) => {
  //   const mergedCart = handleMergeProducts(updatedCart);

  //   localStorage.setItem("cart", JSON.stringify(mergedCart));

  //   dispatch({
  //     type: "ADD_TO_CART",
  //     payload: mergedCart,
  //   });
  // };

  // console.log(idUser);
  // const cartObject = useSelector((state) => state.cart);
  // console.log(cartObject);
  // const cart = Object.values(cartObject[idUser] || {});
  // console.log(cart);

  const handleMergeProductsOld = (updatedCart) => {
    let mergedCart = [];

    updatedCart.forEach((product) => {
      console.log("test", product.productId);
      const existingProductIndex = mergedCart.findIndex(
        (item) =>
          item.productId === product.productId &&
          item.type === product.type &&
          item.width === product.width &&
          item.height === product.height &&
          item.rail === product.rail
      );

      if (existingProductIndex !== -1) {
        // หากพบสินค้าที่มีข้อมูลเหมือนกันใน mergedCart
        mergedCart[existingProductIndex].count += product.count; // เพิ่มจำนวนสินค้า
      } else {
        // หากไม่พบสินค้าที่มีข้อมูลเหมือนกันใน mergedCart
        mergedCart.push(product);
      }
    });

    return mergedCart;
  };

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

  // useEffect(() => {
  //   // ดึงข้อมูลจาก localStorage
  //   const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart")) || [];
  //   setCart(cartFromLocalStorage);
  //   // อัปเดตข้อมูลใน Redux
  //   dispatch({
  //     type: "ADD_TO_CART",
  //     payload: cartFromLocalStorage,
  //   });
  // }, [cart]);

  //   useEffect(() => {
  //     // ดึงข้อมูลจาก localStorage
  //     const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart")) || {};

  //     // ดึงเฉพาะ array ใน cart object ที่มีชื่อเป็น idUser
  //     const cartArray = Object.values(cartFromLocalStorage);

  //     setCart(cartArray);

  //     // อัปเดตข้อมูลใน Redux
  //     dispatch({
  //         type: "ADD_TO_CART",
  //         payload: cartArray,
  //     });
  // }, [cart]);

  // useEffect(() => {
  //   // ดึงข้อมูลจาก localStorage
  //   const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart")) || {};

  //   // ดึงเฉพาะ array ใน cart object ที่มีชื่อเป็น idUser
  //   // const idUser = "65e5aacf6f455e922446b734"; // หรือให้เป็นค่าที่ต้องการ
  //   const cartArray = cartFromLocalStorage[idUser] || [];

  //   setCart(cartArray);

  //   // อัปเดตข้อมูลใน Redux
  //   dispatch({
  //     type: "ADD_TO_CART",
  //     payload: cartArray,
  //   });
  // }, [cart]);

  console.log("after ", cart);

  const handleChangeCount = (e) => {
    const count = e.target.value < 1 ? 1 : e.target.value;

    //เผื่อจะใส่ quitity
    if (count > item.quatity) {
      toast.error("max avialable Quantity");
      return;
    }

    let cart = {};

    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    //update count
    const updatedCart = cart[idUser].map((product) => {
      if (product.cartId === item.cartId) {
        return {
          ...product,
          count: count,
        };
      }
      return product;
    });

    cart[idUser] = updatedCart;

    //maege
    const mergedCart = handleMergeProducts(updatedCart);
    //save to localStorage
    localStorage.setItem("cart", JSON.stringify(mergedCart));

    dispatch({
      type: "ADD_TO_CART",
      payload: mergedCart,
    });
  };

  const handleChangeWidth = (e) => {
    const width = e.target.value < 1 ? 1 : e.target.value;

    let cart = [];
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    //update count
    const updatedCart = cart[idUser].map((product) => {
      if (product.cartId === item.cartId) {
        return {
          ...product,
          width: width,
        };
      }
      return product;
    });

    cart[idUser] = updatedCart;

    //maege
    const mergedCart = handleMergeProducts(updatedCart);
    //save to localStorage
    localStorage.setItem("cart", JSON.stringify(mergedCart));

    dispatch({
      type: "ADD_TO_CART",
      payload: mergedCart,
    });
  };

  const handleChangeHeight = (e) => {
    const height = e.target.value < 1 ? 1 : e.target.value;

    let cart = [];
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    //update count

    const updatedCart = cart[idUser].map((product) => {
      if (product.cartId === item.cartId) {
        return {
          ...product,
          height: height,
        };
      }
      return product;
    });

    cart[idUser] = updatedCart;

    //maege
    const mergedCart = handleMergeProducts(updatedCart);

    //save to localStorage
    localStorage.setItem("cart", JSON.stringify(mergedCart));

    dispatch({
      type: "ADD_TO_CART",
      payload: mergedCart,
    });
  };

  const handleRailChange = (e) => {
    const { value } = e.target;

    // ทำการอัปเดตค่าใน item โดยตรง
    item.rail = value;

    //save to localStorage
    let cart = [];
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    const updatedCart = cart[idUser].map((product) => {
      if (product.cartId === item.cartId) {
        return {
          ...product,
          rail: value,
        };
      }
      return product;
    });

    cart[idUser] = updatedCart;
    //merge
    const mergedCart = handleMergeProducts(updatedCart);
    //save
    localStorage.setItem("cart", JSON.stringify(mergedCart));

    dispatch({
      type: "ADD_TO_CART",
      payload: mergedCart,
    });
  };

  const handleTypeChange = (e) => {
    const { value } = e.target;

    // ทำการอัปเดตค่าใน item โดยตรง
    item.type = value;

    //save to localStorage
    let cart = [];
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }


    const updatedCart = cart[idUser].map((product) => {
      if (product.cartId === item.cartId) {
        return {
          ...product,
          type: value,
        };
      }
      return product;
    });

    cart[idUser] = updatedCart;

    const mergedCart = handleMergeProducts(updatedCart);

    localStorage.setItem("cart", JSON.stringify(mergedCart));

    dispatch({
      type: "ADD_TO_CART",
      payload: mergedCart,
    });
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
        payload: cart,
      });
    }
  };

  return (
    <tbody>
      
      <tr className="text-center ">
        <td className="text-browntop px-2 py-1 border  border-gray-300 ...">
          {" "}
          <img
            className="w-[300px] rounded"
            src={`${process.env.REACT_APP_API}/images/${item.image}`}
            alt="product"
          />
        </td>
        <td className="w-[100px] text-browntop px-2 py-1 border border-gray-300 ...">
          {item.name}
        </td>
        <td className="text-browntop px-2 py-1 border border-gray-300 ...">
          {item.brand}
        </td>
        <td className="text-browntop px-2 py-1 border border-gray-300 ...">
          {item.detail}
        </td>
        <td className="w-[100px] text-browntop px-2 py-1 border border-gray-300 ...">
          <select value={item.type} onChange={handleTypeChange}>
            <option value="ม่านจีบ">ม่านจีบ</option>
            <option value="ม่านพับ">ม่านพับ</option>
            <option value="ม่านตาไก่">ม่านตาไก่</option>
            <option value="ม่านลอน">ม่านลอน</option>
          </select>
        </td>
        <td className="w-[100px] text-browntop px-2 py-1 border border-gray-300 ...">
          <select value={item.rail} onChange={handleRailChange}>
            <option value="รับราง">รับราง</option>
            <option value="ไม่รับราง">ไม่รับราง</option>
          </select>
        </td>
        <td className="w-[280px] text-browntop px-2 py-1 border border-gray-300 ...">
          <input
            onChange={handleChangeWidth}
            className="form-control w-[100px]"
            type="number"
            value={item.width}
          />{" "}
          <input
            onChange={handleChangeHeight}
            className="form-control w-[100px]"
            type="number"
            value={item.height}
          />
          / cm
        </td>
        <td className=" w-[100px] text-browntop px-2 py-1 border border-gray-300 ...">
          {item.price} บาท
        </td>
        <td className="text-browntop px-2 py-1 border border-gray-300 ...">
          <input
            onChange={handleChangeCount}
            className="form-control w-[75px]"
            type="number"
            value={item.count}
          />
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
