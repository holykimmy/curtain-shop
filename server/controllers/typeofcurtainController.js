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

exports.create = (req, res) => {
  const data = req.body;
  console.log(data);
  console.log(req.file);
  // ตรวจสอบว่ามีการอัปโหลดไฟล์ภาพมาด้วยหรือไม่
  if (!req.file) {
    return res.status(400).json({ error: "กรุณาเลือกรูปสินค้า" });
  }

  // สร้าง slug ของสินค้า
  let slug = slugifyMultilingual(
    `${slugify(data.name)}-${slugify(data.price_rail)}-${Date.now()}`
  );

  // ตรวจสอบว่าชื่อซ้ำกับข้อมูลที่มีอยู่แล้วหรือไม่
  TypeofCurtain.findOne({ name: data.name })
    .then((existingType) => {
      if (existingType) {
        // ถ้าชื่อซ้ำกับข้อมูลที่มีอยู่แล้ว ส่งข้อความข้อผิดพลาดกลับไป
        return res.status(400).json({ error: "ข้อมูลนี้มีอยู่แล้ว" });
      } else {
        // ถ้าชื่อไม่ซ้ำ สร้างและบันทึกข้อมูลใหม่
        TypeofCurtain.create({
          name: data.name,
          price_rail: data.price_rail,
          image: req.file.key,
          twolayer: data.twolayer,
          slug: slug
        })
          .then((datatypeof) => {
            res.json(datatypeof);
          })
          .catch((err) => {
            res.status(400).json({ error: "เกิดข้อผิดพลาดในการสร้างข้อมูล" });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการค้นหาข้อมูล" });
    });
};

exports.getAllTypes = (req, res) => {
  TypeofCurtain.find()
    .then((types) => {
      res.json(types);
    })
    .catch((err) => {
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการอ่านข้อมูล" });
    });
};

exports.getTypeById = (req, res) => {
  const typeId = req.params.id;
  TypeofCurtain.findById(typeId)
    .then((type) => {
      if (!type) {
        return res.status(404).json({ error: "ไม่พบประเภทแบบม่านที่ระบุ" });
      }
      res.json(type);
    })
    .catch((err) => {
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการอ่านข้อมูล" });
    });
};

exports.updateTypeById = (req, res) => {
  const typeId = req.params.id;
  const newData = req.body;

  TypeofCurtain.findByIdAndUpdate(typeId, newData, { new: true })
    .then((type) => {
      if (!type) {
        return res.status(404).json({ error: "ไม่พบประเภทแบบม่านที่ระบุ" });
      }
      res.json(type);
    })
    .catch((err) => {
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    });
};

exports.deleteTypeById = (req, res) => {
  const typeId = req.params.id;
  TypeofCurtain.findByIdAndDelete(typeId)
    .then((type) => {
      if (!type) {
        return res.status(404).json({ error: "ไม่พบประเภทแบบม่านที่ระบุ" });
      }
      res.json({ message: "ลบประเภทแบบม่านเรียบร้อยแล้ว" });
    })
    .catch((err) => {
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล" });
    });
};
