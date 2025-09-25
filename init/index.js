const mongoose = require("mongoose");
const data = require("./data.js");
const listing = require("../models/listing.js");
async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/airbnb_proj");
        console.log("Connected to DB in Mongo");
        } catch (err) {
        console.error("DB connection error:", err);
    }
}
main();
const initDB = async () => {
    await listing.deleteMany({});
    await listing.insertMany(data.data);
    console.log("Data was inserted");

}
initDB(); 
