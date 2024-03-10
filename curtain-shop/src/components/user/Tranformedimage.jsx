import React from "react";
import { Image, Transformation } from "cloudinary-react";

const TransformedImage = ({ rgb, selectedCurtain }) => {
  return (
    <Image className="w-[800px]" publicID={selectedCurtain.main + ".png"}>
      {" "}
      <Transformation effect={"brightness:-25"} />
      <Transformation
        effect={"red:" + ((-0.75 + rgb.r / 255) * 100).toFixed(0)}
      />
      <Transformation
        effect={"blue:" + ((-0.75 + rgb.b / 255) * 100).toFixed(0)}
      />
      <Transformation
        effect={"green:" + ((-0.76 + rgb.g / 255) * 100).toFixed(0)}
      />
    </Image>
  );
};
export default TransformedImage;
