const mongoose = require("mongoose");

const latencyResultSchema = new mongoose.Schema({
    domain: String,
    region: String,
    latency: Number,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LatencyResult", latencyResultSchema);
