//connected database
const mongoose = require("mongoose");
const slugify = require("slugify");
// const Blogs = require("../models/blogs");
const slugifyMultilingual = (text) => slugify(text, { lower: true, locale: 'th' });
const Customers = require("../models/customers");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

exports.validateCreate = [
  body('f_name').notEmpty().withMessage('ต้องกรอกชื่อ'),
  body('l_name').notEmpty().withMessage('ต้องกรอกนามสกุล'),
  body('username').notEmpty().withMessage('ต้องกรอกชื่อผู้ใช้'),
  body('email').notEmpty().withMessage('ต้องกรอกอีเมล').isEmail().withMessage('อีเมลไม่ถูกต้อง'),
  body('tell').notEmpty().withMessage('ต้องกรอกเบอร์โทร').isMobilePhone('any', { strictMode: false }).withMessage('เบอร์โทรไม่ถูกต้อง'),
  body('password').notEmpty().withMessage('ต้องกรอกรหัสผ่าน'),
];

exports.create = (req, res) => {
  const { f_name, l_name, username, email, tell, password } = req.body;

  // ตรวจสอบข้อมูลที่ไม่ถูกต้องและส่งคืน response 400 ถ้าไม่ถูกต้อง
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // ตรวจสอบว่า username, email, และ tell ไม่ซ้ำกัน
  Customers.findOne({ $or: [{ username }, { email }, { tell }] })
    .then(existingCustomer => {
      if (existingCustomer) {
        let errorMessage = '';
        if (existingCustomer.username === username) {
          errorMessage = 'Username already exists';
        } else if (existingCustomer.email === email) {
          errorMessage = 'Email already exists';
        } else if (existingCustomer.tell === tell) {
          errorMessage = 'Tell already exists';
        }
        return Promise.reject({ error: errorMessage });
      }
  
      // เข้ารหัสรหัสผ่าน
      return bcrypt.hash(password, 10);
    })
    .then(hashedPassword => {
      // สร้างข้อมูลลูกค้าโดยไม่รวมรหัสผ่านในข้อมูลที่ส่งกลับ
      return Customers.create({ f_name, l_name, username, email, tell, password: hashedPassword });
    })
    .then(customer => {
      // ส่งข้อมูลลูกค้าโดยไม่รวมรหัสผ่านกลับ
      const response = {
        _id: customer._id,
        f_name: customer.f_name,
        l_name: customer.l_name,
        username: customer.username,
        email: customer.email,
        tell: customer.tell,
      };

      res.json(response);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลลงในฐานข้อมูล' });
    });
};



exports.getAllCustomers = (req, res) => {
  Customers.find({})
    .exec()
    .then((customers) => {
      res.json(customers);
    })
    .catch((err) => {
      // Handle the error, for example, send an error response
      res.status(500).json({ error: err.message });
    });
};

exports.search = (req, res) => {
  const { name } = req.query;

    // Use a regular expression to perform a case-insensitive partial match on both first and last names
  const regex = new RegExp(name, 'i');
  Customers.find({ $or: [{ f_name: regex }, { l_name: regex }] })
    .exec()
    .then((customers) => {
      res.json(customers);
    })
    .catch((err) => {
      // จัดการข้อผิดพลาด, ตัวอย่างเช่น ส่งการตอบกลับด้วยข้อความผิดพลาด
      res.status(500).json({ error: err.message });
    });

};

