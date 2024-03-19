const mongoose = require("mongoose");
const moment = require("moment");

const ReceptSchema = new mongoose.Schema(
  {
    fullname: String,
    subject: String,
    address: String,
    rows: [
      {
        list: String,
        detail: String,
        counts: Number,
        width: Number,
        height: Number,
        unitprice: Number,
        p_width:Number,
        railprice:Number,
        total_m: Number,
      },
    ],
    deliveryDate: {
      type: String,
      default: moment().locale("th").format("YYYY-MM-DD HH:mm:ss"),
    },
    
    totalPrice: Number,
    quotation: {
      type: Boolean,
      default: false 
    },
    invoice: {
      type: Boolean,
      default: false 
    },
    createdAt: {
      type: String,
      default: moment().locale("th").format("YYYY-MM-DD HH:mm:ss"),
    },
  },
  { timestamps: true }
);

ReceptSchema.pre('save', function(next) {
  if (!this.createdAt) {
    this.createdAt = moment().locale('th').format('YYYY-MM-DD HH:mm:ss');
  }
  next();
});

module.exports = mongoose.model("Recepts", ReceptSchema);
