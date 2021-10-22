require('dotenv').config()
const Product = require('../models/Products')
const UserModel = require('../models/User')
const OrderModel = require('../models/Orders')
const Paystack = require('../util/paystack')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')

const cloudinary = require('cloudinary')
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const userDetails = async (id) => {
  try {
    return await UserModel.findById(id, (err, res) => {
      return err ? '' : res
    })
  } catch (err) {
    return err
  }
}

exports.allProducts = (req, res, next) => {
  const { skip } = req.body
  const p = Product.displayAll(skip || 0)
  p.then((res_) => {
    res.json(res_)
  }).catch((err) => {
    res.status(500).json({ err })
  })
}

exports.newProducts = async (req, res, next) => {
  const {
    title,
    category,
    price,
    measurement,
    quantity,
    desc,
    token,
    imgUrls,
  } = req.body

  if (!token) {
    return res
      .status(400)
      .json({ message: 'Invalid Request! Try to login again!!' })
  }
  // add secret key to env.
  // create a refresh token.
  jwt.verify(token, 'iFarmSecretKey', async (er, decoded) => {
    if (er) {
      res.status(400).json({ status: false, message: 'Token Has Expired!' })
      return
    }
    let userInfo = await userDetails(decoded.id)
    const { firstName, lastName, email, phone1, address, profileImg } = userInfo

    const product = new Product({
      title,
      category,
      price,
      measurement,
      quantity,
      description: desc,
      imgUrls,
      vendorId: decoded.id,
      vendorDetails: {
        firstName,
        lastName,
        email,
        phone1,
        address,
        profileImg,
      },
    })
    product.newProduct()
    res.send('Your Product Has Been Added To The Marketplace!!!')
  })
}

exports.myProducts = (req, res, next) => {
  // get the id from the token
  const { token } = req.body
  try {
    jwt.verify(token, 'iFarmSecretKey', (er, decoded) => {
      console.log(decoded)
      if (er) {
        res.status(400).json({ status: false, message: 'Token Has Expired!' })
        return
      }

      Product.userProducts({ vendorId: decoded.id })
        .then((res_) => {
          res.json(res_)
        })
        .catch((err) => {
          console.log(err)
        })
    })
  } catch (error) {
    res.send(error)
  }
}

exports.productDetails = async (req, res, next) => {
  const { id } = req.params
  try {
    await Product.productDetails({ _id: id }).then((result) => {
      console.log(result)
      res.json({ status: 'success', result })
    })
  } catch (error) {}
}

exports.deleteProduct = async (req, res) => {
  const { id } = req.body
  try {
    await Product.delete(id).then((result) => {
      res.json({ status: 'success', result })
    })
  } catch (error) {}
}

exports.checkout = async (req, res) => {
  const { userId, cart, price } = req.body

  const userInfo = await userDetails(userId)
  const { email, firstName, lastName, phone1, address } = userInfo
  const orderId = uuid.v1()
  try {
    const initPayment = new Paystack()
    initPayment
      .makePayment(
        'https://ifarms-app.herokuapp.com/products/verifypayment',
        price,
        orderId,
        firstName,
        email,
      )
      .then(async (ress) => {
        await OrderModel.save(
          userId,
          orderId,
          { email, firstName, lastName, phone1, address },
          cart,
          price,
        )
        res.send(ress)
      })
  } catch (error) {
    console.log(error)
  }
}

exports.verify = async (req, res) => {
  const reference = req.query.reference
  if (!reference) res.send('Invalid Payment Reference.')
  try {
    Paystack.verifyPayment(reference).then((res_) => {
      // update the db...
      if (res_ === 'Verification successful')
        res.redirect(
          `${process.env.FRONTEND_URL}/dashboard/shopping-cart?status=completed`,
        )
      else
        res.redirect(
          `${process.env.FRONTEND_URL}/dashboard/shopping-cart?status=error`,
        )
    })
  } catch (error) {}
}

exports.update = async (req, res) => {
  const {
    id,
    title,
    price,
    category,
    measurement,
    description,
    quantity,
  } = req.body
  let update_ = await Product.edit(
    id,
    title,
    category,
    price,
    measurement,
    quantity,
    description,
  )

  if (update_ !== 'error') {
    res.status(200).send('success')
  } else {
    res.status(500).send('An Error Occured')
  }
}
