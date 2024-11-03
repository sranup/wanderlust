const express = require("express");
const Listing = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validaeteListing } = require("../middleware")
const multer = require("multer")
const { storage } = require("../cloudConfig")
const upload = multer({ storage })
const router = express.Router();

const listingsController = require("../controller/listings");

router.get("/", listingsController.index)

//new list
router.route("/new")
    .get(isLoggedIn, listingsController.renderNewForm)
    .post(upload.single('listing[image]'), validaeteListing, isLoggedIn, wrapAsync(listingsController.createNewForm))
// .post(upload.single('listing[image]'), (req, res) => {
//     res.send(req.file)
// })

router.route("/:id")
    .get(wrapAsync(listingsController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validaeteListing, wrapAsync(listingsController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingsController.destroyListing))

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingsController.getIntoEditRoute))


//post list
// router.post("/listing/new", async (req, res, next) => {
//     // let{title,description,image,price,location,country}=req.body  or
//     try {
//         let listing = req.body.listing
//         let newList = new Listing(listing)
//         await newList.save()
//         res.redirect("/listings")
//         // console.log(listing)
//     } catch (err) {
//         next(err)
//     }
// })


// router.get("/testlistings", async (req, res) => {
//     let newList = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Vagator Beach,Goa",
//         country: "India"
//     })
//     await newList.save()
//     res.send("data-saved")

// })
// router.get("/testlistings", async (req, res) => {
//     let newList = new Listing({
//         title: "My New House",
//         description: "peace of mind",
//         image: "https://unsplash.com/photos/a-long-covered-walkway-with-a-clock-on-the-side-of-it-wS7eko4F2O8",
//         price: 1500,
//         location: "Hampi,Karnataka",
//         country: "India"
//     })
//     await newList.save()
//     res.send("data-saved")

// })

module.exports = router