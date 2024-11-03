const User=require("../models/user")

module.exports.renderSignupForm= (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.registerUser=async (req, res) => {
    try {
        let { username, email, password } = req.body
        let newUser = new User({ username, email })
        let newRegUser = await User.register(newUser, password)
        console.log(newRegUser)
        req.login(newRegUser, ((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust")
            res.redirect("/listings")
        }));
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm= (req, res) => {
    res.render("users/login.ejs")
}

module.exports.validateLogin=(req, res) => {
    req.flash("success", "Welcome back to Wanderlust,You're Logged In!!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.log("Logout Error:", err);  // Log the error
            return next(err);
        }
        req.flash("success", "you are logged out")
        res.redirect("/listings")
    })
}