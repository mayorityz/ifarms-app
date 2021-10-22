require("dotenv").config();
// using nodemailer for mailing services...
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.MAILHOST,
  port: process.env.MAILPORT,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

class Mailer {
  static async registration(to, subject, body) {
    let info = await transporter.sendMail({
      from: process.env.EMAILFROM,
      to,
      subject,
      html: body,
    });
    console.log("Message sent: %s", info.messageId);
  }
}

module.exports = Mailer;
