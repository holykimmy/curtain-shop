const express = require("express");
const multer = require("multer");
const path = require("path");
const slugify = require("slugify");
// const AWS = require('aws-sdk');
const { v4: uuidv4 } = require("uuid");


// Multer storage configuration for show images
const storageShow = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "./images/show"); // ระบุโฟลเดอร์ที่คุณต้องการเก็บไฟล์ show
    },
    filename: (req, file, cb) => {
      const { brand, p_type, name } = req.body;
  
      const slugBrand = slugify(brand, { lower: true });
      const slugPType = slugify(p_type, { lower: true });
      const slugName = slugify(name, { lower: true });
  
      const newFilename = `${slugBrand}-${slugPType}-${slugName}-${uuidv4()}-${path.extname(
        file.originalname
      )}`;
  
      cb(null, newFilename);
    },
  });
  const uploadShow = multer({ storage: storageShow }).single("image");

  module.exports =  uploadShow ;
