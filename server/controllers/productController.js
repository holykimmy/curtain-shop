//connected database
const mongoose = require("mongoose");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const slugifyMultilingual = (text) =>
  slugify(text, { lower: true, locale: "th" });

const Products = require("../models/products");

exports.create = (req, res) => {
  const { brand, p_type, name, color, detail, price } = req.body;
  let slug = slugifyMultilingual(
    `${slugify(brand)}-${slugify(name)}-${Date.now()}`
  );
  //connect
  Products.findOne({ brand, p_type, name, color, detail })
    .exec()
    .then((existingProduct) => {
      if (existingProduct) {
        // ถ้าข้อมูลมีอยู่แล้ว
        res.status(400).json({ error: "ข้อมูลที่ต้องการบันทึกมีอยู่แล้ว" });
      } else {
        // ถ้าข้อมูลยังไม่มีอยู่
        // ทำการสร้างข้อมูลใหม่
        return Products.create({
          brand,
          p_type,
          name,
          color,
          detail,
          price,
          slug,
        });
      }
    })
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      res.status(500).json({ error: "กรุรากรอกข้อมูลให้ครบ" });
    });
};

exports.getAllProducts = (req, res) => {
  Products.find({})
    .exec()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      // Handle the error, for example, send an error response
      res.status(500).json({ error: err.message });
    });
};

exports.search = (req, res) => {
  const { name } = req.query;
  // Use a regular expression to perform a case-insensitive partial match on both first and last names
  const regex = new RegExp(name, "i");
  Products.find({ $or: [{ brand: regex }, { name: regex }] })
    .exec()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      // จัดการข้อผิดพลาด, ตัวอย่างเช่น ส่งการตอบกลับด้วยข้อความผิดพลาด
      res.status(500).json({ error: err.message });
    });
};


exports.getFromBrand = (req, res) => {
    const { name } = req.query;
  // Use a regular expression to perform a case-insensitive partial match on both first and last names
  const regex = new RegExp(name, "i");
    Products.find({$or: [{brand:regex}]})
      .exec()
      .then((products) => {
        res.json(products);
      })
      .catch((err) => {
        // จัดการข้อผิดพลาด, ตัวอย่างเช่น ส่งการตอบกลับด้วยข้อความผิดพลาด
        res.status(500).json({ error: err.message });
      });
  };