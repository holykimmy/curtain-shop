const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: { type: {}, required: true },
    author: { type: String, required: "Admin" },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
  },
  { timestamp: true }
);
module.exports =mongoose.model("Blogs", blogSchema);