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

const categorySchema = mongoose.Schema(
  {
    brand: {
      type: String,
      unique: true,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    p_type: [
      {
        type: String,
        required: true,
      },
    ],
    
    createdAt: {
      type: String,
      default: dayjs().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss')    },
    updatedAt: {
      type: String,
      default: dayjs().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss')    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Categorys", categorySchema);

