const express = require("express");
const authController = require("../controller/auth");
const middleware = require("../middlewares/middlewares");
const logUserAgent = require("../middlewares/middlewares");
const route = express.Router();
// Use routers
route.use(middleware.logUserAgent);
route.post("/register", middleware.validateRegister, authController.register);
route.post("/login", middleware.validateLogin, authController.login);

module.exports = route;
