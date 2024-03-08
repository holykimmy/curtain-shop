const mongoose = require("mongoose");

const QuotationSchema = mongoose.Schema(
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
      unique: true,
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
    
    address: [
      {
        houseNo: { type: String },
        sub_district: { type: String },
        district: { type: String },
        province: { type: String },
        postcode: { type: String },
      },
    ],
    
    product: [
      {
        brand: {
          type: String,
          required: true,
        },
        p_type: {
          type: String,
          unique: true,
          required: true,
        },
        slug: {
          type: String,
          lowercase: true,
          unique: true,
        },
        name: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],

    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    author: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Quotations", QuotationSchema);
