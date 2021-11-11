require("dotenv").config();

const jwt = require("jsonwebtoken");

const createTokenAccess = (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_LOGIN, { expiresIn: "12h" });
};

module.exports = createTokenAccess;
