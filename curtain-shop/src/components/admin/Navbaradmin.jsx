import React from "react";
// import { Link } from "react-router-dom";
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

// profile menu component
const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    label: "Edit Profile",
    icon: Cog6ToothIcon,
  },
  {
    label: "Inbox",
    icon: InboxArrowDownIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const closeMenu = () => setIsMenuOpen(false);

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
          return (
            <MenuItem
              key={label}
              onClick={closeMenu}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  // ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  ? ""
                  : ""
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




// nav list component
const navListItems = [
  {
    label: "จัดการสินค้า",
    icon: UserCircleIcon,
    to: "/menu",
  },
 
];

function NavList() {
  return (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
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
      {/* <div className="top-[50%] bg-white fixed">
        <div class="bg-blue-500 sm:bg-green-500 md:bg-yellow-500 lg:bg-red-500 xl:bg-purple-500">
          bg-blue-500 sm:bg-green-500 md:bg-yellow-500 lg:bg-red-500
          xl:bg-purple-500
        </div>
        <p class="text-md sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
          text-md sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl{" "}
        </p>
      </div> */}

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
