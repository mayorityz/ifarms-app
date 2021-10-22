const mailer_ = require("./test-email");

mailer_
  .registration(
    "mayority11@gmail.com",
    "tesing login app",
    "asun is life... I miss my boy "
  )
  .catch((err) => {
    console.log(err.message);
  });
