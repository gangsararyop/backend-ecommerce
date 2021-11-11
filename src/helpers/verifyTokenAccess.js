require("dotenv").config();

const jwt = require("jsonwebtoken");

const verifyTokenAccess = (req, res, next) => {
  jwt.verify(req.token, process.env.ACCESS_TOKEN_LOGIN, (err, decoded) => {
    if (err) return res.status(401).send({ message: "User Unauthorized" });

    req.user = decoded;

    next();
  });
};

module.exports = verifyTokenAccess;
