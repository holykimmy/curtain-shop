const express = require("express");
const multer = require("multer");
const path = require("path");
const slugify = require("slugify");
// const AWS = require('aws-sdk');
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

// Multer storage configuration for slip images
const storageSlip = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./images/slip"); // ระบุโฟลเดอร์ที่คุณต้องการเก็บไฟล์ slip
  },
  filename: (req, file, cb) => {
    const currentDate = moment().format("YYYY-MM-DD"); // วันที่ปัจจุบัน
    const originalFileName = path.parse(file.originalname).name; // ดึงชื่อไฟล์เดิม (ไม่รวมนามสกุล)
    const extension = path.extname(file.originalname); // ดึงนามสกุลของไฟล์

    // สร้างชื่อไฟล์ใหม่โดยใช้ชื่อเดิมรวมกับวันที่
    const newFilename = `${originalFileName}-${currentDate}${extension}`;

    cb(null, newFilename);
  },
});

// Middleware for uploading slip images
const uploadSlip = multer({ storage: storageSlip }).single("slipmoney");

module.exports = uploadSlip;
