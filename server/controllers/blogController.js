//connected database
const mongoose = require('mongoose');
const slugify = require("slugify");
const Blogs = require("../models/blogs");
//save data
exports.create = (req, res) => {
  const { title, content, author } = req.body;
  const slug = slugify(title);

  //validate
  switch (true) {
    case !title:
      return res.status(400).json({ error: "enter title" });
      break;
    case !content:
      return res.status(400).json({ error: "enter content" });
      break;
  }

  // connect database
 
  Blogs.create({ title, content, author, slug })
  .then(blog => {
    res.json(blog);
  })
  .catch(err => {
    res.status(400).json({ error: err.message || "Error saving entry to the database" });
  });


  // create a new blog entry
  // const newBlog = new Blogs({ title, content, author, slug });

  // save the blog entry to the database
  // newBlog.save()
  //   .then(savedBlog => {
  //     res.json({ data: savedBlog });
  //   })
  //   .catch(error => {
  //     res.status(500).json({ error: "Error saving blog entry to the database." });
  //   });

};
