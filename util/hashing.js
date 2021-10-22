const bcrypt = require("bcryptjs");

class Hash {
  static encrypt_(password) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  static checkPassWord(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  static _checkPassWord(password) {
    return bcrypt.compareSync(password, iFarmSecretKey);
  }
}

module.exports = Hash;
