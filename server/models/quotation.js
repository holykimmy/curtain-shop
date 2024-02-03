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
module.exports = mongoose.model("Qoutations", ProdusctSchema);
