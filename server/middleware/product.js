const express = require('express');
const multer = require("multer");
const path = require("path");
const slugify = require('slugify');
// const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');


// // Configure AWS SDK
// AWS.config.update({
//   accessKeyId: 'AKIAQ3EGS6PRLXNBIQQV',
//   secretAccessKey: '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',
//   region: 'ap-southeast-1'
// });

// const s3 = new AWS.S3();


// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 961 * 1080 } // Limit file size to 5MB
// }).single('image');

// module.exports = upload;

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./images"); // ระบุโฟลเดอร์ที่คุณต้องการเก็บไฟล์
  },
  filename: (req, file, cb) => {
    const { brand, p_type, name } = req.body;

    const slugBrand = slugify(brand, { lower: true });
    const slugPType = slugify(p_type, { lower: true });
    const slugName = slugify(name, { lower: true });

   const newFilename = `${slugBrand}-${slugPType}-${slugName}-${uuidv4()}-${path.extname(file.originalname)}`;

    cb(
      null,
      newFilename
    );
  },
});

const upload = multer({ storage: storage }).single("image");



// const upload = multer(storageObject).single("image");

module.exports = upload;



