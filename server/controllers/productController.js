//connected database
const mongoose = require("mongoose");
const slugify = require("slugify");

const Products =  require("../models/products");

exports.create = (req,res) => {
    const { brand, p_type ,name ,color ,detail ,price } = req.body;
    let slug = slugify(brand);
    //connect 
    Products.findOne({ brand, p_type, name, color, detail, price ,slug}).exec()
        .then(existingProduct => {
            if (existingProduct) {
                // ถ้าข้อมูลมีอยู่แล้ว
                res.status(400).json({ error: 'ข้อมูลที่ต้องการบันทึกมีอยู่แล้ว' });
            } else {
                // ถ้าข้อมูลยังไม่มีอยู่
                // ทำการสร้างข้อมูลใหม่
                return Products.create({ brand, p_type, name, color, detail, price,slug });
            }
        })
        .then((product) => {
            res.json(product);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.getAllProducts = (req, res) => {
    Customers.find({})
      .exec()
      .then((products) => {
        res.json(products);
      })
      .catch((err) => {
        // Handle the error, for example, send an error response
        res.status(500).json({ error: err.message });
      });
  };