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

categorySchema.pre('save', function(next) {
  if (!this.createdAt) {
    this.createdAt = moment().locale('th').format('YYYY-MM-DD HH:mm:ss');
  }
  next();
});

module.exports = mongoose.model("Categorys", categorySchema);

