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

const ReceptSchema = new mongoose.Schema(
  {
    fullname: String,
    subject: String,
    detail:String,
    address: String,
    rows: [
      {
        list: String,
        p_type: String,
        rail: String,
        detail: String,
        counts: Number,
        width: Number,
        height: Number,
        unitprice: Number,
        p_width: Number,
        price_rail: Number,
        total_m: Number
      }
    ],
    deliveryDate: {
      type: String,
      default: dayjs().locale("th").format("YYYY-MM-DD")
    },

    totalPrice: Number,
    quotation: {
      type: Boolean,
      default: false
    },
    invoice: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: String,
      default: dayjs().locale("th").format("YYYY-MM-DD")
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Recepts", ReceptSchema);
