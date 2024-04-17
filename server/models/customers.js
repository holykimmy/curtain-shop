const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const dayjs = require("dayjs");
const localizedFormat = require("dayjs/plugin/localizedFormat");
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const thLocale = require('dayjs/locale/th');

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(thLocale);

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
    enable: {
      type:Boolean,
      default: true,
    }

    ,
    role: {
      type: String,

      default: "user", // กำหนดค่าเริ่มต้นเป็น "user"
    },
    createdAt: {
      type: String,
      default: dayjs().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss')
    },
    updatedAt: {
      type: String,
      default: dayjs().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss')
    }
 
  },
  { timestamps: true }
);

// Hashing password before saving

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
        "string.pattern.base": "รหัสผ่านต้องมีอักษรภาษาอังกฤษและตัวเลขและต้องมีความยาวมากกว่า7ตัวขึ้นไป",
      }),
  });
  return schema.validate(data);
};

module.exports = { User, validate };
