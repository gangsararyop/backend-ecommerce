const hashPass = require("./hashPass");
const transporter = require("./transporter");
const createTokenRegister = require("./createTokenRegister");
const verifyTokenRegister = require("./verifyTokenRegister");
const createTokenAccess = require("./createTokenAccess");
const verifyTokenAccess = require("./verifyTokenAccess");
const uploader = require("./uploader");

module.exports = {
  hashPass,
  transporter,
  uploader,
  createTokenRegister,
  verifyTokenRegister,
  createTokenAccess,
  verifyTokenAccess,
};
