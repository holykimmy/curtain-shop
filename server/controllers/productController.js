//connected database
const mongoose = require("mongoose");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const Products = require("../models/products");
const fs = require("fs");
const path = require("path");
const slugifyMultilingual = (text) =>
  slugify(text, { lower: true, locale: "th" });

exports.create = (req, res) => {
  
  const data = req.body;
  console.log(data);
  if (!req.file) {
    return res.status(400).json({ error: "กรุณาเลือกรูปสินค้า" });
  }
  data.file = req.file.filename;
  console.log("data", data);
  // Check if empty
  if (!data.brand) {
    return res.status(400).json({ error: "กรุณาเลือกแบรนด์สินค้า" });
  } else if (!data.p_type) {
    return res.status(400).json({ error: "กรุณาเลือกประเภทสินค้า" });
  } else if (!data.name) {
    return res.status(400).json({ error: "กรุณาระบุชื่อสินค้า" });
  } else if (!req.file) {
    return res.status(400).json({ error: "กรุณาเลือกรูปสินค้า" });
  } else if (!data.color) {
    return res.status(400).json({ error: "กรุณาเลือกสีสินค้า" });
  } else if (!data.detail) {
    return res.status(400).json({ error: "กรุณากรอกลายละเอียดของสินค้า" });
  } else if (!data.price) {
    return res.status(400).json({ error: "กรุณาระบุราคาสินค้า" });
  }

  let slug = slugifyMultilingual(
    `${slugify(data.brand)}-${slugify(data.name)}-${slugify(
      data.p_type
    )}-${Date.now()}`
  );

  // Move the uploaded image to the asset folder
  //connect
  Products.findOne({
    brand: data.brand,
    p_type: data.p_type,
    name: data.name,
    color: data.color,
    detail: data.detail,
  })
    .exec()
    .then((existingProduct) => {
      if (existingProduct) {
        // ถ้าข้อมูลมีอยู่แล้ว
        res.status(400).json({ error: "ข้อมูลที่ต้องการบันทึกมีอยู่แล้ว" });
      } else {
        // ถ้าข้อมูลยังไม่มีอยู่
        // ทำการสร้างข้อมูลใหม่
        return Products.create({
          brand: data.brand,
          p_type: data.p_type,
          name: data.name,
          color: data.color,
          detail: data.detail,
          price: data.price,
          image: data.file,
          slug,
        });
      }
    })
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "server error" });
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

exports.getProductType = (req, res) => {
  const name = req.query.name;
  const regex = new RegExp(name, "i");
  Products.find({ p_type: regex })
    .exec()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      // จัดการข้อผิดพลาด, ตัวอย่างเช่น ส่งการตอบกลับด้วยข้อความผิดพลาด
      res.status(500).json({ error: err.message });
    });
};

exports.search = (req, res) => {
  const { name } = req.query;
  // Use a regular expression to perform a case-insensitive partial match on both first and last names
  const regex = new RegExp(name, "i");
  Products.find({ $or: [{ name: regex }, { brand: regex }, { p_type: regex }] })
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
  Products.find({ $or: [{ brand: regex }] })
    .exec()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      // จัดการข้อผิดพลาด, ตัวอย่างเช่น ส่งการตอบกลับด้วยข้อความผิดพลาด
      res.status(500).json({ error: err.message });
    });
};

exports.updateProduct = (req, res) => {
  const productId = req.params.productId;
  console.log("productId",productId);
  const { brand, p_type, name, color, detail, price  } = req.body;
  console.log(brand, p_type, name, color, detail, price );
  let slug = slugifyMultilingual(
    `${slugify(brand)}-${slugify(name)}-${slugify(p_type)}-${Date.now()}`
  );

  let updateData = { brand, p_type, name, color, detail, price, slug };

 // Check if there's a new image uploaded
  if (req.file) {
    updateData.image = req.file.filename;
  }

  Products.findByIdAndUpdate(
    productId,
    { brand, p_type, name, color, detail, price, slug },
    { new: true }
  )
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "ไม่พบสินค้าที่ต้องการแก้ไข" });
      }
      res.json(product);
    })
    .catch((err) => {
      logger.error(err)
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล" });
    });
};

exports.getProductById = (req, res) => {
  const productId = req.params.productId;

  Products.findById(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "ไม่พบสินค้าที่ค้นหา" });
      }
      res.json(product);
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า" });
    });
};


exports.deleteProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Products.findByIdAndRemove(productId);
    if (!product) {
      return res.status(404).json({ error: "ไม่พบสินค้าที่ต้องการลบ" });
    }
    console.log("product.file",product.file);
    console.log("product.image",product.image);
    fs.unlink('./images/' + product.image, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('ลบรูปภาพสินค้าเรียบร้อยแล้ว');
      }
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบสินค้า" });
  }
};
