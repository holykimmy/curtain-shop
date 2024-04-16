const mongoose = require("mongoose");
const moment = require("moment");

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

categorySchema.pre('save', function(next) {
  if (!this.createdAt) {
    this.createdAt = moment().locale('th').format('YYYY-MM-DD HH:mm:ss');
  }
  next();
});

module.exports = mongoose.model("Categorys", categorySchema);

