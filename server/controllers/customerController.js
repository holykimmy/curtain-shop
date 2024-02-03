//connected database
const mongoose = require("mongoose");
const slugify = require("slugify");
// const Blogs = require("../models/blogs");
const slugifyMultilingual = (text) =>
  slugify(text, { lower: true, locale: "th" });
const Customers = require("../models/customers");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { body, validationResult } = require("express-validator");

exports.validateCreate = [
  body("f_name").notEmpty().withMessage("ต้องกรอกชื่อ"),
  body("l_name").notEmpty().withMessage("ต้องกรอกนามสกุล"),
  body("username").notEmpty().withMessage("ต้องกรอกชื่อผู้ใช้"),
  body("email")
    .notEmpty()
    .withMessage("ต้องกรอกอีเมล")
    .isEmail()
    .withMessage("อีเมลไม่ถูกต้อง"),
  body("tell")
    .notEmpty()
    .withMessage("ต้องกรอกเบอร์โทร")
    .isMobilePhone("any", { strictMode: false })
    .withMessage("เบอร์โทรไม่ถูกต้อง"),
  body("password").notEmpty().withMessage("ต้องกรอกรหัสผ่าน"),
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
    .then((existingCustomer) => {
      if (existingCustomer) {
        let errorMessage = "";
        if (existingCustomer.username === username) {
          errorMessage = "Username already exists";
        } else if (existingCustomer.email === email) {
          errorMessage = "Email already exists";
        } else if (existingCustomer.tell === tell) {
          errorMessage = "Tell already exists";
        }
        return Promise.reject({ error: errorMessage });
      }

      // เข้ารหัสรหัสผ่าน
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      // สร้างข้อมูลลูกค้าโดยไม่รวมรหัสผ่านในข้อมูลที่ส่งกลับ
      return Customers.create({
        f_name,
        l_name,
        username,
        email,
        tell,
        password: hashedPassword,
      });
    })
    .then((customer) => {
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
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูลลงในฐานข้อมูล" });
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
  const regex = new RegExp(name, "i");
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

exports.createAddress = (req, res) => {
  const { username } = req.body;
  const addressData = req.body.address;
  console.log(username, addressData);

  Customers.findOne({ username })
    .exec()
    .then((existingCustomer) => {
      if (existingCustomer) {
        // วนซ้ำแต่ละที่อยู่ในคำขอ
        addressData.forEach((address) => {
          const { houseNo, sub_district, district, province, postcode } =
            address;
          // ตรวจสอบว่ามีที่อยู่อยู่แล้วในที่อยู่ของลูกค้า
          const existingAddressIndex = existingCustomer.address.findIndex(
            (existingAddress) => {
              return (
                existingAddress.houseNo === houseNo &&
                existingAddress.sub_district === sub_district &&
                existingAddress.district === district &&
                existingAddress.province === province &&
                existingAddress.postcode === postcode
              );
            }
          );

          if (existingAddressIndex === -1) {
            // If the address does not exist, add it to the customer's addresses
            existingCustomer.address.push({
              houseNo,
              sub_district,
              district,
              province,
              postcode,
            });
          } else {
            // If the address already exists, reject with an error
            return Promise.reject({ error: "ที่อยู่นี้มีอยู่แล้ว" });
          }
          
        });

        // Save the updated customer data
        return existingCustomer.save();
      } else {
        // If the customer does not exist, reject with an error
        return Promise.reject({ error: "ไม่พบลูกค้า" });
      }
    })
    
    .then((updatedCustomer) => {
      // Return success response
      res.status(200).json(updatedCustomer);
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
      res.status(500).json({ error: "กรุณากรอกข้อมูลให้ครบ" });
    })
   
};

process.on('unhandledRejection', (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // ทำสิ่งที่ต้องการเพื่อจัดการกับ unhandled rejection
});

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // ค้นหาลูกค้าตาม username
    const customer = await Customers.findOne({ username });

    // ถ้าไม่พบลูกค้า
    if (!customer) {
      return res.status(401).json({ error: 'ไม่พบบัญชีผู้ใช้' });
    }

    // ตรวจสอบรหัสผ่าน
    const isPasswordMatch = await bcrypt.compare(password, customer.password);

    // ถ้ารหัสผ่านไม่ตรง
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
    }

    // สร้าง Token
    const token = jwt.sign(
      { customerId: customer._id, username: customer.username },
      'your_secret_key', // ใส่คีย์ลับเฉพาะของคุณที่ปลอดภัย
      { expiresIn: '1h' } // ให้ Token มีอายุ 1 ชั่วโมง
    );

    // ส่ง Token และข้อมูลลูกค้ากลับไป
    res.status(200).json({ token, customer });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};