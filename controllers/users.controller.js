const User = require("../models/user.model");

// Render the signup form for new users
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// Handle user signup
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
       
        const registeredUser = await User.register(newUser, password);
       
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err); 
            }
            req.flash("success", "Welcome Here!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Render the login form for existing users
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// Handle user login
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back");

    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// Handle user logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); 
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};
