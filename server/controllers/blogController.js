//connected database
const mongoose = require('mongoose');
const slugify = require("slugify");
const Blogs = require("../models/blogs");
const { v4: uuidv4 } = require('uuid');

//save data
exports.create = (req, res) => {
  const { title, content, author } = req.body;
  let slug = slugify(title);

  //validate
  if(!slug)slug=uuidv4();
  switch (true) {
    case !title:
      return res.status(400).json({ error: "enter title" });
      break;
    case !content:
      return res.status(400).json({ error: "enter content" });
      break;
  }

  // connect database saved
  Blogs.create({ title, content, author, slug })
  .then(blog => {
    res.json(blog);
  })
  .catch(err => {
    res.status(400).json({ error:"Error saving entry to the database" });
  });
};

 //read database
// exports.getAllblogs=(req,res)=>{
//   Blogs.find({}).exec((err,blogs)=>{
//     res.json(blogs)
//   })
// }
exports.getAllblogs = (req, res) => {
  Blogs.find({}).exec()
    .then(blogs => {
      res.json(blogs);
    })
    .catch(err => {
      // Handle the error, for example, send an error response
      res.status(500).json({ error: err.message });
    });
};

//singleblogs ref slug
exports.Singleblogs  = (req, res) => {
  const {slug} =req.params ;
  Blogs.findOne({slug}).exec()
  .then(blogs => {
    res.json(blogs);
  })
  .catch(err => {
    // Handle the error, for example, send an error response
    res.status(500).json({ error: err.message });
  });

  


};

