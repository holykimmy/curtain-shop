import React from "react";
import { Image, Transformation } from "cloudinary-react";

const TransformedImage = ({ rgb, selectedCurtain }) => {
  return (
    <Image width="500" height="auto" publicID={selectedCurtain.main + ".png"}>
      <Transformation
        effect={"red:" + ((-0.75 + rgb.r / 255) * 100).toFixed(0)}
      />
      <Transformation
        effect={"blue:" + ((-0.80 + rgb.b / 255) * 100).toFixed(0)}
      />
      <Transformation
        effect={"green:" + ((-0.75 + rgb.g / 255) * 100).toFixed(0)}
      />
    </Image>
  );
};
export default TransformedImage;
