require("dotenv").config();
const app = require("./app");
const connectDB = require("./configs/mongoConnection");
const {static} = require("express");
app.use(static("static"));

const PORT = process.env.PORT || 5000;

connectDB().then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
