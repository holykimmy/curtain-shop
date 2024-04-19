const express = require("express");
const multer = require("multer");
const path = require("path");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const { S3 } = require("@aws-sdk/client-s3");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const dayjs = require("dayjs");
const localizedFormat = require("dayjs/plugin/localizedFormat");
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const thLocale = require('dayjs/locale/th');

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(thLocale);
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dwmpdaqqh",
  api_key: "259245877468621",
  api_secret: "WHxSl_cCNMt2HSm6MbRe4sc1j9s"
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "charoenkit", // กำหนดโฟลเดอร์ที่จะบันทึกภาพ
      allowed_formats: ["jpg", "png"], // กำหนดนามสกุลไฟล์ที่อนุญาต
      transformation: [{ width: 500, height: 500, crop: "limit" }] 
    }
  });
  
  const uploadBgtype = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
      } else {
        cb(new Error("รูปภาพจะต้องเป็นรูปภาพประเภท JPEG หรือ PNG เท่านั้น"));
      }
    },
    limits: {
      fileSize: 1024 * 1024 * 5 // ขนาดไฟล์ไม่เกิน 5 MB
    },
    key: (req, file, cb) => {
      const currentDate = dayjs().format("YYYY-MM-DD-HH-mm-ss"); 
      const originalFileName = path.parse(file.originalname).name; 
      const extension = path.extname(file.originalname); 
  
      const newFilename = `typeof/${originalFileName}-${currentDate}${extension}`;
      cb(null, newFilename);
    }
  }).single("bgimage");
  
  module.exports = uploadBgtype;

// cloudinary.config({
//     cloud_name: 'dwmpdaqqh',
//     api_key: '259245877468621',
//     api_secret: 'WHxSl_cCNMt2HSm6MbRe4sc1j9s'
//   });
