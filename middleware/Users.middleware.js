const { validationResult } = require("express-validator");
const UserModel = require("../models/User");

exports.Validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(201).json({ errors: errors.array() });
  }
  req.email = req.body.email;
  next();
};

exports.CheckUserExists = async (req, res, next) => {
  try {
    let result = await UserModel.findOne({ email: req.email });
    result === null
      ? next()
      : res.json({
          success: false,
          errors: [{ msg: `${req.email} already exists...` }],
        });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      success: false,
      errors: [{ msg: `Error : ${error}` }],
    });
  }
};
