const { query } = require("express")
const Listing = require("../models/listings")

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    // console.log(allListings)
    res.render("listing/index.ejs", { allListings })
}

module.exports.renderNewForm = (req, res) => {
    console.log(req.user)
    let formFields = Object.keys(Listing.schema.obj)
    console.log("formfields", formFields)
    let formLabels = formFields.reduce((acc, field) => {
        acc[field] = field;
        return acc;
    }, {});
    console.log("formFieldLabels", formLabels)
    const categories = Listing.schema.path('category').enumValues;
    console.log("categories", categories)
    res.render("listing/new.ejs", { categories, formLabels })
}

module.exports.createNewForm = async (req, res, next) => {
    console.log("Incoming request body:", req.body);
    let url = req.file.path;
    let filename = req.file.filename
    // console.log(url,"..",filename)
    // console.log("req", req.body)
    // let{title,description,image,price,location,country}=req.body  or
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "enter valid data")
    // }

    let listing = req.body.listing
    let newList = new Listing(listing)

    // if (!newList.title) {
    //     throw new ExpressError(400, "title is missing")
    // }
    // if (!newList.description) {
    //     throw new ExpressError(400, "description is missing")
    // }
    // if (!newList.location) {
    //     throw new ExpressError(400, "location is missing")
    // }
    newList.owner = req.user._id
    newList.image = { url, filename }
    let savedListing = await newList.save()
    console.log(savedListing)
    req.flash("success", "New List Created")
    res.redirect("/listings")
}

module.exports.getIntoEditRoute = async (req, res) => {
    let { id } = req.params
    let formFields = Object.keys(Listing.schema.obj)
    console.log("formfields", formFields)
    let formLabels = formFields.reduce((acc, field) => {
        acc[field] = field;
        return acc;
    }, {});
    console.log("formEditLabels", formLabels)
    const categories = Listing.schema.path('category').enumValues;
    let listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Listing you requested does not exist")
        res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_250")
    res.render("listing/edit.ejs", { listing, originalImageUrl, categories, formLabels })
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "enter valid data")
    // }
    // let listing = await Listing.findById(id)
    // if (!listing.owner.equals(res.locals.curUser._id)) {
    //     req.flash("error", "you don't have permission to edit")
    //     return res.redirect(`/listings/${id}`)
    // }
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true }, { new: true })

    if (typeof req.file != "undefined") {
        let url = req.file.path
        let filename = req.file.filename
        listing.image = { url, filename }
        await listing.save()
    }
    req.flash("success", "updated successfully")
    res.redirect(`/listings/${id}`)
}

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params
    // if (id.length !== 24) {
    //     //    return next(new ExpressError(400, "page not found"))
    //     req.flash("error", "Listing you requested does not exist")
    //     res.redirect("/listings")
    // }
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner")
    if (!listing) {
        req.flash("error", "Listing you requested does not exist")
        res.redirect("/listings")
    }
    console.log("listingxsdsd", listing)
    // console.log("current user", req.user)
    res.render("listing/show.ejs", { listing })
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id);
    req.flash("success", "deleted successfully")
    res.redirect("/listings")
}

// module.exports.categoryListing = async (req, res) => {
//     console.log(req.query)
//     let { category } = req.query;
//     console.log(category);
//     try {
//         let searchListing = await Listing.find({ category: category });
//         // Render the view, passing the listings data
//         res.render("listing/index.ejs", { listings: searchListing }); // Pass the listings data to the EJS view
//     } catch (error) {
//         console.error("Error fetching listings:", error);
//         req.flash("error", "Could not fetch listings. Please try again later.");
//         res.redirect("/listings"); // Redirect to the listings page on error
//     }
// };
