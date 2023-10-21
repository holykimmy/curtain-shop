import React from "react";
import { Slide } from "react-slideshow-image";
import img1 from "../img/img1.jpg";
import img2 from "../img/img2.jpg";
import img3 from "../img/img3.jpg";

import "react-slideshow-image/dist/styles.css";


const proprietes = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true,
};

const Slideshow = () => {
  return (
    <div className="flex h-[450px]">
    <div className="containerSlide items-center w-full m-auto pt-auto relative justify-center">
      <Slide {...proprietes}>
        <div className="each-slide">
          <div>
            <img class="flex relative self-center h-[400px] md:h-[450px] justify-center" src={img1} alt="img1"   />
          </div>
        </div>
        <div className="each-slide items-center">
          <div>
            <img class="flex relative self-center h-[400px] md:h-[450px] justify-center" src={img2} alt="img2" />
          </div>
        </div>
        <div className="each-slide items-center">
          <div>
            <img class="flex relative self-center h-[400px] md:h-[450px] justify-center" src={img3} alt="img3" />
          </div>
        </div>
      </Slide>
      <div class="top-right absolute rounded-l-3xl top-[8px] right-0 pl-0 w-[30%] p-2 pl-5 text-md md:text-2xl lg:text-3xl bg-white/75 text-b-font shadow-lg hover:shadow-2xl">รูปแบบผ้าม่าน</div>
    </div>
    </div>
  );
};

export default Slideshow;
