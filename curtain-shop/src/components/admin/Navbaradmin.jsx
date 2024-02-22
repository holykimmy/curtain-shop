import React from "react";
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
  UserCircleIcon,
  ChevronDownIcon,
  InboxArrowDownIcon,
  PowerIcon,
  Bars2Icon,
} from "@heroicons/react/24/outline";
import { CiUser } from "react-icons/ci";
import { Collapse } from '@material-tailwind/react';
const profileMenuItems = [
  {
    label: "การแจ้งเตือน",
    icon: InboxArrowDownIcon,
  },
  {
    label: "ออกจากระบบ",
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
        {profileMenuItems.map(({ label, icon }) => (
          <div
            key={label}
            onClick={closeMenu}
            className="flex items-center gap-2 rounded"
          >
            {React.createElement(icon, { className: "h-4 w-4", strokeWidth: 2 })}
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
  );
}

const navListItems = [
  {
    label: "จัดการสินค้า",
    to: "/dashboard",
  },
];

function NavList() {
  return (
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
      <div className="welcome pt-[60px]"></div>
    </>
  );
}

export default ComplexNavbar;
