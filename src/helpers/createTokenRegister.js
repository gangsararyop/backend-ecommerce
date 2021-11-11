require("dotenv").config();

const jwt = require("jsonwebtoken");

const createTokenRegister = (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_REGISTER, { expiresIn: "3m" });
};

module.exports = createTokenRegister;
