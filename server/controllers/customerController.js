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

exports.findAddress = (req, res) => {
  const { username } = req.query; // Extract username from request parameters
  console.log(username);
  User.findOne({ username }) // Find user by username
    .select("address") // Select only the address field
    .exec()
    .then((customer) => {
      if (!customer) {
        // If customer is not found, return an error response
        return res.status(404).json({ error: "ไม่พบลูกค้า" });
      }

      // console.log("address", customer.address);
      // If customer is found, return the customer's address
      res.json(customer.address);
    })
    .catch((err) => {
      // Handle any errors that occur during the query
      console.log(err);
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
  const id = req.params.id; // Get the user ID from request params
  const addressId = req.params.addressId; // Get the address ID from request params

  // Find the customer by user ID
  User.findById(id)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Customer not found" });
      }

      // Find the address within the customer's addresses array by address ID
      const address = user.address.find(
        (addr) => addr._id.toString() === addressId
      );

      if (!address) {
        return res.status(404).json({ error: "Address not found" });
      }

      // If address is found, return it
      res.json({
        houseNo: address.houseNo,
        sub_district: address.sub_district,
        district: address.district,
        province: address.province,
        postcode: address.postcode
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};


exports.createAddress = (req, res) => {
  const { id } = req.body; // รับ ID ของผู้ใช้จาก req.body
  const addressData = req.body.address;
  // console.log(addressData);

  if (addressData.some((field) => !field)) {
    let errorMessage = "";

    // ตรวจสอบแต่ละฟิลด์ว่ามีค่าว่างหรือไม่ และเพิ่มข้อความแจ้งเตือนเข้าไปใน errorMessage
    if (!addressData.houseNo) errorMessage += "กรุณากรอกบ้านเลขที่\n";
    if (!addressData.sub_district) errorMessage += "กรุณากรอกแขวง\n";
    if (!addressData.district) errorMessage += "กรุณากรอกเขต\n";
    if (!addressData.province) errorMessage += "กรุณากรอกจังหวัด\n";
    if (!addressData.postcode) errorMessage += "กรุณากรอกรหัสไปรษณีย์\n";

    return res.status(400).json({ error: errorMessage });
  }

  User.findById(id) // ใช้ ID เพื่อค้นหาผู้ใช้
    .exec()
    .then((existingCustomer) => {
      if (existingCustomer) {
        //เกิน
        if (existingCustomer.address.length >= 5) {
          console.log(
            "ไม่สามารถเพิ่มที่อยู่ได้ เนื่องจากมีที่อยู่เกินจำนวนที่กำหนด"
          );
          return res.status(400).json({
            error:
              "ไม่สามารถเพิ่มที่อยู่ได้ เนื่องจากมีที่อยู่เกินจำนวนที่กำหนด",
          });
        }

        // ตรวจสอบว่าที่อยู่ที่จะเพิ่มมีอยู่แล้วหรือไม่
        const isAddressExist = existingCustomer.address.some(
          (existingAddress) => {
            return addressData.every((newAddress) => {
              return (
                existingAddress.houseNo === newAddress.houseNo &&
                existingAddress.sub_district === newAddress.sub_district &&
                existingAddress.district === newAddress.district &&
                existingAddress.province === newAddress.province &&
                existingAddress.postcode === newAddress.postcode
              );
            });
          }
        );

        if (isAddressExist) {
          console.log("ที่อยู่นี้มีอยู่แล้ว");
          return res.status(400).json({ error: "ที่อยู่นี้มีอยู่แล้ว" });
        }

        // ถ้าที่อยู่ยังไม่มีในรายการ ให้เพิ่มที่อยู่ลงในรายการของลูกค้า
        addressData.forEach((newAddress) => {
          existingCustomer.address.push(newAddress);
        });

        // บันทึกข้อมูลลูกค้าที่อัปเดต
        return existingCustomer.save();
      } else {
        // ถ้าไม่พบลูกค้า ให้ปฏิเสธด้วยข้อผิดพลาด
        return Promise.reject({ error: "ไม่พบลูกค้า" });
      }
    })
    .then((updatedCustomer) => {
      // ส่งคำตอบสำเร็จ
      res.status(200).json(updatedCustomer);
    })
    .catch((error) => {
      // จัดการข้อผิดพลาด
      // console.error(error);
      res.status(500).json({ error: "server error" });
    });
};

exports.deleteAddress = async (req, res) => {
  const { id, addressId } = req.params; // รับ ID ของผู้ใช้และ ID ของที่อยู่ที่ต้องการลบจาก params

  try {
    // ค้นหาผู้ใช้โดยใช้ ID
    const user = await User.findById(id);

    // ตรวจสอบว่าพบผู้ใช้หรือไม่
    if (!user) {
      return res.status(404).json({ error: "ไม่พบผู้ใช้" });
    }

    // ค้นหาที่อยู่ที่ต้องการลบ
    const addressToDelete = user.address.find(
      (addr) => addr._id.toString() === addressId
    );

    // ตรวจสอบว่าพบที่อยู่ที่ต้องการลบหรือไม่
    if (!addressToDelete) {
      return res.status(404).json({ error: "ไม่พบที่อยู่ที่ต้องการลบ" });
    }

    // ลบที่อยู่ที่ต้องการ
    user.address.pull(addressToDelete);

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
      addressToUpdate.houseNo = newAddress.houseNo || addressToUpdate.houseNo;
      addressToUpdate.sub_district = newAddress.sub_district || addressToUpdate.sub_district;
      addressToUpdate.district = newAddress.district || addressToUpdate.district;
      addressToUpdate.province = newAddress.province || addressToUpdate.province;
      addressToUpdate.postcode = newAddress.postcode || addressToUpdate.postcode;
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

// exports.updateAddress = (req, res) => {
//   const { id, addressId, updatedAddress } = req.body; // รับ ID ของผู้ใช้และ ID ของที่อยู่ที่จะแก้ไข และข้อมูลที่อยู่ที่แก้ไขจาก req.body

//   User.findById(id) // ใช้ ID เพื่อค้นหาผู้ใช้
//     .exec()
//     .then((existingCustomer) => {
//       if (!existingCustomer) {
//         return res.status(404).json({ error: "ไม่พบลูกค้า" });
//       }

//       // หาที่อยู่ที่ต้องการแก้ไข
//       const addressToUpdate = existingCustomer.address.find(
//         (address) => address._id.toString() === addressId
//       );
//       if (!addressToUpdate) {
//         return res.status(404).json({ error: "ไม่พบที่อยู่ที่ต้องการแก้ไข" });
//       }

//       // แก้ไขข้อมูลที่อยู่
//       Object.assign(addressToUpdate, updatedAddress);

//       // บันทึกข้อมูลลูกค้าที่อัปเดต
//       return existingCustomer.save();
//     })
//     .then((updatedCustomer) => {
//       // ส่งคำตอบสำเร็จ
//       res.status(200).json(updatedCustomer);
//     })
//     .catch((error) => {
//       // จัดการข้อผิดพลาด
//       console.error(error);
//       res.status(500).json({ error: "server error" });
//     });
// };

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // ทำสิ่งที่ต้องการเพื่อจัดการกับ unhandled rejection
});
