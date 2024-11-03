const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require('connect-flash')
const path = require("path")
const ejs = require("ejs")
let port = 3030

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

const sessionOption = { secret: "mysupersecret", resave: false, saveUninitialized: true }

// app.use(cookieParser("secretcode"))//now for every request parse the cookie value 

// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "hello")
//     res.cookie("madeIn", "India")
//     res.send("send you cookies")
// })

// app.get("/getSignedCookies", (req, res) => {
//     res.cookie("color", "red", { signed: true })
//     res.send("!done")
// })

// app.get("/verify", (req, res) => {
//     console.log(req.cookies)
//     res.send(req.signedCookies)
// })

// app.get("/", (req, res) => {
//     let { name = "anonymouse" } = req.cookies//if there is no name asign the anonymouse to name
//     console.dir(req.cookies)//undefined cz unable to parse the cookie and therefore install cooki-parser and execute
//     res.send(`hi this is ${name}`)
// })
app.use(session(sessionOption))
app.use(flash())

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success")
    res.locals.errMsg = req.flash("error")
    next()
})



// app.get("/test", (req, res) => {
//     res.send("test successful!!")
// })

// app.get("/reqcount", (req, res) => {
//     if (req.session.count) {
//         req.session.count++
//     } else {
//         req.session.count = 1
//     }
//     res.send(`you sent a request ${req.session.count} times`)
// })

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query
    req.session.name = name//adding name to the session property
    // console.log(req.session)
    // res.send(`welcome ${name}`)
    if (name == "anonymous") {
        req.flash("error", "user is not registered")
    } else {
        req.flash("success", "user registered successfully")
    }
    res.redirect("/hello")
})

app.get("/hello", (req, res) => {
    // console.log(req.flash("success"))
    // res.locals.successMsg = req.flash("success")
    // res.locals.errMsg = req.flash("error")
    // res.render("page.ejs", { name: req.session.name, msg: req.flash("success") })
    res.render("page.ejs", { name: req.session.name })

    // res.send(`hello,${req.session.name}`)
})

app.listen(port, () => {
    console.log("server connected to port", port)
})