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

const ShowSchema = mongoose.Schema(
  {
  
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String, 
      default: 'noimage.jpg'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shows", ShowSchema);
