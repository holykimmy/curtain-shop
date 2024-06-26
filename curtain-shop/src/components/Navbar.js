import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useEffect } from "react";
import { GiShoppingCart } from "react-icons/gi";

// profile menu component

function ProfileMenu({ isLoggedIn, handleLogout, userName, idUser }) {
  //set status
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  console.log("username", userName);
  console.log("Nav login : ", isLoggedIn);
  const profileMenuItems = isLoggedIn
    ? [
        {
          label: "My Profile",
          icon: CiUser,
          to: "/account",
        },
        {
          label: "แก้ไขโปรไฟล์",
          icon: Cog6ToothIcon,
          to: `/edit-profile`,
        },
        {
          label: "ดูคำสั่งซื้อ",
          icon: InboxArrowDownIcon,
          to: "/about-order/confirmed",
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
          <p className="hidden sm:inline-block pl-3 pr-3 text-xs font-normal">{userName}</p>
          <CiUser className="border bg-white/25 rounded-full border-white p-0.5 h-9 w-9" />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <Link to="/cart">
        <GiShoppingCart className="w-10 h-10 p-1 rounded-full hover:shadow-3xl " />
      </Link>

      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon, to, onClick }, key) => (
          <div
            key={label}
            onClick={() => {
              if (onClick) {
                onClick(); // เรียกใช้ฟังก์ชัน onClick ถ้ามีการกำหนด
              }
              closeMenu(); // ปิดเมนูหลังจากคลิก
            }}
            className="flex items-center gap-2 rounded cursor-pointer"
          >
            {React.createElement(icon, {
              className: "h-4 w-4 mt-2 ml-2 mb-2",
              strokeWidth: 2,
            })}
            {to ? (
              <Link to={to} className="w-full">
                <Typography
                  as="span"
                  variant="small"
                  className="font-normal"
                  color="inherit"
                >
                  {label}
                </Typography>
              </Link>
            ) : (
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color="inherit"
              >
                {label}
              </Typography>
            )}
          </div>
        ))}
      </MenuList>
    </Menu>
  );
}

// nav list menu
const navListMenuItems = [
  {
    title: "ผ้ากำมะหยี่",
    description: "3",
    to: "/product/velvet",
  },
  {
    title: "ผ้าฝ้าย",
    description: "2",
    to: "/product/cotton",
  },
  {
    title: "ผ้าผ้าซาติน",
    description: "3",
    to: "/product/satin",
  },
  {
    title: "ผ้าลินิน",
    description: "4",
    to: "/product/linen",
  },
  {
    title: "ผ้าใยสังเคราะห์",
    description: "5",
    to: "/product/polyester",
  },
  {
    title: "ผ้าใยผสม",
    description: "6",
    to: "/product/mixed",
  },
  {
    title: "ผ้ากันแสง",
    description: "7",
    to: "/product/blackout",
  },
  {
    title: "ผ้าโปร่ง",
    description: "8",
    to: "/product/sheer",
  },
  
];

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const renderItems = navListMenuItems.map(({ title, description, to }) => (
    <Link to={to} key={title}>
      <MenuItem>
        <Typography variant="h7" className="mb-1 text-xs md:text-sm font-Kanit">
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
              <p className="text-xs md:text-sm">สินค้า</p>
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
      <MenuItem className="flex text-xs md:text-sm items-center gap-2 text-Kanit lg:hidden">
        สินค้า
      </MenuItem>
      <ul className="ml-6 flex  text-xs md:text-sm flex-col gap-1 lg:hidden text-white">
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
    label: "ผลงานของร้าน",
    icon: CubeTransparentIcon,
    to: "/Achievements",
  },

  {
    label: "ติดต่อเรา",
    icon: CodeBracketSquareIcon,
    to: "/contact",
  },
];

function NavList() {
  return (
    <ul className="mb-4 mt-2 flex flex-col  lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      <NavListMenu />
      {navListItems.map(({ label, to }, key) => (
        <Typography
          key={label}
          as="a"
          href={to}
          color="white"
          className="font-Kanit text-xs md:text-sm lg:text-sm"
        >
          <MenuItem className="flex items-center gap-2 lg:rounded-full">
            {label}
          </MenuItem>
        </Typography>
      ))}
      <NavListMenuAbout />
    </ul>
  );
}
// nav list menu about
const navListMenuItemsAbout = [
  {
    title: "ผ้าม่านและราง",
    description: "1",
    to: "/recommended-curtain",
  },
  {
    title: "ประเภทของผ้า",
    description: "2",
    to: "/Fabric-Type",
  },
  {
    title: "วิธีการวัดผ้าม่าน",
    description: "3",
    to: "/gauging-curtain",
  },
];

function NavListMenuAbout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const renderItems = navListMenuItemsAbout.map(
    ({ title, description, to }) => (
      <Link to={to} key={title}>
        <MenuItem>
          <Typography variant="h7" className="mb-1 text-xs md:text-sm font-Kanit">
            {title}
          </Typography>
          {/* <Typography variant="small" className="font-normal font-Kanit ">
          {description}
        </Typography> */}
        </MenuItem>
      </Link>
    )
  );

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
              <p className="text-xs md:text-sm">เกี่ยวกับผ้าม่าน</p>
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
      <MenuItem className="flex text-xs md:text-sm items-center gap-2 text-Kanit lg:hidden">
        เกี่ยวกับผ้าม่าน
      </MenuItem>
      <ul className="ml-6 flex  text-xs md:text-sm flex-col gap-1 lg:hidden text-white">
        {renderItems}
      </ul>
    </React.Fragment>
  );
}



  // const navigate = useNavigate();
function ComplexNavbar({ isLoggedIn, idUser, userName, handleLogout }) {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth <= 960 && setIsNavOpen(false)
    );
  }, []);
  
  

  useEffect(() => {
    
  }, [isLoggedIn, userName, idUser]);



  return (
    <>
      <Navbar className="fixed top-0 z-10 shadow-md h-max max-w-full border-none rounded-none  px-4 lg:px-8 py-2 bg-browntop">
        <div className="relative mx-auto flex items-center text-white">
          <Typography
            as="a"
            href="/"
            className="mr-4 ml-2  text-xs sm:text-sm lg:text-base xl:text-md font-Kanit cursor-pointer py-1.5 font-medium"
          >
            Curtain Shop
          </Typography>
          <div className="absolute top-2/4 left-[40%] hidden -translate-x-2/4 -translate-y-2/4 lg:block">
            <NavList />
          </div>

          <div className="absolute top-2/4 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block"></div>

          <IconButton
            size="sm"
            color="white"
            variant="text"
            onClick={toggleIsNavOpen}
            className="ml-auto mr-2 lg:hidden"
          >
            <Bars2Icon className="h-6 w-6" />
          </IconButton>
          <ProfileMenu
            idUser={idUser}
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
            userName={userName}
          />
        </div>

        <MobileNav open={isNavOpen} className="overflow-scroll">
          <NavList />
        </MobileNav>
      </Navbar>
      <div class=" pt-[60px]"></div>
    </>
  );
}
export default ComplexNavbar;
