require("dotenv").config();

const jwt = require("jsonwebtoken");

const verifyTokenRegister = (req, res, next) => {
  jwt.verify(req.token, process.env.ACCESS_TOKEN_REGISTER, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Token expired" });

    req.user = decoded;

    next();
  });
};

module.exports = verifyTokenRegister;
