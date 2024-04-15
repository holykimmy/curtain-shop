import React from "react";
import { Slide } from "react-slideshow-image";
import img1 from "../img/img1.jpg";
import img2 from "../img/img2.jpg";
import img3 from "../img/img3.jpg";
import img4 from "../img/img4.jpg";
import img5 from "../img/img5.jpg";
import img6 from "../img/img6.jpg";
import img7 from "../img/img7.jpg";
import img8 from "../img/img8.jpg";
import img9 from "../img/img9.png";
import img10 from "../img/img10.jpg";
import { Link, useNavigate } from "react-router-dom";

import "react-slideshow-image/dist/styles.css";

const proprietes = {
  duration: 1500,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true
};

const Slideshow = () => {
  return (
    <div className="flex h-[450px]">
      <div className="containerSlide items-center w-full m-auto pt-auto relative justify-center">
        <Slide {...proprietes} className="flex">
          {[img1, img2, img3, img4, img5, img6, img7, img8, img9, img10].map(
            (img, index) => (
              <div
                key={index}
                className="flex  justify-center flex-row each-slide items-center "
              >
                <div className=" flex flex-row justify-center">
                  <div className="flex">
                    <img
                      className=" object-contain h-[350px] md:h-[450px] justify-center my-2"
                      src={img}
                      alt={`img${index + 1}`}
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </Slide>
        <Link to="product/polyester">
          <div className="top-right absolute rounded-l-3xl top-[8px] right-0 w-[100px] sm:w-[120px] md:w-[150px] lg:w-[150px] xl:w-[150px] p-2 pl-5 text-xs md:text-md lg:text-xl bg-white/75 text-b-font shadow-lg hover:shadow-2xl">
            รูปแบบผ้าม่าน
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Slideshow;
