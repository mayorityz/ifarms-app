const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
// middleware
const userMiddleware = require('../middleware/Users.middleware')
// controller
const userController = require('../controllers/Users')

router.post(
  '/newuser',
  [
    body('firstName').trim().not().isEmpty(),
    body('lastName').trim().not().isEmpty(),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Invalid Email Address Supplied'),
    body('pass1')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Password Cannot be less than five characters.'),
  ],
  userMiddleware.Validation,
  userMiddleware.CheckUserExists,
  userController.newUser,
)
router.post('/login', userController.userLogin)
router.get('/allusers', userController.allUsers)
router.get('/profile/:userid', userController.userProfile)
router.post('/updateprofile/:userid', userController.userUpdate)
router.post('/user/delete', userController.deleteUser)
router.post('/verify-my-account', userController.verifyUser)
router.post('/user/dashboard', userController.myDashboard)
module.exports = router
