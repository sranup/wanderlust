const mongoose = require("mongoose")
const initData = require("./data")
const Listing = require("../models/listings")


const mongo_URL = 'mongodb://127.0.0.1:27017/wanderlust'

main().then(() => {
    console.log("connected to database")

}).catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect(mongo_URL)
}

// console.log("data", initData.data)

const initialiseData = async () => {
    await Listing.deleteMany({})
    initData.data=initData.data.map((obj)=>({
        ...obj,owner:"6717a8f912c4711e2567001f"
    }));
    await Listing.insertMany(initData.data)
    console.log("success")
}

initialiseData();
