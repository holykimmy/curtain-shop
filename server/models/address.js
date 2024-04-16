const mongoose = require("mongoose");
const moment = require("moment");

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
      default: moment().locale("th").format("YYYY-MM-DD HH:mm:ss")
    },
    updatedAt: {
      type: String,
      default: moment().locale("th").format("YYYY-MM-DD HH:mm:ss")
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Address", addressSchema);
