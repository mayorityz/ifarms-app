const blogModel = require("../models/Blog.Model");

/**
 *
 */
exports.createPost = async (req, res) => {
  const { title, body } = req.body;
  const params = { blogTitle: title, content: body };

  try {
    const create = new blogModel(params);
    await create.save((err, document) => {
      if (err) {
        res
          .status(400)
          .send("An Error Occured While Creating This Post. Please Again");
        return;
      }
      res.status(200).send("Blog Saved Successfully!");
    });
  } catch (error) {
    console.log(error);
  }
};

// fetch all blogs.
exports.fetchBlogs = async (req, res) => {
  try {
    await blogModel.find({}, (er, docx) => {
      if (er)
        res.status(400).send("An Error While Fetching Existing Blog Posts");
      else res.status(200).send(docx);
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
