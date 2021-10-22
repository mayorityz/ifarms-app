require("dotenv").config();
const db = require("mongoose");

const URL = !process.env.NODE_ENV
  ? "mongodb://127.0.0.1:27017/ifarmApp"
  : "mongodb+srv://mayorityz:majormayor@ifarms-app-wpmr0.mongodb.net/test?retryWrites=true&w=majority";
const connection = db.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

module.exports = connection;
//"mongodb+srv://mayorityz:majormayor@ifarms-app-wpmr0.mongodb.net/test?retryWrites=true&w=majority"
// "mongodb://127.0.0.1:27017/ifarmApp"
// mongodb://127.0.0.1:27017
