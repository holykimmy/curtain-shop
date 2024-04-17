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

const addressSchema = mongoose.Schema(
  {
    name: String,
    tell: String,
    houseNo: String,
    sub_district: String,
    district: String,
    province: String,
    postcode: String,
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
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


module.exports = mongoose.model("Address", addressSchema);
