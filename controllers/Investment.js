const InvestmentModel = require('../models/Investment')
const UserModel = require('../models/User')
const getReference = require('uuid')
const paystack = require('paystack')(
  'sk_test_f22375735008edb501116fe73a2e5db6f4aaa68d',
)
const jwt = require('jsonwebtoken')

const sortIntervals = async (firstDate, months) => {
  var newdate = new Date()
  let paymentIntervals = []
  for (let i = 1; i <= months; i++) {
    newdate.setDate(firstDate.getDate() + 31)
    paymentIntervals.push({
      date: new Date(newdate).toDateString(),
      status: 'unpaid',
    })
  }
  return paymentIntervals
}
const userDetails = async (id) => {
  try {
    return await UserModel.findById(id, (err, res) => {
      return err ? '' : res
    })
  } catch (err) {
    return err
  }
}

exports.newInvestment = async (req, res, next) => {
  const { investmentAmt, duration, monthly, total, token } = req.body
  jwt.verify(token, 'iFarmSecretKey', async (er, decoded) => {
    if (er) {
      res.status(400).json({ status: false, message: 'Token Has Expired!' })
      return
    }

    const ref = `iFarms-${getReference.v1()}`
    const investmentBegins = new Date()
    const days = duration * 30 //duration is in months here...
    const investmentEnds = investmentBegins.setDate(
      investmentBegins.getDate() + days,
    )

    // call the function to create the time intervals for payments
    let payoutSchedule = await sortIntervals(investmentBegins, duration)
    let userInfo = await userDetails(decoded.id)

    const { firstName, lastName, email, phone1, address, profileImg } = userInfo

    paystack.transaction
      .initialize({
        amount: investmentAmt * 100,
        reference: ref,
        name: `${firstName} ${lastName}`,
        email,
        callback_url: 'https://ifarms-app.herokuapp.com/verify',
      })
      .then((result) => {
        const { status, data } = result
        if (status) {
          const inv = new InvestmentModel({
            investmentAmt,
            duration,
            monthlyReturn: monthly,
            expectedTotal: total + parseFloat(investmentAmt),
            startedDate: investmentBegins,
            dueDate: investmentEnds,
            investorId: decoded.id,
            reference: ref,
            payoutSchedule,
            investorDetails: {
              firstName,
              lastName,
              email,
              phone1,
              address,
              profileImg,
            },
          })
          try {
            let stuff = inv.create()
            if (stuff) res.send(data.authorization_url)
          } catch (error) {
            console.log(error)
            res.status(500).send('Error!')
          }
        } else {
          res.send('Invalid Trans Id')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

exports.verification = async (req, res, next) => {
  const reference = req.query.reference
  if (!reference) res.send('invalid Payment Reference.')
  paystack.transaction
    .verify(reference)
    .then((result) => {
      const { status, message } = result
      if (!status) res.send('Invalid Reference Provided!!!')
      // update the db
      try {
        let update = InvestmentModel.update({ reference }, { payment: true })
          .then((res) => {
            console.log(res)
          })
          .catch((err) => console.log(err))
        console.log(update)
        if (update) res.redirect('https://i-farms.com/dashboard/newinvestment')
      } catch (error) {
        res.send('Database Connection Error!')
      }
    })
    .catch((err) => {
      res.send('An Error Has Occured!!!')
    })
}

exports.investments = async (req, res, next) => {
  const token = req.params.userid

  jwt.verify(token, 'iFarmSecretKey', async (er, decoded) => {
    console.log(er)
    if (er) {
      res.status(400).json({ status: false, message: 'Token Has Expired!' })
      return
    }
    try {
      InvestmentModel.findAll({ investorId: decoded.id })
        .then((res_) => res.send(res_))
        .catch((err) => console.log(err))
    } catch (error) {
      res.send('Error : ' + error)
    }
  })
}

exports.fetchAll = async (req, res, next) => {
  try {
    InvestmentModel.findAll({}).then((res_) => res.send(res_))
  } catch (error) {
    res.send('Error : ' + error)
  }
}

exports.fetchOne = async (req, res, next) => {
  const id = req.params.id
  try {
    InvestmentModel.findOne({ _id: id })
      .then((res_) => res.send(res_))
      .catch((err) => console.log(err))
  } catch (error) {
    res.send('Error : ' + error)
  }
}
