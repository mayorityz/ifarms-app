require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);
class SendGrid {
  static sendMail(to, body, subject) {
    const msg = {
      to,
      from: "noreply@i-farms.com",
      subject,
      html: `<strong>${body}</strong>`,
    };
    //ES6
    sgMail.send(msg).then(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      }
    );
  }
}

module.exports = SendGrid;
