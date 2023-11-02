import React from "react";
import Navbaradmin from "./Navbaradmin";
function Orders (){
    return (
        <>
          <Navbaradmin/>
          <div class="flex justify-center shadow-lg p-3">
          <p className="text-base md:text-xl xl:text-2xl text-b-font ">
            ข้อมูลการสั่งตัดสินค้า
          </p>
          </div>
        </>
      );
    
}

export default Orders ;