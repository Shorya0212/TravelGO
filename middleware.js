module.exports = isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirect = req.originalUrl;  // user is NOT logged in
        req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
};
module.exports.savedurl = (req, res, next) => {
    if (req.session.redirect) {
        res.locals.redirectUrl = req.session.redirect; 
        delete req.session.redirect; 
    }
    next();
};
