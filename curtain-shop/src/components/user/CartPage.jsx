import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import Footer from "../Footer";
import { Link, useNavigate, useHistory } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ProductInCart from "./ProductIncart";
function CartPage() {
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState("");
  const [idUser, setIdUser] = useState("");
  const [user, setUser] = React.useState({
    f_name: "",
    l_name: "",
    email: "",
    tell: "",
    address: ""
  });

  

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (authToken) {
      // Set up axios default headers
      axios.defaults.headers.common["authtoken"] = authToken;

      const decodedToken = jwtDecode(authToken); // Decode the token

      if (decodedToken && decodedToken.user) {
        const { f_name, l_name } = decodedToken.user;

        const id = decodedToken.id;
        setUserName(`${f_name} ${l_name}`);
        setIdUser(`${id}`);
        setUser({
          f_name: f_name,
          l_name: l_name,
          email: decodedToken.user.email,
          tell: decodedToken.user.tell,
          address: decodedToken.user.address
        });
        setIsLoggedIn(true);

      } else {
        setUserData(decodedToken.user);
      }

      if (
        decodedToken &&
        decodedToken.exp &&
        decodedToken.exp * 1000 < Date.now()
      ) {
        // Token expired, logout user
        handleLogoutAuto();
      }
    } else {
      setIsLoggedIn(false);
    }
    
  }, [idUser]);

  console.log(idUser);
  const cartObject = useSelector((state) => state.cart);
  console.log(cartObject);
  const cart = Object.values(cartObject[idUser] || {});

  const getTotal = () => {
    return cart.reduce((currenValue, nextValue) => {
      return currenValue + nextValue.count * nextValue.totalPiece;
    }, 0);
  };

  const handleLogoutAuto = () => {
    // Logout user
    localStorage.removeItem("token");
    setUserName(""); // Clear user name or any other relevant state

    // Redirect to login page or perform any other action
    navigate("/"); // Redirect to login page
  };

  const handleLogout = () => {
    Swal.fire({
      text: `คุณต้องการออกจากระบบใช่หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่"
    }).then((result) => {
      if (result.isConfirmed) {
        
        localStorage.removeItem("token");

        setUserName("");

        navigate("/"); // ลิงก์ไปยังหน้าหลัก
      }
    });
  };
  //login check

  //save order
  const handleSaveOrder = async (e) => {
    console.log(idUser);
    console.log(cart);
    try {
     
      const response = await axios.post(
        `${process.env.REACT_APP_API}/customer/cart`,
        { idUser, cart }
      );

      if (response.status === 200) {
        console.log("บันทึกสำเร็จ!");
        

        Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ!",
          text: "ข้อมูลของคุณได้รับการบันทึกเรียบร้อยแล้ว"
        }).then(() => {
          localStorage.removeItem("cart");
          const idOrder = response.data._id;
          navigate(`/check-order/${idOrder}`);
          // navigate("/check-order");
          // ทำอื่นๆ ตามที่ต้องการหลังจากบันทึกสำเร็จ
        });
      } else {
        console.log("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
       

      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเรียกใช้ API:", error);
      

    }
  };

  const showCartItems = () => {
    return (
      <>
        {" "}
        <table className="min-w-full text-left text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr className="border-b dark:border-neutral-500">
              <th className="hidden sm:table-cell  text-xs font-normal text-browntop px-2 py-1 border border-gray-300 ">
                รูปภาพ
              </th>
              <th className="text-xs font-normal text-browntop px-2 py-1 border  border-gray-300 ">
                รหัสสินค้า
              </th>
              <th className="text-xs font-normal text-browntop px-2 py-1 border border-gray-300 ">
                ยี่ห้อสินค้า
              </th>
              <th className="hidden sm:table-cell text-xs font-normal text-browntop px-2 py-1 border border-gray-300 ">
                รายละเอียด
              </th>
              <th className="text-xs font-normal text-browntop px-2 py-1 border border-gray-300 ">
                ประเภท
              </th>
              <th className="text-xs font-normal text-browntop px-2 py-1 border border-gray-300 ">
                ม่าน2ชั้น
              </th>
              <th className="text-xs font-normal text-browntop px-2 py-1 border border-gray-300 ">
                ราง
              </th>
              <th className="text-xs font-normal text-browntop px-2 py-1 border border-gray-300 ">
                ขนาด
              </th>

              <th className="text-xs font-normal text-browntop px-2 py-1 border border-gray-300 ">
                จำนวนสินค้า
              </th>
              <th className="text-xs font-normal text-browntop px-2 py-1 border border-gray-300 ">
                ราคา
              </th>
              <th className="text-xs font-normal text-browntop px-2 py-1 border border-gray-300 "></th>
            </tr>
          </thead>
          {cart.map((item) => (
            <ProductInCart idUser={idUser} key={item.productId} item={item} />
          ))}
        </table>
      </>
    );
  };

  const numberWithCommas = (x) => {
    if (x == null) {
      // เพิ่มการตรวจสอบค่า null หรือ undefined
      return ""; // หรือค่าที่คุณต้องการให้ส่งออก
    }
    const formattedNumber = parseFloat(x).toFixed(2);
    return formattedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };




  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        userName={userName}
        idUser={idUser}
      ></Navbar>
      <div class="titlea bg-brown-bg py-1 shadow-md">
        <BsPinFill className=" inline-block ml-7 text-shadow w-6 h-6 md:w-8 md:h-8 xl:w-9 xl:h-9 text-b-font"></BsPinFill>
        <h5 className=" inline-block text-lg md:text-xl xl:text-2xl text-b-font  pl-4 p-2 my-1">
          รายการสินค้าของคุณ
        </h5>
      </div>
      {/* Cart */}
      <div className="container-fluid">
        {/* <div className="flex-row"> Cart Page </div> */}
        <div className="col-md-8 text-brown-500 text-lg text-center my-5 ">
          {" "}
          ตระกร้าสินค้า  {cart.length} ชุด
        </div>
        <div className="overflow-x-auto">
          {!cart.length ? <p>ไม่มีสินค้าในตระกร้า</p> : showCartItems()}

          <div className="flex-col items-center mr-10 justify-center">
            {" "}
            <hr />
            <h4 className=" text-center text-brown-400 my-3">รายการสินค้า </h4>
            <hr />
            <hr />
            {cart.map((item, index) => (
              <>
                <p key={index} className="ml-10 text-sm md:text-base lg:text-base text-brown-400 my-2">
                  {item.name} ขนาด {item.width} x {item.height} เซนติเมตร จำนวน{" "}
                  {item.count} ชุด {item.rail}
                </p>
                <p className="ml-[60px]  text-sm md:text-base lg:text-base  text-brown-400 my-2">
                  ราคา {numberWithCommas(item.totalPiece)} บาท
                </p>
              </>
            ))}
            <hr />
            <hr />
            <h4 className=" ml-10  text-sm md:text-base lg:text-base text-brown-400 my-2 ">
              ราคารวม : {numberWithCommas(getTotal())} บาท{" "}
            </h4>
            <hr />
            <div className="flex items-center justify-center">
              {isLoggedIn ? (
                <button
                  className="my-4 text-white hover:shadow-2xl bg-green-400 rounded-xl p-2 w-[150px]"
                  disabled={!cart.length}
                  onClick={handleSaveOrder}
                >
                  ชำระเงิน
                </button>
              ) : (
                <Link to="/login" state="cart">
                  <button className="my-4 text-white hover:shadow-2xl bg-red-400 rounded-xl p-2 w-[150px]">
                    {" "}
                    เข้าสู่ระบบเพื่อทำรายการต่อ{" "}
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}
export default CartPage;
