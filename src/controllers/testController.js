const LatencyResult = require("../models/latencyResult");
const testService = require("../services/testService");

exports.runLatencyTest = async (req, res) => {
    try {
        const { domain } = req.body;
        if (!domain) {
            return res.status(400).json({ error: "Domain is required" });
        }

        const results = await testService.runTest(domain);
        res.json({ success: true, results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllResults = async (req, res) => {
    try {
        const { domain } = req.query;
        const filter = domain ? { domain } : {};
        const results = await LatencyResult.find(filter).sort({ timestamp: -1 });

        res.json({ success: true, results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const { domain } = req.query;

        if (!domain) {
            return res.status(400).json({ error: "Domain is required" });
        }

        const stats = await LatencyResult.aggregate([
            { $match: { domain } },
            {
                $group: {
                    _id: "$region",
                    avgLatency: { $avg: "$latency" },
                    lastTest: { $max: "$timestamp" }
                }
            }
        ]);

        res.json({ success: true, stats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
