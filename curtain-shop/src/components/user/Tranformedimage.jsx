import React, { useEffect } from "react";
import { Image, Transformation } from "cloudinary-react";
import Swal from "sweetalert2";


const TransformedImage = ({ rgb, selectedCurtain }) => {



  return (
    <Image className="w-[800px]" publicID={selectedCurtain.main}>
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
