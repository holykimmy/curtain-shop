import React from "react";
import { Slide } from "react-slideshow-image";
import sh1 from "../img/sh1.jpeg";
import sh2 from "../img/sh2.jpeg";
import sh3 from "../img/sh3.jpeg";
import sh4 from "../img/sh4.jpeg";

const proprietes = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true,
};

const Showimg = () => {
  return (
    <>
      <div className="flex row mb-4 p-3 ">
        <div className="container">
          <div className="flex pt-10 pr-2 ">
            <img class="sh3 shadow-lg hover:shadow-2xl rounded-sm" src={sh3} alt="sh3" />
          </div>
          <div className="flex pr-2 pt-4 ">
            <img class="sh3 shadow-lg hover:shadow-2xl rounded-sm" src={sh1} alt="sh4" />
          </div>
        </div>
        <div className="container">
          <div className="flex pl-2 ">
            <img class="sh3 shadow-lg hover:shadow-2xl rounded-sm" src={sh4} alt="sh1" />
          </div>
          <div className="flex pl-2 pt-4">
            <img class="sh3 shadow-lg hover:shadow-2xl rounded-sm" src={sh2} alt="sh2" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Showimg;
