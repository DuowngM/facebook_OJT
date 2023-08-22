const express = require("express");
const authController = require("../controller/auth");
const route = express.Router();
// Use routers
route.post("/register", authController.register);
route.post("/login", authController.login);

module.exports = route;
