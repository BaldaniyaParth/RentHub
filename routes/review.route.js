const express = require("express");
const router = express.Router({ mergeParams: true }); // Allows nested routes to access parent route parameters
const wrapAsync = require("../utils/wrapAsync.js"); 
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middlewares/middleware.js"); 
const reviewController = require("../controllers/reviews.controller.js");

// Route for creating a review
router.post("/", 
    isLoggedIn, 
    validateReview, 
    wrapAsync(reviewController.createReview) 
);

// Route for deleting a review
router.delete("/:reviewId", 
    isLoggedIn, 
    isReviewAuthor, 
    wrapAsync(reviewController.destroyReview) 
);

module.exports = router;
