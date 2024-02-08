const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const customerSchema = mongoose.Schema(
  {
    f_name: {
      type: String,
      required: true,
    },
    l_name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    tell: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: { 
      type: String, 
    
      default: "user" // กำหนดค่าเริ่มต้นเป็น "user"
    },
    address: [
      {
        houseNo: { type: String },
        sub_district: { type: String },
        district: { type: String },
        province: { type: String },
        postcode: { type: String },
      },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Hashing password before saving

// Generate JWT token for authentication
customerSchema.methods.generateAuthToken = async function () {
  const customer = this;
  const token = jwt.sign(
    { _id: this._id, email: this.email ,role: this.role },
    process.env.MY_KEY,
    {
      expiresIn: "7d",
    }
    
  );

  customer.tokens = customer.tokens.concat({ token });
  await customer.save();

  return token;
};

const User = mongoose.model("Customers", customerSchema);

const validate = (data) => {
  const schema = Joi.object({
    f_name: Joi.string().required().label("First Name"),
    l_name: Joi.string().required().label("Last name"),
    username: Joi.string().required().label("Username"),
    email: Joi.string().required().label("Email"),
    tell: Joi.string().required().label("tell"),
    password: Joi.string()
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{7,30}$/) // ลบการตรวจสอบอักขระพิเศษออก
      .required()
      .label("Password")
      .messages({
        "string.pattern.base": "รหัสผ่านต้องมีอักษรภาษาอังกฤษและตัวเลข",
      }),
  });
  return schema.validate(data);
};

module.exports = { User, validate };
