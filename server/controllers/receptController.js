//connected database
const mongoose = require("mongoose");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const Recept = require("../models/recept");
const fs = require("fs");
const path = require("path");
const slugifyMultilingual = (text) =>
  slugify(text, { lower: true, locale: "th" });

exports.createQuotation = (req, res) => {
    const data = req.body;
    console.log(data);
  
    Recept.findOne({
      fullname: data.fullname,
      subject: data.subject,
      address: data.address,
      deliveryDate: data.deliveryDate,
      quotation: true,
    })
      .exec()
      .then((existingRecept) => {
        if (existingRecept) {
          return res.status(400).json({ error: "ข้อมูลที่ต้องการบันทึกมีอยู่แล้ว" });
        } else {
          // แปลง counts และ total_m เป็นตัวเลข
          data.rows.forEach((row) => {
            row.counts = parseInt(row.counts);
            row.total_m = parseFloat(row.total_m);
          });
  
          return Recept.create({
            fullname: data.fullname,
            subject: data.subject,
            address: data.address,
            rows: data.rows,
            deliveryDate: data.deliveryDate,
            totalPrice: parseFloat(data.totalPrice), // แปลง totalPrice เป็นตัวเลข
            quotation: true,
          });
        }
      })
      .then((createdRecept) => {
        res.json(createdRecept);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์" });
      });
  };
  


  exports.createQuotation2 = (req, res) => {
  const data = req.body;
  console.log(data);
  Recept.findOne({
    fullname: data.fullname,
    subject: data.subject,
    address: data.address,
    deliveryDate: data.deliveryDate,
    quotation: true,
  })
    .exec()
    .then((existingRecept) => {
      if (existingRecept) {
        return res
          .status(400)
          .json({ error: "ข้อมูลที่ต้องการบันทึกมีอยู่แล้ว" });
      } else {
        return Recept.create({
          fullname: data.fullname,
          subject: data.subject,
          address: data.address,
          rows: data.rows,
          deliveryDate: data.deliveryDate,
          totalPrice: data.totalPrice,
          quotation: true,
        });
      }
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "server error" });
    });
};

exports.createInvoice = (req, res) => {
  const data = req.body;
  console.log(data);

  Recept.findOne({
    fullname: data.fullname,
    subject: data.subject,
    address: data.address,
    deliveryDate: data.deliveryDate,

    invoice: true,
  })
    .exec()
    .then((existingRecept) => {
      if (existingRecept) {
        return res
          .status(400)
          .json({ error: "ข้อมูลที่ต้องการบันทึกมีอยู่แล้ว" });
      } else {
        return Recept.create({
          fullname: data.fullname,
          subject: data.subject,
          address: data.address,
          rows: data.rows,
          deliveryDate: data.deliveryDate,
          totalPrice: data.totalPrice,

          invoice: true,
        });
      }
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "server error" });
    });
};

exports.updateRecept = (req, res) => {
  const { id } = req.params;
  const newData = req.body;

  Recept.findByIdAndUpdate(id, newData, { new: true })
    .exec()
    .then((updatedRecept) => {
      if (!updatedRecept) {
        return res.status(404).json({ error: "ไม่พบข้อมูล Recept" });
      }
      res.json(updatedRecept);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "server error" });
    });
};

exports.updateToInvoice = (req, res) => {
  const { id } = req.params;

  const newData = { quotation: false, invoice: true };

  Recept.findByIdAndUpdate(id, newData, { new: true })
    .exec()
    .then((updatedRecept) => {
      if (!updatedRecept) {
        return res.status(404).json({ error: "ไม่พบข้อมูล Recept" });
      }
      res.json(updatedRecept);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "server error" });
    });
};

exports.updateToQuotation = (req, res) => {
  const { id } = req.params;

  const newData = { quotation: true, invoice: false };

  Recept.findByIdAndUpdate(id, newData, { new: true })
    .exec()
    .then((updatedRecept) => {
      if (!updatedRecept) {
        return res.status(404).json({ error: "ไม่พบข้อมูล Recept" });
      }
      res.json(updatedRecept);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "server error" });
    });
};


exports.deleteRecept = (req, res) => {
  const { id } = req.params;

  Recept.findByIdAndDelete(id)
    .exec()
    .then((deletedRecept) => {
      if (!deletedRecept) {
        return res.status(404).json({ error: "ไม่พบข้อมูล Recept" });
      }
      res.json(deletedRecept);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "server error" });
    });
};

exports.getAllQuotation = (req, res) => {
  Recept.find({ quotation: true })
    .exec()
    .then((recepts) => {
      res.json(recepts);
    })
    .catch((err) => {
      res.status(500).jon({ error: err.message });
    });
};

exports.getAllInvoice = (req, res) => {
  Recept.find({ invoice: true })
    .exec()
    .then((recepts) => {
      res.json(recepts);
    })
    .catch((err) => {
      res.status(500).jon({ error: err.message });
    });
};

exports.getReceptById = (req, res) => {
  const id = req.params.id; // รับ ID จาก parameter ของ request
  Recept.findById(id)
    .exec()
    .then((recept) => {
      if (!recept) {
        return res.status(404).json({ error: "ไม่พบข้อมูลใบเสนอราคา" });
      }
      res.json(recept);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์" });
    });
};


exports.searchRecept = (req, res) => {
  const { name } = req.query;
  const regex = new RegExp(name, "i");
  Recept.find({ $or: [{ fullname: regex } ,{subject:regex}] })
    .exec()
    .then((recepts) => {
      res.json(recepts);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};
