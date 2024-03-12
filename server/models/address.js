const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
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
});

module.exports = mongoose.model("Address", addressSchema);
 