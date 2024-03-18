const express = require("express");
const multer = require("multer");
const path = require("path");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const storageSlip = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./images/window"); 
  },
  filename: (req, file, cb) => {
    const currentDate = moment().format("YYYY-MM-DD"); 
    const originalFileName = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname); 

    const newFilename = `${originalFileName}-${currentDate}${extension}`;

    cb(null, newFilename);
  },
});

const uploadWindow = multer({ storage: storageSlip }).single("windowimg");

module.exports = uploadWindow;
