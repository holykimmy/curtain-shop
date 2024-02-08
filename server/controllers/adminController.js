//connected database
const mongoose = require("mongoose");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, validate } = require("../models/customers");

exports.verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  // const role = userFound.role;
 
  if (!token) {
    return res.json("Token is missing");
  } else {
    jwt.verify(token, process.env.MY_KEY, (err, decoded) => {
      if (err) {
        
        return res.json("Error with token");
      } else {
        if (decoded.role === "admin") {
          
          // ถ้าบทบาทของผู้ใช้เป็น "admin" ให้เรียกใช้งาน middleware ถัดไป
          next();
        } else {
          return res.json("Not admin");
        }
      }
    });
  }
};
