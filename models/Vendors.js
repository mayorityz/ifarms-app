const DB = require("mongoose");
const vendorsSchema = new DB.Schema({
  firstName: String,
  lastName: String,
  email: String,
  bizName: String,
  phone1: { type: Number, default: "" },
  phone2: { type: Number, default: "" },
  password: String,
  createdWhen: { type: Date, default: Date.now },
  status: { type: String, default: false },
  address: { type: String, default: "" },
  profileImg: String,
  LGA: String,
  State: String,
});

const V = DB.model("Vendors", vendorsSchema);

module.exports = V;
