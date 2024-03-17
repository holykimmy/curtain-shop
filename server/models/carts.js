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
    deliveryIs: { type: Number },
    totalPrice: { type: Number },
    confirmed: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    approve: { type: Boolean, default: false },
    slipmoney: { type: String },
    verifypayment: { type: Boolean, default: false },
    cancelled: { type: Boolean, default: false },
    verifycancelled: { type: Boolean, default: false },
    cancelReasonAd : { type: String },
    cancelReason : { type: String },
    pandding: { type: Boolean, default: false },
    sendproduct: { type: Boolean, default: false },
    
    complete: { type: Boolean, default: false },
    createdAt: { type: String, default: moment().locale("th").format("YYYY-MM-DD HH:mm:ss") }
  },
  { timestamps: true }
);
CartSchema.pre('save', function(next) {
  if (!this.createdAt) {
    this.createdAt = moment().locale('th').format('YYYY-MM-DD HH:mm:ss');
  }
  next();
});

module.exports = mongoose.model("Cart", CartSchema);
