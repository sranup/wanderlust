const express = require("express")
const { route } = require("./listing")
const User = require("../models/user")
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware")
const router = express.Router()

const userController = require("../controller/user")

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.registerUser))

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", ({ failureRedirect: "/login", failureFlash: true })), userController.validateLogin)

// router.get("/signup",userController.renderSignupForm)

// router.post("/signup", wrapAsync(userController.registerUser))

// router.get("/login",userController.renderLoginForm)
// router.post("/login", saveRedirectUrl, passport.authenticate("local", ({ failureRedirect: "/login", failureFlash: true })), userController.validateLogin)

router.get("/logout", userController.logout)

module.exports = router