const express = require("express")
const wrapAsync = require("../utils/wrapAsync")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware")
const router = express.Router()

const reviewsController=require("../controller/review")

//post review
router.post("/:id",isLoggedIn, validateReview, wrapAsync(reviewsController.submitReview))

//delete review
router.delete('/:id/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(reviewsController.destroyReview));

module.exports = router