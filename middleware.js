const Listing = require("./models/listings")
const Review=require("./models/review")
const { listingSchema, reviewSchema } = require("./schema")
const ExpressError = require("./utils/expressError")

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.path, "..", req.originalUrl)
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "user must be logged in to create list")
        return res.redirect("/login")
    } else {
        next()
    }
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    if (!listing.owner.equals(res.locals.curUser._id)) {
        req.flash("error", "You are not the owner of this listing")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validaeteListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((ele) => ele.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((ele) => ele.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params
    let review = await Review.findById(reviewId)
    if (!review.author.equals(res.locals.curUser._id)) {
        req.flash("error", "You are not the author of this review")
        return res.redirect(`/listings/${id}`)
    }
    next()
}