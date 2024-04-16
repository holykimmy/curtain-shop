//connected database
const mongoose = require("mongoose");
const slugify = require("slugify");
// const Blogs = require("../models/blogs");
const slugifyMultilingual = (text) =>
  slugify(text, { lower: true, locale: "th" });
const { User, validate } = require("../models/customers");
const Products = require("../models/products");
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
const nodemailer = require("nodemailer");
const moment = require("moment");

exports.register = async (req, res) => {
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

    //chekc user
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
    //encrypt
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // ส่งอีเมล
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "charoenkit.curtain@gmail.com",
        pass: "ojpnyasephiohaqv"
      }
    });

    const mailOptions = {
      from: "charoenkit.curtain@gmail.com",
      to: `${email} `,
      subject: "สมัครสมาชิกสำเร็จ",
      text: `ยินดีต้อนรับ คุณ${f_name} ${l_name} ท่านได้ทำการสมัครสมาชิกเรียบร้อยแล้ว
      `
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      console.log("info : ", info, "error : ", error);
      if (error) {
        console.error("Error sending email:", error);
        if (error.code === "EAUTH" || error.code === "EENVELOPE") {
          return res.status(400).json({ error: "อีเมลไม่ถูกต้อง" });
        } else {
          // ถ้ามีข้อผิดพลาดในการส่งอีเมล ไม่ต้องทำการบันทึกผู้ใช้
          return res.status(500).json({ error: "เกิดข้อผิดพลาดในการส่งอีเมล" });
        }
      } else {
        console.log("Email sent:", info.response);
        // บันทึกผู้ใช้เฉพาะเมื่อส่งอีเมลสำเร็จ
        try {
          await new User({ ...req.body, password: hashedPassword }).save();
          res.status(201).json({ message: "สมัครสมาชิกสำเร็จ" });
        } catch (saveError) {
          console.error("Error saving user:", saveError);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const validatelogin = (data) => {
  const schema = Joi.object({
    user: Joi.string().required().label("Email or Tell"), // ใช้ "user" แทน "email"
    password: Joi.string().min(7).required().label("Password")
  });
  return schema.validate(data);
};

exports.updateEnable = async (req, res) => {
  const idUser = req.params.id;
  const { enable } = req.body;
  console.log("testtt");
  try {
    const updatedCustomer = await User.findByIdAndUpdate(
      idUser,
      { enable: enable },
      { new: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(updatedCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateRole = async (req, res) => {
  const idUser = req.params.id;
  const { role } = req.body;
  try {
    const updatedCustomer = await User.findByIdAndUpdate(
      idUser,
      { role: role },
      { new: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(updatedCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.findUserByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      // ส่งอีเมล
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "charoenkit.curtain@gmail.com",
          pass: "ojpnyasephiohaqv"
        }
      });

      const mailOptions = {
        from: "charoenkit.curtain@gmail.com",
        to: `${email} `,
        subject: "reset Password",
        text: `เรียนคุณ ${user.f_name} ${user.l_name}
        
        แก้ไขรหัสผ่านได้ที่ลิงค์นี้

        http://localhost:3000/reset-password/${user._id}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res
            .status(500)
            .json({ message: "เกิดข้อผิดพลาดในการส่งอีเมล" });
        } else {
          console.log("Email sent:", info.response);
          return res.status(200).json(user);
        }
      });
    } else {
      return res.status(404).json({ message: "ไม่พบ email ของคุณ" });
    }
  } catch (error) {
    console.error("Error finding user by email:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการค้นหาผู้ใช้" });
  }
};

exports.resetPassword = async (req, res) => {
  const idUser = req.params.id;
  const newPassword = req.body.password;
  console.log(idUser);
  console.log(newPassword);
  console.log(req.body);

  if (!newPassword) {
    return res.status(400).json({ error: "กรุณากรอกรหัสผ่าน" });
  }

  try {
    // อัปเดตรหัสผ่านของผู้ใช้โดยใช้ idUser และรหัสผ่านใหม่
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.findByIdAndUpdate(idUser, { password: hashedPassword });

    // ส่งคำตอบเมื่อการรีเซ็ตรหัสผ่านสำเร็จ
    res.status(200).json({ message: "เปลี่นยรหัสผ่านสำเร็จ" });
  } catch (error) {
    console.error(error);
    // ถ้าเกิดข้อผิดพลาดในการอัปเดต ส่งคำตอบกลับว่า Internal Server Error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.UpdateProfile = (req, res) => {
  const idUser = req.params.id;
  const { f_name, l_name, username, email, tell } = req.body;
  console.log(idUser);
  console.log(req.body);
  // Find the customer by ID
  User.findById(idUser)
    .then((customer) => {
      if (!customer) {
        return res
          .status(404)
          .json({ success: false, error: "Customer not found" });
      }

      // Update customer data
      customer.f_name = f_name;
      customer.l_name = l_name;
      customer.email = email;
      customer.tell = tell;

      // Save the updated customer data
      return customer.save();
    })
    .then(() => {
      res.json({
        success: true,
        message: "Customer profile updated successfully"
      });
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ success: false, error: "Failed to update customer profile" });
    });
};

exports.loginUser = async (req, res) => {
  //check user
  const { user, password } = req.body;

  try {
    const { error } = validatelogin(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    //หา user
    const userFound = await User.findOne({
      $or: [{ email: user }, { tell: user }]
    });

    //ไม่เจอ
    if (!userFound) {
      return res.status(401).json({ error: "email หรือ เบอร์โปทรไม่ถูกต้อง" });
    }

    //ตรวจสอบว่าบัญชีถูกระงับหรือไม่
    if (!userFound.enable) {
      return res
        .status(401)
        .json({ error: "บัญชีของคุณถูกระงับ กรุณติดต่อเรา" });
    }

    const validPassword = await bcrypt.compare(password, userFound.password);

    if (!validPassword) {
      return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
    }

    //valid
    let payload = {
      id: userFound._id,
      user: {
        f_name: userFound.f_name,
        l_name: userFound.l_name,
        username: userFound.username,
        email: userFound.email,
        tell: userFound.tell,
        role: userFound.role
      },
      address: userFound.address
    };

    jwt.sign(payload, "jwtsecret", { expiresIn: "1d" }, (err, token) => {
      if (err) throw err;
      console.log(token, payload);

      res.json({ Status: "Success", role: userFound.role, token, payload });
    });

    // const token = await userFound.generateAuthToken();
    // res.cookie("token", token);
    // // res.status(200).json({ token });
    // return res.json({ Status: "Success", role: userFound.role });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllCustomers = (req, res) => {
  User.find({})
    .exec()
    .then((customer) => {
      res.json(customer);
    })
    .catch((err) => {
      console.log(error);
      res.status(500).json({ error: err.message });
    });
};

exports.getCustomers = (req, res) => {
  const { name } = req.query;
  console.log("testt sresfjf");

  // ตรวจสอบว่ามีค่า name และไม่ว่างเปล่า
  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Name parameter is required" });
  }

  const regex = new RegExp(name, "i");

  User.find({ $or: [{ f_name: regex }, { l_name: regex }] })
    .exec()
    .then((customers) => {
      res.json(customers);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
};

exports.getCustomerById = (req, res) => {
  const customerId = req.params.id;

  User.findById(customerId)
    .exec() // Execute the query
    .then((customer) => {
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      res.json(customer);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getCustomerAddressById = (req, res) => {
  const customerId = req.params.id;

  User.findById(customerId)
    .select("address")
    .exec()
    .then((customer) => {
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer.address);
    })
    .catch((err) => {
      // console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getAddress = (req, res) => {
  console.log("-------getAddress-------");
  const idUser = req.params.id;
  console.log(idUser);
  // Find the address using idUser (user's ID)
  Address.find({ idUser: idUser })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Customer not found" });
      }

      res.json({
        houseNo: address.houseNo,
        sub_district: address.sub_district,
        district: address.district,
        province: address.province,
        postcode: address.postcode
      });
    })

    .catch((err) => {
      console.log("-------getAddress-------");

      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getAddressByUserId = (req, res) => {
  const idUser = req.params.id;
  console.log(idUser);

  Address.find({ idUser })
    .exec()
    .then((addresses) => {
      if (addresses.length === 0) {
        return res.status(404).json({ error: "Addresses not found" });
      }
      const formattedAddresses = addresses.map((address) => ({
        id: address._id,
        name: address.name,
        tell: address.tell,
        houseNo: address.houseNo,
        sub_district: address.sub_district,
        district: address.district,
        province: address.province,
        postcode: address.postcode
      }));

      res.json(formattedAddresses);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getAddressById = (req, res, next) => {
  const id = req.params.id; // รับค่า ID ที่ส่งมาจาก request
  Address.findById(id) // ค้นหาที่อยู่โดยใช้ ID
    .exec()
    .then((address) => {
      if (!address) {
        // ถ้าไม่พบที่อยู่
        return res.status(404).json({ error: "Address not found" });
      }
      // ถ้าพบที่อยู่ ส่งข้อมูลที่อยู่กลับไปในรูปแบบ JSON
      res.json({
        id: address._id,
        name: address.name,
        tell: address.tell,
        houseNo: address.houseNo,
        sub_district: address.sub_district,
        district: address.district,
        province: address.province,
        postcode: address.postcode
      });
    })
    .catch((err) => {
      console.error(err);
      // ถ้าเกิดข้อผิดพลาดในการค้นหา ส่งคำตอบกลับว่า Internal Server Error
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.createAddress = async (req, res) => {
  try {
    const { id } = req.body; // รับ ID ของผู้ใช้จาก req.body
    const addressData = req.body.address; // รับข้อมูล address จาก req.body
    console.log(id);
    console.log(addressData);

    // ตรวจสอบว่ามีข้อมูล address และ id ที่ส่งมาหรือไม่
    if (!addressData || !id) {
      return res
        .status(400)
        .send({ error: "กรุณาส่งข้อมูล address และ id ของผู้ใช้" });
    }

    // ตรวจสอบจำนวนที่อยู่ที่มีอยู่แล้ว
    const existingAddressesCount = await Address.countDocuments({
      addressBy: id
    });

    // ถ้ามีที่อยู่มากกว่าหรือเท่ากับ 5 ที่อยู่แล้ว ให้ส่งข้อความแจ้งเตือน
    if (existingAddressesCount >= 5) {
      return res
        .status(400)
        .send({ error: "คุณได้เพิ่มที่อยู่เกิดจำนวนที่จำกัดแล้ว" });
    }

    // ตรวจสอบว่ามีข้อมูลที่ซ้ำกันหรือไม่
    const duplicateAddresses = await Address.find({
      $or: addressData.map((address) => ({
        name: address.name,
        tell: address.tell,
        houseNo: address.houseNo
      })),
      idUser: id
    });

    // ถ้ามีที่อยู่ที่ซ้ำกันในระบบ ให้ส่งข้อความแจ้งเตือน
    if (duplicateAddresses.length > 0) {
      return res.status(400).send({ error: "ที่อยู่นี้มีอยู่แล้ว" });
    }

    // สร้างและบันทึกทุกที่อยู่ใน addressData ถ้ายังไม่ถึงขีดจำกัดของ 5 ที่อยู่
    const createdAddresses = [];
    if (existingAddressesCount + addressData.length <= 5) {
      addressData.forEach(async (address) => {
        const newAddress = await Address.create({
          name: address.name,
          tell: address.tell,
          houseNo: address.houseNo,
          sub_district: address.sub_district,
          district: address.district,
          province: address.province,
          postcode: address.postcode,
          idUser: id
        });
        createdAddresses.push(newAddress);
      });
    } else {
      return res.status(400).send({ error: "เกิดข้อผิดพลาด" });
    }

    res.json(createdAddresses); // ส่งข้อมูลที่อยู่ทั้งหมดที่สร้างใหม่กลับไป
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "เกิดข้อผิดพลาดในการสร้าง address" });
  }
};

exports.updateAddress = (req, res, next) => {
  const id = req.params.id; // รับค่า ID ที่ส่งมาจาก request
  const updatedAddressData = req.body; // รับข้อมูลที่อยู่ใหม่จาก req.body

  // ค้นหาและอัปเดตที่อยู่โดยใช้ ID ที่ระบุ
  Address.findByIdAndUpdate(id, updatedAddressData, { new: true })
    .exec()
    .then((updatedAddress) => {
      if (!updatedAddress) {
        // ถ้าไม่พบที่อยู่ที่ต้องการอัปเดต
        return res.status(404).json({ error: "Address not found" });
      }
      // ส่งข้อมูลที่อยู่ที่อัปเดตแล้วกลับไปในรูปแบบ JSON
      res.json({
        id: updatedAddress._id,
        name: updatedAddress.name,
        tell: updatedAddress.tell,
        houseNo: updatedAddress.houseNo,
        sub_district: updatedAddress.sub_district,
        district: updatedAddress.district,
        province: updatedAddress.province,
        postcode: updatedAddress.postcode
      });
    })
    .catch((err) => {
      console.error(err);
      // ถ้าเกิดข้อผิดพลาดในการอัปเดต ส่งคำตอบกลับว่า Internal Server Error
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.deleteAddress = (req, res, next) => {
  const id = req.params.id; // รับค่า ID ที่ส่งมาจาก request

  // ลบที่อยู่โดยใช้ ID ที่ระบุ
  Address.findByIdAndDelete(id)
    .exec()
    .then((deletedAddress) => {
      if (!deletedAddress) {
        // ถ้าไม่พบที่อยู่ที่ต้องการลบ
        return res.status(404).json({ error: "Address not found" });
      }
      // ส่งข้อความยืนยันการลบที่อยู่กลับไป
      res.json({ message: "Address deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      // ถ้าเกิดข้อผิดพลาดในการลบ ส่งคำตอบกลับว่า Internal Server Error
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.createOrder = async (req, res) => {
  try {
    const { customerId } = req.body; // Extract the customer ID from request parameters

    console.log(customerId);
    const {
      products,
      sendAddress,
      deliveryIs,
      totalPrice,
      confirmed,
      payment,
      approve,
      sendproduct
    } = req.body; // Extract necessary fields from request body
    console.log("test create order");

    // Create a new order object
    const newOrder = {
      products,
      sendAddress,
      deliveryIs,
      totalPrice,
      confirmed,
      payment,
      approve,
      sendproduct
    };
    console.log(newOrder);

    // Find the customer by ID and update the orders array with the new order
    const customer = await User.findByIdAndUpdate(
      customerId,
      { $push: { order: newOrder } },
      { new: true }
    );

    // If customer is not found, return an error response
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // If customer is found and order is successfully added, return the updated customer data
    res.json(customer);
  } catch (error) {
    // Handle any errors that occur during the process
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrder = async (req, res) => {
  try {
    // ดึงข้อมูลทั้งหมดจากฐานข้อมูล
    const users = await User.find({}, "f_name l_name email tell order");
    console.log("users", users);

    // สร้าง array เพื่อเก็บข้อมูล order ทั้งหมด
    const allOrders = [];

    // วนลูปผ่าน users เพื่อเก็บข้อมูล order ทั้งหมดไว้ใน allOrders
    users.forEach((user) => {
      user.order.forEach((order) => {
        allOrders.push({
          f_name: user.f_name,
          l_name: user.l_name,
          email: user.email,
          tell: user.tell,
          order: order
        });
      });
    });

    // ส่งข้อมูล order ทั้งหมดกลับไปยังผู้ใช้
    res.json(allOrders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.userCart = async (req, res) => {
  try {
    const { cart, idUser } = req.body;
    console.log("-------------cart----------------");
    console.log(cart);
    console.log("-------------cart----------------");

    if (!cart || !idUser) {
      return res
        .status(400)
        .send({ error: "กรุณาส่ง cart และ idUser ให้ถูกต้อง" });
    }

    let user = await User.findById(idUser);

    if (!user) {
      return res.status(404).send({ error: "ไม่พบผู้ใช้" });
    }

    const newCart = await Cart({
      //loop procut
      products: cart.map((item) => ({
        product: item.productId,
        type: item.type,
        rail: item.rail,
        count: item.count,
        width: item.width,
        height: item.height,
        twolayer: item.twolayer,
        confirmed: false,
        totalPiece: item.totalPiece
      })),

      orderBy: idUser,
      totalPrice: cart.reduce(
        (total, item) => total + item.totalPiece * item.count,
        0
      )
    }).save();

    res.json(newCart);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "cart error" });
  }
};

exports.userUpdateADCart = async (req, res) => {
  try {
    const idCart = req.params.id;
    console.log("idcart", idCart);
    const { sendAddress, deliveryIs, confirmed } = req.query;
    const files = req.files;
    console.log(files);
    for (const file of files) {
      // กำหนดค่า key ของไฟล์ให้กับ existingCart.windowimg
      console.log(file.key);
    }

    const fileKeys = files.map((file) => file.key);
    console.log("File keys:", fileKeys);
    console.log("Recieved data:", sendAddress, deliveryIs, confirmed);

    if (!req.files) {
      return res.status(400).send("No files were uploaded.");
    }
    if (!sendAddress || !deliveryIs || !confirmed) {
      return res.status(400).send({
        error: "กรุณาส่งค่า sendAddress, deliveryIs, และ confirmed ให้ถูกต้อง"
      });
    }

    let existingCart = await Cart.findById(idCart).exec();

    if (existingCart) {
      // อัปเดตค่าในตะกร้าสินค้า
      existingCart.sendAddress = sendAddress;
      existingCart.deliveryIs = deliveryIs;
      existingCart.confirmed = confirmed;
      existingCart.windowimg = fileKeys;
      existingCart.totalPrice = existingCart.totalPrice;
      await existingCart.save();

      res.json(existingCart);
    } else {
      return res.status(404).send({ error: "ไม่พบตะกร้าสินค้าของผู้ใช้" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "เกิดข้อผิดพลาดในการดำเนินการ" });
  }
};

//------------user---------------//
exports.getOrderById = async (req, res) => {
  try {
    const idUser = req.params.id;
    console.log("get by id all");
    console.log(idUser);
    // const user = await User.findOne({ idUser }).exec();
    let cart = await Cart.find({ orderBy: idUser })
      .populate([
        {
          path: "products.product",
          select: "productId brand p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrderByIdWaitPayment = async (req, res) => {
  try {
    const idUser = req.params.id;
    console.log("get by id");
    console.log(idUser);

    // ตรวจสอบรายการคำสั่งซื้อที่รอการชำระเงิน
    let carts = await Cart.find({
      orderBy: idUser,
      enable: true,
      confirmed: true,
      pandding: false,
      verifypayment: false,
      sendproduct: false,
      complete: false
    })
      .populate([
        {
          path: "products.product",
          select: "productId brand p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    const now = Date.now();
    const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000; // 2 วันในหน่วยมิลลิวินาที

    for (let i = 0; i < carts.length; i++) {
      const createdAt = new Date(carts[i].createdAt);
      const elapsedTime = now - createdAt.getTime(); // เวลาที่ผ่านไปตั้งแต่รายการคำสั่งซื้อถูกสร้าง
      if (elapsedTime >= 0 && elapsedTime < twoDaysInMillis) {
        // ตรวจสอบหากเกิน 2 วัน
        carts[
          i
        ].paymentDeadline = `Order will be cancelled on ${createdAt.toLocaleTimeString(
          "en-US",
          {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          }
        )} ${createdAt.toLocaleDateString()}`; // เพิ่มข้อความแสดงถึงวันที่และเวลาที่ออเดอร์นี้จะถูกยกเลิก
      }
      if (elapsedTime >= twoDaysInMillis) {
        // ตรวจสอบหากเกิน 2 วัน
        carts[i].endble = false; // ยกเลิกรายการคำสั่งซื้อ
        await carts[i].save(); // บันทึกการเปลี่ยนแปลงลงในฐานข้อมูล
        console.log(`Order ID ${carts[i]._id} has been cancelled.`);
      }
    }

    res.json(
      carts.map((cart) => ({
        ...cart._doc,
        paymentDeadline: cart.paymentDeadline // เพิ่ม property paymentDeadline
      }))
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrderByIdPrepare = async (req, res) => {
  try {
    const idUser = req.params.id;
    console.log("get by id");
    console.log(idUser);
    // const user = await User.findOne({ idUser }).exec();
    const cart = await Cart.find({
      orderBy: idUser,
      enable: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: true,
      sendproduct: false,
      cancelled: false,
      complete: false
    })
      .populate([
        {
          path: "products.product",
          select: "productId brand p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    // ตรวจสอบว่ามีข้อมูลใน cart หรือไม่
    if (!cart || cart.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // ส่งข้อมูล cart กลับไปในรูปแบบ JSON
    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrderByIdSend = async (req, res) => {
  try {
    const idUser = req.params.id;
    console.log("get by id");
    console.log(idUser);
    // const user = await User.findOne({ idUser }).exec();
    let cart = await Cart.find({
      orderBy: idUser,
      enable: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: true,
      sendproduct: true,
      complete: false
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand  p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrderByIdComplete = async (req, res) => {
  try {
    const idUser = req.params.id;
    console.log("get by id complete");
    console.log(idUser);
    // const user = await User.findOne({ idUser }).exec();
    let cart = await Cart.find({
      orderBy: idUser,
      enable: true,
      confirmed: true,
      payment: true,
      verifypayment: true,
      pandding: true,
      approve: true,
      sendproduct: true,
      complete: true
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand  p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrderByIdOrder = async (req, res) => {
  try {
    const idOrder = req.params.id;
    console.log("get by id order");
    console.log(idOrder);
    // const user = await User.findOne({ idUser }).exec();
    let cart = await Cart.find({ _id: idOrder })
      .populate([
        {
          path: "products.product",
          select: "productId brand p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderComplete = async (req, res) => {
  try {
    const idOrder = req.params.id;
    const { complete } = req.body;
    console.log("Update order endble for order:", idOrder);

    // ดำเนินการอัปเดตค่า endble ในคำสั่งซื้อที่ระบุ
    await Cart.updateOne({ _id: idOrder }, { complete: complete });

    res.status(200).json({ message: "Order endble updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//----------user----------//

exports.getOrderAll = async (req, res) => {
  console.log("get ---------------- all");
  try {
    console.log("get al  git ffl");
    // const user = await User.findOne({ idUser }).exec();
    let cart = await Cart.find({})
      .populate([
        {
          path: "products.product",
          select: "productId brand p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrderApprove = async (req, res) => {
  console.log("get ---------------- all");
  try {
    console.log("get al  git ffl");
    // const user = await User.findOne({ idUser }).exec();
    let cart = await Cart.find({
      enable: true,
      confirmed: true,
      approve: false,
      payment: false,
      verifypayment: false,
      pandding: false,
      sendproduct: false,
      complete: false
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand  p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrderPayment = async (req, res) => {
  console.log("get ---------------- all");
  try {
    console.log("get al  git ffl");
    // const user = await User.findOne({ idUser }).exec();
    let cart = await Cart.find({
      enable: true,
      confirmed: true,
      approve: true,
      verifypayment: false,
      pandding: false,
      sendproduct: false,
      complete: false
    })
      .populate([
        {
          path: "products.product",
          select: "productId brand p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrdertoVeriflyPayment = async (req, res) => {
  console.log("get ---------------- all");
  try {
    console.log("get al  git ffl");
    // const user = await User.findOne({ idUser }).exec();
    let cart = await Cart.find({
      enable: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: false,
      pandding: false,
      sendproduct: false,
      complete: false
    })
      .populate([
        {
          path: "products.product",
          select: "productId brand p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrderPrepare = async (req, res) => {
  console.log("get ---------------- all");
  try {
    console.log("get al  git ffl");
    // const user = await User.findOne({ idUser }).exec();
    let cart = await Cart.find({
      enable: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: true,
      pandding: false,
      sendproduct: false,
      cancelled: false,
      complete: false
    })
      .populate([
        {
          path: "products.product",
          select: "productId brand p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrderSend = async (req, res) => {
  console.log("get ---------------- all");
  try {
    console.log("get al  git ffl");
    let cart = await Cart.find({
      enable: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: true,
      pandding: true,
      complete: false
    })
      .populate([
        {
          path: "products.product",
          select: "productId brand p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrderComplete = async (req, res) => {
  console.log("get ---------------- all");
  try {
    console.log("get al  git ffl");
    let cart = await Cart.find({
      enable: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: true,
      pandding: true,
      sendproduct: true
    })
      .populate([
        {
          path: "products.product",
          select: "productId brand p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.searchOrderApprove = async (req, res) => {
  const { name } = req.query;
  const regex = new RegExp(name, "i");

  try {
    // ค้นหาข้อมูลคำสั่งซื้อตามเงื่อนไขที่กำหนด
    let cart = await Cart.find({
      enable: true,
      confirmed: true,
      approve: false,
      payment: false,
      verifypayment: false,
      pandding: false,
      sendproduct: false,
      complete: false
    })
      .populate([
        {
          path: "products.product",
          select: "productId brand p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    // กรองข้อมูลที่ต้องการแสดงเฉพาะข้อมูลที่ตรงกับเงื่อนไข
    const filteredCart = cart.filter((order) => {
      const { f_name, l_name } = order.orderBy;
      const { _id } = order;
      return (
        f_name.match(regex) ||
        l_name.match(regex) ||
        _id.toString().match(regex)
      );
    });

    res.json(filteredCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.searchOrderPayment = async (req, res) => {
  const { name } = req.query;
  const regex = new RegExp(name, "i");

  try {
    let cart = await Cart.find({
      enable: true,
      confirmed: true,
      approve: true,
      verifypayment: false,
      pandding: false,
      sendproduct: false,
      complete: false
    })
      .populate([
        {
          path: "products.product",
          select: "productId brand p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    const filteredCart = cart.filter((order) => {
      const { f_name, l_name } = order.orderBy;
      const { _id } = order;
      return (
        f_name.match(regex) ||
        l_name.match(regex) ||
        _id.toString().match(regex)
      );
    });

    res.json(filteredCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.searchOrderPrepare = async (req, res) => {
  const { name } = req.query;
  const regex = new RegExp(name, "i");

  try {
    // ค้นหาข้อมูลคำสั่งซื้อตามเงื่อนไขที่กำหนด
    let cart = await Cart.find({
      enable: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: true,
      pandding: false,
      sendproduct: false,
      cancelled: false,
      complete: false
    })
      .populate([
        {
          path: "products.product",
          select: "productId brand p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    // กรองข้อมูลที่ต้องการแสดงเฉพาะข้อมูลที่ตรงกับเงื่อนไข
    const filteredCart = cart.filter((order) => {
      const { f_name, l_name } = order.orderBy;
      const { _id } = order;
      return (
        f_name.match(regex) ||
        l_name.match(regex) ||
        _id.toString().match(regex)
      );
    });

    res.json(filteredCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.searchOrderSend = async (req, res) => {
  const { name } = req.query;
  const regex = new RegExp(name, "i");

  try {
    // ค้นหาข้อมูลคำสั่งซื้อตามเงื่อนไขที่กำหนด
    let cart = await Cart.find({
      enable: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: true,
      pandding: true,
      sendproduct: false,
      complete: false
    })
      .populate([
        {
          path: "products.product",
          select: "productId brand p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    // กรองข้อมูลที่ต้องการแสดงเฉพาะข้อมูลที่ตรงกับเงื่อนไข
    const filteredCart = cart.filter((order) => {
      const { f_name, l_name } = order.orderBy;
      const { _id } = order;
      return (
        f_name.match(regex) ||
        l_name.match(regex) ||
        _id.toString().match(regex)
      );
    });

    res.json(filteredCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.searchOrderComplete = async (req, res) => {
  const { name } = req.query;
  const regex = new RegExp(name, "i");

  try {
    // ค้นหาข้อมูลคำสั่งซื้อตามเงื่อนไขที่กำหนด
    let cart = await Cart.find({
      enable: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: true,
      pandding: true,
      sendproduct: true
    })
      .populate([
        {
          path: "products.product",
          select: "productId brand p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    // กรองข้อมูลที่ต้องการแสดงเฉพาะข้อมูลที่ตรงกับเงื่อนไข
    const filteredCart = cart.filter((order) => {
      const { f_name, l_name } = order.orderBy;
      const { _id } = order;
      return (
        f_name.match(regex) ||
        l_name.match(regex) ||
        _id.toString().match(regex)
      );
    });

    res.json(filteredCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.searchOrderAll = async (req, res) => {
  const { name } = req.query;
  const regex = new RegExp(name, "i");

  try {
    // ค้นหาข้อมูลคำสั่งซื้อตามเงื่อนไขที่กำหนด
    let cart = await Cart.find({})
      .populate([
        {
          path: "products.product",
          select: "productId brand p_type name p_width price color image detail"
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt"
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser"
        }
      ])
      .exec();

    // กรองข้อมูลที่ต้องการแสดงเฉพาะข้อมูลที่ตรงกับเงื่อนไข
    const filteredCart = cart.filter((order) => {
      const { f_name, l_name } = order.orderBy;
      const { _id } = order;
      return (
        f_name.match(regex) ||
        l_name.match(regex) ||
        _id.toString().match(regex)
      );
    });

    res.json(filteredCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.updateOrderApprove = async (req, res) => {
  try {
    const idOrder = req.params.id;
    const { approve } = req.body;
    const { order } = req.body;
    const user = order.orderBy;

    await Cart.updateOne({ _id: idOrder }, { approve: approve });

    // ส่งอีเมล
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "charoenkit.curtain@gmail.com",
        pass: "ojpnyasephiohaqv"
      }
    });

    const mailOptions = {
      from: "charoenkit.curtain@gmail.com",
      to: `${user.email} `,
      subject: "สินค้าของคุณได้รับการยืนยันแล้ว",
      text: `ถึง ลูกค้าร้าน เจริญกิจผ้าม่าน ขณะนี้ออเดอร์ของคุณ หมายเลขออเดอร์ : ${idOrder}
      ได้รับการยืนยันสินค้าจากทางร้านแล้ว กรุณาชำระเงินของออเดอร์คุณได้แล้วได้ที่ ดูคำสั่งซื้อ -> รอการชำระ รบกวนลูกค้าชำระเงินภายใน 48 ชั่วโมง หากไม่ชำระภายใน 48 ชั่วโมง ออเดอร์สินค้าของคุณจะถูกยกเลิกโดยอัตโนมัติ ขอบคุณค่ะ

      https://charoenkitcurtain.vercel.app/about-order/waitPayment

      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({ message: "Order updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderVerifyPayment = async (req, res) => {
  try {
    const idOrder = req.params.id;
    const { verifypayment } = req.body;
    const { order } = req.body;
    const user = order.orderBy;

    // ดำเนินการอัปเดตค่า endble ในคำสั่งซื้อที่ระบุ
    await Cart.updateOne({ _id: idOrder }, { verifypayment: verifypayment });

    // ส่งอีเมล
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "charoenkit.curtain@gmail.com",
        pass: "ojpnyasephiohaqv"
      }
    });

    const mailOptions = {
      from: "charoenkit.curtain@gmail.com",
      to: `${user.email} `,
      subject: "ตรวจสอบการจ่ายเงินเสร็จ",
      text: `
      ออเดอร์สินค้าหมายเลข : ${idOrder} ได้รับตรวจสอบการชำระเงินเรียบร้อยแล้ว ทางร้านกำลังดำเนินการตัดสินค้าของคุณ ระยะเวลาการตัดสินค้าประมาณ 1-3 สัปดาห์ขึ้นอยู่กับการสั่งตัดของคุณ 
      ทางร้านจึงแจ้งให้ทราบก่อน ขอบคุณค่ะ

      https://charoenkitcurtain.vercel.app/about-order/prepareDelivery

      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({ message: "Order updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderDepositPayment = async (req, res) => {
  try {
    const idOrder = req.params.id;
    const { deposit } = req.body;
    console.log("Update order endble for order:", idOrder);

    // ดำเนินการอัปเดตค่า endble ในคำสั่งซื้อที่ระบุ
    await Cart.updateOne({ _id: idOrder }, { deposit: deposit });

    res.status(200).json({ message: "Order endble updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderPandding = async (req, res) => {
  try {
    const idOrder = req.params.id;
    const { pandding } = req.body;
    const { order } = req.body;
    const user = order.orderBy;
    // ดำเนินการอัปเดตค่า endble ในคำสั่งซื้อที่ระบุ
    await Cart.updateOne({ _id: idOrder }, { pandding: pandding });

    // ส่งอีเมล
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "charoenkit.curtain@gmail.com",
        pass: "ojpnyasephiohaqv"
      }
    });

    const mailOptions = {
      from: "charoenkit.curtain@gmail.com",
      to: `${user.email} `,
      subject: "ทางร้านเตรียมสินค้าเสร็จแล้ว",
      text: `เรียนคุณ${user.f_name} ${user.l_name}
      Order : ${idOrder} 
      ทางร้านได้เตรียมสินค้าเสร็จเรียบร้อยแล้ว

      https://charoenkitcurtain.vercel.app/about-order/prepareDelivery
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({ message: "Order endble updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderEnable = async (req, res) => {
  try {
    const idOrder = req.params.id;
    const { enable } = req.body;
    // const { order } = req.body;
    // const user = order.orderBy;
    console.log("cancel text", enable);

    console.log("Update order enable for order:", idOrder);

    await Cart.updateOne({ _id: idOrder }, { enable: false });
    // await Cart.updateOne({ _id: idOrder }, { verifycancelled: true });

    return res
      .status(200)
      .json({ message: "Order enable updated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderSend = async (req, res) => {
  try {
    const idOrder = req.params.id;
    const { sendproduct, postcodeOrder } = req.body;
    const { order } = req.body;
    const user = order.orderBy;
    console.log(idOrder);
    console.log("postcode text", sendproduct, postcodeOrder);

    // ตรวจสอบว่ามีค่า cause หรือไม่
    if (!postcodeOrder) {
      return res.status(400).json({ error: "Cause is required." });
    }

    await Cart.updateOne(
      { _id: idOrder },
      { sendproduct: true, postcodeOrder: postcodeOrder }
    );
    console.log(postcodeOrder);

    // ส่งอีเมล
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "charoenkit.curtain@gmail.com",
        pass: "ojpnyasephiohaqv"
      }
    });

    const mailOptions = {
      from: "charoenkit.curtain@gmail.com",
      to: `${user.email} `,
      subject: "คำสั่งซื้อของคุณได้รับการจัดส่งเรียบร้อยแล้ว",
      text: `เรียนคุณ${user.f_name} ${user.l_name}
      ออเดอร์สินค้าหมายเลข : ${idOrder} ทางร้านได้จัดส่งสินค้าของคุณแล้ว เลขพัสดุของคุณ : ${postcodeOrder} หากลูกค้าได้รับสินค้าแล้ว รบกวนลูกค้ากดยืนยันการรับสินค้าที่ 
      ดูคำสั่งซื้อ -> สำเร็จ ให้กับทางร้านด้วยนะคะ ขอขอบคุณที่เลือกไว้ใจสั่งตัดสินค้ากับร้านของเราและหวังว่าผ้าม่านที่สั่งตัดมาจะทำให้ลูกค้าพึ่งพอใจเป็นอย่างมาก หากคุณลูกค้าอยากสั่งตัดผ้าม่านอีก 
      เจริญกิจผ้าม่าน ยินดีรับให้บริการคุณลูกค้าอย่างเต็มที่อีกครั้งค่ะ ขอบคุณค่ะ

      https://charoenkitcurtain.vercel.app/about-order/receiveorder
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({ message: "Order send updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderCancelled = async (req, res) => {
  try {
    const idOrder = req.params.id;
    const { cancelled, cancelReasonAd } = req.body;
    const { order } = req.body;
    const user = order.orderBy;
    // ตรวจสอบว่ามีค่า cause หรือไม่
    if (!cancelReasonAd) {
      return res.status(400).json({ error: "Cause is required." });
    }

    await Cart.updateOne(
      { _id: idOrder },
      { cancelled: cancelled, cancelReasonAd: cancelReasonAd }
    );
    console.log(cancelled, cancelReasonAd);

    // ส่งอีเมล
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "charoenkit.curtain@gmail.com",
        pass: "ojpnyasephiohaqv"
      }
    });

    const mailOptions = {
      from: "charoenkit.curtain@gmail.com",
      to: `${user.email} `,
      subject: "คำสั่งซื้อของคุณถูกยกเลิกแล้ว",
      text: `เรียนคุณ${user.f_name} ${user.l_name} ลูกค้า ร้านเจริญกิจผ้าม่าน
      ขณะนี้ทางร้านขอเราขออนุญาติยกเลิกออเดอร์หมายเลข : ${idOrder} ของคุณ เนื่องจากสินค้าผ้าของออเดอร์คุณ ${cancelReasonAd} 
      ทางร้านจึงแจ้งมาให้ทราบและขออภัยคุณลูกค้าในข้อผิดพลาดจากทางร้านเป็นอย่างสูง ขอบคุณค่ะ
      https://charoenkitcurtain.vercel.app/about-order/cancelled  
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({ message: "Order cancel updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderVerifyCancelled = async (req, res) => {
  try {
    const idOrder = req.params.id;
    const { verifycancelled, cantcause } = req.body;
    console.log("Update order enable for order:", idOrder);

    let cancelledValue = false;

    // เช็คค่าของ verifycancelled
    if (verifycancelled === true) {
      cancelledValue = true;
    }

    // อัปเดตฐานข้อมูล
    await Cart.updateOne(
      { _id: idOrder },
      {
        verifycancelled: verifycancelled,
        cancelled: cancelledValue,
        cantcause: cantcause
      }
    );
    console.log(verifycancelled);
    res.status(200).json({ message: "Order cancel updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const s3 = new S3({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: "AKIAQ3EGS6PRLXNBIQQV",
    secretAccessKey: "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"
  }
});

exports.updateSlip = async (req, res) => {
  console.log("data add ", req.file.key);
  const idOrder = req.params.id;
  console.log(idOrder);

  try {
    if (!req.file) {
      return res.status(400).send("No files were uploaded.");
    }

    if (!idOrder) {
      return res.status(400).send("Invalid order ID.");
    }

    // ใช้ idOrder ที่รับเข้ามาในการอัปเดตข้อมูล
    const cart = await Cart.findById(idOrder).exec();
    if (!cart) {
      return res.status(404).json({ error: "ไม่พบสินค้าที่ต้องการอัปเดท" });
    }

    // อัปเดต slipmoney และ payment ใน cart
    cart.slipmoney = req.file.key;
    cart.payment = true;

    // บันทึกการเปลี่ยนแปลง
    await cart.save();

    res.send("File uploaded successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.deleteSlip = async (req, res) => {
  const idOrder = req.params.id;
  try {
    // ตรวจสอบว่ามี slip อัปโหลดอยู่หรือไม่
    const cart = await Cart.findById(idOrder).exec();
    if (!cart) {
      return res.status(404).json({ error: "ไม่พบสินค้าที่ต้องการลบ slip" });
    }

    // ตรวจสอบว่ามี slip ในออเดอร์หรือไม่F
    if (!cart.slipmoney) {
      return res.status(400).send("No slip uploaded for this order.");
    }

    // ลบ slip ออกจากออเดอร์
    cart.slipmoney = "";
    cart.payment = false;

    // บันทึกการเปลี่ยนแปลง
    await cart.save();

    // ลบไฟล์ slip ออกจากไดเร็กทอรี
    // const slipPath = path.join(__dirname, "images", "slip", cart.slipmoney);
    // fs.unlinkSync(slipPath);

    const params = {
      Bucket: "image-products-charoenkit",
      Key: product.imageKey
    };
    // Delete the old image file from AWS S3
    s3.deleteObject(params, function (err, data) {
      if (err) {
        console.error("Error deleting old slip:", err);
      } else {
        console.log(" deleted successfully");
      }
    });

    res.send("Slip deleted successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // ทำสิ่งที่ต้องการเพื่อจัดการกับ unhandled rejection
});
