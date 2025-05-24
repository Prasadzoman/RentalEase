const User = require("../models/user");
const passport = require("passport");
const ExpressError = require("../utils/ExpressError");

module.exports.renderSignup=(req, res) => {
    res.render("users/signup");
}

module.exports.signup=async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const reguser = await User.register(newUser, password);
        console.log(reguser);
        req.login(reguser, (err) => {
            if (err) {
                return next(err); 
            }
            req.flash("success", "Welcome");
            return res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin=(req, res) => {
    res.render("users/login.ejs");
}


module.exports.login=async (req, res) => {
    req.flash("success", "Welcome");

    let redirectUrl = req.session.redirectURL || "/listings";
    delete req.session.redirectURL; 

    res.redirect(redirectUrl);
}

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
}