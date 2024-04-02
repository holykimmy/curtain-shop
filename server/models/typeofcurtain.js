const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const TypeofCurtain = mongoose.Schema(
  {
    type_of: {
      type: String
    },
    price_rail: {
      type: Number
    },
    image: {
      type: String
    }
  },
  { timestamps: true }
);
ProdusctSchema.pre("save", function (next) {
  if (!this.createdAt) {
    this.createdAt = moment().locale("th").format("YYYY-MM-DD HH:mm:ss");
  }
  next();
});

module.exports = mongoose.model("TypeofCurtain", TypeofCurtain);
