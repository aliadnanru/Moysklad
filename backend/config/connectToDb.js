const mongoose = require("mongoose");
module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connection To MongoDB Done!")
    } catch (e) {
        console.log("Connection Failed To MongoDB", e)
    }
}