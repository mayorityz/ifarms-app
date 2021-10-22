const express = require("express");
const Router = express.Router();

const blogController = require("../controllers/blog.controller");
Router.post("/newpost", blogController.createPost);
Router.get("/blogposts", blogController.fetchBlogs);

module.exports = Router;
