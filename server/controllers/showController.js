//connected database
const mongoose = require("mongoose");
const slugify = require("slugify");
// const Blogs = require("../models/blogs");
const slugifyMultilingual = (text) =>
  slugify(text, { lower: true, locale: "th" });
const { User, validate } = require("../models/customers");
const Show = require("../models/show");
const Cart = require("../models/carts");
const Address = require("../models/address");
const { v4: uuidv4 } = require("uuid");
const { S3 } = require("@aws-sdk/client-s3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Joi = require("joi");
const fs = require("fs");
const path = require("path");

const s3 = new S3({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: "AKIAQ3EGS6PRLXNBIQQV",
    secretAccessKey: "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",
  },
});

exports.createShow = async (req, res) => {
  try {
 
    if (!req.file) {
      return res.status(400).json({ error: "กรุณาเลือกรูปสินค้า" });
    }

    const { name } = req.body;

    console.log("create dklsfjals ",name);

    if(!name){
      return res.status(400).json({ error: "กรุณาระบุชื่อสินค้า" });
    }

    // ตรวจสอบว่ามีรายการที่มีรูปภาพเดียวกันหรือไม่
    const existingShow = await Show.findOne({ image: req.file.key });
    if (existingShow) {
      return res.status(400).json({ error: "รูปภาพสินค้านี้ถูกใช้ไปแล้ว" });
    }

  
    // สร้างรายการใหม่ด้วยชื่อและภาพที่ได้รับ
    const newShow = await Show.create({ name, image: req.file.key });
    console.log("Created new show:", newShow);

    res.send("Show created successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getAllImage = (req, res) => {
  Show.find({})
    .exec()
    .then((shows) => {
      res.json(shows);
    })
    .catch((err) => {
      // Handle the error, for example, send an error response
      res.status(500).json({ error: err.message });
    });
};

exports.deleteShow = async (req, res) => {
  const id = req.params.id;
  try {
    // ตรวจสอบว่ามี slip อัปโหลดอยู่หรือไม่
    const show = await Show.findByIdAndRemove(id);
    if (!show) {
      return res.status(404).json({ error: "ไม่พบสินค้าที่ต้องการลบ show" });
    }

    const params = {
      Bucket: "image-products-charoenkit",
      Key: show.image
    };
    // Delete the old image file from AWS S3
    s3.deleteObject(params, function (err, data) {
      if (err) {
        console.error("Error deleting old slip:", err);
      } else {
        console.log(" deleted successfully");
      }
    });

    res.send("Show deleted successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
