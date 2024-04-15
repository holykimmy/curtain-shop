const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
// const request = require('request');
const axios = require("axios");

// import route
const CustomerRoute = require("./routes/customer");
const ProductRoute = require("./routes/product");
const CategoryRoute = require("./routes/category");
const AdminRoute = require("./routes/admin");
const AuthRoute = require("./routes/auth");
const ReceptRoute = require("./routes/recept");
const TypeRoute = require("./routes/typeofcurtain");


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");

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
    origin: ["http://localhost:3000", "https://cms-curtain-shop.vercel.app", "https://curtain-shop.vercel.app" ,"https://curtain-shop-mu.vercel.app" ], // กำหนดโดเมนที่อนุญาตให้เข้าถึง
    methods: ["GET", "POST", "PUT", "DELETE"], // กำหนดเมทอดที่อนุญาต
    allowedHeaders: ["Content-Type", "Authorization", "authtoken"],
    credentials: true, // อนุญาตให้ส่งคุกกี้ (cookies) ไปพร้อมกับคำขอ
  })
);




app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'https://cms-curtain-shop.vercel.app', 'https://curtain-shop.vercel.app' ,'https://curtain-shop-mu.vercel.app'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
});

app.use(cookieParser());
app.use(morgan("dev"));


// Routes
app.use("/api/customer", CustomerRoute);
app.use("/api/product", ProductRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/dashboard", AdminRoute);
app.use("/api/recept", ReceptRoute);
app.use("/api/type-cut", TypeRoute);

app.use("/api", AuthRoute);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// // Proxy middleware to forward requests to the actual API server
// app.use("/api", (req, res) => {
//   // Forward the request to the actual API server
//   const targetUrl = "http://localhost:5500" + req.originalUrl;
//   req.pipe(request(targetUrl)).pipe(res);
// });

// Middleware to forward requests to the actual API server
app.use("/api", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:5500${req.originalUrl}`,
      data: req.body,
      headers: req.headers,
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    // Handle errors appropriately
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`start server in port ${port}`));
