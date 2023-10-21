import React from "react";
import Navbar from "../Navbar";
import { BsPinFill } from "react-icons/bs";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import blackout from "../img/products/blackout.jpeg";
import Footer from "../Footer";
import { useEffect, useState } from "react";
import { CloudinaryContext } from "cloudinary-react";
import {
  SliderPicker,
  SwatchesPicker,
  ChromePicker,
  CirclePicker
} from "react-color";
import TransformedImage from "./Tranformedimage";
const { Alpha } = require("react-color/lib/components/common");

function ContactPage() {
    const default_product = {
        id: 1,
        main: "test2_ocvii1"
      };
    
      const [curtain, setCurtain] = useState([
        default_product,
        { id: 2, main: "test1_gvyquf" },
        { id: 3, main: "curtain_fev3fs" }
      ]);
    
      const [selectedCurtain, setSelectedCurtain] = useState(default_product);
      const [background, setBackground] = useState({
        rgb: { r: 160, g: 25, b: 25 }
      });
    
      const [currentColor, setCurrentColor] = useState("#3D3D44");
      const appStyle = {
        height: "100vh",
        color: "white",
        backgroundColor: currentColor.hex,
        transition: "ease all 300ms"
      };
    
      const selectProduct = (productThumbail) => {
        selectedCurtain(productThumbail);
      };
    
      const changeProductColor = (color) => {
        setBackground(color);
      };
  return (
    <>
      <Navbar></Navbar>
      <div className="App">
      <CloudinaryContext cloudName="dwmpdaqqh">
        <div className="image__container">
          <div className="image">
            <TransformedImage
              rgb={background.rgb}
              selectedCurtain={selectedCurtain}
            />
          </div>
          <CirclePicker
            color={background}
            onChangeComplete={changeProductColor}
          />
        </div>
        <div className="image__thumbnail">
          {curtain.map((curtain_fev3fs) => (
            <div
              id="div2"
              className="thumbnail"
              key={curtain_fev3fs.id}
              // onClick={() => selectProduct(curtain_fev3fs)}
            >
              <TransformedImage
                rgb={background.rgb}
                selectedCurtain={curtain_fev3fs}
              />
            </div>
          ))}
        </div>
      </CloudinaryContext>
    </div>

     

      <Footer></Footer>
    </>
  );
}
export default ContactPage;
