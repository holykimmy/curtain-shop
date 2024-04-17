const express = require("express");
const multer = require("multer");
const path = require("path");
const slugify = require("slugify");
const { S3 } = require("@aws-sdk/client-s3");
const AWS = require('aws-sdk'); 
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require("uuid");



// // Configure AWS SDK
const s3 = new S3 ({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: 'AKIAQ3EGS6PRLXNBIQQV',
    secretAccessKey: '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',
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'image-products-charoenkit',
    acl: 'public-read', // Set ACL permissions for the uploaded file
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const { brand, p_type, name } = req.body;
      const currentDate = dayjs().format("YYYY-MM-DD-HH-mm-ss");
      const slugBrand = slugify(brand, { lower: true });
      const slugPType = slugify(p_type, { lower: true });
      const slugName = slugify(name, { lower: true });

      const newFilename = `images/${slugBrand}-${slugPType}-${slugName}-${currentDate}${path.extname(
        file.originalname
      )}`;

      cb(null, newFilename);
    }
  })
}).single('image');

module.exports = upload;
