//connected database
const mongoose = require("mongoose");
const slugify = require("slugify");
const { User, validate } = require("../models/customers");
const TypeofCurtain = require("../models/typeofcurtain");
const { v4: uuidv4 } = require("uuid");
const { S3 } = require("@aws-sdk/client-s3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Joi = require("joi");
const path = require("path");
const slugifyMultilingual = (text) =>
  slugify(text, { lower: true, locale: "th" });

exports.create =  (req,res) =>{
    const = req.body ;
    if (!req.file) {
        return res.status(400).json({ error: "กรุณาเลือกรูปสินค้า" });
      }
      data.file = req.file.location;
      console.log("location :", data.file);
      console.log("key : ", req.file.key);
}