const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const moment = require("moment");

const CartSchema = mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true
        },
        type: { type: String },
        rail: { type: String },
        count: { type: Number, default: 1 },
        width: { type: Number },
        height: { type: Number },
        totalPiece: { type: Number },
        twolayer: { type: String }
      }
    ],
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers"
    },
    sendAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address"
    },
    detail: { type: String },
    enable: { type: Boolean, default: true },
    deliveryIs: { type: String },
    totalPrice: { type: Number },
    confirmed: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    approve: { type: Boolean, default: false },
    slipmoney: { type: String },
    windowimg: [{ type: String }],
    verifypayment: { type: Boolean, default: false },
    cancelled: { type: Boolean, default: false },
    verifycancelled: { type: Boolean, default: false },
    cancelReasonAd: { type: String },
    cancelReason: { type: String },
    postcodeOrder: { type: String },
    pandding: { type: Boolean, default: false },
    sendproduct: { type: Boolean, default: false },
    complete: { type: Boolean, default: false },
    deposit: { type: Boolean, default: false },
    createdAt: {
      type: String,
      default: moment().locale("th").format("YYYY-MM-DD HH:mm:ss")
    },
    updatedAt: {
      type: String,
      default: moment().locale("th").format("YYYY-MM-DD HH:mm:ss")
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
