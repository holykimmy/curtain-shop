//connected database
const mongoose = require("mongoose");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const Quotation = require("../models/quotation");
const fs = require("fs");
const path = require("path");
const slugifyMultilingual = (text) =>
  slugify(text, { lower: true, locale: "th" });


  exports.createQuotation = async (req, res) => {
    try {
      const data = req.body;
  
      // Create a new Quotation document
      const newQuotation = new Quotation({
        f_name: data.f_name,
        l_name: data.l_name,
        username: data.username,
        email: data.email,
        tell: data.tell,
        address: data.address,
        product: data.product
      });
  
      // Save the new Quotation document
      const savedQuotation = await newQuotation.save();
  
      res.status(201).json(savedQuotation); // Respond with the saved Quotation document
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  };
  