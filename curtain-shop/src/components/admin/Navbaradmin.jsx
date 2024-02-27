import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  IconButton,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  InboxArrowDownIcon,
  PowerIcon,
  Bars2Icon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function ComplexNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [userData, setUserData] = React.useState("");

  const navigate = useNavigate();
  const navListItems = [
    {
      label: "จัดการสินค้า",
      to: "/dashboard",
    },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: `คุณต้องการออกจากระบบใช่หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        // ยืนยันออกจากระบบ
        localStorage.removeItem("token");
        setUserName("");

        // ใช้ useNavigate เพื่อนำผู้ใช้กลับไปยังหน้าหลัก
        navigate("/"); // ลิงก์ไปยังหน้าหลัก
      }
    });
  };

  const handleLogoutAuto = () => {
    // Logout user
    localStorage.removeItem("token");
    setUserName(""); // Clear user name or any other relevant state

    // Redirect to login page or perform any other action
    navigate("/login"); // Redirect to login page
  };

  const closeMenu = () => setIsMenuOpen(false);
  useEffect(() => {
    const authToken = localStorage.getItem("token");
    console.log("authToken", authToken);

    if (authToken) {
      // Set up axios default headers
      axios.defaults.headers.common["authtoken"] = authToken;

      const decodedToken = jwtDecode(authToken); // Decode the token

      if (decodedToken && decodedToken.user) {
        const { f_name, l_name } = decodedToken.user;
        setUserName(`${f_name} ${l_name}`);
      }
      if (
        decodedToken &&
        decodedToken.exp &&
        decodedToken.exp * 1000 < Date.now()
      ) {
        // Token expired, logout user
        handleLogoutAuto();
      }

      if (decodedToken && decodedToken.user) {
        // Check if user is admin
        if (decodedToken.user.role !== "admin") {
          // If user is not admin, redirect to login page or show unauthorized message
          // Redirecting to login page:
          window.location.href = "/login"; // Change '/login' to your actual login page route
          // Showing unauthorized message:
          // Swal.fire("Unauthorized", "You are not authorized to access this page", "error");
        } else {
          setUserData(decodedToken.user);
        }
      }
    } else {
      // If no token found, redirect to login page or show unauthorized message
      // Redirecting to login page:
      window.location.href = "/login"; // Change '/login' to your actual login page route
      // Showing unauthorized message:
      Swal.fire(
        "Unauthorized",
        "You are not authorized to access this page",
        "error"
      );
    }
  }, []);

  const profileMenuItems = [
    {
      label: "การแจ้งเตือน",
      icon: InboxArrowDownIcon,
    },
    {
      label: "ออกจากระบบ",
      icon: PowerIcon,
      onClick: handleLogout,
    },
  ];

  const [isNavOpen, setIsNavOpen] = React.useState(false);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);

  return (
    <>
      <Navbar className="fixed top-0 z-10 shadow-md h-max max-w-full border-none rounded-none px-4 lg:px-8 py-2 bg-browntop">
        <div className="relative mx-auto flex items-center text-white">
          <Typography
            as="a"
            href="/"
            className="mr-4 ml-2 text-2xl font-Kanit cursor-pointer py-1.5 font-medium"
          >
            Curtain Shop
          </Typography>
          <div className="absolute top-2/4 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block">
            <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
              {navListItems.map(({ label, to }) => (
                <Typography
                  key={label}
                  as="a"
                  href={to}
                  variant="small"
                  color="white"
                  className="font-Kanit text-base"
                >
                  {label}
                </Typography>
              ))}
            </ul>
          </div>
          <IconButton
            size="sm"
            color="white"
            variant="text"
            onClick={toggleIsNavOpen}
            className="ml-auto mr-2 lg:hidden"
          >
            <Bars2Icon className="h-6 w-6" />
          </IconButton>
          <Menu
            open={isMenuOpen}
            handler={setIsMenuOpen}
            placement="bottom-end"
          >
            <MenuHandler>
              <Button
                variant="text"
                color="white"
                className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
              >
                <p>{userName}</p>
                <CiUser className="border bg-white/25 rounded-full border-white p-0.5 h-9 w-9" />
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`h-3 w-3 transition-transform ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </MenuHandler>

            <MenuList className="p-1">
              {profileMenuItems.map(({ label, icon, onClick }) => (
                <div
                  key={label}
                  onClick={() => {
                    onClick(); // เรียกใช้ฟังก์ชัน handleLogout เมื่อคลิกที่เมนู "ออกจากระบบ"
                    closeMenu(); // ปิดเมนูหลังจากคลิก
                  }}
                  className="flex items-center gap-2 rounded"
                >
                  {React.createElement(icon, {
                    className: "h-4 w-4 mt-2 ml-2 mb-2",
                    strokeWidth: 2,
                  })}
                  <Typography
                    as="span"
                    variant="small"
                    className="font-normal"
                    color="inherit"
                  >
                    {label}
                  </Typography>
                </div>
              ))}
            </MenuList>
          </Menu>
        </div>
        <MobileNav open={isNavOpen} className="overflow-scroll">
          <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
            {navListItems.map(({ label, to }) => (
              <Typography
                key={label}
                as="a"
                href={to}
                variant="small"
                color="white"
                className="font-Kanit text-base"
              >
                {label}
              </Typography>
            ))}
          </ul>
        </MobileNav>
      </Navbar>
      <div className="welcome pt-[60px]"></div>
    </>
  );
}

export default ComplexNavbar;
