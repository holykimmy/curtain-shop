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

const s3 = new S3({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: "AKIAQ3EGS6PRLXNBIQQV",
    secretAccessKey: "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"
  }
});

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

  console.log(
    newData.name,
    newData.price_rail,
    newData.image,
    newData.twolayer
  );
  console.log(typeId, newData);
  console.log(req.file);
  //   newData.image = req.file.key;
  // Check if a new image is uploaded
  if (req.file) {
    console.log("have image : ");
    newData.image = req.file.key; // Update image field with S3 key
    // Find and update the type of curtain
    TypeofCurtain.findById(typeId)
      .exec()
      .then((type) => {
        console.log(type.image);
        if (type && type.image) {
          const params = {
            Bucket: "image-products-charoenkit",
            Key: type.image
          };
          s3.deleteObject(params, function (err, data) {
            if (err) {
              console.error("Error deleting old image:", err);
            } else {
              console.log("Delete successful");
            }
          });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: "Failed to update data" });
      });
  }

  let slug = slugifyMultilingual(
    `${slugify(newData.name)}-${slugify(newData.price_rail)}-${Date.now()}`
  );
  console.log("no image", typeId);
  console.log(newData.image);
  TypeofCurtain.findById(typeId)
    .exec()
    .then((type) => {
      if (!type) {
        return res.status(404).json({ error: "ไม่พบประภทนี้" });
      } else {
        console.log("testtff");
        console.log(type.image, newData.twolayer);
        console.log(type.twolayer, newData.twolayer);
        type.name = newData.name || type.name;
        type.price_rail = newData.price_rail || type.price_rail;
        type.image = newData.image || type.image;
        type.twolayer = newData.twolayer || type.twolayer;
        slud = slug;

        return type.save();
      }
    })
    .then((updateTypes) => {
      res.json(updateTypes);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to update data" });
    });
};

// exports.updateTypeById = (req, res) => {
//     const typeId = req.params.id;
//     const newData = req.body;

//     console.log(
//       newData.name,
//       newData.price_rail,
//       newData.image,
//       newData.twolayer
//     );
//     console.log(typeId, newData);
//     console.log(req.file);

//     // Check if a new image is uploaded
//     if (req.file) {
//       console.log("have image : ");
//       newData.image = req.file.key; // Update image field with S3 key
//       // Find and update the type of curtain
//       TypeofCurtain.findById(typeId)
//         .exec()
//         .then((type) => {
//           console.log(type.image);
//           if (type && type.image) {
//             const params = {
//               Bucket: "image-products-charoenkit",
//               Key: type.image
//             };
//             s3.deleteObject(params, function (err, data) {
//               if (err) {
//                 console.error("Error deleting old image:", err);
//               } else {
//                 console.log("Delete successful");
//               }
//             });
//           }
//           // Update the type of curtain after deleting the old image
//           updateType(typeId, newData, res);
//         })
//         .catch((err) => {
//           res.status(500).json({ error: "Failed to update data" });
//         });
//     } else {
//       // If no new image is uploaded, update the type of curtain directly
//       updateType(typeId, newData, res);
//     }
//   };

//   function updateType(typeId, newData, res) {
//     let slug = slugifyMultilingual(
//       `${slugify(newData.name)}-${slugify(newData.price_rail)}-${Date.now()}`
//     );
//     console.log("no image", typeId);
//     console.log(newData.image);
//     TypeofCurtain.findById(typeId)
//       .exec()
//       .then((type) => {
//         if (!type) {
//           return res.status(404).json({ error: "ไม่พบประภทนี้" });
//         } else {
//           console.log("testtff");
//           console.log(type.image);
//           type.name = newData.name || type.name;
//           type.price_rail = newData.price_rail || type.price_rail;
//           type.image = newData.image || type.image;
//           type.twolayer = newData.twolayer || type.twolayer;
//           slud = slug;

//           return type.save();
//         }
//       })
//       .then((updateTypes) => {
//         res.json(updateTypes);
//       })
//       .catch((err) => {
//         console.log(err);
//         res.status(500).json({ error: "Failed to update data" });
//       });
//   }

exports.deleteTypeById = (req, res) => {
  const typeId = req.params.id;
  TypeofCurtain.findByIdAndDelete(typeId)
    .then((type) => {
      if (!type) {
        return res.status(404).json({ error: "ไม่พบประเภทแบบม่านที่ระบุ" });
      }

      const params = {
        Bucket: "image-products-charoenkit",
        Key: type.image
      };
      // Delete the old image file from AWS S3
      s3.deleteObject(params, function (err, data) {
        if (err) {
          console.error("Error deleting old image:", err);
        } else {
          console.log("Old image deleted successfully");
        }
      });
      
      res.json({ message: "ลบประเภทแบบม่านเรียบร้อยแล้ว" });
    })
    .catch((err) => {
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล" });
    });
};
