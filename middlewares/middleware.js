const Listing = require("../models/listing.model.js");
const Review = require("../models/review.model.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../utils/schema.js");

// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store the URL the user tried to access
        req.flash("error", "You must be logged in to create a new listing!");
        return res.redirect("/login"); 
    }
    next(); 
};

// Middleware to save the URL where the user should be redirected after login
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Make the redirect URL available to the view
    }
    next(); 
};

// Middleware to check if the current user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const listing = await Listing.findById(id); 
        if (!listing.owner.equals(res.locals.currUser._id)) { 
            req.flash("error", "You are not the owner of this listing");
            return res.redirect(`/listings/${id}`); 
        }
        next();
    } catch (err) {
        next(new ExpressError(400, "This listing page is not valid...")); 
    }
};

// Middleware to validate the listing data
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body); // Validate the request body against the listing schema
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", "); // Aggregate error messages
        throw new ExpressError(400, errMsg); 
    } else {
        next(); 
    }
};

// Middleware to validate the review data
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); // Validate the request body against the review schema
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", "); // Aggregate error messages
        throw new ExpressError(400, errMsg); 
    } else {
        next(); 
    }
};

// Middleware to check if the current user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params; 
    const review = await Review.findById(reviewId); 
    if (!review.author.equals(res.locals.currUser._id)) { 
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`); 
    }
    next(); 
};
