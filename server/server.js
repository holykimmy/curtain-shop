const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
// const blogRoute = require('./routes/blog')
const CustomerRoute = require("./routes/customer");
const ProductRoute = require("./routes/product");
const CategoryRoute = require("./routes/category");
const AdminRoute = require("./routes/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

//connect cloud database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
    dbName: "curtain-shop",
  })
  .then(() => console.log("Connected to the server"))
  .catch((err) => console.log(err));

//middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // กำหนดโดเมนที่อนุญาตให้เข้าถึง
    methods: ["GET", "POST" ,"PUT" ,"DELETE"], // กำหนดเมทอดที่อนุญาต
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // อนุญาตให้ส่งคุกกี้ (cookies) ไปพร้อมกับคำขอ
  })
);
app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api/customer", CustomerRoute);
app.use("/api/product", ProductRoute);
app.use("/api/category", CategoryRoute);
app.use('/api/dashboard', AdminRoute);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`start server in port ${port}`));
