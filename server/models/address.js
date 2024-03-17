const mongoose = require("mongoose");

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
  },
  { timestamps: true }
);

addressSchema.pre("save", function (next) {
  if (!this.createdAt) {
    this.createdAt = moment().locale("th").format("YYYY-MM-DD HH:mm:ss");
  }
  next();
});

module.exports = mongoose.model("Address", addressSchema);
