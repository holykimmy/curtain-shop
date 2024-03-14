const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const CartSchema = mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products", 
          required: true,
        },
        type: { type: String },
        rail: { type: String },
        count: { type: Number, default: 1 },
        width: { type: Number },
        height: { type: Number },
      },
    ],
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
    },
    sendAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address", 
    },
    endble: { type: Boolean, default: true },
    deliveryIs: { type: Number},
    totalPrice: { type: Number },
    confirmed: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    approve: { type: Boolean, default: false },
    verifypayment: { type: Boolean, default: false },
    pandding: { type: Boolean, default: false },
    sendproduct: { type: Boolean, default: false },
    complete: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true}
);

module.exports = mongoose.model("Cart", CartSchema);
