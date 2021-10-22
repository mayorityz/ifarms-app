const UserModel = require('../models/User')
const ProductModel = require('../models/Products')
const InvestmentModel = require('../models/Investment')
const OrderModel = require('../models/Orders')
const Hash = require('../util/hashing')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')

exports.newUser = async (req, res, next) => {
  let uniqId = uuid.v4()
  try {
    const { firstName, lastName, email, pass1: password } = req.body
    const hash = Hash.encrypt_(password)
    const newAccount = new UserModel({
      firstName,
      lastName,
      email,
      password: hash,
      verificationId: uniqId,
    })
    const save = await newAccount.save()
    if (!save) throw 'An Error Occured While Saving This Account!'
    else {
      res.status(201).json({ success: true, errors: false, vid: uniqId })
    }
  } catch (error) {
    console.log(error)
    res.status(201).json({
      success: false,
      errors: { msg: `${error}` },
    })
  }
}

exports.userLogin = async (req, res_, next) => {
  const { password, email } = req.body
  UserModel.findOne({ email: email }, (err, res) => {
    if (err) {
      console.log(err)
      res_.json({ success: false, msg: err.message })
      return
    }

    if (res !== null) {
      if (res.status === false)
        return res_.json({
          success: false,
          msg: 'Account exists, but not verified!',
        })
      // sigin
      if (Hash.checkPassWord(password, res.password)) {
        console.log(res._id)
        let token = jwt.sign({ id: res._id, email: email }, 'iFarmSecretKey', {
          expiresIn: '24h',
        })
        res_.json({ success: true, msg: token })
      } else {
        console.log('Invalid Password')
        res_.json({ success: false, msg: 'Invalid Password ...' })
      }
    } else {
      console.log('invalid credentials')
      res_.json({ success: false, msg: 'Invalid Credentials ...' })
    }
  })
}

exports.userProfile = async (req, res, next) => {
  const { userid } = req.params
  UserModel.findOne({ _id: userid }, (err, res_) => {
    if (err) res.status(401).send('Database Error')
    res.json(res_)
  })
}

exports.userUpdate = async (req, res, next) => {
  const { firstName, lastName, phone1, phone2, address, LGA, state } = req.body
  const { userid } = req.params
  UserModel.updateOne(
    { _id: userid },
    { firstName, lastName, phone1, phone2, address, LGA, State: state },
    (err, res_) => {
      if (err) console.log(err)
      if (res_) res.json('Updated Successfully')
    },
  )
}

exports.allUsers = async (req, res, next) => {
  const query = UserModel.find({})
  const promise = query.exec()
  promise
    .then((res_) => {
      res.status(200).json(res_)
    })
    .catch((err) => {
      res.status(500).send('Error!')
    })
}

exports.deleteUser = async (req, res) => {
  const { id } = req.body
  UserModel.findByIdAndDelete(id)
    .then((response) => {
      console.log(response)
      res.send('Record Deleted')
    })
    .catch((err) => {
      res.send('An Error Has Occured! ', err)
    })
}

exports.verifyUser = async (req, res) => {
  const { id } = req.body
  try {
    let update_ = await UserModel.findOneAndUpdate(
      { verificationId: id, isVerified: false },
      { isVerified: true },
    )
    console.log(update_)
    if (update_ === null) throw 'Invalid Verification Process!'
    else res.send('ok!')
  } catch (error) {
    res.send(`${error}`)
  }
}

exports.myDashboard = async (req, res) => {
  const { id } = req.body
  /**
    total payments
    expected returns
    total sales
   */

  //  products
  const myProducts = await ProductModel.countMyProducts({ vendorId: id })
  const myInvestments = await InvestmentModel.allInvestments({
    investorId: id,
  })
  const myPendingOrders = await OrderModel.countMyPendingOrders({
    customerId: id,
    orderStatus: 'InComplete',
  })

  res.status(201).json({
    productCount: myProducts,
    investmentCount: myInvestments,
    pendingOrders: myPendingOrders,
    totalPayments: 0,
    expectedReturns: 0,
    totalSales: 0,
  })

  // console.log(id);
}
