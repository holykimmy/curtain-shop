const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config()
// const blogRoute = require('./routes/blog')
const CustomerRoute = require('./routes/customer')
const ProductRoute = require('./routes/product')
const CategoryRoute = require('./routes/category')



const app = express();

//connect cloud database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
    dbName: 'curtain-shop',
  })
    .then(() => console.log("Connected to the server"))
    .catch((err) => console.log(err));

//middleware
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

//route
app.use('/api',CustomerRoute)
app.use('/api/product',ProductRoute)
app.use('/api/category',CategoryRoute)

const port = process.env.PORT || 8080
app.listen(port,()=>console.log(`start server in port ${port}`))