import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { MdDeleteForever } from "react-icons/md";

const ProductInCart = ({ item }) => {
  const dispatch = useDispatch();

  const handleChangeCount = (e) => {
    const count = e.target.value < 1 ? 1 : e.target.value;

    //เผื่อจะใส่ quitity
    if (count > item.quatity) {
      toast.error("max avialable Quantity");
      return;
    }

    let cart = [];
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    //update count
    cart.map((product, i) => {
      if (product.productId == item.productId) {
        cart[i].count = count;
      }
    });

    //save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    dispatch({
      type: "ADD_TO_CART",
      payload: cart,
    });
  };

  const handleRemove = () => {

    let cart = [];
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    //update count
    cart.map((product, i) => {
      if (product.productId == item.productId) {
        cart.splice(i,1) // remove
      }
    });

    //save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    dispatch({
      type: "ADD_TO_CART",
      payload: cart,
    });
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
          {item.type}
        </td>
        <td className="w-[100px] text-browntop px-2 py-1 border border-gray-300 ...">
          {item.rail}
        </td>
        <td className="w-[280px] text-browntop px-2 py-1 border border-gray-300 ...">
        <input
            // onChange={handleChangeCount}
            className="form-control w-[100px]"
            type="number"
            value={item.width}
          />  <input
          // onChange={handleChangeCount}
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
