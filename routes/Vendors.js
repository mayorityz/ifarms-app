const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const vendorController = require("../controllers/Vendors");

router.post(
  "/vendor/newaccount",
  [
    check("firstName").trim().not().isEmpty(),
    check("lastName").trim().not().isEmpty(),
    check("email")
      .trim()
      .isEmail()
      .withMessage("Invalid Email Address Supplied"),
    check("pass1")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password Cannot be less than five characters."),
  ],
  vendorController.newVendor
);
router.post("/vendor/login", vendorController.login);
// router.get("/allusers", userController.allUsers);
// router.get("/profile/:userid", userController.userProfile);
// router.post("/updateprofile/:userid", userController.userUpdate);

module.exports = router;
