if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejs_mate = require("ejs-mate");
const Listing = require("./models/listing");
const Review = require("./models/reviews");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const isloggedin = require("./middleware");




const app = express();
const { savedurl } = require("./middleware");
const listingcontroller = require("./controllers/listings");
const reviewcontroller = require("./controllers/reviews");
const usercontroller = require("./controllers/users");
const wrapAsync = require("./utils/wrapasync");
const mongostore = require("connect-mongo");
const { wrap } = require("module");



const dbUrl = process.env.ATLASDB_URL ;

mongoose
  .connect(dbUrl)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));


app.engine("ejs", ejs_mate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = mongostore.create({
  mongoUrl: dbUrl,
  collection: "sessions",
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});
store.on("error", function (e) {
  console.log(e);
});


const sessionOptions = {
  secret: process.env.SECRET,
  store,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user; 
  next();
});




app.get("/", (req, res) => res.redirect("/listings"));






app.get("/signup", (req, res) => {
  res.render("users/signup");
});


app.post("/signup", wrapAsync(usercontroller.sign));


app.get("/login", (req, res) => {
  res.render("users/login");
});

app.post(
  "/login",
  savedurl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);


app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.flash("error", "Logged out successfully!");
    res.redirect("/listings");
  });
});




app.get("/listings", wrapAsync(listingcontroller.index));  
app.get("/listings/new", isloggedin, listingcontroller.new);

app.post("/listings", wrapAsync(listingcontroller.create));

app.get("/listings/:id", wrapAsync(listingcontroller.show));

app.get("/listings/:id/edit", isloggedin, wrapAsync(listingcontroller.edit));

app.put("/listings/:id", isloggedin, wrapAsync(listingcontroller.update));

app.delete("/listings/:id", isloggedin, wrapAsync(listingcontroller.delete));

// Reviews
app.post("/listings/:id/reviews", wrapAsync(reviewcontroller.reviewadd));

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(reviewcontroller.reviewdel));


app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});


app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);
