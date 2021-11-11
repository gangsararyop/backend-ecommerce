const express = require("express");
const router = express.Router();
const { verifyTokenAccess } = require("../helpers");
const { authControllers } = require("./../controllers");
const { register, keepLogin, login } = authControllers;

router.post("/register", register);
router.post("/login", login);
router.get("/keeplogin", verifyTokenAccess, keepLogin);

module.exports = router;
