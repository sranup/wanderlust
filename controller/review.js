const Listing = require("../models/listings")
const Review = require("../models/review")

module.exports.submitReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id
    listing.reviews.push(newReview)
    console.log("review_listing", listing)
    await newReview.save()
    await listing.save()
    console.log("new review is saved")
    req.flash("success", "New Review Created")
    res.redirect(`/listings/${listing._id}`)
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    console.log(id, reviewId);  // Ensure the IDs are being logged correctly

    // Update the listing to remove the review reference
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the actual review from the reviews collection
    await Review.findByIdAndDelete(reviewId);  // This should be `findByIdAndDelete`
    req.flash("success", "Review Deleted")
    res.redirect(`/listings/${id}`);
}