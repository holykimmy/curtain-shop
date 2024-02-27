import React from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  PowerIcon,
  Bars2Icon,
} from "@heroicons/react/24/outline";
import { CiUser } from "react-icons/ci";
import { useState, useEffect } from "react";
import axios from "axios";

// profile menu component


function ProfileMenu({ isLoggedIn, handleLogout }) {

  //set status
  const [data, setData] = useState({
    f_name: "",
    l_name: "",
    username: "",
    email: "",
    tell: "",
    password: "",
    confirmPassword: "",
  });
  const { f_name, l_name, username, email, tell } = data;

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const profileMenuItems = isLoggedIn
  ? [
      {
        label: "My Profile",
        icon: CiUser,
      },
      {
        label: "แก้ไขโปรไฟล์",
        icon: Cog6ToothIcon,
      },
      {
        label: "ตระกร้าสินค้า",
        icon: InboxArrowDownIcon,
      },
      {
        label: "ออกจากระบบ",
        icon: PowerIcon,
        onClick: handleLogout,
      },
    ]
  : [
      {
        label: "เข้าสู่ระบบ",
        icon: PowerIcon,
         to: "/login",
      },
    ];

  

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="white"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
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
        {profileMenuItems.map(({ label, icon }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          const isLogout = label === "ออกจากระบบ";
          return (
            <MenuItem
              key={label}
              onClick={closeMenu}
              className={`flex items-center gap-2 rounded ${
                isLastItem ? "" : ""
              }`}

            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

// nav list menu
const navListMenuItems = [
  {
    title: "ผ้ากำมะหยี่",
    description: "3",
    to: "/products",
  },
  {
    title: "ผ้าฝ้าย",
    description: "2",
    to: "/register",
  },
  {
    title: "ผ้าผ้าซาติน",
    description: "3",
    to: "/register",
  },
  {
    title: "ผ้าลินิน",
    description: "4",
    to: "/register",
  },
  {
    title: "ผ้าใยสังเคราะห์",
    description: "5",
    to: "/product/polyester",
  },
  {
    title: "ผ้าใยผสม",
    description: "6",
    to: "/register",
  },
  {
    title: "ผ้ากันแสง",
    description: "7",
    to: "/register",
  },
  {
    title: "ม่านล็อกลอน",
    description: "4",
    to: "/register",
  },
  {
    title: "อุปกรณ์ในการติดตั้ง",
    description: "4",
    to: "/register",
  },
];

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const renderItems = navListMenuItems.map(({ title, description, to }) => (
    <Link to={to} key={title}>
      <MenuItem>
        <Typography variant="h7" className="mb-1 font-Kanit">
          {title}
        </Typography>
        {/* <Typography variant="small" className="font-normal font-Kanit ">
          {description}
        </Typography> */}
      </MenuItem>
    </Link>
  ));

  return (
    <React.Fragment>
      <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography
            as="a"
            href="#"
            variant="small"
            className="font-normal text-Kanit"
          >
            <MenuItem className="hidden items-center gap-2 text-base text-white text-Kanit lg:flex lg:rounded-full">
              <p>สินค้า</p>
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden grid-cols-5 gap-3 overflow-visible lg:grid text-b-font">
          <ul className="col-span-5 flex w-full flex-col">{renderItems}</ul>
        </MenuList>
      </Menu>
      <MenuItem className="flex items-center gap-2 text-Kanit text-lg lg:hidden">
        สินค้า
      </MenuItem>
      <ul className="ml-6 flex  text-sm flex-col gap-1 lg:hidden text-white">
        {renderItems}
      </ul>
    </React.Fragment>
  );
}

// nav list component
const navListItems = [
  {
    label: "หน้าหลัก",
    icon: UserCircleIcon,
    to: "/",
  },
  {
    label: "บริการของเรา",
    icon: CubeTransparentIcon,
    to: "/service",
  },
  {
    label: "แนะนำผ้าม่าน",
    icon: CubeTransparentIcon,
    to: "/recommended-curtain",
  },
  {
    label: "วิธีการวัดผ้าม่าน",
    icon: CubeTransparentIcon,
    to: "/gauging-curtain",
  },
  {
    label: "ติดต่อเรา",
    icon: CodeBracketSquareIcon,
    to: "/contact",
  },
];

function NavList() {
  return (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      <NavListMenu />
      {navListItems.map(({ label, to }, key) => (
        <Typography
          key={label}
          as="a"
          href={to}
          variant="small"
          color="white"
          className="font-Kanit text-base"
        >
          <MenuItem className="flex items-center gap-2 lg:rounded-full">
            {label}
          </MenuItem>
        </Typography>
      ))}
    </ul>
  );
}

function ComplexNavbar() {
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
      <Navbar className="fixed top-0 z-10 shadow-md h-max max-w-full border-none rounded-none  px-4 lg:px-8 py-2 bg-browntop">
        <div className="relative mx-auto flex items-center text-white">
          <Typography
            as="a"
            href="/"
            className="mr-4 ml-2  text-2xl font-Kanit cursor-pointer py-1.5 font-medium"
          >
            Curtain Shop
          </Typography>
          <div className="absolute top-2/4 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block">
            <NavList />
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
          <ProfileMenu />
        </div>
        <MobileNav open={isNavOpen} className="overflow-scroll">
          <NavList />
        </MobileNav>
      </Navbar>
      <div class="welcome pt-[60px]"></div>
    </>
  );
}
export default ComplexNavbar;
