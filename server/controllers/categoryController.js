//connected database
const mongoose = require("mongoose");
const slugify = require("slugify");
const { v4: uuidv4 } = require('uuid'); 
const Categorys = require("../models/categorys");
// const TypeOfPs =  require("../models/categorys");
const slugifyMultilingual = (text) => slugify(text, { lower: true, locale: 'th' });

exports.create = (req, res) => {
  const { brand, p_type } = req.body;
  let slug = slugifyMultilingual(brand);
  // ตรวจสอบว่าแบรนนี้มีอยู่แล้วหรือไม่

  Categorys.findOne({ brand })
    .then((existingCategory) => {
      if (existingCategory) {
        // if have brand
        if (p_type.length > 0) {
          // check if dupicate
          const newTypes = p_type.filter(
            (type) => !existingCategory.p_type.includes(type)
          );

          if (newTypes.length > 0) {
            // add type if not dupicate
            existingCategory.p_type.push(...newTypes);

            return existingCategory.save();
          } else {
            // if type have in data
            return Promise.reject({ error: "ประเภททั้งหมดมีอยู่แล้ว" });
          }
        }
        return Promise.reject({ error: "ข้อมูลนี้มีอยู่แล้ว" });
      } else {
        // if don't have brand in database
        // create brand and type
        
        const newCategory = new Categorys({ brand:brand , p_type: p_type,slug });
        return newCategory.save();
      }
    })
    .then((updatedCategory) => {
      res.json(updatedCategory);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "ข้อมูลนี้มีอยู่แล้ว" });
    });
};


exports.createBrand = (req, res) => {
  const { brand } = req.body;
  let slug = slugifyMultilingual(brand);
  if(!slug)slug=uuidv4();
  switch (true) {
    case !brand:
      return res.status(400).json({ error: "enter brand" });
      break;
  }

  Categorys.create({ brand, slug })
    .then((category) => {
      res.json(category);
    })
    .catch((err) => {
      res.status(400).json({ error: "brand นี้มีอยู่แล้ว" });
    });
};

exports.createType = (req,res) => {
  const {brand , p_type  } = req.body ;
  let slug = slugifyMultilingual(brand);
  if(!slug)slug=uuidv4();
  switch (true) {
    case !brand:
      return res.status(400).json({ error: "กรุณาเลือกแบรนด์สินค้า" });
      break;
  }

  Categorys.findOne({ brand })
    .then((existingCategory) => {
      if (existingCategory) {
        // if have brand
        if (p_type.length > 0) {
          // check if dupicate
          const newTypes = p_type.filter(
            (type) => !existingCategory.p_type.includes(type)
          );

          if (newTypes.length > 0) {
            // add type if not dupicate
            existingCategory.p_type.push(...newTypes);

            return existingCategory.save();
          } else {
            // if type have in data
            return Promise.reject({ error: "ประเภททั้งหมดมีอยู่แล้ว" });
          }
        }
        return Promise.reject({ error: "ข้อมูลนี้มีอยู่แล้ว" });
      } else {
        // if don't have brand in database
        // create brand and type
        
        const newCategory = new Categorys({ brand:brand , p_type: p_type,slug });
        return newCategory.save();
      }
    })
    .then((updatedCategory) => {
      console.log(updatedCategory);
      res.json(updatedCategory);
    })
    .catch((err) => {
      // console.log(error);
      res.status(500).json({ error: err.message });
      // res.status(500).json({ error: "server error" });
    });
}

exports.getAllCategorys = (req, res) => {
  const { slug, brand } = req.query; // รับ brand จาก query parameters
  Categorys.find()
    .exec()
    .then((brands) => {
      res.json(brands);
    })
    .catch((err) => {
      // Handle the error, for example, send an error response
      res.status(500).json({ error: err.message });
    });
};
// const { slug } = req.body;

exports.getTypeOfPs = (req, res) => {
const { slug } = req.query;
console.log("slug:", slug);

  Categorys.find({ slug })
    .exec()
    .then((categories) => {
      if (categories.length === 0) {
        res.status(404).json({ error: "ไม่พบข้อมูลที่ตรงกับ slug ที่ระบุ" });
        return;
      }

      // ไว้เก็บค่า p_type
      const pTypesArray = [];

      categories.forEach((category) => {
        if (category.p_type && Array.isArray(category.p_type)) {
          pTypesArray.push(...category.p_type);
        }
      });

      const result = {
        brand: categories[0].brand, // brand จาก file slug
        slug: slug, // slug form slug
        p_type: pTypesArray, // p_type form array
      };

      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};