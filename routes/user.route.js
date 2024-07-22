const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync"); 
const passport = require("passport"); 
const { saveRedirectUrl } = require("../middlewares/middleware.js"); 
const userController = require("../controllers/users.controller.js");

// Routes for user signup
router.route("/signup")
    .get(userController.renderSignupForm) 
    .post(wrapAsync(userController.signup)); 

// Routes for user login
router.route("/login")
    .get(userController.renderLoginForm) 
    .post(
        saveRedirectUrl, // Save the redirect URL before authentication
        passport.authenticate("local", {
            failureRedirect: "/login", // Redirect on authentication failure
            failureFlash: true, // Enable flash messages for failures
        }),
        userController.login 
    );

// Route for user logout
router.get("/logout", userController.logout); 

module.exports = router;
