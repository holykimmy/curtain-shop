//connected database
const mongoose = require("mongoose");
const slugify = require("slugify");
// const Blogs = require("../models/blogs");
const slugifyMultilingual = (text) =>
  slugify(text, { lower: true, locale: "th" });
const { User, validate } = require("../models/customers");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Joi = require("joi");

exports.create = async (req, res) => {
  const { f_name, l_name, username, email, tell, password } = req.body;
  try {
    const { error } = validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((detail) => detail.message) });
    }
    console.log(f_name, l_name, username, email, tell, password);
    const user = await User.findOne({ email: req.body.email });
    const u_username = await User.findOne({ username: req.body.username });
    const u_tell = await User.findOne({ tell: req.body.tell });
    if (user) {
      return res
        .status(409)
        .json({ error: "email นี้ถูกใช้ไปแล้ว กรุณาใช้ email อื่น" });
    } else if (u_username) {
      return res
        .status(409)
        .json({ error: "username นี้ถูกใช้ไปแล้ว กรุณาใช้ username อื่น" });
    } else if (u_tell) {
      return res
        .status(409)
        .json({ error: "เบอร์โทรนี้ถูกใช้ไปแล้ว กรุณาใช้เบอร์โทรอื่น" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await new User({ ...req.body, password: hashedPassword }).save();
    res.status(201).json({ message: "สมัครรสมาชิกสำเร็จ" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const validatelogin = (data) => {
  const schema = Joi.object({
    user: Joi.string().required().label("Email or Tell"), // ใช้ "user" แทน "email"
    password: Joi.string().min(7).required().label("Password"),
  });
  return schema.validate(data);
};

exports.loginUser = async (req, res) => {
  const { user, password } = req.body;

  try {
    const { error } = validatelogin(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userFound = await User.findOne({
      $or: [{ email: user }, { tell: user }],
    });

    if (!userFound) {
      return res.status(401).json({ error: "email หรือ เบอร์โปทรไม่ถูกต้อง" });
    }

    const validPassword = await bcrypt.compare(password, userFound.password);

    if (!validPassword) {
      return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
    }

    const token = await userFound.generateAuthToken();
    res.cookie("token", token )
    // res.status(200).json({ token });
    return res.json({Status:"Success", role: userFound.role})
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
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
    });
};

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // ทำสิ่งที่ต้องการเพื่อจัดการกับ unhandled rejection
});
