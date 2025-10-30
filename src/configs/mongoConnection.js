const mongoose = require("mongoose");

async function connectDB() {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGO_URL;
        if (!uri) throw new Error("MONGO_URI missing");

        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
