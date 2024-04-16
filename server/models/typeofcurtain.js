const mongoose = require("mongoose");
const moment = require("moment");

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
      default: moment().locale("th").format("YYYY-MM-DD HH:mm:ss")
    },
    updatedAt: {
      type: String,
      default: moment().locale("th").format("YYYY-MM-DD HH:mm:ss")
    }
  },
  { timestamps: true }
);

TypeofCurtain.pre("save", function (next) {
  if (!this.createdAt) {
    this.createdAt = moment().locale("th").format("YYYY-MM-DD HH:mm:ss");
  }
  next();
});

module.exports = mongoose.model("TypeofCurtain", TypeofCurtain);
