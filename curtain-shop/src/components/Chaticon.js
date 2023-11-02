import React from "react";
import { HiOutlineChat } from "react-icons/hi";
import line from "./img/icon/line.png";
import {
  IconButton,
  SpeedDial,
  SpeedDialHandler,
  SpeedDialContent,
  SpeedDialAction,
} from "@material-tailwind/react";

function Chaticon() {
  return (
    <div className=" fixed right-[5%] bottom-[7%] justify-center">
      <SpeedDial>
        <SpeedDialHandler>
          <IconButton
            size="lg"
            className="rounded-full p-[30px] md:p-[45px] md:w-[45px]  shadow-xl text-b-font hover:text-brown-400 bg-white hover:shadow-2xl "
          >
            <HiOutlineChat className="h-12 w-12 md:h-[70px] md:w-[70px] transition-transform group-hover:rotate-45" />
          </IconButton>
        </SpeedDialHandler>
        <SpeedDialContent>
          <SpeedDialAction>
            <a href="https://lin.ee/G2OgdGY">
              <img src={line} alt="line" className="h-12 w-12 md:h-[70px] md:w-[70px]" />
            </a>
          </SpeedDialAction>
        </SpeedDialContent>
      </SpeedDial>
    </div>
  );
}
export default Chaticon;
