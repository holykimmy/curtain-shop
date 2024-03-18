const mongoose = require("mongoose");

const ProdusctSchema = mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    p_type: {
      type: String,
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
    p_width: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      get: (value) => (value !== null && value !== undefined ? value.toFixed(2) : '0.00'), // Format the value to always have two decimal places when retrieving
      set: (value) => parseFloat(value).toFixed(2), // Ensure the stored value always has two decimal places
    },
    image: {
      type: String, 
      default: 'noimage.jpg'
    },
    author: { 
      type:String, 
      default: "admin" 
    },
    visibility: {
      type: Boolean,
      default: true // เริ่มต้นให้สินค้าเป็น visible สำหรับลูกค้าทุกคน
    }
  },
  { timestamps: true }
);
ProdusctSchema.pre('save', function(next) {
  if (!this.createdAt) {
    this.createdAt = moment().locale('th').format('YYYY-MM-DD HH:mm:ss');
  }
  next();
});
module.exports = mongoose.model("Products", ProdusctSchema);
