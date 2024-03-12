const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    brand: {
      type: String,
      unique: true,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    p_type: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Categorys", categorySchema);

