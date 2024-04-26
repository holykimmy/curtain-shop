const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const dayjs = require("dayjs");
const localizedFormat = require("dayjs/plugin/localizedFormat");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const thLocale = require("dayjs/locale/th");

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(thLocale);

const CartSchema = mongoose.Schema(
  {
    products: [
      {
        product: {
          brand: {
            type: String,
            required: true
          },
          p_type: {
            type: String
          },
          name: {
            type: String
          },
          color: {
            type: String
          },
          detail: {
            type: String
          },
          p_width: {
            type: Number
          },
          price: {
            type: Number
          },
          image: {
            type: String,
            default: "noimage.jpg"
          },
          imageKey: {
            type: String
          },
          createdAt: {
            type: String,
            default: dayjs().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss")
          }
        },
        detailwd: { type: String },
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
      name: String,
      tell: String,
      houseNo: String,
      sub_district: String,
      district: String,
      province: String,
      postcode: String,

      createdAt: {
        type: String,
        default: dayjs().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss")
      }
    
    },
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
      default: dayjs().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss")
    },
    updatedAt: {
      type: String,
      default: dayjs().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss")
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
