import React from "react";
import Navbaradmin from "./Navbaradmin";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Customers() {
  return (
    <>
      <Navbaradmin />
      <div className="row ml-5 mr-5 mt-5 text-center shadow-xl ">
        <div className="col-md-12">customers</div>
      </div>
    </>
  );
}

export default Customers;
