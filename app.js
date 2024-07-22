if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); // Load environment variables in development
}

require("./db/connect.js"); // Connect to the database

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");

const User = require("./models/user.model.js");

const listingRouter = require("./routes/listing.route.js");
const reviewsRouter = require("./routes/review.route.js");
const userRouter = require("./routes/user.route.js");

// Setting up EJS for templating
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Database URL from environment variables
const dburl = process.env.ATLASDB_URL;
if (!dburl) {
  console.error("Error: ATLASDB_URL is not defined in environment variables");
  process.exit(1);
}

// Configure Mongo session store
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600, // Update session only once in a 24-hour period
});

store.on("error", (err) => {
  console.error("ERROR in Mongo Session Store", err);
});

// Session configuration
const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days max age
    httpOnly: true, // Ensure cookies are sent only over HTTP(S)
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Initialize Passport and configure for persistent login sessions
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to make flash messages and current user available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Home route redirects to listings
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// Route handlers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// 404 error handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// General error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
});
