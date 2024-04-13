//connected database
const mongoose = require("mongoose");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const Products = require("../models/products");
const fs = require("fs");
const AWS = require("aws-sdk");
const { S3 } = require("@aws-sdk/client-s3");
const path = require("path");
const slugifyMultilingual = (text) =>
  slugify(text, { lower: true, locale: "th" });

exports.create = (req, res) => {
  const data = req.body;
  console.log("data add ", data);

  if (!req.file) {
    return res.status(400).json({ error: "กรุณาเลือกรูปสินค้า" });
  }
  data.file = req.file.location;
  console.log("location :", data.file);
  console.log("key : ", req.file.key);
  // console.log(data.);

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
  } else if (!data.p_width) {
    return res.status(400).json({ error: "กรุณาระบุความกว้างของหน้าผ้า" });
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
          p_width: data.p_width,
          image: data.file,
          imageKey: req.file.key,
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

exports.getProductTypeVis = (req, res) => {
  const name = req.query.name;
  const regex = new RegExp(name, "i");
  Products.find({ $and: [{ p_type: regex }, { visibility: true }] })
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

exports.searchVis = (req, res) => {
  const { name } = req.query;
  // Use a regular expression to perform a case-insensitive partial match on both first and last names
  const regex = new RegExp(name, "i");
  Products.find({
    $and: [
      { $or: [{ name: regex }, { brand: regex }, { p_type: regex }] },
      { visibility: true },
    ],
  })
    .exec()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      // Handle errors, for example, by sending back an error message
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

exports.getFromBrandVis = (req, res) => {
  const { name } = req.query;
  // Use a regular expression to perform a case-insensitive partial match on both first and last names
  const regex = new RegExp(name, "i");
  Products.find({ $and: [{ brand: regex }, { visibility: true }] })
    .exec()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      // จัดการข้อผิดพลาด, ตัวอย่างเช่น ส่งการตอบกลับด้วยข้อความผิดพลาด
      res.status(500).json({ error: err.message });
    });
};

const s3 = new S3({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: "AKIAQ3EGS6PRLXNBIQQV",
    secretAccessKey: "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",
  },
});

exports.updateProduct = (req, res) => {
  const newData = req.body;
  console.log(newData);

  console.log(newData.brand);

  const productId = req.params.productId;
  if (!newData.brand) {
    return res.status(400).json({ error: "กรุณาเลือกแบรนด์สินค้า" });
  } else if (!newData.p_type) {
    return res.status(400).json({ error: "กรุณาเลือกประเภทสินค้า" });
  }
  // ตรวจสอบว่ามีการอัปโหลดรูปหรือไม่
  if (req.file) {
    // เก็บชื่อไฟล์รูปภาพใหม่
    newData.image = req.file.location;
    newData.imageKey = req.file.key;
    console.log(req.file.key);
    // หากมีรูปภาพใหม่ เรียกใช้งาน fs.unlink เพื่อลบรูปเก่า
    Products.findById(productId)
      .exec()
      .then((product) => {
        if (product && product.imageKey) {
          s3: s3;
          const params = {
            Bucket: "image-products-charoenkit",
            Key: product.imageKey,
          };

          // Delete the old image file from AWS S3
          s3.deleteObject(params, function (err, data) {
            if (err) {
              console.error("Error deleting old image:", err);
            } else {
              console.log("Old image deleted successfully");
            }
          });
        }
      })
      .catch((err) => {
        console.error("Error finding product:", err);
      });
  }
  
  let slug = slugifyMultilingual(
    `${slugify(newData.brand)}-${slugify(newData.name)}-${slugify(
      newData.p_type
    )}-${Date.now()}`
  );

  // ค้นหาและอัปเดตข้อมูลสินค้า
  Products.findById(productId)
    .exec()
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "ไม่พบสินค้าที่ต้องการอัปเดต" });
      } else {
        // อัปเดตข้อมูล
        product.brand = newData.brand || product.brand;
        product.p_type = newData.p_type || product.p_type;
        product.name = newData.name || product.name;
        product.color = newData.color || product.color;
        product.detail = newData.detail || product.detail;
        product.p_width = newData.p_width || product.p_width;
        product.price = newData.price || product.price;
        product.image = newData.image || product.image;
        product.imageKey = newData.imageKey || product.imageKey;
        product.visibility = newData.visibility || product.visibility;
        product.slug = slug;
        // บันทึกการเปลี่ยนแปลง
        return product.save();
      }
    })
    .then((updatedProduct) => {
      res.json(updatedProduct);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    });
};

exports.updateVisibility = (req, res) => {
  const { visibility } = req.body;
  const productId = req.params.productId;

  // ตรวจสอบค่าที่ส่งมา
  if (typeof visibility !== "boolean") {
    return res.status(400).json({ error: "ค่าสถานะไม่ถูกต้อง" });
  }

  // ค้นหาและอัปเดตข้อมูลสินค้าเฉพาะฟิลด์ visibility
  Products.findByIdAndUpdate(productId, { visibility }, { new: true })
    .exec()
    .then((updatedProduct) => {
      if (!updatedProduct) {
        return res.status(404).json({ error: "ไม่พบสินค้าที่ต้องการอัปเดต" });
      }
      res.json(updatedProduct);
    })
    .catch((err) => {
      console.error("Error updating visibility:", err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตสถานะสินค้า" });
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
    console.log("product.file", product.file);
    console.log("product.image", product.image);

    const params = {
      Bucket: "image-products-charoenkit",
      Key: product.imageKey,
    };

    // Delete the old image file from AWS S3
    s3.deleteObject(params, function (err, data) {
      if (err) {
        console.error("Error deleting old image:", err);
      } else {
        console.log("Old image deleted successfully");
      }
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบสินค้า" });
  }
};
