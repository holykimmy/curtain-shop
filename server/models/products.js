const mongoose = require("mongoose");

const ProdusctSchema = mongoose.Schema(
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
    detail: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      get: (value) => value.toFixed(2), // Format the value to always have two decimal places when retrieving
      set: (value) => parseFloat(value).toFixed(2), // Ensure the stored value always has two decimal places
    },
    author: { 
      type:String, 
      default: "Admin" 
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Products", ProdusctSchema);
