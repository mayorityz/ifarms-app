const DB = require("mongoose");

const blogSchema = new DB.Schema({
  blogTitle: String,
  postDate: {
    type: Date,
    default: Date.now,
  },
  content: String,
});

const Blog = DB.model("blog", blogSchema);

module.exports = Blog;
