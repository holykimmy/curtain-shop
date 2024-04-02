const express = require("express");
const multer = require("multer");
const path = require("path");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const { S3 } = require("@aws-sdk/client-s3");
const AWS = require('aws-sdk'); 
const multerS3 = require('multer-s3');
const moment = require("moment");

// // Configure AWS SDK
const s3 = new S3 ({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: 'AKIAQ3EGS6PRLXNBIQQV',
    secretAccessKey: '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',
  },
});


// Middleware for uploading slip images
const uploadType = multer({ storage: multerS3 ({
  s3 : s3,
  bucket: 'image-products-charoenkit',
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function(req,file,cb){
    cb(null,{fieldName: file.fieldName});
  },
  key : function(req,file,cb){
    const currentDate = moment().format("YYYY-MM-DD"); // วันที่ปัจจุบัน
    const originalFileName = path.parse(file.originalname).name; // ดึงชื่อไฟล์เดิม (ไม่รวมนามสกุล)
    const extension = path.extname(file.originalname); // ดึงนามสกุลของไฟล์

    const newFilename = `typeof/${originalFileName}-${currentDate}${extension}`;
    cb(null, newFilename);
  }
})
}).single("typeof");

module.exports = uploadType;
