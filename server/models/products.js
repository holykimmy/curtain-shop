const mongoose = require("mongoose");
const dayjs = require("dayjs");
const localizedFormat = require("dayjs/plugin/localizedFormat");
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const thLocale = require('dayjs/locale/th');

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(thLocale);

const ProdusctSchema = mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    p_type: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    p_width: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      get: (value) => (value !== null && value !== undefined ? value.toFixed(2) : '0.00'), // Format the value to always have two decimal places when retrieving
      set: (value) => parseFloat(value).toFixed(2), // Ensure the stored value always has two decimal places
    },
    image: {
      type: String, 
      default: 'noimage.jpg'
    },
    imageKey: {
      type : String
    },
    author: { 
      type:String, 
      default: "admin" 
    },
    visibility: {
      type: Boolean,
      default: true 
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

module.exports = mongoose.model("Products", ProdusctSchema);
