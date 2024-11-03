if (process.env.NODE_ENV != "production") {
    require("dotenv").config()
}

const express = require("express")
const mongoose = require("mongoose")
const ejs = require("ejs")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const sessions = require("express-session")
const flash = require("connect-flash")
const ExpressError = require("./utils/expressError")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const app = express()
const port = 8080;
const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/reviews.js")
const usersRouter = require("./routes/user.js")
const User = require("./models/user.js")
const Listing = require("./models/listings.js")

const mongo_URL = 'mongodb://127.0.0.1:27017/wanderlust'
main().then(() => {
    console.log('connected to db')

}).catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect(mongo_URL)
}

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.engine("ejs", ejsMate)
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "/public")))
// app.get("/", (req, res) => {
//     res.send("server is working")
// })

const sessionOption = {
    secret: "mysuperhero",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}


app.use(sessions(sessionOption))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success")
    res.locals.errorMsg = req.flash("error")
    res.locals.curUser = req.user
    next()
})

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "traveller01@gmail.com",
//         username: "traveller-01"
//     })
//     let result = await User.register(fakeUser, "sr117")
//     res.send(result)
// })

app.use("/listings", listingsRouter)
app.use("/listings/review", reviewsRouter)
app.use("/", usersRouter)

// app.get("/search", async (req, res) => {
//     let { category } = req.query
//     console.log(category)
//     try {
//         let searchListing = await Listing.find({ category: category });
//         // Render the view, passing the listings data
//         res.send(searchListing)
//         res.render("listing/index.ejs", { listings: searchListing }); // Pass the listings data to the EJS view
//     } catch (error) {
//         console.error("Error fetching listings:", error);
//         req.flash("error", "Could not fetch listings. Please try again later.");
//         res.redirect("/listings"); // Redirect to the listings page on error
//     }
// })


//if none of the path matches throw this error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found!!"))
})



//handle errors
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err
    // res.status(statusCode).send(message)
    res.status(statusCode).render("error.ejs", { message })
})
app.listen(port, () => {
    console.log("server connected to port", port)
})