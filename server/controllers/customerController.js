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
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Joi = require("joi");
const fs = require("fs");
const path = require("path");

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

    //save
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
  //check user
  const { user, password } = req.body;

  try {
    const { error } = validatelogin(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    //หา user
    const userFound = await User.findOne({
      $or: [{ email: user }, { tell: user }],
    });

    //ไม่เจอ
    if (!userFound) {
      return res.status(401).json({ error: "email หรือ เบอร์โปทรไม่ถูกต้อง" });
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
        role: userFound.role,
      },
      address: userFound.address,
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
      // Handle the error, for example, send an error response
      console.log(error);
      res.status(500).json({ error: err.message });
    });
};

exports.getCustomerById = (req, res) => {
  const customerId = req.params.id; // Extract the customer ID from request parameters

  // Use Mongoose findById() to find the customer by ID
  User.findById(customerId)
    .exec() // Execute the query
    .then((customer) => {
      if (!customer) {
        // If customer is not found, return an error response
        return res.status(404).json({ error: "Customer not found" });
      }

      // If customer is found, return the customer data
      res.json(customer);
    })
    .catch((err) => {
      // Handle any errors that occur during the query
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getCustomerAddressById = (req, res) => {
  const customerId = req.params.id; // ดึง ID ของลูกค้าจากพารามิเตอร์ request

  // ใช้ Mongoose findById() เพื่อหาลูกค้าโดยใช้ ID
  User.findById(customerId)
    .select("address") // เลือกฟิลด์ address เท่านั้น
    .exec() // ประมวลผลคิวรี
    .then((customer) => {
      if (!customer) {
        // ถ้าไม่พบลูกค้า ส่งคำตอบข้อผิดพลาดกลับ
        return res.status(404).json({ error: "Customer not found" });
      }

      // ถ้าพบลูกค้า ส่งข้อมูล address กลับไป
      res.json(customer.address);
    })
    .catch((err) => {
      // จัดการข้อผิดพลาดที่เกิดขึ้นในระหว่างคิวรี
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.search = (req, res) => {
  const { name } = req.query;

  // Use a regular expression to perform a case-insensitive partial match on both first and last names
  const regex = new RegExp(name, "i");
  User.find({ $or: [{ f_name: regex }, { l_name: regex }] })
    .exec()
    .then((customers) => {
      res.json(customers);
    })
    .catch((err) => {
      console.log(error);
      // จัดการข้อผิดพลาด, ตัวอย่างเช่น ส่งการตอบกลับด้วยข้อความผิดพลาด
      res.status(500).json({ error: err.message });
    });
};

exports.getAddress = (req, res) => {
  console.log("-------getAddress-------");
  const idUser = req.params.id; // Get the user ID from request params
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
        postcode: address.postcode,
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
        postcode: address.postcode,
      }));

      res.json(formattedAddresses);
    })
    .catch((err) => {
      console.error(err);
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
      addressBy: id,
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
        houseNo: address.houseNo,
      })),
      idUser: id,
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
          idUser: id,
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

exports.deleteAddress = async (req, res) => {
  try {
    const id = req.params.id; // รับ ID ของผู้ใช้จาก req.body
    const addressId = req.params.addressId; // รับ ID ของที่อยู่จาก req.params

    // ตรวจสอบว่ามีข้อมูล address และ id ที่ส่งมาหรือไม่
    if (!addressId || !id) {
      return res
        .status(400)
        .send({ error: "กรุณาส่ง ID ของที่อยู่และ ID ของผู้ใช้" });
    }

    // ตรวจสอบว่าที่อยู่ที่ต้องการลบมีอยู่หรือไม่
    const address = await Address.findOneAndDelete({
      _id: addressId,
      idUser: id,
    });

    if (!address) {
      return res.status(404).send({ error: "ไม่พบที่อยู่ที่ต้องการลบ" });
    }

    res.json({ message: "ที่อยู่ถูกลบเรียบร้อยแล้ว" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "เกิดข้อผิดพลาดในการลบที่อยู่" });
  }
};

exports.updateAddress = async (req, res) => {
  const { id, addressId } = req.params; // รับ ID ของผู้ใช้และ ID ของที่อยู่ที่ต้องการอัปเดตจาก params
  const { newAddress } = req.body; // รับที่อยู่ใหม่จาก req.body

  try {
    // ค้นหาผู้ใช้โดยใช้ ID
    const user = await User.findById(id);

    // ตรวจสอบว่าพบผู้ใช้หรือไม่
    if (!user) {
      return res.status(404).json({ error: "ไม่พบผู้ใช้" });
    }

    // ค้นหาที่อยู่ที่ต้องการอัปเดต
    const addressToUpdate = user.address.find(
      (addr) => addr._id.toString() === addressId
    );

    // ตรวจสอบว่าพบที่อยู่ที่ต้องการอัปเดตหรือไม่
    if (!addressToUpdate) {
      return res.status(404).json({ error: "ไม่พบที่อยู่ที่ต้องการอัปเดต" });
    }

    // อัปเดตที่อยู่เฉพาะถ้ามีการระบุข้อมูลใหม่
    if (newAddress) {
      addressToUpdate.name = newAddress.name || addressToUpdate.name;
      addressToUpdate.tell = newAddress.tell || addressToUpdate.tell;
      addressToUpdate.houseNo = newAddress.houseNo || addressToUpdate.houseNo;
      addressToUpdate.sub_district =
        newAddress.sub_district || addressToUpdate.sub_district;
      addressToUpdate.district =
        newAddress.district || addressToUpdate.district;
      addressToUpdate.province =
        newAddress.province || addressToUpdate.province;
      addressToUpdate.postcode =
        newAddress.postcode || addressToUpdate.postcode;
    }

    // บันทึกการเปลี่ยนแปลง
    await user.save();

    // ส่งคำตอบสำเร็จ
    res.status(200).json(user);
  } catch (error) {
    // จัดการข้อผิดพลาด
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
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
      sendproduct,
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
      sendproduct,
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
          order: order,
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

    //delete if hava old
    // await Cart.findOneAndDelete({ orderBy: idUser }).exec();

    const newCart = await Cart({
      //loop procut
      products: cart.map((item) => ({
        product: item.productId,
        type: item.type,
        rail: item.rail,
        count: item.count,
        width: item.width,
        height: item.height,
      })),

      orderBy: idUser,
      totalPrice: cart.reduce(
        (total, item) => total + item.price * item.count,
        0
      ),
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
    const { sendAddress, deliveryIs, confirmed } = req.body;
    console.log("recive", sendAddress, deliveryIs, confirmed);
    // ตรวจสอบค่าที่ส่งมา
    if (!sendAddress || !deliveryIs || !confirmed) {
      return res.status(400).send({
        error: "กรุณาส่งค่า sendAddress, deliveryIs, และ confirmed ให้ถูกต้อง",
      });
    }

    // ค้นหาตะกร้าสินค้าด้วย idCart
    let existingCart = await Cart.findById(idCart).exec();

    if (existingCart) {
      // อัปเดตค่าในตะกร้าสินค้า
      existingCart.sendAddress = sendAddress;
      existingCart.deliveryIs = deliveryIs;
      existingCart.confirmed = confirmed;

      // คำนวณค่า totalPrice ใหม่โดยเพิ่ม deliveryIs เข้าไป
      existingCart.totalPrice = existingCart.totalPrice + deliveryIs;

      // บันทึกการเปลี่ยนแปลง
      await existingCart.save();

      res.json(existingCart); // ส่งค่าตะกร้าสินค้าที่อัปเดตกลับไป
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
    console.log("get by id");
    console.log(idUser);
    // const user = await User.findOne({ idUser }).exec();
    let cart = await Cart.find({ orderBy: idUser, endble: true })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
      ])
      .exec();

    const {
      products,
      orderBy,
      totalPrice,
      sendAddress,
      deliveryIs,
      endble,
      confirmed,
      payment,
      verifypayment,
      pandding,
      approve,
      sendproduct,
      createdAt,
    } = cart;

    res.json(cart);
    // res.json({ products, orderBy,totalPrice, sendAddress, deliveryIs,endble, confirmed ,payment,approve,sendproduct,createdAt});
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
      endble: true,
      confirmed: true,
      pandding: false,
      verifypayment: false,
      sendproduct: false,
      complete: false,
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
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
            second: "2-digit",
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
        paymentDeadline: cart.paymentDeadline, // เพิ่ม property paymentDeadline
      }))
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrderByIdPrepair = async (req, res) => {
  try {
    const idUser = req.params.id;
    console.log("get by id");
    console.log(idUser);
    // const user = await User.findOne({ idUser }).exec();
    let cart = await Cart.find({
      orderBy: idUser,
      endble: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: true,
      sendproduct: false,
      complete: false,
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
      ])
      .exec();

    const {
      products,
      orderBy,
      totalPrice,
      sendAddress,
      deliveryIs,
      endble,
      confirmed,
      payment,
      verifypayment,
      pandding,
      approve,
      sendproduct,
      createdAt,
    } = cart;

    res.json(cart);
    // res.json({ products, orderBy,totalPrice, sendAddress, deliveryIs,endble, confirmed ,payment,approve,sendproduct,createdAt});
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
      endble: true,
      confirmed: true,
      payment: true,
      approve: true,
      verifypayment: true,
      pandding: true,
      complete: false,
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand  p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
      ])
      .exec();

    const {
      products,
      orderBy,
      totalPrice,
      sendAddress,
      deliveryIs,
      endble,
      confirmed,
      verifypayment,
      pandding,
      payment,
      approve,
      sendproduct,
      createdAt,
    } = cart;

    res.json(cart);
    // res.json({ products, orderBy,totalPrice, sendAddress, deliveryIs,endble, confirmed ,payment,approve,sendproduct,createdAt});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrderByIdComplete = async (req, res) => {
  try {
    const idUser = req.params.id;
    console.log("get by id");
    console.log(idUser);
    // const user = await User.findOne({ idUser }).exec();
    let cart = await Cart.find({
      orderBy: idUser,
      endble: true,
      confirmed: true,
      payment: true,
      verifypayment: true,
      pandding: true,
      approve: true,
      sendproduct: true,
      complete: true,
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand  p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
      ])
      .exec();

    const {
      products,
      orderBy,
      totalPrice,
      sendAddress,
      deliveryIs,
      endble,
      confirmed,
      verifypayment,
      pandding,
      payment,
      approve,
      sendproduct,
      createdAt,
    } = cart;

    res.json(cart);
    // res.json({ products, orderBy,totalPrice, sendAddress, deliveryIs,endble, confirmed ,payment,approve,sendproduct,createdAt});
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
          select:
            "productId brand p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
      ])
      .exec();

    const {
      products,
      orderBy,
      totalPrice,
      sendAddress,
      deliveryIs,
      endble,
      confirmed,
      payment,
      approve,
      sendproduct,
      slipmoney,
      createdAt,
    } = cart;

    res.json(cart);
    // res.json({ products, orderBy,totalPrice, sendAddress, deliveryIs,endble, confirmed ,payment,approve,sendproduct,createdAt});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderEnable = async (req, res) => {
  try {
    const idOrder = req.params.id;
    const { enable, cancelReasonAd } = req.body;
    console.log(cancelReasonAd);
    console.log("Update order enable for order:", idOrder);
    if(!cancelReasonAd){
      res.status(500).json({ error: "กรุณาใส่รายละเอียดการยกเลิก" });

    }

    // ดำเนินการอัปเดตค่า enable และ cancelReason ในคำสั่งซื้อที่ระบุ
    await Cart.updateOne({ _id: idOrder }, { enable: enable, cancelReason: cancelReasonAd });

    res.status(200).json({ message: "Order enable updated successfully." });
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
          select:
            "productId brand p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
      ])
      .exec();

    const {
      products,
      orderBy,
      totalPrice,
      sendAddress,
      deliveryIs,
      endble,
      confirmed,
      payment,
      approve,
      sendproduct,
      createdAt,
    } = cart;

    res.json(cart);
    // res.json({ products, orderBy,totalPrice, sendAddress, deliveryIs,endble, confirmed ,payment,approve,sendproduct,createdAt});
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
      endble: true,
      confirmed: true,
      approve: false,
      payment: false,
      verifypayment: false,
      pandding: false,
      sendproduct: false,
      complete: false,
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand  p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
      ])
      .exec();

    const {
      products,
      orderBy,
      totalPrice,
      sendAddress,
      deliveryIs,
      endble,
      confirmed,
      payment,
      verifypayment,
      pandding,
      approve,
      sendproduct,
      createdAt,
    } = cart;

    res.json(cart);
    // res.json({ products, orderBy,totalPrice, sendAddress, deliveryIs,endble, confirmed ,payment,approve,sendproduct,createdAt});
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
      endble: true,
      confirmed: true,
      approve: true,
      payment: false,
      verifypayment: false,
      pandding: false,
      sendproduct: false,
      complete: false,
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
      ])
      .exec();

    const {
      products,
      orderBy,
      totalPrice,
      sendAddress,
      deliveryIs,
      endble,
      confirmed,
      verifypayment,
      pandding,
      payment,
      approve,
      sendproduct,
      createdAt,
    } = cart;

    res.json(cart);
    // res.json({ products, orderBy,totalPrice, sendAddress, deliveryIs,endble, confirmed ,payment,approve,sendproduct,createdAt});
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
      endble: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: false,
      pandding: false,
      sendproduct: false,
      complete: false,
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
      ])
      .exec();

    const {
      products,
      orderBy,
      totalPrice,
      sendAddress,
      deliveryIs,
      endble,
      confirmed,
      verifypayment,
      pandding,
      payment,
      approve,
      sendproduct,
      createdAt,
    } = cart;

    res.json(cart);
    // res.json({ products, orderBy,totalPrice, sendAddress, deliveryIs,endble, confirmed ,payment,approve,sendproduct,createdAt});
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
      endble: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: true,
      pandding: false,
      sendproduct: false,
      complete: false,
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
      ])
      .exec();

    const {
      products,
      orderBy,
      totalPrice,
      sendAddress,
      deliveryIs,
      endble,
      confirmed,
      verifypayment,
      pandding,
      payment,
      approve,
      sendproduct,
      createdAt,
    } = cart;

    res.json(cart);
    // res.json({ products, orderBy,totalPrice, sendAddress, deliveryIs,endble, confirmed ,payment,approve,sendproduct,createdAt});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrderSend = async (req, res) => {
  console.log("get ---------------- all");
  try {
    console.log("get al  git ffl");
    // const user = await User.findOne({ idUser }).exec();
    let cart = await Cart.find({
      endble: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: true,
      pandding: true,
      sendproduct: false,
      complete: false,
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
      ])
      .exec();

    const {
      products,
      orderBy,
      totalPrice,
      sendAddress,
      deliveryIs,
      endble,
      confirmed,
      verifypayment,
      pandding,
      payment,
      approve,
      sendproduct,
      createdAt,
    } = cart;

    res.json(cart);
    // res.json({ products, orderBy,totalPrice, sendAddress, deliveryIs,endble, confirmed ,payment,approve,sendproduct,createdAt});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrderComplete = async (req, res) => {
  console.log("get ---------------- all");
  try {
    console.log("get al  git ffl");
    // const user = await User.findOne({ idUser }).exec();
    let cart = await Cart.find({
      endble: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: true,
      pandding: true,
      sendproduct: true,
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
      ])
      .exec();

    const {
      products,
      orderBy,
      totalPrice,
      sendAddress,
      deliveryIs,
      endble,
      confirmed,

      payment,
      verifypayment,
      pandding,
      approve,
      sendproduct,
      createdAt,
    } = cart;

    res.json(cart);
    // res.json({ products, orderBy,totalPrice, sendAddress, deliveryIs,endble, confirmed ,payment,approve,sendproduct,createdAt});
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
      endble: true,
      confirmed: true,
      approve: false,
      payment: false,
      verifypayment: false,
      pandding: false,
      sendproduct: false,
      complete: false,
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
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
    // ค้นหาข้อมูลคำสั่งซื้อตามเงื่อนไขที่กำหนด
    let cart = await Cart.find({
      endble: true,
      confirmed: true,
      approve: true,
      payment: false,
      verifypayment: false,
      pandding: false,
      sendproduct: false,
      complete: false,
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
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

exports.searchOrderPrepare = async (req, res) => {
  const { name } = req.query;
  const regex = new RegExp(name, "i");

  try {
    // ค้นหาข้อมูลคำสั่งซื้อตามเงื่อนไขที่กำหนด
    let cart = await Cart.find({
      endble: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: true,
      pandding: false,
      sendproduct: false,
      complete: false,
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
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
      endble: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: true,
      pandding: true,
      sendproduct: false,
      complete: false,
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
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
      endble: true,
      confirmed: true,
      approve: true,
      payment: true,
      verifypayment: true,
      pandding: true,
      sendproduct: true,
    })
      .populate([
        {
          path: "products.product",
          select:
            "productId brand p_type name p_width price color image detail",
        },
        {
          path: "orderBy",
          select: "_id f_name l_name username email tell createdAt updatedAt",
        },
        {
          path: "sendAddress",
          select:
            "id name tell houseNo sub_district district province postcode idUser",
        },
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
    console.log("Update order endble for order:", idOrder);

    // ดำเนินการอัปเดตค่า endble ในคำสั่งซื้อที่ระบุ
    await Cart.updateOne({ _id: idOrder }, { approve: approve });

    res
      .status(200)
      .json({ message: "Order  p_type endble updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderVerifyPayment = async (req, res) => {
  try {
    const idOrder = req.params.id;
    const { verifypayment } = req.body;
    console.log("Update order endble for order:", idOrder);

    // ดำเนินการอัปเดตค่า endble ในคำสั่งซื้อที่ระบุ
    await Cart.updateOne({ _id: idOrder }, { verifypayment: verifypayment });

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
    console.log("Update order endble for order:", idOrder);

    // ดำเนินการอัปเดตค่า endble ในคำสั่งซื้อที่ระบุ
    await Cart.updateOne({ _id: idOrder }, { pandding: pandding });

    res.status(200).json({ message: "Order endble updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderSend = async (req, res) => {
  try {
    const idOrder = req.params.id;
    const { sendproduct } = req.body;
    console.log("Update order endble for order:", idOrder);

    // ดำเนินการอัปเดตค่า endble ในคำสั่งซื้อที่ระบุ
    await Cart.updateOne({ _id: idOrder }, { sendproduct: sendproduct });
    console.log(sendproduct);
    res.status(200).json({ message: "Order endble updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrderCancelled = async (req, res) => {
  try {
    const idOrder = req.params.id;
    const { cancelled, cause } = req.body;

    // ตรวจสอบว่ามีค่า cause หรือไม่
    if (!cause) {
      return res.status(400).json({ error: "Cause is required." });
    }

    console.log("Update order enable for order:", idOrder);

    await Cart.updateOne({ _id: idOrder }, { cancelled: cancelled, cause: cause });
    console.log(cancelled, cause);

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
      { verifycancelled: verifycancelled, cancelled: cancelledValue, cantcause: cantcause }
    );
    console.log(verifycancelled);
    res.status(200).json({ message: "Order cancel updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.updateSlip = async (req, res) => {
  console.log("data add ", req.file.filename);
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
    cart.slipmoney = req.file.filename;
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

    // ตรวจสอบว่ามี slip ในออเดอร์หรือไม่
    if (!cart.slipmoney) {
      return res.status(400).send("No slip uploaded for this order.");
    }

    // ลบ slip ออกจากออเดอร์
    cart.slipmoney = "";
    cart.payment = false;

    // บันทึกการเปลี่ยนแปลง
    await cart.save();

    // ลบไฟล์ slip ออกจากไดเร็กทอรี
    const slipPath = path.join(__dirname, "images", "slip", cart.slipmoney);
    fs.unlinkSync(slipPath);

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
