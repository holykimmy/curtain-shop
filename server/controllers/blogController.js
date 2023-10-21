//connected database
const slugify = require("slugify");
//save data
exports.create = (req, res) => {
  const { title, content, author } = req.body;
  // const slug = slugify(req.body.slug)
  const slug = slugify(title);

  switch (true) {
    case !title:
      return res.status(400).json({ error: "enter title" });
      break;
    case !content:
      return res.status(400).json({ error: "enter content" });
      break;
  }
  res.json({
    data: { title, content, author, slug },
  });
};
