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

const TypeofCurtain = mongoose.Schema(
  {
    name: {
      type: String
    },
    price_rail: {
      type: Number
    },
    image: {
      type: String
    },
    bgimage:{
      type:String,
      default: "test2_ocvii1"
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true
    },
    twolayer: {
        type: String
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



module.exports = mongoose.model("TypeofCurtain", TypeofCurtain);
