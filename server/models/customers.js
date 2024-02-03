const mongoose = require("mongoose");
const customerSchema = mongoose.Schema(
  {
    f_name: {
      type: String,
      required: true,
    },
    l_name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique:true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    tell: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address:  [
      {
        houseNo: { type: String },
        sub_district: { type: String },
        district: { type: String },
        province: { type: String },
        postcode: { type: String },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Customers", customerSchema);
